import { ApiClient, HelixUser } from '@twurple/api';
import { ChatClient } from '@twurple/chat';

export type GetCommandHandlers = (
	user: HelixUser,
	chatBot: ChatClient,
	twitchApiClient: ApiClient
) => Record<
	string,
	(message: string, userId: string, userName: string) => Promise<void>
>;
