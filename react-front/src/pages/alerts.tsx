import { useEffect, useState } from 'react';
import uuid from 'uuid-random';
import SocketTopics from '../constants/socket-topics.enum';
import createSocket from '../lib/create-socket';
import useAlertQueue from '../lib/states/alert-queue-reducer';
import { AlertEvent, FollowEvent } from '../types/alert-box-state.type';
import { AlertTypes } from '../types/alert-types.enum';

const Alerts = () => {
	const [rendered, setRendered] = useState<boolean>(false);
	const { alertQueue, addNewAlert } = useAlertQueue();
	const socketClient = createSocket();

	const followHandler = getOnFollowHandler(addNewAlert);

	useEffect(() => {
		socketClient.on(SocketTopics.FOLLOW, followHandler);

		return () => {
			socketClient.off(SocketTopics.FOLLOW, followHandler);
		};
	}, []);

	useEffect(() => {
		if (alertQueue.currentEvent?.type === AlertTypes.FOLLOW) setRendered(true);
	}, [alertQueue.currentEvent]);

	console.log(rendered, alertQueue);

	if (
		alertQueue.currentEvent &&
		alertQueue.currentEvent.type === AlertTypes.FOLLOW
	)
		return (
			<div className='barWrapper'>
				<div className='barContainer'>
					<div className={`upperBar ${rendered ? 'upperBar-rendered' : ''}`}>
						<span
							className={`upperText ${rendered ? 'upperText-rendered' : ''}`}>
							FOLLOWER
						</span>
					</div>
					<div className={`lowerBar ${rendered ? 'lowerBar-rendered' : ''}`}>
						<span
							className={`lowerText ${rendered ? 'lowerText-rendered' : ''}`}>
							{alertQueue.currentEvent.username}
						</span>
					</div>
				</div>
				<span
					className={`subscriptionText ${
						rendered ? 'subscriptionText-rendered' : ''
					}`}></span>
			</div>
		);
	else return null;
};

export default Alerts;

const getOnFollowHandler =
	(addNewAlert: (newEvent: AlertEvent) => void) => (username: string) => {
		const newAlert: FollowEvent = {
			id: uuid(),
			username,
			type: AlertTypes.FOLLOW,
		};

		addNewAlert(newAlert);
	};

//#region Box animation
// <div className='container-lg flex-c-c mt-0_5'>
// 	<div className={`box-border-animated ${rendered ? 'rendered' : ''}`}>
// 		<div
// 			className={`box-border-inner-animated ${
// 				rendered ? 'rendered-inner' : ''
// 			}`}></div>
// 	</div>
// </div>;
//#endregion

/**
 * 		const speechSynthesis = window.speechSynthesis;
		const voices = speechSynthesis.getVoices();
		const utterThis = new SpeechSynthesisUtterance();
		utterThis.volume = 100;
		utterThis.voice = voices[7];
		utterThis.text =
			'Hola, soy nuevo en el canal, sois la puta polla en vinagre, jaja salu2';


		utterThis.onend = () => console.log('SACABO');
		speechSynthesis.speak(utterThis);
 */
