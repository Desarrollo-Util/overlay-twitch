import { FC, useEffect, useState } from 'react';
import { FollowEvent } from '../../types/alert-event.type';

type FollowAlertProps = {
	followEvent: FollowEvent;
	nextAlert: () => void;
};

/** S
Duration (ms) of the alert except for the entry and exit transitions */
const ALERT_DURATION = 8000;

/**
 * Component to show follow alerts
 */
const FollowAlert: FC<FollowAlertProps> = ({ followEvent, nextAlert }) => {
	const [rendered, setRendered] = useState<boolean>(false);

	const onTransitionEnd = getOnTransitionEnd(nextAlert);

	useEffect(() => {
		//Timer for input transition to work fine in OBS browser
		setTimeout(() => {
			setRendered(true);
			setTimeout(() => setRendered(false), ALERT_DURATION);
		}, 100);
	}, [followEvent]);

	return (
		<div className='bar_wrapper'>
			<div className='bar_container'>
				<div className={`bar_upper ${rendered ? 'bar_upper-opened' : ''}`}>
					<span
						className={`bar_upperText ${
							rendered ? 'bar_upperText-opened' : ''
						}`}>
						FOLLOWER
					</span>
				</div>
				<div
					onTransitionEnd={onTransitionEnd}
					className={`bar_lower ${rendered ? 'bar_lower-opened' : ''}`}>
					<span
						className={`bar_lowerText ${
							rendered ? 'bar_lowerText-opened' : ''
						}`}>
						{followEvent.userName}
					</span>
				</div>
			</div>
		</div>
	);
};

const getOnTransitionEnd = (nextAlert: () => void) => (ev: any) => {
	if (
		ev.target === ev.currentTarget &&
		!ev.pseudoElement &&
		!ev.currentTarget?.classList.contains('bar_lower-opened')
	) {
		setTimeout(() => nextAlert(), 1000);
	}
};

export default FollowAlert;
