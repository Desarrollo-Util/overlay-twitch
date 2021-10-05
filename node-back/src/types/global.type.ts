import { ApiClient, HelixUser } from '@twurple/api/lib';
import { ChatClient } from '@twurple/chat/lib';
import { EventSubListener } from '@twurple/eventsub/lib';

export type GlobalType = {
	USER: HelixUser | null;
	NUMBER_OF_SUBSCRIPTIONS: number | null;
	TWITCH_API_CLIENT: ApiClient | null;
	TWITCH_EVENT_LISTENER: EventSubListener | null;
	TWITCH_CHATBOT: ChatClient | null;
};
