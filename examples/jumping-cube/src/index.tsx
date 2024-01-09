import { NukleusContainer } from 'ebon';
import ReactDOM from 'react-dom/client';
import './styles/global.css';

import { game } from './game';

const root = ReactDOM.createRoot(
	document.getElementById('root') as HTMLElement
);

root.render(
	<main className="App">
		<NukleusContainer
			script={game}
			style={{
				background: 'linear-gradient(-45deg, #131313, #3a3a3a)'
			}}
		></NukleusContainer>
	</main>
);
