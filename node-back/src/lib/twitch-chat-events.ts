import { ChatClient } from '@twurple/chat/lib';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { Server } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';

const startChat = (
	chatBot: ChatClient,
	socketServer: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap>
) => {
	chatBot.onMessage(async (channel, _user, message) => {
		if (/explorer/i.test(message)) {
			setTimeout(
				() => socketServer.emit('meme'),
				Math.floor(Math.random() * 1000 * 10) + 5000
			);
		}

		if (/^!frase$/i.test(message)) {
			const filePath = join(__dirname, '../resources/frases.json');

			const frasesString = await readFile(filePath, {
				encoding: 'utf-8',
			});

			const { frases } = JSON.parse(frasesString);
			const frase = frases[Math.floor(Math.random() * frases.length)];

			chatBot.say(channel, `/me ${frase}`);
		}
	});
};

export default startChat;
