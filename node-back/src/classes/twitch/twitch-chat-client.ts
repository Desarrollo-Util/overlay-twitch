import ITwitchApiClient from '@Interfaces/twitch-api-client.interface';
import ITwitchAuth from '@Interfaces/twitch-auth.interface';
import ITwitchChatClient from '@Interfaces/twitch-chat-client.interface';
import chatMessageHandler from '@Lib/handlers/chat-message';
import raidHandler from '@Lib/handlers/raid';
import { ChatClient } from '@twurple/chat';
import { readFile } from 'fs/promises';
import { inject, injectable, postConstruct } from 'inversify';
import iocSymbols from 'ioc-symbols';
import { join } from 'path';
import { AsyncTask, SimpleIntervalJob, ToadScheduler } from 'toad-scheduler';
import { CronJob } from 'types/cron-jobs.type';
import { Server as SocketServer } from 'socket.io';

/** Twitch chat client */
@injectable()
class TwitchChatClient implements ITwitchChatClient {
	private _chatClient: ChatClient;
	private _cronScheduler: ToadScheduler;

	private static _cronSrcFilePath = join(
		__dirname,
		'../../../node-back/src/resources/cron.json'
	);

	constructor(
		@inject(iocSymbols.BotTwitchAuth)
		private _botTwitchAuth: ITwitchAuth,
		@inject(iocSymbols.TwitchApiClient)
		private _twitchApiClient: ITwitchApiClient,
		@inject(iocSymbols.TwitchChannel) public twitchChannel: string
	) {
		this._chatClient = new ChatClient({
			authProvider: this._botTwitchAuth.refreshableAuthProvider,
			channels: [this.twitchChannel],
			//logger: { minLevel: 'debug' },
		});

		this._cronScheduler = new ToadScheduler();
	}

	/** Chat client getter */
	get chatClient(): ChatClient {
		return this._chatClient;
	}

	get cronScheduler(): ToadScheduler {
		return this._cronScheduler;
	}

	@postConstruct()
	protected async initializeChat() {
		await this.connectChat();
		await this.startCronJobs();
	}

	private async connectChat() {
		await this._chatClient.connect();
	}

	private async startCronJobs() {
		const cronJobsString = await readFile(TwitchChatClient._cronSrcFilePath, {
			encoding: 'utf-8',
		});

		let cronJobs: CronJob[];

		cronJobs = JSON.parse(cronJobsString).cronJobs;

		for (const [index, cronJob] of cronJobs.entries()) {
			const taskJob = new AsyncTask(
				index.toString(),
				async () => {
					const stream =
						await this._twitchApiClient.apiClient.streams.getStreamByUserName(
							this._twitchApiClient.user.name
						);

					if (stream)
						await this._chatClient.say(
							this._twitchApiClient.user.name,
							cronJob.message
						);
				},
				(err: Error) => console.error(`Error at cron messages: ${err}`)
			);

			this._cronScheduler.addSimpleIntervalJob(
				new SimpleIntervalJob(
					{
						minutes: cronJob.minutes * this.getRandomNumberBetween(0.8, 1.2),
					},
					taskJob
				)
			);
		}
	}

	public startChatHandlers(socketServer: SocketServer) {
		this._chatClient.onMessage(
			chatMessageHandler(this._chatClient, this._twitchApiClient)
		);
		this._chatClient.onRaid(
			raidHandler(this._chatClient, this._twitchApiClient, socketServer)
		);
	}

	private getRandomNumberBetween(min: number, max: number) {
		return Math.random() * (max - min) + min;
	}
}

export default TwitchChatClient;
