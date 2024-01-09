import { Behavior, LiveEntity, Scene } from 'ebon';
import * as THREE from 'three';
import { clamp } from '../utils/clamp';

export const SmoothMovement = new Behavior<
	{
		position: THREE.Vector3;
		delta: number;
		scene: Scene;
		this: LiveEntity<any, any>;
	},
	{}
>()
	.init(() => {
		return {
			speedX: 0,
			speedY: 0,
			friction: 0.05,
			acceleration: 0.0001,
			maxSpeed: 0.02
		};
	})
	.tick(({ speedX, speedY, friction, position, delta, maxSpeed }) => {
		const newSpeedX = clamp(speedX * (1 - friction), -maxSpeed, maxSpeed); // + speedX * delta;
		const newSpeedY = clamp(speedY * (1 - friction), -maxSpeed, maxSpeed); // + speedY * delta;

		position.x += newSpeedX * delta;
		position.y += newSpeedY * delta;

		return { speedX: newSpeedX, speedY: newSpeedY };
	});
