import { useEffect } from 'react';
import uuid from 'uuid-random';
import FollowAlert from '../components/alerts/follow-alert';
import RewardAlert from '../components/alerts/reward-alert';
import TtsAlert from '../components/alerts/tts-alert';
import { SocketTopics } from '../constants/alert-types.enum';
import useAlertQueue from '../lib/alert-queue-reducer';
import createSocket from '../lib/create-socket';
import {
	AlertEvent,
	CheerEvent,
	FollowEvent,
	RewardEvent,
	SubscriptionMessageEvent,
} from '../types/alert-event.type';
import {
	CheerResponse,
	FollowResponse,
	RewardResponse,
	SubscriptionMessageResponse,
} from '../types/socket-response.type';

const Alerts = () => {
	const { alertQueue, nextAlert, addNewAlert } = useAlertQueue();
	const socketClient = createSocket();

	const followHandler = getFollowHandler(addNewAlert);
	const subscriptionMessageHandler = getSubscriptionMessageHandler(addNewAlert);
	const cheerHandler = getCheerHandler(addNewAlert);
	const rewardsHandler = getRewardsHandler(addNewAlert);

	useEffect(() => {
		socketClient.on(SocketTopics.FOLLOW, followHandler);
		socketClient.on(
			SocketTopics.SUBSCRIPTIONMESSAGE,
			subscriptionMessageHandler
		);
		socketClient.on(SocketTopics.CHEER, cheerHandler);
		socketClient.on(SocketTopics.REWARDS, rewardsHandler);

		// setTimeout(
		// 	() =>
		// 		addNewAlert({
		// 			type: SocketTopics.REWARDS,
		// 			id: uuid(),
		// 			userName: 'yeah',
		// 			reward: RewardTypes.BEER,
		// 		}),
		// 	1000
		// );

		return () => {
			socketClient.off(SocketTopics.FOLLOW, followHandler);
			socketClient.off(
				SocketTopics.SUBSCRIPTIONMESSAGE,
				subscriptionMessageHandler
			);
			socketClient.off(SocketTopics.CHEER, cheerHandler);
			socketClient.off(SocketTopics.REWARDS, rewardsHandler);
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
		return (
			<TtsAlert ttsEvent={alertQueue.currentEvent} nextAlert={nextAlert} />
		);

	if (alertQueue.currentEvent?.type === SocketTopics.REWARDS)
		return (
			<RewardAlert
				rewardEvent={alertQueue.currentEvent}
				nextAlert={nextAlert}
			/>
		);

	return null;
};

export default Alerts;

const getFollowHandler =
	(addNewAlert: (newEvent: AlertEvent) => void) =>
	({ userName }: FollowResponse) => {
		const newAlert: FollowEvent = {
			id: uuid(),
			userName,
			type: SocketTopics.FOLLOW,
		};

		addNewAlert(newAlert);
	};

const getSubscriptionMessageHandler =
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

const getCheerHandler =
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

const getRewardsHandler =
	(addNewAlert: (newEvent: AlertEvent) => void) =>
	({ userName, reward }: RewardResponse) => {
		const newAlert: RewardEvent = {
			id: uuid(),
			userName,
			type: SocketTopics.REWARDS,
			reward,
		};

		addNewAlert(newAlert);
	};
