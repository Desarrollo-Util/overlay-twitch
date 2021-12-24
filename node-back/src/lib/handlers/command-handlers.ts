import { addPhrase } from '@Lib/phrases';
import { ApiClient, HelixUser } from '@twurple/api';
import { ChatClient } from '@twurple/chat';
import got from 'got';
import { GetCommandHandlers } from 'types/command-handlers.type';
import { TwitchTmiBody } from 'types/twitch-tmi-chatters';

export const getCommonCommandHandlers: GetCommandHandlers = (
	user: HelixUser,
	chatBot: ChatClient,
	twitchApiClient: ApiClient
) => ({
	git: async () => {
		await chatBot.say(user.name, '/me https://github.com/Desarrollo-Util');
	},
	theme: async () => {
		await chatBot.say(
			user.name,
			'/me El tema que usamos en VSCode es Monokai Vibrant, aquí te dejo el enlace -> https://marketplace.visualstudio.com/items?itemName=s3gf4ult.monokai-vibrant'
		);
	},
	discord: async () => {
		await chatBot.say(
			user.name,
			'Aquí tienes nuestro discord: https://discord.gg/TDcYzwNceK'
		);
	},
	youtube: async () => {
		await chatBot.say(
			user.name,
			'Nuestros canales de Youtube => https://www.youtube.com/c/desarrolloutil y https://www.youtube.com/c/pablocdev'
		);
	},
	rrss: async () => {
		await chatBot.say(
			user.name,
			'Nuestras RRSS => https://twitter.com/desarrollo_util https://www.instagram.com/desarrolloutil'
		);
	},
	music: async () => {
		await chatBot.say(
			user.name,
			'Música que solemos reproducir en el canal https://www.pretzel.rocks'
		);
	},
	culpa: async () => {
		const { body } = await got.get(
			`https://tmi.twitch.tv/group/user/${user.name}/chatters`,
			{ responseType: 'json' }
		);
		const { viewers } = (body as TwitchTmiBody).chatters;

		await chatBot.say(
			user.name,
			`La culpa de esto es de @${
				viewers[Math.floor(Math.random() * viewers.length)]
			}`
		);
	},
	followage: async (_, userId, userName) => {
		const followage =
			await twitchApiClient.users.getFollowFromUserToBroadcaster(
				userId,
				user.id
			);

		if (followage) {
			const days =
				(new Date().getTime() - followage.followDate.getTime()) /
				(1000 * 3600 * 24);

			await chatBot.say(
				user.name,
				`${userName} nos sigue desde hace ${days.toFixed(0)} días`
			);
		}
	},
	beta: async () => {
		await chatBot.say(
			user.name,
			'Puedes probar la beta de Learnthis aquí: https://learnthisdev.com'
		);
	},
	help: async function help() {
		await chatBot.say(
			user.name,
			'Comandos disponibles: !git !theme !discord !youtube !music !culpa !followage !beta'
		);
	},
});

export const getModCommandHandlers: GetCommandHandlers = (
	user: HelixUser,
	chatBot: ChatClient
) => ({
	addfrase: addPhrase,
	promo: async (message: string) => {
		const messageSplitted = message.split(' ');
		const channelToPromote = messageSplitted[0];

		if (channelToPromote && messageSplitted.length === 1) {
			await chatBot.say(
				user.name,
				`/me La promosió de este bellísimo canal, seguidle y dadle cariño -> https://twitch.tv/${channelToPromote}`
			);
		}
	},
});
