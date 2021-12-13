const iocSymbols = {
	//#region Constants
	TwitchChannel: Symbol.for('TwitchChannel'),
	ClientId: Symbol.for('ClientId'),
	ClientSecret: Symbol.for('ClientSecret'),
	ClientCode: Symbol.for('ClientCode'),
	RedirectUri: Symbol.for('RedirectUri'),
	ChatBotClientId: Symbol.for('ChatBotClientId'),
	ChatBotClientSecret: Symbol.for('ChatBotClientSecret'),
	ChatBotClientCode: Symbol.for('ChatBotClientCode'),
	ChatBotRedirectUri: Symbol.for('ChatBotRedirectUri'),
	WebhookSecret: Symbol.for('WebhookSecret'),
	Hostname: Symbol.for('Hostname'),
	PortEventSub: Symbol.for('PortEventSub'),
	//#endregion
	//#region Auth
	PrimaryTwitchAuth: Symbol.for('PrimaryTwitchAuth'),
	BotTwitchAuth: Symbol.for('BotTwitchAuth'),
	//#endregion
	//#region Twitch tools
	TwitchApiClient: Symbol.for('TwitchApiClient'),
	TwitchEventClient: Symbol.for('TwitchEventClient'),
	TwitchChatClient: Symbol.for('TwitchChatClient'),
	//#endregion
	//#region Server
	WebServer: Symbol.for('WebServer'),
	//#endregion
};

export default iocSymbols;
