import { FC } from 'react';
//@ts-ignore
import { BeerEvent } from '../types/alert-event.type';

type BeerBoxProps = {
	actualEvent: BeerEvent;
	onEnd: () => void;
};

const BeerBox: FC<BeerBoxProps> = ({ actualEvent, onEnd }) => {
	return (
		<div className='alertbox'>
			<video
				className='w-full'
				src={`/video/points/cerveza.mp4?id=${actualEvent.id}`}
				controls={false}
				autoPlay={true}
				onPlay={event => (event.currentTarget.volume = 0.05)}
				onEnded={onEnd}
			/>
			<span className='message-alertbox'>
				{getUsernameAnimated(actualEvent.userName)}
				&nbsp;ha canjeado un zumito!!
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
				}}>
				{username[i]}
			</span>
		);
	}

	return usernameAnimated;
};

export default BeerBox;
