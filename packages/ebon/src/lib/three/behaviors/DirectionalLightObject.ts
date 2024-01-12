import * as THREE from 'three';

import { Behavior } from '@/modules/behavior/Behavior';
import { ThreeObject } from './ThreeObject';

export const DirectionalLightObject = new Behavior() //
	.use(ThreeObject)
	.init(() => {
		// create light
		const light = new THREE.DirectionalLight(0xffffff, 1);
		light.position.set(-2, 1, 2); //default; light shining from top
		light.castShadow = true; // default false

		//Set up shadow properties for the light
		light.shadow.mapSize.width = 512; // default
		light.shadow.mapSize.height = 512; // default
		light.shadow.camera.near = 0.5; // default
		light.shadow.camera.far = 500; // default

		return { object: light };
	});
