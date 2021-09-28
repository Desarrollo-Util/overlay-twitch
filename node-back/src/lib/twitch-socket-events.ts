import {
	EventSubChannelRedemptionAddEvent,
	EventSubListener,
} from '@twurple/eventsub';
import {} from 'fs/promises';
import info from 'info';
import { Server as SocketServer } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';

const startWebSockets = async (
	twitchEventListener: EventSubListener,
	socketServer: SocketServer<
		DefaultEventsMap,
		DefaultEventsMap,
		DefaultEventsMap
	>
) => {
	const user = info.USER;

	if (!user) throw new Error(`${process.env['TWITCH_CHANNEL']} user not found`);

	await twitchEventListener.subscribeToChannelFollowEvents(
		user.id,
		({ userName }) => {
			socketServer.emit('follow', userName);
		}
	);

	await twitchEventListener.subscribeToChannelSubscriptionMessageEvents(
		user.id,
		({ userDisplayName, messageText, cumulativeMonths }) => {
			console.log(userDisplayName, messageText, cumulativeMonths);
			socketServer.emit('subscription', {
				userName: userDisplayName,
				message: messageText,
				months: cumulativeMonths,
			});
		}
	);

	await twitchEventListener.subscribeToChannelRedemptionAddEventsForReward(
		user.id,
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
