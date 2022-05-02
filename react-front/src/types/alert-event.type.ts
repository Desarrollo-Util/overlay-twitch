import { RewardTypes, SocketTopics } from '../constants/alert-types.enum';

export type AlertQueueState<AlertEvent> = {
	currentEvent?: AlertEvent;
	eventList: Array<AlertEvent>;
};

export type GenericEvent = {
	id: string;
	userName: string;
};

export type FollowEvent = {
	type: SocketTopics.FOLLOW;
} & GenericEvent;

export type SubscriptionEvent = {
	type: SocketTopics.SUBSCRIPTION;
} & GenericEvent;

export type RaidEvent = {
	type: SocketTopics.RAID;
	viewers: number;
} & GenericEvent;

export type SubscriptionEndEvent = {
	type: SocketTopics.ENDSUBSCRIPTION;
} & GenericEvent;

export type SubscriptionMessageEvent = {
	type: SocketTopics.SUBSCRIPTIONMESSAGE;
	message: string;
	months: number;
} & GenericEvent;

export type CheerEvent = {
	type: SocketTopics.CHEER;
	message: string;
	bits: number;
} & GenericEvent;

export type RewardEvent = {
	type: SocketTopics.REWARDS;
	reward: RewardTypes;
} & GenericEvent;

export type AlertEvent =
	| FollowEvent
	| SubscriptionEvent
	| SubscriptionEndEvent
	| SubscriptionMessageEvent
	| CheerEvent
	| RewardEvent
	| RaidEvent;
