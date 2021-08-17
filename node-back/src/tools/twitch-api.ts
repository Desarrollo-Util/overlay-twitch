import { readFile, writeFile } from 'fs/promises';
import fetch from 'node-fetch';
import { join } from 'path';
import { ApiClient } from 'twitch';
import {
	ClientCredentialsAuthProvider,
	RefreshableAuthProvider,
	StaticAuthProvider,
} from 'twitch-auth';
import { EventSubListener } from 'twitch-eventsub';
import { NgrokAdapter } from 'twitch-eventsub-ngrok';
import {
	TwitchAuthData,
	TwitchAuthResponse,
	TwitchAuthResponseData,
	TwitchErrorResponse,
} from 'types/twitch-auth.type';

const initializeTwitchAPI = async () => {
	const CLIENT_ID = process.env['CLIENT_ID'] as string;
	const CLIENT_SECRET = process.env['CLIENT_SECRET'] as string;
	const CLIENT_CODE = process.env['CLIENT_CODE'] as string;
	const REDIRECT_URI = process.env['REDIRECT_URI'] as string;

	const appAuthProvider = await getTwitchAuth(
		CLIENT_ID,
		CLIENT_SECRET,
		CLIENT_CODE,
		REDIRECT_URI
	);

	const twitchApiClient = new ApiClient({ authProvider: appAuthProvider });
	const twitchEventListener = new EventSubListener(
		twitchApiClient,
		new NgrokAdapter(),
		process.env['WEBHOOK_SECRET'] as string
	);

	await twitchApiClient.helix.eventSub.deleteAllSubscriptions();

	await twitchEventListener.listen();

	removeListenerOnShutdown(twitchEventListener);

	return {
		twitchApiClient,
		twitchEventListener,
	};
};

const getTwitchAuth = async (
	CLIENT_ID: string,
	CLIENT_SECRET: string,
	CLIENT_CODE: string,
	REDIRECT_URI: string
) => {
	const TOKENS_FILE = join(__dirname, './tokens.json');

	try {
		const tokensFileBuffer = await readFile(TOKENS_FILE, 'utf8');
		const twitchAuth: TwitchAuthData = JSON.parse(tokensFileBuffer);

		const refAuthProvider = new RefreshableAuthProvider(
			new StaticAuthProvider(CLIENT_ID, twitchAuth.accessToken),
			{
				clientSecret: CLIENT_SECRET,
				refreshToken: twitchAuth.refreshToken,
				expiry:
					twitchAuth.expiryTimestamp === null
						? null
						: new Date(twitchAuth.expiryTimestamp),
				onRefresh: async ({ accessToken, refreshToken, expiryDate }) => {
					const newTokenData: TwitchAuthData = {
						accessToken,
						refreshToken,
						expiryTimestamp: expiryDate === null ? null : expiryDate.getTime(),
					};
					await writeFile(
						TOKENS_FILE,
						JSON.stringify(newTokenData, null, 4),
						'utf-8'
					);
				},
			}
		);

		refAuthProvider.refresh();
	} catch (error) {
		const twitchAuthResponse = await fetch(
			`https://id.twitch.tv/oauth2/token?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&code=${CLIENT_CODE}&grant_type=authorization_code&redirect_uri=${REDIRECT_URI}`,
			{
				method: 'POST',
			}
		);

		let twitchAuthResponseJSON: TwitchAuthResponse;

		if (!twitchAuthResponse.ok) {
			twitchAuthResponseJSON =
				(await twitchAuthResponse.json()) as TwitchErrorResponse;

			console.log(
				twitchAuthResponseJSON.status,
				twitchAuthResponseJSON.message
			);
			console.log(
				`Please enter in this website and get CLIENT_CODE, after this update in .env and restart:
      https://id.twitch.tv/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=channel:read:subscriptions`
			);

			process.exit(1);
		}

		twitchAuthResponseJSON =
			(await twitchAuthResponse.json()) as TwitchAuthResponseData;

		await writeFile(
			TOKENS_FILE,
			JSON.stringify(
				{
					accessToken: twitchAuthResponseJSON.access_token,
					refreshToken: twitchAuthResponseJSON.refresh_token,
					expiryTimestamp: null,
				} as TwitchAuthData,
				null,
				4
			),
			'utf-8'
		);
	}

	const appAuthProvider = new ClientCredentialsAuthProvider(
		process.env['CLIENT_ID'] as string,
		process.env['CLIENT_SECRET'] as string
	);

	return appAuthProvider;
};

const removeListenerOnShutdown = (twitchEventListener: EventSubListener) =>
	process.on('SIGINT', async () => {
		await twitchEventListener.unlisten();
		process.exit(0);
	});

export default initializeTwitchAPI;
