import { EventSubListener } from '@twurple/eventsub';

/** Twitch event client interface */
interface ITwitchEventClient {
	get eventClient(): EventSubListener;
}

export default ITwitchEventClient;
