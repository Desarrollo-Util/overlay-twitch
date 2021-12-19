import { FC, useEffect, useState } from 'react';
import { RewardEvent } from '../../types/alert-event.type';

type RewardAlertProps = {
	rewardEvent: RewardEvent;
	nextAlert: () => void;
};

const RewardAlert: FC<RewardAlertProps> = ({ rewardEvent, nextAlert }) => {
	const [rendered, setRendered] = useState<boolean>(false);

	useEffect(() => {
		setTimeout(() => setRendered(true), 100);
	}, [rewardEvent]);

	return (
		<div className='container-lg flex-c-c'>
			<div className={`box_border ${rendered ? 'box_border-rendered' : ''}`}>
				<div
					className={`box_inner ${rendered ? 'box_inner-rendered' : ''}`}></div>
				<video
					className='max-h-full max-w-full'
					src={`/video/points/shit.mp4?id=${rewardEvent.id}`}
					controls={false}
					autoPlay={true}
					onPlay={event => (event.currentTarget.volume = 0.05)}
				/>
			</div>
		</div>
	);
};

export default RewardAlert;
