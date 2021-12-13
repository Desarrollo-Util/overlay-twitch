import { ApiClient, HelixUser } from '@twurple/api';

/** Twitch api client interface */
interface ITwitchApiClient {
	get apiClient(): ApiClient;
	get user(): HelixUser;
}

export default ITwitchApiClient;
