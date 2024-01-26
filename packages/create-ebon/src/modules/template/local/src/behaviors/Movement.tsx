// import { Behavior, Keyboard, Transform } from 'ebon';
// import { ebon } from '../lib/ebon/ebon';

// export const Movement = new Behavior()
// 	.require(Transform)
// 	.use(
// 		new Keyboard(ebon, {
// 			up: 'w',
// 			down: 's',
// 			left: 'a',
// 			right: 'd',
// 			interact: 'e',
// 			jump: ' '
// 		}).register()
// 	)
// 	.init((state) => state.keyboard)
// 	.init((state) => {
// 		state.friction.set(25, 25, 0);
// 		return { maxVelocity: 10 };
// 	})
// 	.tick(({ keyboard, acceleration, position, velocity }) => {
// 		acceleration.set(0, 0, 0);
// 		if (position.z <= 0) {
// 			velocity.z = 0;
// 			position.z = 0;
// 		} else {
// 			acceleration.z = -50;
// 		}
// 		if (keyboard.jump && position.z === 0) velocity.z = 15;
// 		if (keyboard.left) acceleration.x = 100;
// 		if (keyboard.right) acceleration.x = -100;
// 		if (keyboard.up) acceleration.y = -100;
// 		if (keyboard.down) acceleration.y = 100;
// 	});
