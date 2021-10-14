import React, {
	Dispatch,
	FC,
	SetStateAction,
	useEffect,
	useMemo,
	useState,
} from 'react';
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
import { AlertTypes } from './types/alert-types.enum';

const App: FC = () => {
	const socketClient = useMemo(
		() =>
			io('ws://localhost:3100', {
				transports: ['websocket'],
			}),
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
		socketClient.on('meme', memeEventHandler);
		socketClient.on('beer', beerEventHandler);
		socketClient.on('subscription', subscriptionEventHandler);
		socketClient.on('end-subscription', endSubscriptionEventHandler);

		return () => {
			socketClient.off('follow', followEventHandler);
			socketClient.off('meme', memeEventHandler);
			socketClient.off('beer', beerEventHandler);
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
		<>
			<SubscriptionsBar currentSubs={currentSubs} />
			{renderAlerts}
		</>
	);
};

const getCurrentSubs = async (
	setCurrentSubs: Dispatch<SetStateAction<number>>
) => {
	try {
		const response = await fetch('http://localhost:3100/subscriptions', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
		});
		const body = await response.json();

		setCurrentSubs(body);
	} catch (error) {
		console.log(error);
	}
};

export default App;
