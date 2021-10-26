import cors from 'cors';
import express from 'express';
import http from 'http';

const initializeHttp = () => {
	const app = express();
	app.use(cors());
	const httpServer = http.createServer(app);

	return { app, httpServer };
};

export default initializeHttp;
