import { Server as HttpServer } from 'http';

interface IWebServer {
	get httpServer(): HttpServer;
}

export default IWebServer;
