import {
	AccessToken,
	ClientCredentialsAuthProvider,
	RefreshingAuthProvider,
} from '@twurple/auth';
import { readFile, writeFile } from 'fs/promises';
import got from 'got';
import { join } from 'path';
import {
	TwitchAuthData,
	TwitchAuthResponseData,
} from '../types/twitch-auth.type';

const TWITCH_SCOPES = [
	'channel:read:subscriptions',
	'channel:read:redemptions',
	'chat:read',
	'chat:edit',
	'whispers:edit',
];

export const getRefreshableAuthProvider = async (
	CLIENT_ID: string,
	CLIENT_SECRET: string,
	CLIENT_CODE: string,
	REDIRECT_URI: string
) => {
	const TOKENS_FILE = join(__dirname, './tokens.json');

	try {
		const refreshingAuthProvider = await generateRefresableProvider(
			CLIENT_ID,
			CLIENT_SECRET,
			TOKENS_FILE
		);

		return refreshingAuthProvider;
	} catch (error: any) {
		const twitchAuthResponse = await got
			.post(
				`https://id.twitch.tv/oauth2/token?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&code=${CLIENT_CODE}&grant_type=authorization_code&redirect_uri=${REDIRECT_URI}`,
				{
					responseType: 'json',
				}
			)
			.catch(_error => {
				const scopeQuery = TWITCH_SCOPES.reduce((prev, curr) => {
					if (!prev) return curr;
					else return `${prev}%20${curr}`;
				}, '');

				console.log(
					`Please enter in this website and get CLIENT_CODE, after this update in .env and restart:
      https://id.twitch.tv/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=${scopeQuery}`
				);

				process.exit(1);
			});

		let twitchAuthResponseJSON =
			twitchAuthResponse.body as TwitchAuthResponseData;

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

		const refreshingAuthProvider = await generateRefresableProvider(
			CLIENT_ID,
			CLIENT_SECRET,
			TOKENS_FILE
		);

		return refreshingAuthProvider;
	}
};

const generateRefresableProvider = async (
	CLIENT_ID: string,
	CLIENT_SECRET: string,
	TOKENS_FILE: string
): Promise<RefreshingAuthProvider> => {
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

	await refreshingAuthProvider.refresh();

	return refreshingAuthProvider;
};

export const getAppAuthProvider = async (
	CLIENT_ID: string,
	CLIENT_SECRET: string
) => {
	try {
		const appAuthProvider = new ClientCredentialsAuthProvider(
			CLIENT_ID,
			CLIENT_SECRET
		);

		return appAuthProvider;
	} catch (error) {
		console.error(
			'Could not get app twitch auth provider, please check your credentials'
		);
		throw error;
	}
};
