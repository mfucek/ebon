import { Behavior, Keyboard } from 'nukleus';
import * as THREE from 'three';
import { nukleus } from '../lib/nukleus/nukleus';
import { SmoothMovement } from './SmoothMovement';

export const Movement = new Behavior<
	{ object: THREE.Object3D; delta: number },
	{}
>()
	.use(
		new Keyboard(nukleus, {
			up: 'w',
			down: 's',
			left: 'a',
			right: 'd',
			interact: 'e',
			jump: ' '
		}).register()
	)
	.use(SmoothMovement)
	.tick(({ keyboard, object, delta, speedX, speedY, acceleration }) => {
		if (keyboard.left) speedX += acceleration * delta;
		if (keyboard.right) speedX -= acceleration * delta;
		if (keyboard.up) speedY -= acceleration * delta;
		if (keyboard.down) speedY += acceleration * delta;
		return { speedX, speedY };
	});
