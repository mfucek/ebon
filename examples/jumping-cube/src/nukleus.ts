import { Behavior, Entity, Keyboard, Nukleus, Scene } from '@nukleus/core';
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry';

console.clear();

const nukleus = new Nukleus();

// Age
const AgeTracker = new Behavior()
	.init(() => {
		return { age: 0 };
	})
	.tick(({ age, delta }) => {
		return { age: age + delta };
	});

const Jumping = new Behavior<{
	age: number;
	delta: number;
	object: THREE.Object3D;
}>()
	.init(() => {
		return {
			jumpDuration: 1000,
			isJumping: false,
			jumpStart: 0,
			jumpHeight: 2
		};
	})
	.tick(({ age, object, jumpDuration, jumpStart, isJumping, jumpHeight }) => {
		if (!isJumping) return;

		const jumpProgress = ((age - jumpStart) % jumpDuration) / jumpDuration;

		if (jumpProgress < 0.2) {
			object.scale.z = 1 - jumpProgress * 2;
		}

		if (0.3 <= jumpProgress && jumpProgress <= 1) {
			const relativeProgress = (jumpProgress - 0.3) / 0.7;
			// https://graphtoy.com/
			// z = -cos ( 2𝜋 * (1.4*x - 0.7)^2 + 𝜋) + 1
			object.position.z =
				(-Math.cos(2 * 3.14 * (relativeProgress * 1.4 - 0.7) ** 2 + 3.14) + 1) *
				jumpHeight;
		}

		if (0.3 <= jumpProgress && jumpProgress <= 0.45) {
			const relativeProgress = (jumpProgress - 0.3) / 0.15;
			object.scale.z = 0.6 + relativeProgress * 0.4;
		}

		if (isJumping && age > jumpStart + jumpDuration) {
			object.scale.z = 1;
			object.position.z = 0;
			return { isJumping: false };
		}
	});

const clamp = (value: number, min: number, max: number) => {
	return Math.min(Math.max(value, min), max);
};

const SmoothMovement = new Behavior<{ object: THREE.Object3D; delta: number }>()
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

const Movement = new Behavior<{ object: THREE.Object3D; delta: number }>()
	.use(
		new Keyboard(nukleus, {
			up: 'w',
			down: 's',
			left: 'a',
			right: 'd',
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

// Entity
const Cube = Entity.use(AgeTracker)
	.init(() => {
		// create cube
		const cube: THREE.Mesh<any, any> = new THREE.Mesh(
			new RoundedBoxGeometry(1, 1, 1, 6, 0.2).translate(0, 0, 0.5),
			new THREE.MeshStandardMaterial({ color: '#ff8f87', roughness: 0.2 })
		);
		cube.castShadow = true;
		cube.receiveShadow = false;

		return { object: cube };
	})
	.use(Movement)
	.use(Jumping)
	.tick(({ keyboard, isJumping, age, object }) => {
		if (keyboard.jump && !isJumping) {
			return { isJumping: true, jumpStart: age };
		}
	});

// Floor
const Floor = Entity.init(({ object }) => {
	const plane = new THREE.Mesh(
		new THREE.CircleGeometry(4, 64),
		new THREE.MeshPhongMaterial({
			color: '#222222'
		})
	);
	plane.receiveShadow = true;
	plane.castShadow = false;
	return { object: plane };
});

// Scene
const scene = new Scene();

scene.addEntity(Cube);
scene.addEntity(Floor);

nukleus.setScene(scene);

export { nukleus as game };
