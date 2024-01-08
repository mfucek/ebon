import * as THREE from 'three';
import { Behavior } from '../behavior/Behavior';

const initializeThreeLight = new Behavior().init(() => {
	const light = new THREE.AmbientLight(0x404040); // soft white light
	return { object: light };
});

const AgeTracker = new Behavior()
	.init(() => {
		return { age: 0 };
	})
	.tick(({ age, delta }) => {
		return { age: age + delta };
	});

export const Entity = new Behavior().use(initializeThreeLight).use(AgeTracker);
