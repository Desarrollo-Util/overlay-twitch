import { FC } from 'react';
import HeroItem from '../components/hero-item';
import BitsIcon from '../icons/bits-icon';
import FollowIcon from '../icons/follow-icon';
import SubscriptionIcon from '../icons/subscription-icon';

const HeroPanel: FC = () => (
	<div className='container-lg flex-c-c'>
		<HeroItem icon={SubscriptionIcon} label='LAST SUB' value='Josyto' />
		<HeroItem icon={FollowIcon} label='LAST FOLLOW' value='Josyto' />
		<HeroItem icon={BitsIcon} label='LAST BITS' value='Josyto' />
	</div>
);

export default HeroPanel;
