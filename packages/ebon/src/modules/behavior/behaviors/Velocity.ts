import { Vector3 } from 'three';
import { Behavior } from '../Behavior';
import { Delta } from './Delta';
import { Position } from './Position';

export const Velocity = new Behavior() //
	.require(Delta)
	.require(Position)
	.init(() => {
		return { velocity: new Vector3() };
	})
	.tick(({ velocity, delta, position }) => {
		return { position: position.add(velocity.clone().multiplyScalar(delta)) };
	});
