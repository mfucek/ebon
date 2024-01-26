import { ebon } from '../lib/ebon/ebon';

import {
	ApplyTransformToObject,
	Behavior,
	Delta,
	Keyboard,
	MeshObject,
	SceneReference,
	Transform
} from 'ebon';

// Player
export const Player = new Behavior() //
	.use(Delta)
	.use(SceneReference)
	.use(MeshObject)
	.use(Transform)
	.use(
		new Keyboard(ebon, {
			up: 'w',
			down: 's',
			left: 'a',
			right: 'd',
			jump: ' '
		}).register()
	)
	.use(ApplyTransformToObject)
	.init((state) => {
		state.friction.set(25, 25, 0);
		return {
			maxVelocity: 10
		};
	})
	.tick(({ keyboard, acceleration, position, velocity, object }) => {
		acceleration.set(0, 0, 0);
		if (position.z <= 0) {
			velocity.z = 0;
			position.z = 0;
		} else {
			acceleration.z = -50;
		}

		const isGrounded = position.z <= 0;

		if (keyboard.jump && isGrounded) velocity.z = 15;

		if (keyboard.left) acceleration.x = 100;
		if (keyboard.right) acceleration.x = -100;
		if (keyboard.up) acceleration.y = -100;
		if (keyboard.down) acceleration.y = 100;
	});
