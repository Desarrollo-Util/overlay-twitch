import { useCallback } from 'react';
import uuid from 'uuid-random';
import { AlertBoxEvent, QueueBoxEvent } from '../../types/alert-box-state.type';
import { AlertTypes } from '../../types/alert-types.enum';

const getFollowEventHandler = (addEvent: (newEvent: QueueBoxEvent) => void) =>
	useCallback((username: string) => {
		const newEvent: AlertBoxEvent = {
			id: uuid(),
			username,
			type: AlertTypes.FOLLOW,
		};

		addEvent(newEvent);
	}, []);

export default getFollowEventHandler;
