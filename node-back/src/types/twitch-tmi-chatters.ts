export type TwitchTmiBody = {
	chatters: TwitchTmiChatters;
};

export type TwitchTmiChatters = {
	broadcaster: string[];
	vips: string[];
	moderators: string[];
	staff: string[];
	admins: string[];
	global_mods: string[];
	viewers: string[];
};
