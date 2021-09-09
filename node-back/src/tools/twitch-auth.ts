import {
	AccessToken,
	ClientCredentialsAuthProvider,
	RefreshingAuthProvider,
} from '@twurple/auth';
import { readFile, writeFile } from 'fs/promises';
import fetch from 'node-fetch';
import { join } from 'path';
import {
	TwitchAuthData,
	TwitchAuthResponse,
	TwitchAuthResponseData,
	TwitchErrorResponse,
} from 'types/twitch-auth.type';

const TWITCH_SCOPES = ['channel:read:subscriptions', 'chat:read', 'chat:edit'];

const getTwitchAuth = async (
	CLIENT_ID: string,
	CLIENT_SECRET: string,
	CLIENT_CODE: string,
	REDIRECT_URI: string
) => {
	const TOKENS_FILE = join(__dirname, './tokens.json');

	try {
		const tokensFileBuffer = await readFile(TOKENS_FILE, 'utf8');
		const twitchAccessToken: AccessToken = JSON.parse(tokensFileBuffer);

		const refreshingAuthProvider = new RefreshingAuthProvider(
			{
				clientId: CLIENT_ID,
				clientSecret: CLIENT_SECRET,
				onRefresh: async accessToken => {
					await writeFile(
						TOKENS_FILE,
						JSON.stringify(accessToken, null, 4),
						'utf-8'
					);
				},
			},
			twitchAccessToken
		);

		refreshingAuthProvider.refresh();

		const appAuthProvider = new ClientCredentialsAuthProvider(
			process.env['CLIENT_ID'] as string,
			process.env['CLIENT_SECRET'] as string
		);

		return { appAuthProvider, refreshingAuthProvider };
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

			const scopeQuery = TWITCH_SCOPES.reduce((prev, curr) => {
				if (!prev) return curr;
				else return `${prev}%20${curr}`;
			}, '');

			console.log(
				`Please enter in this website and get CLIENT_CODE, after this update in .env and restart:
      https://id.twitch.tv/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=${scopeQuery}`
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

	throw new Error('Could not get twitch auth');
};

export default getTwitchAuth;
