import { useState } from 'react';
import { QueueBoxEvent, QueueBoxState } from '../../types/alert-box-state.type';

const queueReducer = () => {
	const [queueBoxState, setQueueBoxState] = useState<
		QueueBoxState<QueueBoxEvent>
	>({
		currentEvent: undefined,
		eventList: [],
	});

	const addNewEvent = (newEvent: QueueBoxEvent) => {
		setQueueBoxState(prevState => {
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

	const nextEvent = () => {
		setQueueBoxState(prevState => {
			const prevEventList = [...prevState.eventList];

			return {
				currentEvent: prevEventList.shift(),
				eventList: prevEventList,
			};
		});
	};

	return { queueBoxState, addNewEvent, nextEvent };
};

export default queueReducer;
