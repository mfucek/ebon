import { Behavior, Keyboard, LiveEntity, Scene } from 'ebon';
import * as THREE from 'three';
import { ebon } from '../lib/ebon/ebon';
import { SmoothMovement } from './SmoothMovement';

export const Movement = new Behavior<
	{
		object: THREE.Object3D;
		delta: number;
		scene: Scene;
		this: LiveEntity<any, any>;
	},
	{},
	{}
>()
	.use(
		new Keyboard(ebon, {
			up: 'w',
			down: 's',
			left: 'a',
			right: 'd',
			interact: 'e',
			jump: ' '
		}).register()
	)
	.use(SmoothMovement)
	.tick(({ keyboard, delta, speedX, speedY, acceleration }) => {
		if (keyboard.left) speedX += acceleration * delta;
		if (keyboard.right) speedX -= acceleration * delta;
		if (keyboard.up) speedY -= acceleration * delta;
		if (keyboard.down) speedY += acceleration * delta;
		return { speedX, speedY };
	});
