import { createLogger, Logger } from '@d-fischer/logger';
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
	private _apiClient!: ApiClient;
	private readonly _logger: Logger;

	constructor(
		@inject(iocSymbols.Hostname) private _hostName: string,
		@inject(iocSymbols.PortEventSub) private _portEventSub: number,
		@inject(iocSymbols.WebhookSecret) private _webhookSecret: string,
		@inject(iocSymbols.PrimaryTwitchAuth)
		private _primaryTwitchAuth: ITwitchAuth
	) {
		this._logger = createLogger({
			name: 'Twitch-Event-Client',
			emoji: true,
			minLevel: 'info',
		});
	}

	get apiClient(): ApiClient {
		return this._apiClient;
	}

	get eventClient(): EventSubListener {
		return this._eventClient;
	}

	get logger(): Logger {
		return this._logger;
	}

	@postConstruct()
	protected async initializeEventListener() {
		this._apiClient = new ApiClient({
			authProvider: this._primaryTwitchAuth.appAuthProvider,
		});

		await this._apiClient.eventSub.deleteAllSubscriptions();

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
			apiClient: this._apiClient,
			adapter,
			secret: this._webhookSecret,
			// logger: { minLevel: 'debug' },
		});

		await twitchEventListener.listen();

		const PORT = this._portEventSub || (await adapter.getListenerPort());
		this._logger.info(`Twitch event listener on port *:${PORT}`);

		this._eventClient = twitchEventListener;
	}
}

export default TwitchEventClient;
