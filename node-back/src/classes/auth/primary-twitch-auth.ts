import { inject, injectable } from 'inversify';
import iocSymbols from 'ioc-symbols';
import TwitchAuth from './twitch-auth';

/** Primary twitch auth */
@injectable()
class PrimaryTwitchAuth extends TwitchAuth {
	/** Tokens filename */
	private static _tokensFilename = 'tokens';

	/**
	 * Constructor
	 * @param clientId Client's id
	 * @param clientSecret Client's secret
	 * @param clientCode Client's code
	 * @param redirectUri Redirect URI
	 */
	constructor(
		@inject(iocSymbols.ClientId) clientId: string,
		@inject(iocSymbols.ClientCode) clientSecret: string,
		@inject(iocSymbols.ClientId) clientCode: string,
		@inject(iocSymbols.RedirectUri) redirectUri: string
	) {
		super(
			clientId,
			clientSecret,
			clientCode,
			redirectUri,
			PrimaryTwitchAuth._tokensFilename
		);
	}
}

export default PrimaryTwitchAuth;
