import {} from 'fs/promises';
import { Server as SocketServer } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { EventSubListener } from 'twitch-eventsub/lib';
import { ApiClient } from 'twitch/lib';

const startWebSockets = async (
	twitchApiClient: ApiClient,
	twitchEventListener: EventSubListener,
	socketServer: SocketServer<
		DefaultEventsMap,
		DefaultEventsMap,
		DefaultEventsMap
	>
) => {
	const user = await twitchApiClient.helix.users.getUserByName(
		process.env['TWTICH_USERNAME'] as string
	);

	if (!user)
		throw new Error(`${process.env['TWTICH_USERNAME']} user not found`);

	twitchEventListener.subscribeToChannelFollowEvents(
		user.id,
		({ userName }) => {
			socketServer.emit('follow', userName);
		}
	);

	twitchEventListener.subscribeToChannelSubscriptionMessageEvents(
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
