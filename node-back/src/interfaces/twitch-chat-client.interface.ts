import { ChatClient } from '@twurple/chat';

interface ITwitchChatClient {
	get chatClient(): ChatClient;
}

export default ITwitchChatClient;
