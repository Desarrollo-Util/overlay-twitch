export type TwitchAuthResponse = TwitchErrorResponse | TwitchAuthResponseData;

export type TwitchErrorResponse = {
	status: number;
	message: string;
};

export type TwitchAuthResponseData = {
	access_token: string;
	refresh_token: string;
	expires_in: number;
};

export type TwitchAuthData = {
	accessToken: string;
	refreshToken: string;
	expiryTimestamp: number | null;
};
