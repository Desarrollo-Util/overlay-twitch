import { FC, TransitionEvent, useEffect, useState } from 'react';
import { RewardTypes } from '../../constants/alert-types.enum';
import { RewardEvent } from '../../types/alert-event.type';

type RewardAlertProps = {
	rewardEvent: RewardEvent;
	nextAlert: () => void;
};

const RewardAlertMedia: Partial<Record<RewardTypes, string>> = {
	[RewardTypes.SHIT]: '/video/points/shit.mp4',
	[RewardTypes.BEER]: '/video/points/cerveza.mp4',
};

const RewardAlert: FC<RewardAlertProps> = ({ rewardEvent, nextAlert }) => {
	const [rendered, setRendered] = useState<boolean>(false);
	const onTransitionEnd = getTransitionEnd(nextAlert);

	useEffect(() => {
		setTimeout(() => setRendered(true), 100);
	}, [rewardEvent]);

	return (
		<div className='container-lg flex-c-c'>
			<div className='box__wrapper'>
				<video
					className={`box__video ${rendered ? 'box__video--rendered' : ''}`}
					src={`${RewardAlertMedia[rewardEvent.reward]}?id=${rewardEvent.id}`}
					controls={false}
					onPlay={event => (event.currentTarget.volume = 0.3)}
					onTransitionEnd={onTransitionEnd}
					onEnded={() => setRendered(false)}
				/>
				<div
					className={`box__borderUR ${
						rendered ? 'box__borderUR--rendered' : ''
					}`}></div>
				<div
					className={`box__innerDL ${
						rendered ? 'box__innerDL--rendered' : ''
					}`}></div>
			</div>
		</div>
	);
};

const getTransitionEnd =
	(nextAlert: () => void) =>
	async (event: TransitionEvent<HTMLVideoElement>) => {
		const videoElement = event.currentTarget;
		if (videoElement.classList.contains('box__video--rendered'))
			setTimeout(() => videoElement.play(), 150);
		else nextAlert();
	};

export default RewardAlert;
