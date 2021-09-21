import { addPhrase, getRandomPhrase } from '@Lib/phrases';
import { ChatClient } from '@twurple/chat';
import { TwitchPrivateMessage } from '@twurple/chat/lib/commands/TwitchPrivateMessage';
import { Server } from 'socket.io';

const chatMessageHandler = (chatBot: ChatClient, socketServer: Server) => {
	const channel = process.env['TWITCH_CHANNEL'] as string;

	const commonCommandHandlers: Record<string, () => Promise<void>> = {
		frase: async () => {
			const phrase = await getRandomPhrase();
			chatBot.say(channel, `/me ${phrase}`);
		},
	};

	const modCommandHandlers: Record<string, (message: string) => Promise<void>> =
		{
			addfrase: addPhrase,
			promo: async (message: string) => {
				const messageSplitted = message.split(' ');
				const channelToPromote = messageSplitted[1];

				if (channelToPromote && messageSplitted.length === 2) {
					await chatBot.say(
						channel,
						`/me La promosió de este bellísimo canal, seguidle y dadle cariño -> https://twitch.tv/${channelToPromote}`
					);
				}
			},
		};

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
			const handler = commonCommandHandlers[command];

			if (handler) await handler();
			else if (isMod) {
				const modHandler = modCommandHandlers[command];
				const messageText = message
					.replace(isCommand[0] as string, '')
					.trimEnd();
				if (modHandler) await modHandler(messageText);
			}
		}

		if (message.includes('explorer')) {
			setTimeout(
				() => socketServer.emit('meme'),
				Math.floor(Math.random() * 1000 * 10) + 5000
			);
		}
	};
};

export default chatMessageHandler;
