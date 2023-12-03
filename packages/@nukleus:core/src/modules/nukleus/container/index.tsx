import React, { FC, useEffect, useRef } from 'react';
import { Nukleus } from '../Nukleus';

interface NukleusContainerProps {
	script?: Nukleus;
}

export const NukleusContainer: FC<NukleusContainerProps> = ({
	script: nukleus
}) => {
	// const keyboardController = new KeyboardController();

	const canvasContainerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!nukleus) {
			console.error(
				'No script provided. Please provide a script in NukleusContainer to initialize.'
			);
			return;
		}

		if (!canvasContainerRef.current) {
			return;
		}

		const cleanup = nukleus.initialize(canvasContainerRef.current!);
		console.log('Container initialized');
		nukleus.start();
		console.log('Script started');

		return () => {
			cleanup();
			console.log('Container cleaned up');
		};
	}, []);

	const styles: React.CSSProperties = {
		width: '100vw',
		height: '100vh',
		backgroundColor: 'red'
	};

	return (
		<div
			id="nukleus-container"
			style={styles}
			ref={canvasContainerRef}
			// tabIndex={0}
			// {...keyboardController.register}
		/>
	);
};
