import { useCallback } from 'react';
import uuid from 'uuid-random';
import { AlertEvent, MemeEvent } from '../../types/alert-box-state.type';
import { AlertTypes } from '../../types/alert-types.enum';
import { RewardTypes } from '../../types/reward-types.enum';

const getMemeEventHandler = (addEvent: (newEvent: AlertEvent) => void) =>
	useCallback((rewardType: RewardTypes) => {
		const newEvent: MemeEvent = {
			id: uuid(),
			type: AlertTypes.MEME,
			reward: rewardType,
		};

		addEvent(newEvent);
	}, []);

export default getMemeEventHandler;
