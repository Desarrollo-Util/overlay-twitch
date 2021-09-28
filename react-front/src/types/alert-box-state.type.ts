import { AlertTypes } from './alert-types.enum';

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
} & BoxEvent;

export type QueueBoxEvent = AlertBoxEvent | BeerBoxEvent | MemeBoxEvent;
