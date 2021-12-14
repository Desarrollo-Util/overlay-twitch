import { FC, useEffect, useMemo } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AlertBox from './components/alert-box';
import BeerBox from './components/beer-box';
import MemeBox from './components/meme-box';
import createSocket from './lib/create-socket';
import getBeerEventHandler from './lib/handlers/beer-handler';
import getFollowEventHandler from './lib/handlers/follow-handler';
import getMemeEventHandler from './lib/handlers/meme-handler';
import queueReducer from './lib/states/queue-reducer';
import HeroPanel from './pages/hero-panel';
import SubscriptionsBar from './pages/subscriptions-bar';
import { AlertTypes } from './types/alert-types.enum';

const App: FC = () => {
	const socketClient = createSocket();
	const { queueBoxState, nextEvent, addNewEvent } = queueReducer();

	const followEventHandler = getFollowEventHandler(addNewEvent);
	const memeEventHandler = getMemeEventHandler(addNewEvent);
	const beerEventHandler = getBeerEventHandler(addNewEvent);

	useEffect(() => {
		socketClient.on('follow', followEventHandler);
		socketClient.on('beer', beerEventHandler);
		socketClient.on('explorer', memeEventHandler);
		socketClient.on('shit', memeEventHandler);

		return () => {
			socketClient.off('follow', followEventHandler);
			socketClient.off('beer', beerEventHandler);
			socketClient.off('explorer', memeEventHandler);
			socketClient.off('shit', memeEventHandler);
		};
	}, []);

	const renderAlerts = useMemo(
		() => (
			<>
				{queueBoxState.currentEvent &&
					queueBoxState.currentEvent.type === AlertTypes.FOLLOW && (
						<AlertBox
							actualEvent={queueBoxState.currentEvent}
							onEnd={nextEvent}
						/>
					)}
				{queueBoxState.currentEvent &&
					queueBoxState.currentEvent.type === AlertTypes.MEME && (
						<MemeBox
							actualEvent={queueBoxState.currentEvent}
							onEnd={nextEvent}
						/>
					)}
				{queueBoxState.currentEvent &&
					queueBoxState.currentEvent.type === AlertTypes.BEER && (
						<BeerBox
							actualEvent={queueBoxState.currentEvent}
							onEnd={nextEvent}
						/>
					)}
			</>
		),
		[queueBoxState.currentEvent]
	);

	return (
		<BrowserRouter>
			<Routes>
				<Route path='/subscription-bar' element={<SubscriptionsBar />} />
				<Route path='/alerts' element={renderAlerts} />
				<Route path='/hero' element={<HeroPanel />} />
			</Routes>
		</BrowserRouter>
	);
};

export default App;
