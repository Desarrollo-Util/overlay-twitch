import cors from 'cors';
import express from 'express';
import http from 'http';
import { join } from 'path';

const initializeHttp = () => {
	const app = express();
	app.use(cors());
	const httpServer = http.createServer(app);

	app.get('/', (_, res) => {
		res.sendFile(join(__dirname, '../../public/index.html'));
	});

	app.use(express.static(join(__dirname, '../../public')));

	return { app, httpServer };
};

export default initializeHttp;
