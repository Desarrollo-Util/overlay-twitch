import 'reflect-metadata';
import BotTwitchAuth from '@Classes/auth/bot-twitch-auth';
import PrimaryTwitchAuth from '@Classes/auth/primary-twitch-auth';
import TwitchApiClient from '@Classes/twitch/twitch-api-client';
import TwitchChatClient from '@Classes/twitch/twitch-chat-client';
import TwitchEventClient from '@Classes/twitch/twitch-event-client';
import WebServer from '@Classes/web-server';
import ITwitchApiClient from '@Interfaces/twitch-api-client.interface';
import ITwitchAuth from '@Interfaces/twitch-auth.interface';
import ITwitchChatClient from '@Interfaces/twitch-chat-client.interface';
import ITwitchEventClient from '@Interfaces/twitch-event-client.interface';
import IWebServer from '@Interfaces/web-server.interface';
import dotenv from 'dotenv';
import { Container } from 'inversify';
import iocSymbols from 'ioc-symbols';

dotenv.config();

const startServer = async () => {
	let iocContainer = new Container({ defaultScope: 'Singleton' });

	//#region Environment variables

	iocContainer
		.bind<string>(iocSymbols.TwitchChannel)
		.toConstantValue(process.env['TWITCH_CHANNEL'] as string);
	iocContainer
		.bind<string>(iocSymbols.ClientId)
		.toConstantValue(process.env['CLIENT_ID'] as string);
	iocContainer
		.bind<string>(iocSymbols.ClientSecret)
		.toConstantValue(process.env['CLIENT_SECRET'] as string);
	iocContainer
		.bind<string>(iocSymbols.ClientCode)
		.toConstantValue(process.env['CLIENT_CODE'] as string);
	iocContainer
		.bind<string>(iocSymbols.RedirectUri)
		.toConstantValue(process.env['REDIRECT_URI'] as string);
	iocContainer
		.bind<string>(iocSymbols.ChatBotClientId)
		.toConstantValue(process.env['CHAT_BOT_CLIENT_ID'] as string);
	iocContainer
		.bind<string>(iocSymbols.ChatBotClientSecret)
		.toConstantValue(process.env['CHAT_BOT_CLIENT_SECRET'] as string);
	iocContainer
		.bind<string>(iocSymbols.ChatBotClientCode)
		.toConstantValue(process.env['CHAT_BOT_CLIENT_CODE'] as string);
	iocContainer
		.bind<string>(iocSymbols.ChatBotRedirectUri)
		.toConstantValue(process.env['CHAT_BOT_REDIRECT_URI'] as string);
	iocContainer
		.bind<string>(iocSymbols.WebhookSecret)
		.toConstantValue(process.env['WEBHOOK_SECRET'] as string);
	iocContainer
		.bind<string>(iocSymbols.Hostname)
		.toConstantValue(process.env['HOSTNAME'] as string);
	iocContainer
		.bind<number>(iocSymbols.PortEventSub)
		.toConstantValue(Number(process.env['PORT_EVENTSUB'] as string));
	iocContainer
		.bind<string>(iocSymbols.DiscordWebhookURL)
		.toConstantValue(process.env['DISCORD_WEBHOOK_URL'] as string);

	//#endregion

	//#region Auth accounts

	iocContainer
		.bind<ITwitchAuth>(iocSymbols.PrimaryTwitchAuth)
		.to(PrimaryTwitchAuth);
	iocContainer.bind<ITwitchAuth>(iocSymbols.BotTwitchAuth).to(BotTwitchAuth);

	//#endregion

	//#region Twitch clients
	iocContainer
		.bind<ITwitchApiClient>(iocSymbols.TwitchApiClient)
		.to(TwitchApiClient);
	iocContainer
		.bind<ITwitchEventClient>(iocSymbols.TwitchEventClient)
		.to(TwitchEventClient);
	iocContainer
		.bind<ITwitchChatClient>(iocSymbols.TwitchChatClient)
		.to(TwitchChatClient);

	//#endregion

	//#region Web server

	iocContainer.bind<IWebServer>(iocSymbols.WebServer).to(WebServer);


	const webServer = await iocContainer.getAsync<IWebServer>(
		iocSymbols.WebServer
	);

	webServer.httpServer.listen(process.env['PORT'], () => {
		webServer.logger.info(
			`Websockets and server is ready, listening on port *:${process.env['PORT']}`
		);
		webServer.logger.info('Server is ready');
	});

	//#endregion
};

startServer();
