import { ChatClient } from '@twurple/chat';

export type GetCommandHandlers = (
	channel: string,
	chatBot: ChatClient
) => Record<
	string,
	(message: string, userId: string, userName: string) => Promise<void>
>;
