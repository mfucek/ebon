import React, { FC, useEffect } from 'react';

interface NukleusContainerProps {
	script?: any;
	windowSized?: boolean;
}

export const NukleusContainer: FC<NukleusContainerProps> = ({
	script,
	windowSized
}) => {
	useEffect(() => {
		console.log('Container initialized');
		if (!script) {
			console.error(
				'No script provided. Please provide a script in NukleusContainer to initialize.'
			);
			return;
		}
		// script();
	}, []);

	const styles: React.CSSProperties = windowSized
		? {
				width: '100vw',
				height: '100vh',
				background: 'red'
		  }
		: {
				width: '100%',
				height: '100%',
				background: 'red'
		  };

	return (
		<div style={styles}>
			<canvas id="nukleus-canvas" />
		</div>
	);
};
