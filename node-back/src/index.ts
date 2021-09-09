import startChat from '@Lib/twitch-chat-events';
import startWebSockets from '@Lib/twitch-socket-events';
import initializeHttp from '@Tools/http-server';
import initializeTwitchAPI from '@Tools/twitch-api';
import getTwitchAuth from '@Tools/twitch-auth';
import initializeChatBot from '@Tools/twitch-chat';
import initializeSocket from '@Tools/websocket-server';
import dotenv from 'dotenv';
dotenv.config();

const startServer = async () => {
	//#region Initialization

	const CLIENT_ID = process.env['CLIENT_ID'] as string;
	const CLIENT_SECRET = process.env['CLIENT_SECRET'] as string;
	const CLIENT_CODE = process.env['CLIENT_CODE'] as string;
	const REDIRECT_URI = process.env['REDIRECT_URI'] as string;

	const { appAuthProvider, refreshingAuthProvider } = await getTwitchAuth(
		CLIENT_ID,
		CLIENT_SECRET,
		CLIENT_CODE,
		REDIRECT_URI
	);

	const { twitchApiClient, twitchEventListener } = await initializeTwitchAPI(
		appAuthProvider
	);
	const chatBot = await initializeChatBot(refreshingAuthProvider);
	const httpServer = initializeHttp();
	const socketServer = initializeSocket(httpServer);

	//#endregion

	await startWebSockets(twitchApiClient, twitchEventListener, socketServer);
	startChat(chatBot, socketServer);

	console.log('Server is ready');
};

startServer();
