import {
	getCommonCommandHandlers,
	getModCommandHandlers,
} from '@Lib/handlers/command-handlers';
import { TwitchPrivateMessage } from '@twurple/chat/lib/commands/TwitchPrivateMessage';
import global from 'global';

const chatMessageHandler = () => {
	const { TWITCH_CHATBOT, USER } = global;

	if (!USER) throw new Error(`${process.env['TWITCH_CHANNEL']} user not found`);
	if (!TWITCH_CHATBOT) throw new Error(`TwitchChatBot isn't initialized`);

	const commonCommandHandlers = getCommonCommandHandlers(
		USER.name,
		TWITCH_CHATBOT
	);
	const modCommandHandlers = getModCommandHandlers(USER.name, TWITCH_CHATBOT);

	return async (
		_channel: string,
		userName: string,
		message: string,
		info: TwitchPrivateMessage
	) => {
		const isMod = info.userInfo.isMod || userName === USER.name;
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
