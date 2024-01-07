import React, {
	FC,
	HTMLAttributes,
	PropsWithChildren,
	useEffect,
	useRef
} from 'react';
import { InterfaceRenderer } from '../interface/renderer';
import { Ebon } from './Ebon';

interface EbonContainerProps {
	script?: Ebon;
}

export const EbonContainer: FC<
	HTMLAttributes<HTMLDivElement> & EbonContainerProps & PropsWithChildren
> = ({ script: ebon, style, children, ...rest }) => {
	const canvasContainerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!ebon) {
			console.error(
				'No script provided. Please provide a script in EbonContainer to initialize.'
			);
			return;
		}

		if (!canvasContainerRef.current) {
			return;
		}

		const cleanup = ebon.initialize(canvasContainerRef.current!);
		console.log('Container initialized');
		ebon.start();
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
			<InterfaceRenderer>{children}</InterfaceRenderer>
			<div
				id="ebon-container"
				style={{ ...styles, ...style }}
				ref={canvasContainerRef}
				{...rest}
			/>
		</>
	);
};
