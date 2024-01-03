import { Behavior } from '@nukleus/core';
import * as THREE from 'three';
import { clamp } from '../utils/clamp';

export const SmoothMovement = new Behavior<
	{ object: THREE.Object3D; delta: number },
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
	.tick(({ speedX, speedY, friction, object, delta, maxSpeed }) => {
		const newSpeedX = clamp(speedX * (1 - friction), -maxSpeed, maxSpeed); // + speedX * delta;
		const newSpeedY = clamp(speedY * (1 - friction), -maxSpeed, maxSpeed); // + speedY * delta;

		object.position.x += newSpeedX * delta;
		object.position.y += newSpeedY * delta;

		return { speedX: newSpeedX, speedY: newSpeedY };
	});
