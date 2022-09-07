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
		await chatBot.say(user.name, '/me github.com/Desarrollo-Util');
	},
	theme: async () => {
		await chatBot.say(
			user.name,
			'/me El tema que usamos en VSCode es Monokai Vibrant, aquí te dejo el enlace -> marketplace.visualstudio.com/items?itemName=s3gf4ult.monokai-vibrant'
		);
	},
	discord: async () => {
		await chatBot.say(
			user.name,
			'Aquí tienes nuestro discord: discord.gg/TDcYzwNceK'
		);
	},
	youtube: async () => {
		await chatBot.say(
			user.name,
			'Nuestros canales de Youtube => youtube.com/c/desarrolloutil y youtube.com/c/pablocdev'
		);
	},
	redes: async () => {
		await chatBot.say(
			user.name,
			'Nuestras RRSS => twitter.com/desarrollo_util instagram.com/desarrolloutil'
		);
	},
	music: async () => {
		await chatBot.say(
			user.name,
			'Música que solemos reproducir en el canal www.pretzel.rocks'
		);
	},
	culpa: async () => {
		const { body } = await got.get(
			`tmi.twitch.tv/group/user/${user.name}/chatters`,
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
	project: async () => {
		await chatBot.say(
			user.name,
			'El proyecto en el que estamos trabajando es Memesplash, una aplicación web para programar publicaciones en redes sociales. Utilizaremos React con Next.JS para el front y Node para el back. Consulta los proyectos en github.com/Desarrollo-Util/memesplash y github.com/Desarrollo-Util/front-memesplash'
		);
	},
	learnthis: async () => {
		await chatBot.say(
			user.name,
			'Nuestra plataforma de elearning: https://learnthisacademy.com'
		);
	},
	help: async function help() {
		await chatBot.say(
			user.name,
			'Comandos disponibles: !learnthis !project !git !theme !discord !youtube !redes !music !culpa !followage'
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
				`/me La promosió de este bellísimo canal, seguidle y dadle cariño -> twitch.tv/${channelToPromote}`
			);
		}
	},
});
