import type { ComponentProps, FC } from 'react';

/**
 * Subscription icon
 * @param props Component props
 * @returns Component
 */
const SubscriptionIcon: FC<ComponentProps<'svg'>> = props => (
	<svg
		{...props}
		fill='none'
		stroke='currentColor'
		strokeLinecap='round'
		strokeLinejoin='round'
		strokeWidth='2'
		viewBox='0 0 24 24'>
		<path stroke='none' d='M0 0h24v24H0z'></path>
		<path d='M12 6l4 6 5-4-2 10H5L3 8l5 4z'></path>
	</svg>
);

export default SubscriptionIcon;
