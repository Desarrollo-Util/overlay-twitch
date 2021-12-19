import { useEffect } from 'react';
import uuid from 'uuid-random';
import FollowAlert from '../components/alerts/follow-alert';
import TtsAlert from '../components/alerts/tts-alert';
import { SocketTopics } from '../constants/alert-types.enum';
import useAlertQueue from '../lib/alert-queue-reducer';
import createSocket from '../lib/create-socket';
import {
	AlertEvent,
	CheerEvent,
	FollowEvent,
	SubscriptionMessageEvent,
} from '../types/alert-event.type';
import {
	CheerResponse,
	FollowResponse,
	SubscriptionMessageResponse,
} from '../types/socket-response.type';

const Alerts = () => {
	const { alertQueue, nextAlert, addNewAlert } = useAlertQueue();
	const socketClient = createSocket();

	const followHandler = getOnFollowHandler(addNewAlert);
	const subscriptionMessageHandler =
		getOnSubscriptionMessageHandler(addNewAlert);
	const cheerHandler = getOnCheerHandler(addNewAlert);

	useEffect(() => {
		socketClient.on(SocketTopics.FOLLOW, followHandler);
		socketClient.on(
			SocketTopics.SUBSCRIPTIONMESSAGE,
			subscriptionMessageHandler
		);
		socketClient.on(SocketTopics.CHEER, cheerHandler);

		return () => {
			socketClient.off(SocketTopics.FOLLOW, followHandler);
			socketClient.off(
				SocketTopics.SUBSCRIPTIONMESSAGE,
				subscriptionMessageHandler
			);
			socketClient.off(SocketTopics.CHEER, cheerHandler);
		};
	}, []);

	if (alertQueue.currentEvent?.type === SocketTopics.FOLLOW)
		return (
			<FollowAlert
				followEvent={alertQueue.currentEvent}
				nextAlert={nextAlert}
			/>
		);
	if (
		alertQueue.currentEvent?.type === SocketTopics.SUBSCRIPTIONMESSAGE ||
		alertQueue.currentEvent?.type === SocketTopics.CHEER
	)
		return <TtsAlert event={alertQueue.currentEvent} nextAlert={nextAlert} />;

	return null;
};

export default Alerts;

const getOnFollowHandler =
	(addNewAlert: (newEvent: AlertEvent) => void) =>
	({ userName }: FollowResponse) => {
		const newAlert: FollowEvent = {
			id: uuid(),
			userName,
			type: SocketTopics.FOLLOW,
		};

		addNewAlert(newAlert);
	};

const getOnSubscriptionMessageHandler =
	(addNewAlert: (newEvent: AlertEvent) => void) =>
	({ userName, message, months }: SubscriptionMessageResponse) => {
		const newAlert: SubscriptionMessageEvent = {
			id: uuid(),
			userName,
			message,
			months,
			type: SocketTopics.SUBSCRIPTIONMESSAGE,
		};

		addNewAlert(newAlert);
	};

const getOnCheerHandler =
	(addNewAlert: (newEvent: AlertEvent) => void) =>
	({ userName, message, bits }: CheerResponse) => {
		const newAlert: CheerEvent = {
			id: uuid(),
			userName,
			message,
			bits,
			type: SocketTopics.CHEER,
		};

		addNewAlert(newAlert);
	};
