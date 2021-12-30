import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react';
import HeroItem from '../components/hero-panel/hero-item';
import SocketTopics from '../constants/socket-topics.enum';
import BitsIcon from '../icons/bits-icon';
import FollowIcon from '../icons/follow-icon';
import SubscriptionIcon from '../icons/subscription-icon';
import createSocket from '../lib/create-socket';
import { HeroInfoState, HeroTypes } from '../types/hero-info-state.type';
import {
	CheerResponse,
	FollowResponse,
	SubscriptionResponse,
} from '../types/socket-response.type';

const HeroPanel: FC = () => {
	const socketClient = createSocket();
	const [heroState, setHeroState] = useState<HeroInfoState>();

	const followHandler = getOnFollowHandler(setHeroState);
	const subHandler = getOnSubHandler(setHeroState);
	const cheerHandler = getOnCheerHandler(setHeroState);

	useEffect(() => {
		getHeroInfo(setHeroState);

		socketClient.on(SocketTopics.FOLLOW, followHandler);
		socketClient.on(SocketTopics.SUBSCRIPTION, subHandler);
		socketClient.on(SocketTopics.CHEER, cheerHandler);

		return () => {
			socketClient.off(SocketTopics.FOLLOW, followHandler);
			socketClient.off(SocketTopics.SUBSCRIPTION, subHandler);
			socketClient.off(SocketTopics.CHEER, cheerHandler);
		};
	}, []);

	return (
		<div className='container-lg flex-c-c'>
			<HeroItem
				icon={SubscriptionIcon}
				label='LAST SUB'
				type={HeroTypes.SUBSCRIPTION}
				heroState={heroState}
			/>
			<HeroItem
				icon={FollowIcon}
				label='LAST FOLLOW'
				type={HeroTypes.FOLLOW}
				heroState={heroState}
			/>
			<HeroItem
				icon={BitsIcon}
				label='LAST BITS'
				type={HeroTypes.CHEER}
				heroState={heroState}
			/>
		</div>
	);
};

const getHeroInfo = async (
	setHeroState: Dispatch<SetStateAction<HeroInfoState | undefined>>
) => {
	const lastFollowerResponse = await fetch(
		`${import.meta.env.VITE_NODE_ENV === 'production' ? 'https' : 'http'}://${
			import.meta.env.VITE_BACKEND_HOST
		}/last-follower`,
		{
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
		}
	);

	const lastSubscriberResponse = await fetch(
		`${import.meta.env.VITE_NODE_ENV === 'production' ? 'https' : 'http'}://${
			import.meta.env.VITE_BACKEND_HOST
		}/last-subscriber`,
		{
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
		}
	);

	const lastCheerResponse = await fetch(
		`${import.meta.env.VITE_NODE_ENV === 'production' ? 'https' : 'http'}://${
			import.meta.env.VITE_BACKEND_HOST
		}/last-cheer`,
		{
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
		}
	);

	const lastFollower: string = await lastFollowerResponse.json();
	const lastSubscriber: string = await lastSubscriberResponse.json();
	const lastCheer: string = await lastCheerResponse.json();

	setHeroState({
		[HeroTypes.FOLLOW]: lastFollower,
		[HeroTypes.SUBSCRIPTION]: lastSubscriber,
		[HeroTypes.CHEER]: lastCheer,
	});
};

const getOnFollowHandler =
	(setHeroState: Dispatch<SetStateAction<HeroInfoState | undefined>>) =>
	({ userName }: FollowResponse) =>
		setHeroState(heroState => ({ ...heroState, [HeroTypes.FOLLOW]: userName }));

const getOnSubHandler =
	(setHeroState: Dispatch<SetStateAction<HeroInfoState | undefined>>) =>
	({ userName }: SubscriptionResponse) =>
		setHeroState(heroState => ({
			...heroState,
			[HeroTypes.SUBSCRIPTION]: userName,
		}));

const getOnCheerHandler =
	(setHeroState: Dispatch<SetStateAction<HeroInfoState | undefined>>) =>
	({ userName }: CheerResponse) =>
		setHeroState(heroState => ({
			...heroState,
			[HeroTypes.CHEER]: userName,
		}));

export default HeroPanel;
