import ITwitchApiClient from '@Interfaces/twitch-api-client.interface';
import ITwitchChatClient from '@Interfaces/twitch-chat-client.interface';
import ITwitchEventClient from '@Interfaces/twitch-event-client.interface';
import IWebServer from '@Interfaces/web-server.interface';
import { getRewardsHandlers } from '@Lib/handlers/rewards-handlers';
import { EventSubChannelRedemptionAddEvent } from '@twurple/eventsub';
import cors from 'cors';
import express, { Express } from 'express';
import http, { Server as HttpServer } from 'http';
import { inject, injectable, postConstruct } from 'inversify';
import iocSymbols from 'ioc-symbols';
import { Server as SocketServer } from 'socket.io';

/** Web server */
@injectable()
class WebServer implements IWebServer {
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
	}

	private async initializeEndpoints() {
		const { apiClient, user } = this._twitchApiClient;
		const subscriptions = await apiClient.subscriptions.getSubscriptions(
			user.id
		);

		this._app.get('/subscriptions', (_, res) => {
			res.json(subscriptions.total);
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
			({ userName }) => {
				console.log('FOLLOW', userName);
				this._socketServer.emit('follow', userName);
			}
		);

		/** Subscription with message */
		await this._twitchEventClient.eventClient.subscribeToChannelSubscriptionMessageEvents(
			this._twitchApiClient.user.id,
			({ userDisplayName, messageText, cumulativeMonths }) => {
				console.log('CHANNEL_SUBSCRIPTION_MESSAGE_EVENT');
				this._socketServer.emit('subscription-message', {
					userName: userDisplayName,
					message: messageText,
					months: cumulativeMonths,
				});
			}
		);

		/** Subscription start */
		await this._twitchEventClient.eventClient.subscribeToChannelSubscriptionEvents(
			this._twitchApiClient.user.id,
			() => {
				console.log('CHANNEL_SUBSCRIPTION_EVENT');
				this._socketServer.emit('subscription');
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
}

export default WebServer;
