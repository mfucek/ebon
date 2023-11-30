import { Behaveiour, Camera, Entity, Nukleus, Scene } from '@nukleus/core';
import * as THREE from 'three';

console.clear();

const nukleus = new Nukleus();

// Entity

// const deltaBehaveiour = new Entity().init(() => {
// 	return { delta: 0 };
// });

const Common = new Behaveiour<{ counter: number; delta: number }>()
	.init(() => {
		const speedZ = 0.1;
		const speedRot = 0.1;
		return { speedZ, speedRot };
	})
	.init((state) => {
		return {
			setSpeedZ: (z: number) => {
				state.speedZ = z;
			}
		};
	});

const AgeTracker = new Behaveiour()
	.init((state) => {
		return { age: 0 };
	})
	.tick((state) => {
		return { age: state.age + state.delta };
	});

const Happiness = new Behaveiour<{
	delta: number;
	age: number;
	object: THREE.Mesh<any, THREE.MeshPhongMaterial>;
}>().tick(({ age, object }) => {
	object.material.color.setHSL(age / 10000, 1, 0.5);
});

const skeleton = Entity.use(AgeTracker)
	.use(Common)
	.use(Happiness)
	.init((state) => {
		state.setSpeedZ(10);
	})
	.tick((state) => {
		const { object, age, speedRot, speedZ } = state;

		object.rotation.z = age / 100;
		object.position.y = Math.sin((age / 100) * speedRot) * 2.5;
		object.position.x = Math.cos((age / 100) * speedRot) * 2.5;
		object.position.z = Math.cos((age / 100) * speedZ) * 1 + 1;
	})
	.tick(({ age, object }) => {
		object.material.color.setHSL(age / 10000, 1, 0.5);
	});
const HappyFloor = Entity.init(({ object }) => {
	const mesh = new THREE.Mesh(
		new THREE.PlaneGeometry(10, 10),
		new THREE.MeshPhongMaterial({ color: 0xffffff })
	);
	return { object: mesh };
}).use(AgeTracker);
// .tick(({ age, object }) => {
// 	object.material.color.setHSL(age / 10000, 1, 0.5);
// });

const PayerCamera = Camera;

// Scene
const scene = new Scene();

scene.addEntity(skeleton);
scene.addEntity(HappyFloor);

nukleus.setScene(scene);

export { nukleus as game };
