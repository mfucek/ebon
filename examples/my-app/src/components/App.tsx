import { add } from '@nukleus/core';
import { useEffect } from 'react';

function App() {
	useEffect(() => {
		console.log('Hello');
	}, []);

	return (
		<div className="App">
			<header className="App-header">
				<p>Hello</p>
				<a
					className="App-link"
					href="https://reactjs.org"
					target="_blank"
					rel="noopener noreferrer"
				>
					Learn React {add(1, 2)}
				</a>
			</header>
		</div>
	);
}

export default App;
