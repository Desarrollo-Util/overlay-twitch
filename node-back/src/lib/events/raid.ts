import { ApiClient } from '@twurple/api/lib';
import { ChatClient, ChatRaidInfo, UserNotice } from '@twurple/chat/lib';

const raidHandler = (chatBot: ChatClient, twitchApiClient: ApiClient) => {
	return async (
		channel: string,
		userName: string,
		raidInfo: ChatRaidInfo,
		_info: UserNotice
	) => {
		const stream = await twitchApiClient.streams.getStreamByUserName(userName);

		if (stream) {
			chatBot.say(
				channel,
				`/me ${userName} estaba en directo ${stream.title} y se ha marcado un precioso raideo con ${raidInfo.viewerCount} personitas, pegadle un buen follow a su canal https://twitch.tv/${userName}`
			);
		} else {
			chatBot.say(
				channel,
				`/me ${userName} se ha marcado un precioso raideo con ${raidInfo.viewerCount} personitas, pegadle un buen follow a su canal https://twitch.tv/${userName}`
			);
		}
	};
};

export default raidHandler;
