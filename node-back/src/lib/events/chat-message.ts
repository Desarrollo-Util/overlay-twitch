import { ChatClient } from '@twurple/chat/lib';
import { TwitchPrivateMessage } from '@twurple/chat/lib/commands/TwitchPrivateMessage';
import { copyFile, readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import { Server } from 'socket.io';

const PHRASE_FILE_PATH = join(__dirname, '../../resources/frases.json');
const PHRASE_SRC_FILE_PATH = join(
	__dirname,
	'../../../node-back/src/resources/frases.json'
);

const chatMessageHandler = (chatBot: ChatClient, socketServer: Server) => {
	return async (
		channel: string,
		userName: string,
		message: string,
		info: TwitchPrivateMessage
	) => {
		if (/explorer/i.test(message)) {
			setTimeout(
				() => socketServer.emit('meme'),
				Math.floor(Math.random() * 1000 * 10) + 5000
			);
		}

		if (/^!frase$/i.test(message)) {
			const phrase = await getRandomPhrase();
			chatBot.say(channel, `/me ${phrase}`);
		}

		if (/^!frase /i.test(message)) {
			if (info.userInfo.isMod || userName === process.env['TWITCH_CHANNEL']) {
				const newPhrase = message.split('!frase ')[1]?.trim();
				if (newPhrase) await addPhrase(newPhrase);
			}
		}
	};
};

export default chatMessageHandler;

const getRandomPhrase = async (): Promise<string> => {
	const frasesString = await readFile(PHRASE_FILE_PATH, {
		encoding: 'utf-8',
	});

	const { frases } = JSON.parse(frasesString);
	return frases[Math.floor(Math.random() * frases.length)];
};

const addPhrase = async (phrase: string): Promise<void> => {
	const frasesString = await readFile(PHRASE_FILE_PATH, {
		encoding: 'utf-8',
	});

	const frases = JSON.parse(frasesString);
	frases.frases.push(phrase);

	await writeFile(PHRASE_FILE_PATH, JSON.stringify(frases));
	await copyFile(PHRASE_FILE_PATH, PHRASE_SRC_FILE_PATH);
};
