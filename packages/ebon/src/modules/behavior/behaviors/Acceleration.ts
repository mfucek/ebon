import { Vector3 } from 'three';
import { Behavior } from '../Behavior';
import { Delta } from './Delta';
import { Velocity } from './Velocity';

export const Acceleration = new Behavior() //
	.require(Delta)
	.require(Velocity)
	.init(() => {
		return { acceleration: new Vector3() };
	})
	.tick(({ acceleration, velocity, delta }) => {
		return {
			velocity: velocity.add(acceleration.clone().multiplyScalar(delta))
		};
	});
