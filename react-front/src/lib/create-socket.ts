import { io } from 'socket.io-client';
import { SocketClient } from '../types/socket-client.type';
let socket: SocketClient;

const createSocket = () => {
	if (!socket)
		socket = io(
			`${import.meta.env.VITE_NODE_ENV === 'production' ? 'wss' : 'ws'}://${
				import.meta.env.VITE_BACKEND_HOST
			}`,
			{
				transports: ['websocket'],
			}
		);

	return socket;
};

export default createSocket;
