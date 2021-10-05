import { Dispatch, SetStateAction, useCallback } from 'react';

const getSubscriptionEventHandler = (
	setCurrentSubs: Dispatch<SetStateAction<number>>
) =>
	useCallback(() => {
		setCurrentSubs(currentSubs => currentSubs + 1);
	}, []);

export default getSubscriptionEventHandler;
