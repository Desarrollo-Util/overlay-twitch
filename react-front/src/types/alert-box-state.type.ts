import { AlertTypes } from './alert-types.enum';
import { RewardTypes } from './reward-types.enum';

export type QueueBoxState<QueueBoxEvent> = {
	currentEvent?: QueueBoxEvent;
	eventList: Array<QueueBoxEvent>;
};

export type BoxEvent = {
	id: string;
};

export type AlertBoxEvent = {
	type: AlertTypes.FOLLOW;
	username: string;
} & BoxEvent;

export type BeerBoxEvent = {
	type: AlertTypes.BEER;
	username: string;
	message: string;
} & BoxEvent;

export type MemeBoxEvent = {
	type: AlertTypes.MEME;
	reward: RewardTypes;
} & BoxEvent;

export type QueueBoxEvent = AlertBoxEvent | BeerBoxEvent | MemeBoxEvent;
