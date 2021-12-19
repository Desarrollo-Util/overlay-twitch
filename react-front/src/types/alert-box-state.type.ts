import { AlertTypes } from './alert-types.enum';
import { RewardTypes } from './reward-types.enum';

export type AlertQueueState<AlertEvent> = {
	currentEvent?: AlertEvent;
	eventList: Array<AlertEvent>;
};

export type GenericEvent = {
	id: string;
};

export type FollowEvent = {
	type: AlertTypes.FOLLOW;
	username: string;
} & GenericEvent;

export type BeerEvent = {
	type: AlertTypes.BEER;
	username: string;
	message: string;
} & GenericEvent;

export type MemeEvent = {
	type: AlertTypes.MEME;
	reward: RewardTypes;
} & GenericEvent;

export type AlertEvent = FollowEvent | BeerEvent | MemeEvent;
