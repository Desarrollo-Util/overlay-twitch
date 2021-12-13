import type { ComponentProps, FC } from 'react';

/**
 * Bits icon
 * @param props Component props
 * @returns Component
 */
const BitsIcon: FC<ComponentProps<'svg'>> = props => (
	<svg
		{...props}
		fill='none'
		stroke='currentColor'
		strokeLinecap='round'
		strokeLinejoin='round'
		strokeWidth='2'
		viewBox='0 0 24 24'>
		<path stroke='none' d='M0 0h24v24H0z'></path>
		<circle cx='12' cy='12' r='9'></circle>
		<path d='M14.8 9A2 2 0 0013 8h-2a2 2 0 000 4h2a2 2 0 010 4h-2a2 2 0 01-1.8-1M12 6v2m0 8v2'></path>
	</svg>
);

export default BitsIcon;
