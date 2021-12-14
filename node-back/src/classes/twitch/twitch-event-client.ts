import ITwitchAuth from '@Interfaces/twitch-auth.interface';
import ITwitchEventClient from '@Interfaces/twitch-event-client.interface';
import { ApiClient } from '@twurple/api';
import { EventSubListener, ReverseProxyAdapter } from '@twurple/eventsub';
import { inject, injectable, postConstruct } from 'inversify';
import iocSymbols from 'ioc-symbols';
import localtunnel from 'localtunnel';

@injectable()
class TwitchEventClient implements ITwitchEventClient {
	private _eventClient!: EventSubListener;

	constructor(
		@inject(iocSymbols.Hostname) private _hostName: string,
		@inject(iocSymbols.PortEventSub) private _portEventSub: number,
		@inject(iocSymbols.WebhookSecret) private _webhookSecret: string,
		@inject(iocSymbols.PrimaryTwitchAuth)
		private _primaryTwitchAuth: ITwitchAuth
	) {}

	get eventClient(): EventSubListener {
		return this._eventClient;
	}

	@postConstruct()
	protected async initializeEventListener() {
		const twitchApiClient = new ApiClient({
			authProvider: this._primaryTwitchAuth.appAuthProvider,
		});

		let adapter;
		if (this._hostName && this._portEventSub)
			adapter = new ReverseProxyAdapter({
				hostName: this._hostName,
				port: this._portEventSub,
			});
		else if (this._portEventSub) {
			const tunnel = await localtunnel({ port: this._portEventSub });

			adapter = new ReverseProxyAdapter({
				hostName: new URL(tunnel.url).hostname,
				port: this._portEventSub,
			});
		} else throw new Error('PORT_EVENTSUB environment variable not defined');

		const twitchEventListener = new EventSubListener({
			apiClient: twitchApiClient,
			adapter,
			secret: this._webhookSecret,
			// logger: { minLevel: 'debug' },
		});

		await twitchEventListener.listen();

		const PORT = this._portEventSub || (await adapter.getListenerPort());
		console.log(`Twitch event listener on port *:${PORT}`);

		this.removeListenerOnShutdown(twitchEventListener);

		this._eventClient = twitchEventListener;
	}

	private removeListenerOnShutdown(twitchEventListener: EventSubListener) {
		process.on('SIGINT', async () => {
			console.log('Killing Twitch event listener...');
			await twitchEventListener.unlisten();

			process.exit(0);
		});
	}
}

export default TwitchEventClient;
