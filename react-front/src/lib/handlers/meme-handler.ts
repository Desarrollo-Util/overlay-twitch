import { useCallback } from 'react';
import uuid from 'uuid-random';
import { MemeBoxEvent, QueueBoxEvent } from '../../types/alert-box-state.type';
import { AlertTypes } from '../../types/alert-types.enum';
import { RewardTypes } from '../../types/reward-types.enum';

const getMemeEventHandler = (addEvent: (newEvent: QueueBoxEvent) => void) =>
	useCallback((rewardType: RewardTypes) => {
		const newEvent: MemeBoxEvent = {
			id: uuid(),
			type: AlertTypes.MEME,
			reward: rewardType,
		};

		addEvent(newEvent);
	}, []);

export default getMemeEventHandler;
