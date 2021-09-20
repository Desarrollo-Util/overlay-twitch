import React, { FC, useEffect, useMemo } from 'react';
import { io } from 'socket.io-client';
import AlertBox from './components/alert-box';
import MemeBox from './components/meme-box';
import getFollowEventHandler from './lib/handlers/follow-handler';
import getMemeEventHandler from './lib/handlers/meme-handler';
import queueReducer from './lib/states/queue-reducer';
import { AlertTypes } from './types/alert-types.enum';

const App: FC = () => {
	const socketClient = useMemo(() => io('ws://localhost:3001'), []);
	const { queueBoxState, nextEvent, addNewEvent } = queueReducer();

	const followEventHandler = getFollowEventHandler(addNewEvent);
	const memeEventHandler = getMemeEventHandler(addNewEvent);

	useEffect(() => {
		socketClient.on('follow', followEventHandler);
		socketClient.on('meme', memeEventHandler);

		return () => {
			socketClient.off('follow', followEventHandler);
			socketClient.off('meme', memeEventHandler);
		};
	}, []);

	const renderAlerts = useMemo(
		() => (
			<>
				{queueBoxState.actualEvent && queueBoxState.actualEvent.type === AlertTypes.FOLLOW && (
					<AlertBox actualEvent={queueBoxState.actualEvent} onEnd={nextEvent} />
				)}
				{queueBoxState.actualEvent && queueBoxState.actualEvent.type === AlertTypes.MEME && (
					<MemeBox actualEvent={queueBoxState.actualEvent} onEnd={nextEvent} />
				)}
			</>
		),
		[queueBoxState.actualEvent]
	);

	return <>{renderAlerts}</>;
};

export default App;
