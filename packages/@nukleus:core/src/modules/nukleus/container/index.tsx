import React, {
	FC,
	HTMLAttributes,
	PropsWithChildren,
	useEffect,
	useRef
} from 'react';
import { InterfaceHandler } from '../../interface/InterfaceHandler';
import { Nukleus } from '../Nukleus';

interface NukleusContainerProps {
	script?: Nukleus;
}

export const NukleusContainer: FC<
	HTMLAttributes<HTMLDivElement> & NukleusContainerProps & PropsWithChildren
> = ({ script: nukleus, style, children, ...rest }) => {
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
		height: '100vh'
	};

	return (
		<>
			<InterfaceHandler>{children}</InterfaceHandler>
			<div
				id="nukleus-container"
				style={{ ...styles, ...style }}
				ref={canvasContainerRef}
				{...rest}
			/>
		</>
	);
};
