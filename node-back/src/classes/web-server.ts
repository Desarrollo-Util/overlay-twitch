import { createLogger, Logger } from '@d-fischer/logger';
import ITwitchApiClient from '@Interfaces/twitch-api-client.interface';
import ITwitchChatClient from '@Interfaces/twitch-chat-client.interface';
import ITwitchEventClient from '@Interfaces/twitch-event-client.interface';
import IWebServer from '@Interfaces/web-server.interface';
import { getRewardsHandlers } from '@Lib/handlers/rewards-handlers';
import {
	EventSubChannelCheerEvent,
	EventSubChannelRedemptionAddEvent,
} from '@twurple/eventsub';
import cors from 'cors';
import express, { Express } from 'express';
import { readFile, writeFile } from 'fs/promises';
import http, { Server as HttpServer } from 'http';
import { inject, injectable, postConstruct } from 'inversify';
import iocSymbols from 'ioc-symbols';
import { join } from 'path';
import { Server as SocketServer } from 'socket.io';
import { LastInfo } from 'types/last-info.type';

/** Web server */
@injectable()
class WebServer implements IWebServer {
	private static lastInfoFilepath: string = join(
		__dirname,
		'../../node-back/src/resources/last-info.json'
	);
	private _app: Express;
	private _httpServer: HttpServer;
	private _socketServer: SocketServer;
	private readonly _logger: Logger;
	private _lastInfo!: LastInfo;

	constructor(
		@inject(iocSymbols.TwitchApiClient)
		private _twitchApiClient: ITwitchApiClient,
		@inject(iocSymbols.TwitchChatClient)
		private _twitchChatClient: ITwitchChatClient,
		@inject(iocSymbols.TwitchEventClient)
		private _twitchEventClient: ITwitchEventClient
	) {
		this._logger = createLogger({
			name: 'Web-Server',
			emoji: true,
			minLevel: 'info',
		});

		this._app = express();
		this._app.use(cors());
		this._httpServer = http.createServer(this._app);

		this._socketServer = new SocketServer(this._httpServer, {
			cors: {
				origin: '*',
				methods: ['GET', 'POST'],
			},
		});

		this._socketServer.on('connection', socket => {
			this._logger.info(`A user with socket id ${socket.id} has connected`);
		});
	}

	get httpServer(): http.Server {
		return this._httpServer;
	}

	get logger(): Logger {
		return this._logger;
	}

	@postConstruct()
	protected async initializeWebServer() {
		await this.updateLastInfoFromAPI();
		await this.initializeWebSockets();
		await this.initializeEndpoints();
		this.gracefulShutdown();
	}

	private async initializeEndpoints() {
		this._app.get('/subscriptions', async (_, res) => {
			res.json(this._lastInfo.numberOfSubscriptions);
		});

		this._app.get('/last-subscriber', async (_, res) => {
			res.json(this._lastInfo.lastSubscriber);
		});

		this._app.get('/last-follower', async (_, res) => {
			res.json(this._lastInfo.lastFollower);
		});

		this._app.get('/last-cheer', async (_, res) => {
			res.json(this._lastInfo.lastCheer);
		});
	}

