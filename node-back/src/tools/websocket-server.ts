import { Server as HttpServer } from 'http';
import { Server as SocketServer } from 'socket.io';

const initializeSocket = (httpServer: HttpServer) => {
	const socketServer = new SocketServer(httpServer, {
		cors: {
			origin: 'http://localhost:3000',
			methods: ['GET', 'POST'],
		},
	});

	socketServer.on('connection', socket => {
		console.log(`A user with socket id ${socket.id} has connected`);
	});

	return socketServer;
};

export default initializeSocket;
