import { ApiClient } from '@twurple/api';
import { EventSubListener } from '@twurple/eventsub';
import {} from 'fs/promises';
import { Server as SocketServer } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';

const startWebSockets = async (
	twitchApiClient: ApiClient,
	twitchEventListener: EventSubListener,
	socketServer: SocketServer<
		DefaultEventsMap,
		DefaultEventsMap,
		DefaultEventsMap
	>
) => {
	const user = await twitchApiClient.users.getUserByName(
		process.env['TWITCH_CHANNEL'] as string
	);

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
};

export default startWebSockets;
