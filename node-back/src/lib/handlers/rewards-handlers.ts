import { getRandomPhrase } from '@Lib/phrases';
import { ChatClient } from '@twurple/chat';
import { EventSubChannelRedemptionAddEvent } from '@twurple/eventsub';
import Rewards from 'constants/rewards.enum';
import SocketTopics from 'constants/socket-topics.enum';
import { Server as SocketServer } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';

export const getRewardsHandlers = (
	socketServer: SocketServer<
		DefaultEventsMap,
		DefaultEventsMap,
		DefaultEventsMap
	>,
	chatClient: ChatClient
): Record<string, any> => ({
	//Beer
	'78e45fd3-91e6-40be-bc5e-c9ec84152ffb': (
		redemptionEvent: EventSubChannelRedemptionAddEvent
	) => {
		const name = redemptionEvent.userName || redemptionEvent.userDisplayName;
		socketServer.emit(SocketTopics.REWARDS, {
			reward: Rewards.BEER,
			userName: name,
			message: redemptionEvent.input,
		});
	},
	//Phrase
	'da12ab41-31c2-46ba-b5a0-52f3ba88e0bf': async (
		redemptionEvent: EventSubChannelRedemptionAddEvent
	) => {
		const phrase = await getRandomPhrase();
		chatClient.say(redemptionEvent.broadcasterName, `/me ${phrase}`);
	},
	//Explorer
	'1c6f6968-8469-45ee-8c5f-bf779c67608a': (
		redemptionEvent: EventSubChannelRedemptionAddEvent
	) => {
		const name = redemptionEvent.userName || redemptionEvent.userDisplayName;
		socketServer.emit(SocketTopics.REWARDS, {
			reward: Rewards.EXPLORER,
			userName: name,
		});
	},
	//Shit
	'564b37da-728a-48a3-9d1c-16c9f87154b6': (
		redemptionEvent: EventSubChannelRedemptionAddEvent
	) => {
		const name = redemptionEvent.userName || redemptionEvent.userDisplayName;
		socketServer.emit(SocketTopics.REWARDS, {
			reward: Rewards.SHIT,
			userName: name,
		});
	},
});
