import { ApiClient } from '@twurple/api/lib';
import { ChatClient } from '@twurple/chat/lib';
import { Server } from 'socket.io';
import chatMessageHandler from './events/chat-message';
import raidHandler from './events/raid';

const startChat = (
	chatBot: ChatClient,
	socketServer: Server,
	twitchApiClient: ApiClient
) => {
	chatBot.onMessage(chatMessageHandler(chatBot, socketServer));
	chatBot.onRaid(raidHandler(chatBot, twitchApiClient));
};

export default startChat;
