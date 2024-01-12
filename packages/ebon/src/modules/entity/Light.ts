import * as THREE from 'three';
import { Behavior } from '../behavior/Behavior';
import { Age } from '../behavior/behaviors/Age';

export const Light = (light: THREE.AmbientLight | THREE.DirectionalLight) =>
	new Behavior() //
		.init(() => {
			const light = new THREE.AmbientLight(0x404040); // soft white light
			return { object: light };
		})
		.use(Age);
