import { ComponentProps, FC } from 'react';
import { HeroInfoState, HeroTypes } from '../../types/hero-info-state.type';

type HeroItemProps = {
	icon: FC<ComponentProps<'svg'>>;
	label: string;
	type: HeroTypes;
	heroState: HeroInfoState | undefined;
};

const HeroItem: FC<HeroItemProps> = ({
	icon: Icon,
	label,
	type,
	heroState,
}) => (
	<div className='flex-s-st w-1/3 h-3 px-0_5'>
		<div className='bg-primary w-3 flex-c-c'>
			<Icon className='h-2 text-bg-700' />
		</div>
		<div className='flexcol-s-s flex-grow px-1 py-0_375 bg-bg'>
			<span className='text-13 leading-3 text-primary font-bold'>{label}</span>
			<span className='text-white font-bold'>
				{heroState ? heroState[type] : ''}
			</span>
		</div>
	</div>
);

export default HeroItem;
