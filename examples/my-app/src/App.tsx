import { NukleusContainer } from '@nukleus/core';
import { game } from './nukleus';

function App() {
	return (
		<main className="App">
			<NukleusContainer windowSized script={game} />
		</main>
	);
}

export default App;
