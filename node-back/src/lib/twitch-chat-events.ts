import global from 'global';
import chatMessageHandler from './handlers/chat-message';
import raidHandler from './handlers/raid';

const startChat = () => {
	const { TWITCH_CHATBOT } = global;
	if (!TWITCH_CHATBOT) throw new Error(`TwitchChatBot isn't initialized`);

	TWITCH_CHATBOT.onMessage(chatMessageHandler());
	TWITCH_CHATBOT.onRaid(raidHandler());
};

export default startChat;
