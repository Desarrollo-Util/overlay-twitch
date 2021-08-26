import { client as TmiClient, Options as TmiOptions } from 'tmi.js';

const initializeTmi = async () => {
	const TMIOPTIONS: TmiOptions = {
		options: {
			debug: true,
		},
		connection: {
			reconnect: true,
		},
		identity: {
			username: process.env['TWTICH_USERNAME'],
			password: process.env['PASSWORD'],
		},
		channels: [process.env['TWTICH_USERNAME'] as string],
	};

	const client = new TmiClient(TMIOPTIONS);

	await client.connect();

	return client;
};

export default initializeTmi;
