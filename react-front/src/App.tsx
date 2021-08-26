import React, { FC } from 'react';
import { io } from 'socket.io-client';
import AlertBox from './components/alert-box';
import MemeBox from './components/meme-box';

const socket = io('ws://localhost:3001');

const App: FC = () => {
	return (
		<>
			<AlertBox socketClient={socket} />
			<MemeBox socketClient={socket} />
		</>
	);
};

export default App;
