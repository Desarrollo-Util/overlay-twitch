import type { ComponentProps, FC } from 'react';

/**
 * Follow icon
 * @param props Component props
 * @returns Component
 */
const FollowIcon: FC<ComponentProps<'svg'>> = props => (
	<svg
		{...props}
		fill='none'
		stroke='currentColor'
		strokeLinecap='round'
		strokeLinejoin='round'
		strokeWidth='2'
		viewBox='0 0 24 24'>
		<path stroke='none' d='M0 0h24v24H0z'></path>
		<path d='M19.5 13.572L12 21l-7.5-7.428m0 0A5 5 0 1112 7.006a5 5 0 117.5 6.572'></path>
	</svg>
);

export default FollowIcon;
