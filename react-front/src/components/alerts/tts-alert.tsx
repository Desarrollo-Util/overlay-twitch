import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react';
import SocketTopics from '../../constants/socket-topics.enum';
import {
	CheerEvent,
	SubscriptionMessageEvent,
} from '../../types/alert-event.type';

type TtsAlertProps = {
	ttsEvent: SubscriptionMessageEvent | CheerEvent;
	nextAlert: () => void;
};

const TtsAlertTitles: Partial<Record<SocketTopics, string>> = {
	[SocketTopics.SUBSCRIPTIONMESSAGE]: 'SUBSCRIPTOR',
	[SocketTopics.CHEER]: 'CHEER',
};

/**
 * Component to show subscription and cheer events with tts message
 */
const TtsAlert: FC<TtsAlertProps> = ({ ttsEvent, nextAlert }) => {
	const [rendered, setRendered] = useState<boolean>(false);
	const [tts, setTts] = useState<boolean>(false);

	const onTransitionEnd = getOnTransitionEnd(nextAlert, setTts, setRendered);

	useEffect(() => {
		//Timer for input transition to work fine in OBS browser
		setTimeout(() => {
			setRendered(true);
		}, 100);
	}, [ttsEvent]);

	return (
		<div className='bar_wrapper'>
			<div className='bar_container'>
				<div className={`bar_upper ${rendered ? 'bar_upper-opened' : ''}`}>
					<span
						className={`bar_upperText ${
							rendered ? 'bar_upperText-opened' : ''
						}`}>
						{TtsAlertTitles[ttsEvent.type]}
					</span>
				</div>
				<div
					onTransitionEnd={onTransitionEnd}
					className={`bar_lower ${rendered ? 'bar_lower-opened' : ''}`}>
					<span
						className={`bar_lowerText ${
							rendered ? 'bar_lowerText-opened' : ''
						}`}>
						{ttsEvent.userName}
					</span>
				</div>
			</div>
			<span className={`bar_message ${rendered ? 'bar_message-opened' : ''}`}>
				{ttsEvent.message}
			</span>
			{tts && (
				<video
					onEnded={() => setTimeout(() => setRendered(false), 1000)}
					className='max-w-0 max-h-0'
					src={`https://api.streamelements.com/kappa/v2/speech?voice=es-ES-Standard-A&text=${encodeURI(
						ttsEvent.message
					)}`}
					onPlay={event => (event.currentTarget.volume = 0.1)}
					autoPlay
				/>
			)}
		</div>
	);
};

const getOnTransitionEnd =
	(
		nextAlert: () => void,
		setTts: Dispatch<SetStateAction<boolean>>,
		setRendered: Dispatch<SetStateAction<boolean>>
	) =>
	async (ev: any) => {
		if (
			ev.pseudoElement === '::after' &&
			ev.currentTarget?.classList.contains('bar_lower-opened')
		) {
			setTts(true);
		} else if (
			ev.target === ev.currentTarget &&
			!ev.pseudoElement &&
			!ev.currentTarget?.classList.contains('bar_lower-opened')
		) {
			setTimeout(() => nextAlert(), 1000);
		}
	};

export default TtsAlert;
