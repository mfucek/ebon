import React, {
	FC,
	HTMLAttributes,
	PropsWithChildren,
	useEffect,
	useRef
} from 'react';
import { useCounterStore } from '../../../lib/zustand';
import { InterfaceProvider } from '../../interface/InterfaceProvider';
import { Nukleus } from '../Nukleus';

interface NukleusContainerProps {
	script?: Nukleus;
}

const dictToTuple = <V,>(dict: { [key: string]: V }): [string, V][] => {
	return Object.keys(dict).map((key) => [key, dict[key]]);
};

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

	const counter = useCounterStore();

	return (
		<InterfaceProvider>
			<div style={{ position: 'absolute', inset: '0', zIndex: 0 }}>
				{children}
				{counter.position2?.x}, {counter.position2?.y}
				{dictToTuple(counter.objects).map(([key, obj]) => (
					// <>{obj}</>
					<div
						key={key}
						style={{
							position: 'absolute',
							top: (obj.position?.y || 0) * 100 + '%',
							left: (obj.position?.x || 0) * 100 + '%',
							zIndex: -Math.floor(100000 * (obj.position?.z || 0))
						}}
					>
						{obj.element}
					</div>
				))}
			</div>
			<div
				id="nukleus-container"
				style={{ ...styles, ...style }}
				ref={canvasContainerRef}
				{...rest}
			/>
		</InterfaceProvider>
	);
};
