import { ChatClient } from '@twurple/chat';
import { ToadScheduler } from 'toad-scheduler';
import { Server as SocketServer } from 'socket.io';

interface ITwitchChatClient {
	get chatClient(): ChatClient;
	get cronScheduler(): ToadScheduler;
	startChatHandlers(socketServer: SocketServer): void;
}

export default ITwitchChatClient;
