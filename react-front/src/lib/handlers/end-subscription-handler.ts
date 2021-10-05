import { Dispatch, SetStateAction, useCallback } from 'react';

const getEndSubscriptionEventHandler = (
	setCurrentSubs: Dispatch<SetStateAction<number>>
) =>
	useCallback(() => {
		setCurrentSubs(currentSubs => currentSubs - 1);
	}, []);

export default getEndSubscriptionEventHandler;
