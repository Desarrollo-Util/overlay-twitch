import { ChatClient } from '@twurple/chat';
import { ToadScheduler } from 'toad-scheduler';

interface ITwitchChatClient {
	get chatClient(): ChatClient;
	get cronScheduler(): ToadScheduler;
}

export default ITwitchChatClient;
