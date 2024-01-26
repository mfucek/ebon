// import { Behavior, Delta, Transform } from 'ebon';

// export const Jumping = new Behavior()
// 	.require(Delta)
// 	.require(Transform)
// 	.init(() => {
// 		return {
// 			jumpDuration: 1000,
// 			isJumping: false,
// 			jumpStart: 0,
// 			jumpHeight: 2
// 		};
// 	})
// 	.tick(
// 		({
// 			age,
// 			jumpDuration,
// 			jumpStart,
// 			isJumping,
// 			jumpHeight,
// 			position,
// 			scale
// 		}) => {
// 			if (!isJumping) return;

// 			const jumpProgress = ((age - jumpStart) % jumpDuration) / jumpDuration;

// 			if (jumpProgress < 0.2) {
// 				scale.z = 1 - jumpProgress * 2;
// 			}

// 			if (0.3 <= jumpProgress && jumpProgress <= 1) {
// 				const relativeProgress = (jumpProgress - 0.3) / 0.7;
// 				// https://graphtoy.com/
// 				// z = -cos ( 2𝜋 * (1.4*x - 0.7)^2 + 𝜋) + 1
// 				position.z =
// 					(-Math.cos(2 * 3.14 * (relativeProgress * 1.4 - 0.7) ** 2 + 3.14) +
// 						1) *
// 					jumpHeight;
// 			}

// 			if (0.3 <= jumpProgress && jumpProgress <= 0.45) {
// 				const relativeProgress = (jumpProgress - 0.3) / 0.15;
// 				scale.z = 0.6 + relativeProgress * 0.4;
// 			}

// 			if (isJumping && age > jumpStart + jumpDuration) {
// 				scale.z = 1;
// 				position.z = 0;
// 				return { isJumping: false };
// 			}
// 		}
// 	);
