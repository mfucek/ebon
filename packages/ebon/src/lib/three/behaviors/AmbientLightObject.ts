import * as THREE from 'three';

import { Behavior } from '@/modules/behavior/Behavior';
import { ThreeObject } from './ThreeObject';

export const AmbientLightObject = new Behavior() //
	.use(ThreeObject)
	.init(() => {
		// create light
		const light = new THREE.AmbientLight(0xffffff, 0.7);

		return { object: light };
	});
