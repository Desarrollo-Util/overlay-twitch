import { useCallback } from 'react';
import uuid from 'uuid-random';
import { AlertEvent, FollowEvent } from '../../types/alert-box-state.type';
import { AlertTypes } from '../../types/alert-types.enum';

const getFollowEventHandler = (addEvent: (newEvent: AlertEvent) => void) =>
	useCallback((username: string) => {
		const newEvent: FollowEvent = {
			id: uuid(),
			username,
			type: AlertTypes.FOLLOW,
		};

		addEvent(newEvent);
	}, []);

export default getFollowEventHandler;
