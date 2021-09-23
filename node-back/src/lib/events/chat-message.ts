import {
	getCommonCommandHandlers,
	getModCommandHandlers,
} from '@Lib/handlers/command-handlers';
import { ChatClient } from '@twurple/chat';
import { TwitchPrivateMessage } from '@twurple/chat/lib/commands/TwitchPrivateMessage';
import { Server } from 'socket.io';

const chatMessageHandler = (chatBot: ChatClient, socketServer: Server) => {
	const channel = process.env['TWITCH_CHANNEL'] as string;

	const commonCommandHandlers = getCommonCommandHandlers(channel, chatBot);
	const modCommandHandlers = getModCommandHandlers(channel, chatBot);

	return async (
		_channel: string,
		userName: string,
		message: string,
		info: TwitchPrivateMessage
	) => {
		const isMod =
			info.userInfo.isMod || userName === process.env['TWITCH_CHANNEL'];
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
		} else if (message.includes('explorer')) {
			setTimeout(
				() => socketServer.emit('meme'),
				Math.floor(Math.random() * 1000 * 10) + 5000
			);
		}
	};
};

export default chatMessageHandler;
