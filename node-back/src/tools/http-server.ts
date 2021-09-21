import express from 'express';
import http from 'http';
import { join } from 'path';

const initializeHttp = () => {
	const app = express();
	const httpServer = http.createServer(app);

	app.get('/', (_, res) => {
		res.sendFile(join(__dirname, '../../public/index.html'));
	});

	app.use(express.static(join(__dirname, '../../public')));

	httpServer.listen(process.env['PORT'], () => {
		console.log(`Listening on port *:${process.env['PORT']}`);
	});

	return httpServer;
};

export default initializeHttp;
