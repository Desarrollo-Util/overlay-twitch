import { FC } from 'react';
//@ts-ignore
import { MemeEvent } from '../types/alert-event.type';

type MemeBoxProps = {
	actualEvent: MemeEvent;
	onEnd: () => void;
};

const MemeBox: FC<MemeBoxProps> = ({ actualEvent, onEnd }) => {
	return (
		<div className='memebox'>
			<video
				className='w-full'
				src={`/video/memes/${actualEvent.reward}.mp4?id=${actualEvent.id}`}
				controls={false}
				autoPlay={true}
				onPlay={event => (event.currentTarget.volume = 0.1)}
				onEnded={onEnd}
			/>
		</div>
	);
};

export default MemeBox;
