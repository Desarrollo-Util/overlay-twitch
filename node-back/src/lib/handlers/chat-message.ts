import ITwitchApiClient from '@Interfaces/twitch-api-client.interface';
import {
	getCommonCommandHandlers,
	getModCommandHandlers,
} from '@Lib/handlers/command-handlers';
import { ChatClient } from '@twurple/chat';
import { TwitchPrivateMessage } from '@twurple/chat/lib/commands/TwitchPrivateMessage';

const chatMessageHandler = (
	chatClient: ChatClient,
	twitchApiClient: ITwitchApiClient
) => {
	const { apiClient, user } = twitchApiClient;
	const commonCommandHandlers = getCommonCommandHandlers(
		user,
		chatClient,
		apiClient
	);
	const modCommandHandlers = getModCommandHandlers(user, chatClient, apiClient);

	return async (
		_channel: string,
		userName: string,
		message: string,
		info: TwitchPrivateMessage
	) => {
		const isMod = info.userInfo.isMod || userName === user.name;
		const isCommandRegex = /^![a-zA-Z]+\s*/g;
		const isCommand = message.match(isCommandRegex);

		if (isCommand) {
			const command = (isCommand[0] as string).replace('!', '').trimEnd();
			const messageText = message.replace(isCommand[0] as string, '').trimEnd();

			const handler = commonCommandHandlers[command];

			if (handler) await handler(messageText, info.userInfo.userId, userName);
			else if (isMod) {
				const modHandler = modCommandHandlers[command];
				if (modHandler)
					await modHandler(messageText, info.userInfo.userId, userName);
			}
		}
	};
};

export default chatMessageHandler;
