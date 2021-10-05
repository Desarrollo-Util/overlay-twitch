import { ApiClient } from '@twurple/api';
import { RefreshingAuthProvider } from '@twurple/auth/lib';

const getTwitchApiClient = (
	refreshableAuthProvider: RefreshingAuthProvider
) => {
	const twitchApiClient = new ApiClient({
		authProvider: refreshableAuthProvider,
	});

	return twitchApiClient;
};

export default getTwitchApiClient;
