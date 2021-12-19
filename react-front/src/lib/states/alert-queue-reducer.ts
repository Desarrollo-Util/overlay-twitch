import { useState } from 'react';
import { AlertEvent, AlertQueueState } from '../../types/alert-box-state.type';

const useAlertQueue = () => {
	const [alertQueue, setAlertQueue] = useState<AlertQueueState<AlertEvent>>({
		currentEvent: undefined,
		eventList: [],
	});

	const addNewAlert = (newEvent: AlertEvent) => {
		setAlertQueue(prevState => {
			if (!prevState.currentEvent)
				return {
					currentEvent: newEvent,
					eventList: [],
				};
			else {
				return {
					...prevState,
					eventList: [...prevState.eventList, newEvent],
				};
			}
		});
	};

	const nextAlert = () => {
		setAlertQueue(prevState => {
			const prevEventList = [...prevState.eventList];

			return {
				currentEvent: prevEventList.shift(),
				eventList: prevEventList,
			};
		});
	};

	return { alertQueue, addNewAlert, nextAlert };
};

export default useAlertQueue;
