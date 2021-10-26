import { ApiClient } from '@twurple/api';
import { ClientCredentialsAuthProvider } from '@twurple/auth';
import { EventSubListener, ReverseProxyAdapter } from '@twurple/eventsub';
import localtunnel from 'localtunnel';

const getTwitchEventClient = async (
	appAuthProvider: ClientCredentialsAuthProvider
) => {
	const HOSTNAME = process.env['HOSTNAME'] || undefined;
	const PORT_EVENTSUB = Number(process.env['PORT_EVENTSUB']) || undefined;

	const twitchApiClient = new ApiClient({ authProvider: appAuthProvider });
	await twitchApiClient.eventSub.deleteAllSubscriptions();

	let adapter;
	if (HOSTNAME && PORT_EVENTSUB)
		adapter = new ReverseProxyAdapter({
			hostName: HOSTNAME,
			port: PORT_EVENTSUB,
		});
	else if (PORT_EVENTSUB) {
		const tunnel = await localtunnel({ port: PORT_EVENTSUB });
		adapter = new ReverseProxyAdapter({
			hostName: new URL(tunnel.url).hostname,
			port: PORT_EVENTSUB,
		});
	} else throw new Error('PORT_EVENTSUB environment variable not defined');

	const twitchEventListener = new EventSubListener({
		apiClient: twitchApiClient,
		adapter,
		secret: process.env['WEBHOOK_SECRET'] as string,
	});

	await twitchEventListener.listen();

	const PORT = PORT_EVENTSUB || (await adapter.getListenerPort());
	console.log(`Event listener ready, listening on port *:${PORT}`);

	removeListenerOnShutdown(twitchEventListener);

	return twitchEventListener;
};

const removeListenerOnShutdown = (twitchEventListener: EventSubListener) =>
	process.on('SIGINT', async () => {
		await twitchEventListener.unlisten();
		process.exit(0);
	});

export default getTwitchEventClient;
