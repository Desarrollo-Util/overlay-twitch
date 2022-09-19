import { FC, TransitionEvent, useEffect, useMemo, useState } from 'react';
import { RewardTypes } from '../../constants/alert-types.enum';
import { RewardEvent } from '../../types/alert-event.type';

type RewardAlertProps = {
	rewardEvent: RewardEvent;
	nextAlert: () => void;
};

const RewardAlertMedia: Partial<Record<RewardTypes, string>> = {
	[RewardTypes.SHIT]: '/video/points/chicote',
	[RewardTypes.BEER]: '/video/points/cerveza.mp4',
};

const RewardAlertChicote = [
	'/avion.mp4',
	'/bochornoso.mp4',
	'/boqueron.mp4',
	'/bronca.mp4',
	'/chaval.mp4',
	'/credibilidad.mp4',
	'/cuchillo.mp4',
	'/fregar.mp4',
	'/gollum.mp4',
	'/huevos.mp4',
	'/ira.mp4',
	'/ironman.mp4',
	'/mierda.mp4',
	'/semana.mp4',
	'/shit.mp4',
	'/vida.mp4',
	'/viejo.mp4',
	'/virgen.mp4',
];

const RewardAlert: FC<RewardAlertProps> = ({ rewardEvent, nextAlert }) => {
	const [rendered, setRendered] = useState<boolean>(false);
	const onTransitionEnd = getTransitionEnd(nextAlert);

	useEffect(() => {
		setTimeout(() => setRendered(true), 100);
	}, [rewardEvent]);

	const rewardAlertMediaSrc = useMemo(
		() =>
			rewardEvent.reward === RewardTypes.SHIT
				? `${RewardAlertMedia[rewardEvent.reward]}${
						RewardAlertChicote[
							Math.round(Math.random() * (RewardAlertChicote.length - 1))
						]
				  }`
				: RewardAlertMedia[rewardEvent.reward],
		[rewardEvent]
	);
	return (
		<div className='container-lg flex-c-c'>
			<div className='box__wrapper'>
				<video
					className={`box__video ${rendered ? 'box__video--rendered' : ''}`}
					src={`${rewardAlertMediaSrc}?id=${rewardEvent.id}`}
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
