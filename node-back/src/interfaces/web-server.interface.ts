import { Logger } from '@d-fischer/logger';
import { Server as HttpServer } from 'http';

interface IWebServer {
	get httpServer(): HttpServer;
	get logger(): Logger;
}

export default IWebServer;
