import ITwitchApiClient from '@Interfaces/twitch-api-client.interface';
import ITwitchChatClient from '@Interfaces/twitch-chat-client.interface';
import ITwitchEventClient from '@Interfaces/twitch-event-client.interface';
import IWebServer from '@Interfaces/web-server.interface';
import { getRewardsHandlers } from '@Lib/handlers/rewards-handlers';
import { EventSubChannelRedemptionAddEvent } from '@twurple/eventsub';
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

	constructor(
		@inject(iocSymbols.TwitchApiClient)
		private _twitchApiClient: ITwitchApiClient,
		@inject(iocSymbols.TwitchChatClient)
		private _twitchChatClient: ITwitchChatClient,
		@inject(iocSymbols.TwitchEventClient)
		private _twitchEventClient: ITwitchEventClient
	) {
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
			console.log(`A user with socket id ${socket.id} has connected`);
		});
	}

	get httpServer(): http.Server {
		return this._httpServer;
	}

	@postConstruct()
	protected async initializeWebServer() {
		await this.initializeEndpoints();
		await this.initializeWebSockets();
		await this.initializeLastInfo();
	}

	private async initializeEndpoints() {
		const { numberOfSubscriptions, lastFollower, lastSubscriber } =
			await this.getLastInfo();

		this._app.get('/subscriptions', async (_, res) => {
			res.json(numberOfSubscriptions);
		});

		this._app.get('/last-subscriber', async (_, res) => {
			res.json(lastFollower);
		});

		this._app.get('/last-follower', async (_, res) => {
			res.json(lastSubscriber);
		});
	}

	private async initializeWebSockets() {
		const customRewardsHandlers = getRewardsHandlers(
			this._socketServer,
			this._twitchChatClient.chatClient
		);

		/** Follow */
		await this._twitchEventClient.eventClient.subscribeToChannelFollowEvents(
			this._twitchApiClient.user.id,
			({ userName, userDisplayName }) => {
				console.log('FOLLOW', userName);
				this._socketServer.emit('follow', userName || userDisplayName);
			}
		);

		/** Subscription with message */
		await this._twitchEventClient.eventClient.subscribeToChannelSubscriptionMessageEvents(
			this._twitchApiClient.user.id,
			({ userDisplayName, userName, messageText, cumulativeMonths }) => {
				console.log('CHANNEL_SUBSCRIPTION_MESSAGE_EVENT');
				this._socketServer.emit('subscription-message', {
					userName: userName || userDisplayName,
					message: messageText,
					months: cumulativeMonths,
				});
			}
		);

		/** Subscription start */
		await this._twitchEventClient.eventClient.subscribeToChannelSubscriptionEvents(
			this._twitchApiClient.user.id,
			({ userDisplayName, userName }) => {
				console.log('CHANNEL_SUBSCRIPTION_EVENT');
				this._socketServer.emit('subscription', userName || userDisplayName);
			}
		);

		/** Subscription end */
		await this._twitchEventClient.eventClient.subscribeToChannelSubscriptionEndEvents(
			this._twitchApiClient.user.id,
			() => {
				console.log('CHANNEL_SUBSCRIPTION_END_EVENT');
				this._socketServer.emit('end-subscription');
			}
		);

		/** Custom rewards filtered */
		await this._twitchEventClient.eventClient.subscribeToChannelRedemptionAddEvents(
			this._twitchApiClient.user.id,
			(redemptionEvent: EventSubChannelRedemptionAddEvent) => {
				const customerRewardHandler =
					customRewardsHandlers[redemptionEvent.rewardId];
				if (customerRewardHandler) customerRewardHandler(redemptionEvent);
			}
		);
	}

	private async initializeLastInfo() {
		const lastInfo = await this.getLastInfo();

		if (lastInfo.dateLastUpdate + 1000 * 60 * 15 < new Date().getTime())
			await this.updateLastInfo();
	}

	private async updateLastInfo() {
		const { apiClient, user } = this._twitchApiClient;

		const { total: numberOfSubscriptions } =
			await apiClient.subscriptions.getSubscriptions(user.id);

		const subscriptionEvents =
			await apiClient.subscriptions.getSubscriptionEventsForBroadcaster(
				user.id,
				{ limit: 30 }
			);

		const lastSubscriber = subscriptionEvents.data.find(
			({ eventType }) => eventType === 'subscriptions.subscribe'
		);

		const lastFollower = await apiClient.users.getFollows({
			followedUser: user.id,
			limit: 1,
		});

		const lastInfo: LastInfo = {
			numberOfSubscriptions,
			lastSubscriber: lastSubscriber ? lastSubscriber.userDisplayName : '',
			lastFollower: lastFollower.data[0]
				? lastFollower.data[0].userDisplayName
				: '',
			lastCheer: '',
			dateLastUpdate: new Date().getTime(),
		};

		await writeFile(WebServer.lastInfoFilepath, JSON.stringify(lastInfo));
	}

	private async getLastInfo() {
		const lastInfoString = await readFile(WebServer.lastInfoFilepath, {
			encoding: 'utf-8',
		});

		const lastInfo: LastInfo = JSON.parse(lastInfoString);

		return lastInfo;
	}
}

export default WebServer;
