import { Logger } from '@d-fischer/logger';
import { ApiClient } from '@twurple/api';
import { EventSubListener } from '@twurple/eventsub';

/** Twitch event client interface */
interface ITwitchEventClient {
	get eventClient(): EventSubListener;
	get apiClient(): ApiClient;
	get logger(): Logger;
}

export default ITwitchEventClient;
