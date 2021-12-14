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

/** Twitch chat client */
@injectable()
class TwitchChatClient implements ITwitchChatClient {
	private _chatClient: ChatClient;

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
		});
	}

	/** Chat client getter */
	get chatClient(): ChatClient {
		return this._chatClient;
	}

	@postConstruct()
	protected async initializeChat() {
		await this.connectChat();
		await this.startCronJobs();
		this.startChatHandlers();
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

		const scheduler = new ToadScheduler();

		for (const [index, cronJob] of cronJobs.entries()) {
			const taskJob = new AsyncTask(
				index.toString(),
				async () =>
					await this._chatClient.say(
						this._twitchApiClient.user.name,
						cronJob.message
					),
				(err: Error) => console.error(`Error at cron messages: ${err}`)
			);

			scheduler.addSimpleIntervalJob(
				new SimpleIntervalJob({ minutes: cronJob.minutes }, taskJob)
			);
		}

		process.on('SIGINT', () => {
			console.log('Killing cron scheduler...');
			scheduler.stop();
		});
	}

	private startChatHandlers() {
		this._chatClient.onMessage(
			chatMessageHandler(this._chatClient, this._twitchApiClient)
		);
		this._chatClient.onRaid(
			raidHandler(this._chatClient, this._twitchApiClient)
		);
		this._twitchApiClient.apiClient;
	}
}

export default TwitchChatClient;
