import { addPhrase, getRandomPhrase } from '@Lib/phrases';
import { ChatClient } from '@twurple/chat/lib';
import got from 'got';
import { GetCommandHandlers } from 'types/command-handlers.type';
import { TwitchTmiBody } from 'types/twitch-tmi-chatters';

export const getCommonCommandHandlers: GetCommandHandlers = (
	channel: string,
	chatBot: ChatClient
) => ({
	frase: async () => {
		const phrase = await getRandomPhrase();
		await chatBot.say(channel, `/me ${phrase}`);
	},
	git: async () => {
		await chatBot.say(channel, '/me https://github.com/Desarrollo-Util');
	},
	theme: async () => {
		await chatBot.say(
			channel,
			'/me El tema que usamos en VSCode es Monokai Vibrant, aquí te dejo el enlace -> https://marketplace.visualstudio.com/items?itemName=s3gf4ult.monokai-vibrant'
		);
	},
	discord: async () => {
		await chatBot.say(
			channel,
			'Aquí tienes nuestro discord: https://discord.gg/TDcYzwNceK'
		);
	},
	youtube: async () => {
		await chatBot.say(
			channel,
			'Nuestros canales de Youtube => https://www.youtube.com/c/desarrolloutil y https://www.youtube.com/c/pablocdev'
		);
	},
	music: async () => {
		await chatBot.say(
			channel,
			'Música que solemos reproducir en el canal https://www.pretzel.rocks'
		);
	},
	culpa: async () => {
		const { body } = await got.get(
			`https://tmi.twitch.tv/group/user/${channel}/chatters`,
			{ responseType: 'json', }
		);
		const { viewers } = (body as TwitchTmiBody).chatters;

		await chatBot.say(
			channel,
			`La culpa de esto es de @${
				viewers[Math.floor(Math.random() * viewers.length)]
			}`
		);
	},
	help: async function help(){
		await chatBot.say(
			channel,
			'Comandos disponibles: !frase !git !theme !discord !youtube !music !culpa'
		);
	},
});

export const getModCommandHandlers: GetCommandHandlers = (
	channel: string,
	chatBot: ChatClient
) => ({
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
});
