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
		<div className='bar__container'>
			<div className='bar__wrapper'>
				<div className={`bar__upper ${rendered ? 'bar__upper--opened' : ''}`}>
					<span
						className={`bar__upperText ${
							rendered ? 'bar__upperText--opened' : ''
						}`}>
						FOLLOWER
					</span>
				</div>
				<div
					onTransitionEnd={onTransitionEnd}
					className={`bar__lower ${rendered ? 'bar__lower--opened' : ''}`}>
					<span
						className={`bar__lowerText ${
							rendered ? 'bar__lowerText--opened' : ''
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
		!ev.currentTarget?.classList.contains('bar__lower--opened')
	) {
		setTimeout(() => nextAlert(), 1000);
	}
};

export default FollowAlert;
