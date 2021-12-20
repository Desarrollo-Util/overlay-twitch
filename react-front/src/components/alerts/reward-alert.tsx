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
			<div className='box_wrapper'>
				<video
					className={`box_video ${rendered ? 'box_video-rendered' : ''}`}
					src={`${RewardAlertMedia[rewardEvent.reward]}?id=${rewardEvent.id}`}
					controls={false}
					onPlay={event => (event.currentTarget.volume = 0.05)}
					onTransitionEnd={onTransitionEnd}
					onEnded={() => setRendered(false)}
				/>
				<div
					className={`box_borderUR ${
						rendered ? 'box_borderUR-rendered' : ''
					}`}></div>
				<div
					className={`box_innerDL ${
						rendered ? 'box_innerDL-rendered' : ''
					}`}></div>
			</div>
		</div>
	);
};

const getTransitionEnd =
	(nextAlert: () => void) =>
	async (event: TransitionEvent<HTMLVideoElement>) => {
		const videoElement = event.currentTarget;
		if (videoElement.classList.contains('box_video-rendered'))
			setTimeout(() => videoElement.play(), 150);
		else nextAlert();
	};

export default RewardAlert;
