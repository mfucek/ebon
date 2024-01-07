import { FC, PropsWithChildren } from 'react';
import { useEbonInterface } from '../../lib/zustand';

const dictToTuple = <V,>(dict: { [key: string]: V }): [string, V][] => {
	return Object.keys(dict).map((key) => [key, dict[key]]);
};

export const InterfaceRenderer: FC<PropsWithChildren> = ({ children }) => {
	const counter = useEbonInterface();

	return (
		<div style={{ position: 'absolute', inset: '0', zIndex: 0 }}>
			{dictToTuple(counter.objects).map(([key, obj]) => (
				// <>{obj}</>
				<div
					key={key}
					style={{
						position: 'absolute',
						// top: (obj.position?.y || 0) * 100 + '%',
						bottom: 100 - (obj.position?.y || 0) * 100 + '%',
						left: (obj.position?.x || 0) * 100 + '%',
						zIndex: -Math.floor(100000 * (obj.position?.z || 0)),
						transform: 'translate(-50%, 0)'
						// filter: `blur(${1 / (1 - (obj.position?.z || 0) ** 50) - 1}px)`
					}}
				>
					{obj.element}
				</div>
			))}
			{children}
		</div>
	);
};
