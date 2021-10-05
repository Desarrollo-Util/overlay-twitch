import { Express } from 'express';
import global from 'global';

const startEndpoints = async (app: Express) => {
	let { USER, NUMBER_OF_SUBSCRIPTIONS, TWITCH_API_CLIENT } = global;

	if (USER && TWITCH_API_CLIENT) {
		const subscriptions =
			await TWITCH_API_CLIENT.subscriptions.getSubscriptions(USER.id);

		NUMBER_OF_SUBSCRIPTIONS = subscriptions.total;

		app.get('/subscriptions', (_, res) => {
			res.json(NUMBER_OF_SUBSCRIPTIONS);
		});
	}
};

export default startEndpoints;
