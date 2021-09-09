import { ApiClient } from '@twurple/api';
import { ClientCredentialsAuthProvider } from '@twurple/auth/lib';
import { EventSubListener } from '@twurple/eventsub';
import { NgrokAdapter } from '@twurple/eventsub-ngrok';

const initializeTwitchAPI = async (
	twitchAuthProvider: ClientCredentialsAuthProvider
) => {
	const twitchApiClient = new ApiClient({ authProvider: twitchAuthProvider });
	const twitchEventListener = new EventSubListener({
		apiClient: twitchApiClient,
		adapter: new NgrokAdapter(),
		secret: process.env['WEBHOOK_SECRET'] as string,
	});

	await twitchApiClient.eventSub.deleteAllSubscriptions();

	await twitchEventListener.listen();

	removeListenerOnShutdown(twitchEventListener);

	return {
		twitchApiClient,
		twitchEventListener,
	};
};

const removeListenerOnShutdown = (twitchEventListener: EventSubListener) =>
	process.on('SIGINT', async () => {
		await twitchEventListener.unlisten();
		process.exit(0);
	});

export default initializeTwitchAPI;
