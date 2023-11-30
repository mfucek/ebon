import { Behaveiour, Entity, Nukleus, Scene } from '@nukleus/core';
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry';

console.clear();

const nukleus = new Nukleus();

// Age
const AgeTracker = new Behaveiour()
	.init(() => {
		return { age: 0 };
	})
	.tick(({ age, delta }) => {
		return { age: age + delta };
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

		// make a jump last 1200ms
		const jumpTime = 1200;
		return { object: cube, jumpTime };
	})
	.tick(({ age, object, jumpTime }) => {
		const jumpProgress = (age % jumpTime) / jumpTime;

		if (jumpProgress < 0.2) {
			object.scale.z = 1 - jumpProgress * 2;
		}

		if (0.3 <= jumpProgress && jumpProgress <= 1) {
			const relativeProgress = (jumpProgress - 0.3) / 0.7;
			// https://graphtoy.com/
			// z = -cos ( 2𝜋 * (1.4*x - 0.7)^2 + 𝜋) + 1
			object.position.z =
				-Math.cos(2 * 3.14 * (relativeProgress * 1.4 - 0.7) ** 2 + 3.14) + 1;
		}

		if (0.3 <= jumpProgress && jumpProgress <= 0.45) {
			const relativeProgress = (jumpProgress - 0.3) / 0.15;
			object.scale.z = 0.6 + relativeProgress * 0.4;
		}
	});

// Floor
const Floor = Entity.init(({ object }) => {
	const plane = new THREE.Mesh(
		new THREE.CircleGeometry(4, 64),
		new THREE.MeshPhongMaterial({
			color: '#ffffff',
			specular: '#ffffff',
			shininess: 0.5
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
