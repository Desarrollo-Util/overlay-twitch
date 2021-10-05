import { EventSubChannelRedemptionAddEvent } from '@twurple/eventsub';
import {} from 'fs/promises';
import global from 'global';
import { Server as SocketServer } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';

const startWebSockets = async (
	socketServer: SocketServer<
		DefaultEventsMap,
		DefaultEventsMap,
		DefaultEventsMap
	>
) => {
	const { USER, TWITCH_EVENT_LISTENER } = global;

	if (!USER) throw new Error(`${process.env['TWITCH_CHANNEL']} user not found`);
	if (!TWITCH_EVENT_LISTENER)
		throw new Error(`TwitchEventListener isn't initialized`);

	await TWITCH_EVENT_LISTENER.subscribeToChannelFollowEvents(
		USER.id,
		({ userName }) => {
			socketServer.emit('follow', userName);
		}
	);

	await TWITCH_EVENT_LISTENER.subscribeToChannelSubscriptionMessageEvents(
		USER.id,
		({ userDisplayName, messageText, cumulativeMonths }) => {
			console.log(userDisplayName, messageText, cumulativeMonths);
			socketServer.emit('subscription-message', {
				userName: userDisplayName,
				message: messageText,
				months: cumulativeMonths,
			});
		}
	);

	await TWITCH_EVENT_LISTENER.subscribeToChannelSubscriptionEvents(
		USER.id,
		() => {
			socketServer.emit('subscription');
		}
	);

	await TWITCH_EVENT_LISTENER.subscribeToChannelSubscriptionEndEvents(
		USER.id,
		() => {
			socketServer.emit('end-subscription');
		}
	);

	await TWITCH_EVENT_LISTENER.subscribeToChannelRedemptionAddEventsForReward(
		USER.id,
		'78e45fd3-91e6-40be-bc5e-c9ec84152ffb',
		({ input, userDisplayName }: EventSubChannelRedemptionAddEvent) => {
			socketServer.emit('beer', {
				userName: userDisplayName,
				message: input,
			});
		}
	);
};

export default startWebSockets;
