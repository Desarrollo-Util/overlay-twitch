import React, { FC } from 'react';
import { AlertBoxEvent } from '../types/alert-box-state.type';

type AlertBoxProps = {
	actualEvent: AlertBoxEvent;
	onEnd: () => void;
};

const VIDEOS = ['Soy programador.mp4', 'Soy yo Concha.mp4'];

const AlertBox: FC<AlertBoxProps> = ({ actualEvent, onEnd }) => {
	return (
		<div className='alertbox'>
			<video
				className='w-full'
				src={`/video/follow/${
					VIDEOS[Math.floor(Math.random() * VIDEOS.length)]
				}?id=${actualEvent.id}`}
				controls={false}
				autoPlay={true}
				onPlay={event => (event.currentTarget.volume = 0.05)}
				onEnded={onEnd}
			/>
			<span className='message-alertbox'>
				{getUsernameAnimated(actualEvent.username)}
				&nbsp;se ha unido al equipo de desarrollo
			</span>
		</div>
	);
};

const getUsernameAnimated = (username: string) => {
	const usernameAnimated = [];

	for (let i = 0; i < username.length; i++) {
		usernameAnimated.push(
			<span
				key={i}
				className='username-message-alertbox'
				style={{
					animationDelay: `${i * 0.1}s`,
				}}
			>
				{username[i]}
			</span>
		);
	}

	return usernameAnimated;
};

export default AlertBox;
