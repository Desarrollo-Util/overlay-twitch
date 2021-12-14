import {
	Dispatch,
	FC,
	SetStateAction,
	useEffect,
	useRef,
	useState,
} from 'react';
import createSocket from '../lib/create-socket';

const GOAL_SUBS = Number(import.meta.env.VITE_SUBSCRIPTIONS_GOAL);
const BAR_CTN_WIDTH = 320;

const SubscriptionsBar: FC = () => {
	const socketClient = createSocket();
	const [currentSubs, setCurrentSubs] = useState<number>(0);
	const [barWidth, setBarWidth] = useState(0);

	const barRef = useRef<HTMLDivElement>(null);
	const textLabelRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (currentSubs) {
			setBarWidth(Math.round((currentSubs * BAR_CTN_WIDTH) / GOAL_SUBS));

			if (barRef.current && textLabelRef.current) {
				const bar = barRef.current;
				const textLabel = textLabelRef.current;

				const interval = setInterval(() => {
					setPercentageLabel(
						interval,
						bar.clientWidth,
						BAR_CTN_WIDTH,
						textLabel
					);
				}, 20);

				return () => clearInterval(interval);
			}
		}
	}, [currentSubs, barWidth]);

	const subHandler = getOnSubHandler(setCurrentSubs);
	const endSubHandler = getOnEndSubHandler(setCurrentSubs);

	useEffect(() => {
		if (!currentSubs) getCurrentSubs(setCurrentSubs);

		socketClient.on('subscription', subHandler);
		socketClient.on('end-subscription', endSubHandler);
		return () => {
			socketClient.off('subscription', subHandler);
			socketClient.off('end-subscription', endSubHandler);
		};
	}, []);

	return (
		<div
			className='flex-sb-c flex-wrap fixed top-0 left-2/4 -ml-10'
			style={{ width: `${BAR_CTN_WIDTH}px` }}>
			<span className='font-semibold text-16 text-white'>0</span>
			<span className='font-semibold text-18 text-white'>
				Objetivo suscripciones
			</span>
			<span className='font-semibold text-16 text-white'>{GOAL_SUBS}</span>
			<div className='progBar'>
				<div
					ref={barRef}
					style={{ width: `${barWidth}px` }}
					className='progBar__filling'>
					<div className='progBar__label'>
						<div className='progBar__label__arrow'></div>
						<span ref={textLabelRef} className='progBar__label__text'></span>
					</div>
				</div>
			</div>
		</div>
	);
};

const setPercentageLabel = (
	interval: NodeJS.Timer,
	currentBarWidth: number,
	barContainerWidth: number,
	textLabel: HTMLDivElement
) => {
	const labelSubs = Math.round(
		(currentBarWidth * GOAL_SUBS) / barContainerWidth
	);
	textLabel.textContent = `${labelSubs}`;
	if (GOAL_SUBS === labelSubs) clearInterval(interval);
};

const getCurrentSubs = async (
	setCurrentSubs: Dispatch<SetStateAction<number>>
) => {
	try {
		const response = await fetch(
			`http://${import.meta.env.VITE_BACKEND_HOST}:${
				import.meta.env.VITE_BACKEND_PORT
			}/subscriptions`,
			{
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				},
			}
		);
		const body = await response.json();

		setCurrentSubs(body);
	} catch (error) {
		console.log(error);
	}
};

const getOnSubHandler =
	(setCurrentSubs: Dispatch<SetStateAction<number>>) => () =>
		setCurrentSubs(currentSubs => currentSubs + 1);

const getOnEndSubHandler =
	(setCurrentSubs: Dispatch<SetStateAction<number>>) => () =>
		setCurrentSubs(currentSubs => currentSubs - 1);

export default SubscriptionsBar;
