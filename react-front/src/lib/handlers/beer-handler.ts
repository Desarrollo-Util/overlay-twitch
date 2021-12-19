import { useCallback } from 'react';
import uuid from 'uuid-random';
import { AlertEvent, BeerEvent } from '../../types/alert-box-state.type';
import { AlertTypes } from '../../types/alert-types.enum';

const getBeerEventHandler = (addEvent: (newEvent: AlertEvent) => void) =>
	useCallback(({ userName, message }) => {
		const newEvent: BeerEvent = {
			id: uuid(),
			username: userName,
			type: AlertTypes.BEER,
			message,
		};

		addEvent(newEvent);
	}, []);

export default getBeerEventHandler;
