import { RewardTypes } from '../constants/alert-types.enum';

export type GenericResponse = {
	userName: string;
};

export type FollowResponse = GenericResponse;

export type SubscriptionResponse = GenericResponse;

export type SubscriptionMessageResponse = {
	message: string;
	months: number;
} & GenericResponse;

export type CheerResponse = {
	message: string;
	bits: number;
} & GenericResponse;

export type RewardResponse = {
	reward: RewardTypes;
} & GenericResponse;

export type RaidResponse = {
	viewers: number;
} & GenericResponse;
