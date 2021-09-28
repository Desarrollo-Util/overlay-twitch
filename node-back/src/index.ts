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
import info from 'info';

dotenv.config();

const startServer = async () => {
	//#region Initialization

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

	const twitchApiClient = await getTwitchApiClient(refreshableAuthProvider);
	const twitchEventListener = await getTwitchEventClient(appAuthProvider);
	const chatBot = await initializeChatBot(refreshableAuthProvider);

	const { app, httpServer } = initializeHttp();
	const socketServer = initializeSocket(httpServer);

	//#endregion

	info.USER = await twitchApiClient.users.getUserByName(
		process.env['TWITCH_CHANNEL'] as string
	);

	await startEndpoints(app, twitchApiClient);
	await startWebSockets(twitchEventListener, socketServer);
	startChat(chatBot, socketServer, twitchApiClient);

	httpServer.listen(process.env['PORT'], () => {
		console.log(`Server is ready, listening on port *:${process.env['PORT']}`);
	});
};

startServer();
