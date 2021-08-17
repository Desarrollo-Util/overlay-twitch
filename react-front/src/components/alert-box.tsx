import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { Socket } from 'socket.io-client';
import { DefaultEventsMap } from 'socket.io-client/build/typed-events';
import uuid from 'uuid-random';
import { AlertBoxEvent, AlertBoxState } from '../types/alert-box-state.type';

type AlertBoxProps = {
	socketClient: Socket<DefaultEventsMap, DefaultEventsMap>;
};

const VIDEOS = ['Soy programador.mp4', 'Soy yo Concha.mp4'];

const AlertBox: FC<AlertBoxProps> = ({ socketClient }) => {
	const [alertBoxState, setAlertBoxState] = useState<AlertBoxState>({
		actualEvent: undefined,
		eventList: [],
	});

	const alert = useMemo(() => {
		if (alertBoxState.actualEvent)
			return (
				<>
					<video
						className='w-full'
						src={`/video/follow/${
							VIDEOS[Math.floor(Math.random() * VIDEOS.length)]
						}?id=${alertBoxState.actualEvent.id}`}
						controls={false}
						autoPlay={true}
						onPlay={event => (event.currentTarget.volume = 0.05)}
						onEnded={() => {
							setAlertBoxState(prevState => {
								const prevEventList = [...prevState.eventList];

								return {
									actualEvent: prevEventList.shift(),
									eventList: prevEventList,
								};
							});
						}}
					/>
					<span className='message-alertbox'>
						{getUsernameAnimated(alertBoxState.actualEvent.username)}
						&nbsp;se ha unido al equipo de desarrollo
					</span>
				</>
			);
		else return <></>;
	}, [alertBoxState.actualEvent]);

	const followEventHandler = getFollowEventHandler(setAlertBoxState);

	useEffect(() => {
		socketClient.on('follow', followEventHandler);

		return () => {
			socketClient.off('follow', followEventHandler);
		};
	}, []);

	return <div className='alertbox'>{alert}</div>;
};

const getFollowEventHandler = (
	setAlertBoxState: React.Dispatch<React.SetStateAction<AlertBoxState>>
) =>
	useCallback((username: string) => {
		const newEvent: AlertBoxEvent = {
			id: uuid(),
			username,
			type: 'FOLLOW',
		};

		setAlertBoxState(prevState => {
			if (!prevState.actualEvent)
				return {
					...prevState,
					actualEvent: newEvent,
				};
			else {
				return {
					...prevState,
					eventList: [...prevState.eventList, newEvent],
				};
			}
		});
	}, []);

const getUsernameAnimated = (username: string) => {
	const usernameAnimated = [];

	for (let i = 0; i < username.length; i++) {
		usernameAnimated.push(
			<span
				key={i}
				className='username-message-alertbox'
				style={{
					animationDelay: `${i * 0.1}s`,
				}}>
				{username[i]}
			</span>
		);
	}

	return usernameAnimated;
};

export default AlertBox;
