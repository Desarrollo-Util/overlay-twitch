import { EventSubChannelRedemptionAddEvent } from '@twurple/eventsub';
import {} from 'fs/promises';
import global from 'global';
import { Server as SocketServer } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { getRewardsHandlers } from './handlers/rewards-handlers';

const startWebSockets = async (
	socketServer: SocketServer<
		DefaultEventsMap,
		DefaultEventsMap,
		DefaultEventsMap
	>
) => {
	const { USER, TWITCH_EVENT_LISTENER, TWITCH_CHATBOT } = global;

	if (!USER) throw new Error(`${process.env['TWITCH_CHANNEL']} user not found`);
	if (!TWITCH_EVENT_LISTENER)
		throw new Error(`TwitchEventListener isn't initialized`);
	if (!TWITCH_CHATBOT) throw new Error(`Twitch Chatbot isn't initialized`);

	const customRewardsHandlers = getRewardsHandlers(
		socketServer,
		TWITCH_CHATBOT
	);

	/** Follow */
	await TWITCH_EVENT_LISTENER.subscribeToChannelFollowEvents(
		USER.id,
		({ userName }) => {
			console.log('FOLLOW', userName);
			socketServer.emit('follow', userName);
		}
	);

	/** Subscription with message */
	await TWITCH_EVENT_LISTENER.subscribeToChannelSubscriptionMessageEvents(
		USER.id,
		({ userDisplayName, messageText, cumulativeMonths }) => {
			console.log('CHANNEL_SUBSCRIPTION_MESSAGE_EVENT');
			socketServer.emit('subscription-message', {
				userName: userDisplayName,
				message: messageText,
				months: cumulativeMonths,
			});
		}
	);

	/** Subscription start */
	await TWITCH_EVENT_LISTENER.subscribeToChannelSubscriptionEvents(
		USER.id,
		() => {
			console.log('CHANNEL_SUBSCRIPTION_EVENT');
			socketServer.emit('subscription');
		}
	);

	/** Subscription end */
	await TWITCH_EVENT_LISTENER.subscribeToChannelSubscriptionEndEvents(
		USER.id,
		() => {
			console.log('CHANNEL_SUBSCRIPTION_END_EVENT');
			socketServer.emit('end-subscription');
		}
	);

	/** Custom rewards filtered */
	await TWITCH_EVENT_LISTENER.subscribeToChannelRedemptionAddEvents(
		USER.id,
		(redemptionEvent: EventSubChannelRedemptionAddEvent) => {
			const customerRewardHandler =
				customRewardsHandlers[redemptionEvent.rewardId];
			if (customerRewardHandler) customerRewardHandler(redemptionEvent);
		}
	);
};

export default startWebSockets;
