import { useCallback } from 'react';
import uuid from 'uuid-random';
import { MemeBoxEvent, QueueBoxEvent } from '../../types/alert-box-state.type';
import { AlertTypes } from '../../types/alert-types.enum';

const getMemeEventHandler = (addEvent: (newEvent: QueueBoxEvent) => void) =>
	useCallback(() => {
		const newEvent: MemeBoxEvent = {
			id: uuid(),
			type: AlertTypes.MEME,
		};

		addEvent(newEvent);
	}, []);

export default getMemeEventHandler;
