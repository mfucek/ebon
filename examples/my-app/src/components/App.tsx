import { NukleusContainer } from '@nukleus/core';
import { useEffect } from 'react';
import { game } from '../nukleus';

function App() {
	useEffect(() => {
		console.log('Hello');
	}, []);

	return (
		<main className="App">
			<NukleusContainer windowSized script={game} />
		</main>
	);
}

export default App;
