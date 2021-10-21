import { ApiClient } from '@twurple/api';
import { ClientCredentialsAuthProvider } from '@twurple/auth';
import { EventSubListener } from '@twurple/eventsub';
import { NgrokAdapter } from '@twurple/eventsub-ngrok';

const getTwitchEventClient = async (
	appAuthProvider: ClientCredentialsAuthProvider
) => {
	const twitchApiClient = new ApiClient({ authProvider: appAuthProvider });
	await twitchApiClient.eventSub.deleteAllSubscriptions();

	const twitchEventListener = new EventSubListener({
		apiClient: twitchApiClient,
		adapter: new NgrokAdapter(),
		secret: process.env['WEBHOOK_SECRET'] as string,
	});

	await twitchEventListener.listen();

	removeListenerOnShutdown(twitchEventListener);

	return twitchEventListener;
};

const removeListenerOnShutdown = (twitchEventListener: EventSubListener) =>
	process.on('SIGINT', async () => {
		await twitchEventListener.unlisten();
		process.exit(0);
	});

export default getTwitchEventClient;
