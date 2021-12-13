import { ChatRaidInfo, UserNotice } from '@twurple/chat';
import global from 'global';

const raidHandler = () => {
	return async (
		channel: string,
		userName: string,
		raidInfo: ChatRaidInfo,
		_info: UserNotice
	) => {
		const { TWITCH_API_CLIENT, TWITCH_CHATBOT } = global;

		if (!TWITCH_CHATBOT) throw new Error(`TwitchChatBot isn't initialized`);
		if (!TWITCH_API_CLIENT)
			throw new Error(`TwitchApiClient isn't initialized`);

		const stream = await TWITCH_API_CLIENT.streams.getStreamByUserName(
			userName
		);

		if (stream) {
			await TWITCH_CHATBOT.say(
				channel,
				`/me ${userName} estaba en directo ${stream.title} y se ha marcado un precioso raideo con ${raidInfo.viewerCount} personitas, pegadle un buen follow a su canal https://twitch.tv/${userName}`
			);
		} else {
			await TWITCH_CHATBOT.say(
				channel,
				`/me ${userName} se ha marcado un precioso raideo con ${raidInfo.viewerCount} personitas, pegadle un buen follow a su canal https://twitch.tv/${userName}`
			);
		}
	};
};

export default raidHandler;
