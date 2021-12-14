import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react';
import HeroItem from '../components/hero-item';
import BitsIcon from '../icons/bits-icon';
import FollowIcon from '../icons/follow-icon';
import SubscriptionIcon from '../icons/subscription-icon';
import createSocket from '../lib/create-socket';
import { HeroInfoState, HeroTypes } from '../types/hero-info-state.type';

const HeroPanel: FC = () => {
	const socketClient = createSocket();
	const [heroState, setHeroState] = useState<HeroInfoState>();

	const followHandler = getOnFollowHandler(setHeroState);
	const subHandler = getOnSubHandler(setHeroState);

	useEffect(() => {
		getHeroInfo(setHeroState);

		socketClient.on('follow', followHandler);
		socketClient.on('subscription', subHandler);

		return () => {
			socketClient.off('follow', followHandler);
			socketClient.off('subscription', subHandler);
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
				type={HeroTypes.BITS}
				heroState={heroState}
			/>
		</div>
	);
};

const getHeroInfo = async (
	setHeroState: Dispatch<SetStateAction<HeroInfoState | undefined>>
) => {
	const lastFollowerResponse = await fetch(
		`http://${import.meta.env.VITE_BACKEND_HOST}:${
			import.meta.env.VITE_BACKEND_PORT
		}/last-follower`,
		{
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
		}
	);

	const lastSubscriberResponse = await fetch(
		`http://${import.meta.env.VITE_BACKEND_HOST}:${
			import.meta.env.VITE_BACKEND_PORT
		}/last-subscriber`,
		{
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
		}
	);

	const lastFollower: string = await lastFollowerResponse.json();
	const lastSubscriber: string = await lastSubscriberResponse.json();

	setHeroState({
		[HeroTypes.FOLLOW]: lastFollower,
		[HeroTypes.SUBSCRIPTION]: lastSubscriber,
	});
};

const getOnFollowHandler =
	(setHeroState: Dispatch<SetStateAction<HeroInfoState | undefined>>) =>
	(username: string) =>
		setHeroState(heroState => ({ ...heroState, [HeroTypes.FOLLOW]: username }));

const getOnSubHandler =
	(setHeroState: Dispatch<SetStateAction<HeroInfoState | undefined>>) =>
	(username: string) =>
		setHeroState(heroState => ({
			...heroState,
			[HeroTypes.SUBSCRIPTION]: username,
		}));

export default HeroPanel;
