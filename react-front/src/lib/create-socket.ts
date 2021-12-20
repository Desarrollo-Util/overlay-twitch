import { io } from 'socket.io-client';
import { SocketClient } from '../types/socket-client.type';
let socket: SocketClient;

const createSocket = () => {
	if (!socket)
		socket = io(
			`ws://${import.meta.env.VITE_BACKEND_HOST}:${
				import.meta.env.VITE_BACKEND_PORT
			}`,
			{
				transports: ['websocket'],
			}
		);

	return socket;
};

export default createSocket;
