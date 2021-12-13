import { readFile } from 'fs/promises';
import global from 'global';
import { join } from 'path';
import { AsyncTask, SimpleIntervalJob, ToadScheduler } from 'toad-scheduler';
import { CronJob } from 'types/cron-jobs.type';

const CRON_SRC_FILE_PATH = join(
	__dirname,
	'../../node-back/src/resources/cron.json'
);

const startCronJobs = async () => {
	const { TWITCH_CHATBOT, USER } = global;

	if (!USER) throw new Error(`${process.env['TWITCH_CHANNEL']} user not found`);
	if (!TWITCH_CHATBOT) throw new Error(`TwitchChatBot isn't initialized`);

	const cronJobsString = await readFile(CRON_SRC_FILE_PATH, {
		encoding: 'utf-8',
	});

	let cronJobs: CronJob[];

	cronJobs = JSON.parse(cronJobsString).cronJobs;

	const scheduler = new ToadScheduler();

	for (const [index, cronJob] of cronJobs.entries()) {
		const taskJob = new AsyncTask(
			index.toString(),
			async () => await TWITCH_CHATBOT.say(USER.name, cronJob.message),
			(err: Error) => console.error(`Error at cron messages: ${err}`)
		);

		scheduler.addSimpleIntervalJob(
			new SimpleIntervalJob({ minutes: cronJob.minutes }, taskJob)
		);
	}

	removeSchedulerOnShutdown(scheduler);
};

const removeSchedulerOnShutdown = (scheduler: ToadScheduler) =>
	process.on('SIGINT', () => {
		console.log('Killing cron scheduler...');
		scheduler.stop();
	});

export default startCronJobs;
