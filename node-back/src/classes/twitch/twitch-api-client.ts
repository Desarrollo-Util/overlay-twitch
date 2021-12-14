import ITwitchApiClient from '@Interfaces/twitch-api-client.interface';
import ITwitchAuth from '@Interfaces/twitch-auth.interface';
import { ApiClient, HelixUser } from '@twurple/api';
import { inject, injectable, postConstruct } from 'inversify';
import iocSymbols from 'ioc-symbols';

/** Twitch api client */
@injectable()
class TwitchApiClient implements ITwitchApiClient {
	private _apiClient: ApiClient;
	private _user!: HelixUser;

	/**
	 * Constructor
	 * @param primaryTwitchAuth Primary twitch auth
	 */
	constructor(
		@inject(iocSymbols.TwitchChannel) public twitchChannel: string,
		@inject(iocSymbols.PrimaryTwitchAuth) private primaryTwitchAuth: ITwitchAuth
	) {
		this._apiClient = new ApiClient({
			authProvider: this.primaryTwitchAuth.refreshableAuthProvider,
			// logger: { minLevel: 'debug' },
		});
	}

	/** Api client getter */
	get apiClient(): ApiClient {
		return this._apiClient;
	}

	/** User getter */
	get user(): HelixUser {
		return this._user;
	}

	@postConstruct()
	/** User init */
	protected async initializeUser() {
		const user = await this._apiClient.users.getUserByName(this.twitchChannel);

		if (!user) throw new Error(`${this.twitchChannel} user not found`);

		this._user = user;
	}
}

export default TwitchApiClient;
