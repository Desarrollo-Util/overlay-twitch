import { ApiClient } from '@twurple/api/lib';
import { Express } from 'express';
import info from 'info';

const startEndpoints = async (app: Express, twitchApiClient: ApiClient) => {
	let { USER, NUMBER_OF_SUBSCRIPTIONS } = info;

	if (USER) {
		const subscriptions = await twitchApiClient.subscriptions.getSubscriptions(
			USER.id
		);

		NUMBER_OF_SUBSCRIPTIONS = subscriptions.total;

		app.get('/subscriptions', (_, res) => {
			res.json(NUMBER_OF_SUBSCRIPTIONS);
		});
	}
};

export default startEndpoints;
