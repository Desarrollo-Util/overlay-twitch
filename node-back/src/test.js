const { ClientCredentialsAuthProvider } = require('@twurple/auth');
const { ApiClient } = require('@twurple/api');
const { EventSubListener, ReverseProxyAdapter } = require('@twurple/eventsub');
const localtunnel = require('localtunnel');
require('dotenv').config();

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;

const bootstrap = async () => {
	const authProvider = new ClientCredentialsAuthProvider(
		clientId,
		clientSecret
	);
	const apiClient = new ApiClient({ authProvider });
	const user = await apiClient.users.getUserByName(process.env.TWITCH_CHANNEL);
	const tunnel = await localtunnel(Number(process.env.PORT_EVENTSUB));

	const adapter = new ReverseProxyAdapter({
		hostName: new URL(tunnel.url).hostname,
		port: process.env.PORT_EVENTSUB,
	});

	const listener = new EventSubListener({
		apiClient,
		adapter,
		secret: process.env.WEBHOOK_SECRET,
		strictHostCheck: true,
		logger: { minLevel: 'debug' },
	});

	console.log(JSON.stringify(listener, null, 4));

	await apiClient.eventSub.deleteAllSubscriptions();
	await listener.listen();

	const subscription = await listener.subscribeToChannelRedemptionAddEvents(
		user.id,
		data => {
			console.log('HANDLER');
		}
	);

	console.log(await subscription.getCliTestCommand());
};

bootstrap();
