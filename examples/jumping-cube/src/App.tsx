import { NukleusContainer } from '@nukleus/core';
import { game } from './nukleus';

function App() {
	return (
		<main className="App">
			<NukleusContainer
				script={game}
				style={{ background: 'linear-gradient(-45deg, #131313, #3a3a3a)' }}
			>
				{'Hello!'}
			</NukleusContainer>
		</main>
	);
}

export default App;
