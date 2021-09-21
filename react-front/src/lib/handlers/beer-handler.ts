import { useCallback } from 'react';
import uuid from 'uuid-random';
import { BeerBoxEvent, QueueBoxEvent } from '../../types/alert-box-state.type';
import { AlertTypes } from '../../types/alert-types.enum';

const getBeerEventHandler = (addEvent: (newEvent: QueueBoxEvent) => void) =>
	useCallback(({ userName, message }) => {
		const newEvent: BeerBoxEvent = {
			id: uuid(),
			username: userName,
			type: AlertTypes.BEER,
			message,
		};

		addEvent(newEvent);
	}, []);

export default getBeerEventHandler;
