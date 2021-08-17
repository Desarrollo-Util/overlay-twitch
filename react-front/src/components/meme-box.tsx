import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { Socket } from 'socket.io-client';
import { DefaultEventsMap } from 'socket.io-client/build/typed-events';
import uuid from 'uuid-random';
import { MemeBoxState } from '../types/alert-box-state.type';

type MemeBoxProps = {
	socketClient: Socket<DefaultEventsMap, DefaultEventsMap>;
};

const MemeBox: FC<MemeBoxProps> = ({ socketClient }) => {
	const [memeBoxState, setMemeBoxState] = useState<MemeBoxState>({
		actualEvent: undefined,
		eventList: [],
	});

	const alert = useMemo(() => {
		if (memeBoxState.actualEvent)
			return (
				<video
					className='w-full'
					src={`/video/memes/Random.mp4?id=${memeBoxState.actualEvent}`}
					controls={false}
					autoPlay={true}
					onPlay={event => (event.currentTarget.volume = 0.05)}
					onEnded={() => {
						setMemeBoxState(prevState => {
							const prevEventList = [...prevState.eventList];

							return {
								actualEvent: prevEventList.shift(),
								eventList: prevEventList,
							};
						});
					}}
				/>
			);
		else return <></>;
	}, [memeBoxState.actualEvent]);

	const memeEventHandler = getMemeEventHandler(setMemeBoxState);

	useEffect(() => {
		socketClient.on('meme', memeEventHandler);

		return () => {
			socketClient.off('meme', memeEventHandler);
		};
	}, []);

	return <div className='memebox'>{alert}</div>;
};

const getMemeEventHandler = (
	setMemeBoxState: React.Dispatch<React.SetStateAction<MemeBoxState>>
) =>
	useCallback(() => {
		const newEvent: string = uuid();

		setMemeBoxState(prevState => {
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

export default MemeBox;
