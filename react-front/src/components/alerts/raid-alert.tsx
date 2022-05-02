import { FC, TransitionEvent, useEffect, useState } from 'react';
import { RaidEvent } from '../../types/alert-event.type';

type RaidAlertProps = {
	raidEvent: RaidEvent;
	nextAlert: () => void;
};

const RaidAlert: FC<RaidAlertProps> = ({ raidEvent, nextAlert }) => {
	const [rendered, setRendered] = useState<boolean>(false);
	const onTransitionEnd = getTransitionEnd(nextAlert);

	useEffect(() => {
		setTimeout(() => setRendered(true), 100);
	}, [raidEvent]);

	return (
		<div className='container-lg flexcol-c-c'>
			<div className='box__raid_wrapper'>
				<video
					className={`box__video ${rendered ? 'box__video--rendered' : ''}`}
					src='/video/alerts/raid.mp4'
					controls={false}
					onPlay={event => (event.currentTarget.volume = 0.35)}
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
			<span
				className={`transition-all-eio-2000 text-26  pt-0_5 ${
					rendered ? 'text-white' : 'text-transparent'
				}`}>
				{raidEvent.userName} y {raidEvent.viewers} soldados se unen a la batalla
			</span>
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

export default RaidAlert;
