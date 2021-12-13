import {
	ClientCredentialsAuthProvider,
	RefreshingAuthProvider,
} from '@twurple/auth';

/** Twitch auth interface */
interface ITwitchAuth {
	get refreshableAuthProvider(): RefreshingAuthProvider;
	get appAuthProvider(): ClientCredentialsAuthProvider;
}

export default ITwitchAuth;
