import { Vector3 } from 'three';
import { Behavior } from '../Behavior';

export const Position = new Behavior() //
	.init(() => {
		return { position: new Vector3() };
	});
