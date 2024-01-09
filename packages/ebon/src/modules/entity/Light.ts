import * as THREE from 'three';
import { Behavior } from '../behavior/Behavior';
import { AgeTracker } from '../behavior/behaviors/AgeTracker';

export const Light = (light: THREE.AmbientLight | THREE.DirectionalLight) =>
	new Behavior() //
		.init(() => {
			const light = new THREE.AmbientLight(0x404040); // soft white light
			return { object: light };
		})
		.use(AgeTracker);
