import React, { FC, useEffect, useRef } from 'react';
import { Nukleus } from '../Nukleus';

interface NukleusContainerProps {
	script?: Nukleus;
}

export const NukleusContainer: FC<NukleusContainerProps> = ({
	script: nukleus
}) => {
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

		nukleus.initialize(canvasContainerRef.current!);
		console.log('Container initialized');
		nukleus.start();
		console.log('Script started');
	}, []);

	const styles: React.CSSProperties = {
		width: '100vw',
		height: '100vh'
	};

	return <div style={styles} ref={canvasContainerRef} />;
};
