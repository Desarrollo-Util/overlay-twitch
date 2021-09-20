import React, { FC } from 'react';
import { MemeBoxEvent } from '../types/alert-box-state.type';

type MemeBoxProps = {
	actualEvent: MemeBoxEvent;
	onEnd: () => void;
};

const MemeBox: FC<MemeBoxProps> = ({ actualEvent, onEnd }) => {
	return (
		<div className='memebox'>
			<video
				className='w-full'
				src={`/video/memes/Random.mp4?id=${actualEvent.id}`}
				controls={false}
				autoPlay={true}
				onPlay={event => (event.currentTarget.volume = 0.05)}
				onEnded={onEnd}
			/>
		</div>
	);
};

export default MemeBox;
