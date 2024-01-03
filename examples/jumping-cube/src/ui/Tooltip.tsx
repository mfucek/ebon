import { FC } from 'react';

export const Tooltip: FC<{ text: string }> = ({ text }) => (
	<div
		style={{
			background: '#44444480',
			color: 'white',
			borderRadius: '8px',
			padding: '8px 12px',
			fontSize: '12px',
			fontWeight: 'bold',
			transform: 'translate(-50%, -100%)',
			backdropFilter: 'blur(4px)'
		}}
	>
		{text}
	</div>
);