	private async initializeWebSockets() {
		const customRewardsHandlers = getRewardsHandlers(
			this._socketServer,
			this._twitchChatClient.chatClient
		);

		try {
			await this._twitchEventClient.eventClient.subscribeToChannelFollowEvents(
				this._twitchApiClient.user.id,
				({ userDisplayName, userName }) => {
					const name = userName || userDisplayName;

					this._lastInfo.numberOfSubscriptions += 1;
					this._lastInfo.lastFollower = name;
					this._twitchEventClient.logger.info(`Follow -> ${name}`);
					this._socketServer.emit('follow', name);
				}
			);

			await this._twitchEventClient.eventClient.subscribeToChannelSubscriptionMessageEvents(
				this._twitchApiClient.user.id,
				({ userDisplayName, userName, messageText, cumulativeMonths }) => {
					const name = userName || userDisplayName;

					this._twitchEventClient.logger.info(
						`Subscription message event -> ${name}; Cumulative months -> ${cumulativeMonths}`
					);
					this._socketServer.emit('subscription-message', {
						userName: name,
						message: messageText,
						months: cumulativeMonths,
					});
				}
			);

			await this._twitchEventClient.eventClient.subscribeToChannelSubscriptionEvents(
				this._twitchApiClient.user.id,
				({ userDisplayName, userName, isGift }) => {
					const name = userName || userDisplayName;

					this._twitchEventClient.logger.info(
						`Subscription event -> ${name}; Is gift -> ${isGift}`
					);
					this._socketServer.emit('subscription', name);
				}
			);

			await this._twitchEventClient.eventClient.subscribeToChannelSubscriptionEndEvents(
				this._twitchApiClient.user.id,
				({ userDisplayName, userName, isGift }) => {
					const name = userName || userDisplayName;

					this._twitchEventClient.logger.info(
						`Subscription end event -> ${name}; Is gift -> ${isGift}`
					);
					this._socketServer.emit('end-subscription');
				}
			);

			await this._twitchEventClient.eventClient.subscribeToChannelRedemptionAddEvents(
				this._twitchApiClient.user.id,
				(redemptionEvent: EventSubChannelRedemptionAddEvent) => {
					this._twitchEventClient.logger.info(
						`Reward Redemption Points -> ${redemptionEvent.rewardTitle}`
					);
					const customerRewardHandler =
						customRewardsHandlers[redemptionEvent.rewardId];
					if (customerRewardHandler) customerRewardHandler(redemptionEvent);
				}
			);

			await this._twitchEventClient.eventClient.subscribeToChannelCheerEvents(
				this._twitchApiClient.user.id,
				({
					userDisplayName,
					userName,
					bits,
					message,
				}: EventSubChannelCheerEvent) => {
					const name = userName || userDisplayName || '';

					this._lastInfo.lastCheer = name;
					this._twitchEventClient.logger.info(
						`Cheer event -> ${name}; Bits -> ${bits}`
					);
					this._socketServer.emit('cheer', {
						userName: name,
						message,
						bits,
					});
				}
			);
		} catch (error: any) {
			if (error._statusCode === 403) {
				this._logger.error(
					'Se ha producido un error de autenticación, por favor revisa los scopes, clientID y clientSecret'
				);
				process.exit(-1);
			}
		}
	}

	private async updateLastInfoFromAPI() {
		const { apiClient, user } = this._twitchApiClient;
		const { total: numberOfSubscriptions } =
			await apiClient.subscriptions.getSubscriptions(user.id);

		const subscriptionEvents =
			await apiClient.subscriptions.getSubscriptionEventsForBroadcaster(
				user.id
			);

		const lastSubscriber = subscriptionEvents.data.find(
			({ eventType }) => eventType === 'subscriptions.subscribe'
		);

		const lastFollower = await apiClient.users.getFollows({
			followedUser: user.id,
			limit: 1,
		});

		const oldLastInfo = await this.readLastInfo();
		this._lastInfo = {
			numberOfSubscriptions,
			lastSubscriber: lastSubscriber ? lastSubscriber.userDisplayName : '',
			lastFollower: lastFollower.data[0]
				? lastFollower.data[0].userDisplayName
				: '',
			lastCheer: oldLastInfo.lastCheer || '',
			dateLastUpdate: new Date().getTime(),
		};

		await writeFile(WebServer.lastInfoFilepath, JSON.stringify(this._lastInfo));
	}

	private async updateLastInfo() {
		const { numberOfSubscriptions, lastSubscriber, lastFollower, lastCheer } =
			this._lastInfo;

		const updatedLastInfo: LastInfo = {
			numberOfSubscriptions,
			lastSubscriber,
			lastFollower,
			lastCheer,
			dateLastUpdate: new Date().getTime(),
		};

		await writeFile(
			WebServer.lastInfoFilepath,
			JSON.stringify(updatedLastInfo)
		);
	}

	private async readLastInfo() {
		const lastInfoString = await readFile(WebServer.lastInfoFilepath, {
			encoding: 'utf-8',
		});

		const lastInfo: LastInfo = JSON.parse(lastInfoString);

		return lastInfo;
	}

	private gracefulShutdown() {
		process.on('SIGINT', async () => {
			this._logger.info('Stopping all listeners and servers...');

			this._twitchChatClient.cronScheduler.stop();
			await this._twitchChatClient.chatClient.quit();
			await this.updateLastInfo();

			this._logger.info('Stopped all listeners and servers, process finished');
			process.exit(0);
		});
	}
}

export default WebServer;
