import ITwitchAuth from '@Interfaces/twitch-auth.interface';
import {
	AccessToken,
	ClientCredentialsAuthProvider,
	RefreshingAuthProvider,
} from '@twurple/auth';
import { readFile, writeFile } from 'fs/promises';
import got from 'got';
import { inject, injectable, postConstruct, unmanaged } from 'inversify';
import iocSymbols from 'ioc-symbols';
import { join } from 'path';
import { TwitchAuthData, TwitchAuthResponseData } from 'types/twitch-auth.type';

/** Twitch auth class */
@injectable()
abstract class TwitchAuth implements ITwitchAuth {
	private static TWITCH_SCOPES = [
		'channel:read:subscriptions',
		'channel:read:redemptions',
		'chat:read',
		'chat:edit',
		'whispers:edit',
	];

	private _appAuthProvider!: ClientCredentialsAuthProvider;
	private _refreshableAuthProvider!: RefreshingAuthProvider;

	/**
	 * Constructor
	 * @param clientId Client's id
	 * @param clientSecret Client's secret
	 * @param clientCode Client's code
	 * @param redirectUri Redirect URI
	 * @param tokensFilename Tokens filename
	 */
	constructor(
		@inject(iocSymbols.ClientId) private _clientId: string,
		@inject(iocSymbols.ClientCode) private _clientSecret: string,
		@inject(iocSymbols.ClientId) private _clientCode: string,
		@inject(iocSymbols.RedirectUri) private _redirectUri: string,
		@unmanaged() public tokensFilename: string
	) {
		this.initAppAuthProvider();
	}

	/** Application auth provider getter */
	public get appAuthProvider(): ClientCredentialsAuthProvider {
		return this._appAuthProvider;
	}

	/** Refreshable auth provider getter */
	public get refreshableAuthProvider(): RefreshingAuthProvider {
		return this._refreshableAuthProvider;
	}

	/** Initialize application auth provider */
	private initAppAuthProvider() {
		try {
			this._appAuthProvider = new ClientCredentialsAuthProvider(
				this._clientId,
				this._clientSecret
			);
		} catch (error) {
			console.error(
				'Could not get app twitch auth provider, please check your credentials'
			);
			throw error;
		}
	}

	@postConstruct()
	/** Initialize refreshable auth provider */
	protected async initRefreshableAuthProvider() {
		const tokensFile = join(
			__dirname,
			`../../../node-back/${this.tokensFilename}.json`
		);

		try {
			this._refreshableAuthProvider = await this.generateRefresableProvider(
				tokensFile
			);
		} catch (error: any) {
			const twitchAuthResponse = await got
				.post(
					`https://id.twitch.tv/oauth2/token?client_id=${this._clientId}&client_secret=${this._clientSecret}&code=${this._clientCode}&grant_type=authorization_code&redirect_uri=${this._redirectUri}`,
					{
						responseType: 'json',
					}
				)
				.catch(_error => {
					const scopeQuery = TwitchAuth.TWITCH_SCOPES.reduce((prev, curr) => {
						if (!prev) return curr;
						else return `${prev}%20${curr}`;
					}, '');

					console.log(
						`Please enter in this website and get ${
							this.tokensFilename === 'tokens'
								? 'CLIENT_CODE'
								: 'CHAT_BOT_CLIENT_CODE'
						}, after this update in .env and restart:
      https://id.twitch.tv/oauth2/authorize?client_id=${
				this._clientId
			}&redirect_uri=${
							this._redirectUri
						}&response_type=code&scope=${scopeQuery}`
					);

					process.exit(1);
				});

			let twitchAuthResponseJSON =
				twitchAuthResponse.body as TwitchAuthResponseData;

			await writeFile(
				tokensFile,
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

			this._refreshableAuthProvider = await this.generateRefresableProvider(
				tokensFile
			);
		}
	}

	/**
	 * Refreshable provider generator
	 * @param tokensFile Tokens file
	 * @returns Refreshable provider
	 */
	private async generateRefresableProvider(
		tokensFile: string
	): Promise<RefreshingAuthProvider> {
		const tokensFileBuffer = await readFile(tokensFile, 'utf8');
		const twitchAccessToken: AccessToken = JSON.parse(
			tokensFileBuffer.toString()
		);

		const refreshingAuthProvider = new RefreshingAuthProvider(
			{
				clientId: this._clientId,
				clientSecret: this._clientSecret,
				onRefresh: async accessToken => {
					await writeFile(
						tokensFile,
						JSON.stringify(accessToken, null, 4),
						'utf-8'
					);
				},
			},
			twitchAccessToken
		);

		await refreshingAuthProvider.refresh();

		return refreshingAuthProvider;
	}
}

export default TwitchAuth;
