import { Server as SocketServer } from 'socket.io';
import { Client as TmiClient } from 'tmi.js';

const startChat = (tmiClient: TmiClient, socketServer: SocketServer) => {
	tmiClient.on('message', (_channel, _userstate, message) => {
		if (/explorer/i.test(message)) {
			console.log(`*************${message}**************`);
			setTimeout(
				() => socketServer.emit('meme'),
				Math.floor(Math.random() * 1000 * 10) + 5000
			);
		}
	});
};

export default startChat;
