import { Behavior, Keyboard, Transform } from 'ebon';
import { ebon } from '../lib/ebon/ebon';

export const Movement = new Behavior()
	.require(Transform)
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
	.init((state) => state.keyboard)
	.tick(({ keyboard, acceleration }) => {
		acceleration.set(0, 0, 0);
		if (keyboard.left) acceleration.x = 100;
		if (keyboard.right) acceleration.x = -100;
		if (keyboard.up) acceleration.y = -100;
		if (keyboard.down) acceleration.y = 100;
	})
	.init((state) => {
		state.friction.set(25, 25, 0);
		state.maxVelocity.set(15, 15, Infinity);
	})
	.tick((state) => {
		console.log(state.position);
		console.log(state.velocity);
		console.log(state.acceleration);
		console.log('\n');
	});
// .tick(({ velocity }) => {
// 	velocity.clamp(
// 		new THREE.Vector3(-0.1, -0.1, -0.1),
// 		new THREE.Vector3(0.1, 0.1, 0.1)
// 	);
// });
