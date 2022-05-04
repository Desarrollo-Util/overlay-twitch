import ITwitchApiClient from '@Interfaces/twitch-api-client.interface';
import { ChatClient, ChatRaidInfo, UserNotice } from '@twurple/chat';
import SocketTopics from 'constants/socket-topics.enum';
import { Server as SocketServer } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';

const raidHandler = (
	chatClient: ChatClient,
	twitchApiClient: ITwitchApiClient,
	socketServer: SocketServer<
		DefaultEventsMap,
		DefaultEventsMap,
		DefaultEventsMap
	>
) => {
	return async (
		channel: string,
		userName: string,
		raidInfo: ChatRaidInfo,
		_info: UserNotice
	) => {
		const { apiClient } = twitchApiClient;
		const stream = await apiClient.streams.getStreamByUserName(userName);

		socketServer.emit(SocketTopics.RAID, {
			userName,
			viewers: raidInfo.viewerCount,
		});

		if (stream) {
			await chatClient.say(
				channel,
				`/me ${userName} estaba en directo ${stream.title} y se ha marcado un precioso raideo con ${raidInfo.viewerCount} personitas, pegadle un buen follow a su canal https://twitch.tv/${userName}`
			);
		} else {
			await chatClient.say(
				channel,
				`/me ${userName} se ha marcado un precioso raideo con ${raidInfo.viewerCount} personitas, pegadle un buen follow a su canal https://twitch.tv/${userName}`
			);
		}
	};
};

export default raidHandler;
