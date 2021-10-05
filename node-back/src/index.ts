import startEndpoints from '@Lib/endpoints';
import startChat from '@Lib/twitch-chat-events';
import startWebSockets from '@Lib/twitch-socket-events';
import initializeHttp from '@Tools/http-server';
import getTwitchApiClient from '@Tools/twitch-api-client';
import {
	getAppAuthProvider,
	getRefreshableAuthProvider,
} from '@Tools/twitch-auth';
import initializeChatBot from '@Tools/twitch-chat-client';
import getTwitchEventClient from '@Tools/twitch-event-client';
import initializeSocket from '@Tools/websocket-server';
import dotenv from 'dotenv';
import global from 'global';

dotenv.config();

const startServer = async () => {
	const CLIENT_ID = process.env['CLIENT_ID'] as string;
	const CLIENT_SECRET = process.env['CLIENT_SECRET'] as string;
	const CLIENT_CODE = process.env['CLIENT_CODE'] as string;
	const REDIRECT_URI = process.env['REDIRECT_URI'] as string;

	const appAuthProvider = await getAppAuthProvider(CLIENT_ID, CLIENT_SECRET);
	const refreshableAuthProvider = await getRefreshableAuthProvider(
		CLIENT_ID,
		CLIENT_SECRET,
		CLIENT_CODE,
		REDIRECT_URI
	);

	global.TWITCH_API_CLIENT = getTwitchApiClient(refreshableAuthProvider);
	global.TWITCH_EVENT_LISTENER = await getTwitchEventClient(appAuthProvider);
	global.TWITCH_CHATBOT = await initializeChatBot(refreshableAuthProvider);
	global.USER = await global.TWITCH_API_CLIENT.users.getUserByName(
		process.env['TWITCH_CHANNEL'] as string
	);

	const { app, httpServer } = initializeHttp();
	const socketServer = initializeSocket(httpServer);

	await startEndpoints(app);
	await startWebSockets(socketServer);
	startChat(socketServer);

	httpServer.listen(process.env['PORT'], () => {
		console.log(`Server is ready, listening on port *:${process.env['PORT']}`);
	});
};

startServer();
