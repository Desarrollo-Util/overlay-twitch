import { FC } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Alerts from './pages/alerts';
import HeroPanel from './pages/hero-panel';
import SubscriptionsBar from './pages/subscriptions-bar';

const App: FC = () => {
	return (
		<BrowserRouter>
			<Routes>
				<Route path='/subscription-bar' element={<SubscriptionsBar />} />
				<Route path='/alerts' element={<Alerts />} />
				<Route path='/hero' element={<HeroPanel />} />
			</Routes>
		</BrowserRouter>
	);
};

export default App;
