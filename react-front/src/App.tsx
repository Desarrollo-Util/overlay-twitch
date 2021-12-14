import {
	Dispatch,
	FC,
	SetStateAction,
	useEffect,
	useMemo,
	useState,
} from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { io } from 'socket.io-client';
import AlertBox from './components/alert-box';
import BeerBox from './components/beer-box';
import MemeBox from './components/meme-box';
import SubscriptionsBar from './components/subscriptions-bar';
import getBeerEventHandler from './lib/handlers/beer-handler';
import getEndSubscriptionEventHandler from './lib/handlers/end-subscription-handler';
import getFollowEventHandler from './lib/handlers/follow-handler';
import getMemeEventHandler from './lib/handlers/meme-handler';
import getSubscriptionEventHandler from './lib/handlers/subscription-handler';
import queueReducer from './lib/states/queue-reducer';
import HeroPanel from './pages/hero-panel';
import { AlertTypes } from './types/alert-types.enum';

const App: FC = () => {
	const socketClient = useMemo(
		() =>
			io(
				`ws://${import.meta.env.VITE_BACKEND_HOST}:${
					import.meta.env.VITE_BACKEND_PORT
				}`,
				{
					transports: ['websocket'],
				}
			),
		[]
	);
	const { queueBoxState, nextEvent, addNewEvent } = queueReducer();
	const [currentSubs, setCurrentSubs] = useState<number>(0);

	const followEventHandler = getFollowEventHandler(addNewEvent);
	const memeEventHandler = getMemeEventHandler(addNewEvent);
	const beerEventHandler = getBeerEventHandler(addNewEvent);
	const subscriptionEventHandler = getSubscriptionEventHandler(setCurrentSubs);
	const endSubscriptionEventHandler =
		getEndSubscriptionEventHandler(setCurrentSubs);

	useEffect(() => {
		if (!currentSubs) getCurrentSubs(setCurrentSubs);
		socketClient.on('follow', followEventHandler);
		socketClient.on('beer', beerEventHandler);
		socketClient.on('explorer', memeEventHandler);
		socketClient.on('shit', memeEventHandler);
		socketClient.on('subscription', subscriptionEventHandler);
		socketClient.on('end-subscription', endSubscriptionEventHandler);

		return () => {
			socketClient.off('follow', followEventHandler);
			socketClient.off('beer', beerEventHandler);
			socketClient.off('explorer', memeEventHandler);
			socketClient.off('shit', memeEventHandler);
			socketClient.off('subscription', subscriptionEventHandler);
			socketClient.off('end-subscription', endSubscriptionEventHandler);
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
				<Route
					path='/subscription-bar'
					element={<SubscriptionsBar currentSubs={currentSubs} />}
				/>
				<Route path='/alerts' element={renderAlerts} />
				<Route path='/hero' element={<HeroPanel />} />
			</Routes>
		</BrowserRouter>
	);
};

const getCurrentSubs = async (
	setCurrentSubs: Dispatch<SetStateAction<number>>
) => {
	try {
		const response = await fetch(
			`http://${import.meta.env.VITE_BACKEND_HOST}:${
				import.meta.env.VITE_BACKEND_PORT
			}/subscriptions`,
			{
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				},
			}
		);
		const body = await response.json();

		setCurrentSubs(body);
	} catch (error) {
		console.log(error);
	}
};

export default App;
