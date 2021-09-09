import { RefreshingAuthProvider } from '@twurple/auth/lib';
import { ChatClient } from '@twurple/chat';

const initializeChatBot = async (appAuthProvider: RefreshingAuthProvider) => {
	const chatClient = new ChatClient({
		authProvider: appAuthProvider,
		channels: [process.env['TWITCH_CHANNEL'] as string],
	});

	await chatClient.connect();

	return chatClient;
};

export default initializeChatBot;
