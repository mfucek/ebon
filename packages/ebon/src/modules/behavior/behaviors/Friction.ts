import { Vector3 } from 'three';
import { Behavior } from '../Behavior';
import { Delta } from './Delta';
import { Velocity } from './Velocity';

export const Friction = new Behavior() //
	.require(Delta)
	.require(Velocity)
	.init(() => {
		return { friction: new Vector3(0.05, 0.05, 0) };
	})
	.tick(({ friction, velocity, delta }) => {
		// return { velocity: velocity.multiplyScalar(friction ** delta) };
		return {
			velocity: new Vector3(
				velocity.x * friction.x ** delta,
				velocity.y * friction.y ** delta,
				velocity.z * friction.z ** delta
			)
		};
	});
