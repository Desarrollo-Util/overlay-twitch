import { Express } from 'express';
import global from 'global';

const startEndpoints = async (app: Express) => {
	let { USER, NUMBER_OF_SUBSCRIPTIONS, TWITCH_API_CLIENT } = global;

	if (USER && TWITCH_API_CLIENT) {
		const subscriptions =
			await TWITCH_API_CLIENT.subscriptions.getSubscriptions(USER.id);

		const subscriptionEvents =
			await TWITCH_API_CLIENT.subscriptions.getSubscriptionEventsForBroadcaster(
				USER.id,
				{ limit: 30 }
			);

		const lastSubscriber = subscriptionEvents.data.find(
			({ eventType }) => eventType === 'subscriptions.subscribe'
		);

		const lastFollower = await TWITCH_API_CLIENT.users.getFollows({
			followedUser: USER.id,
			limit: 1,
		});

		NUMBER_OF_SUBSCRIPTIONS = subscriptions.total;

		app.get('/subscriptions', (_, res) => {
			res.json(NUMBER_OF_SUBSCRIPTIONS);
		});

		app.get('/last-subscriber', (_, res) => {
			res.json(lastSubscriber?.userDisplayName);
		});

		app.get('/last-follower', (_, res) => {
			res.json(lastFollower?.data[0]?.userDisplayName);
		});
	}
};

export default startEndpoints;
