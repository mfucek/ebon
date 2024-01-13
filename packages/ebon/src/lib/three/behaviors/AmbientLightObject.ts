import * as THREE from 'three';

import { Transform } from '@/modules/behavior';
import { Behavior } from '@/modules/behavior/Behavior';
import { ThreeObject } from './ThreeObject';

export const AmbientLightObject = new Behavior() //
	.use(ThreeObject)
	.use(Transform)
	.init(() => {
		// create light
		const light = new THREE.AmbientLight(0xffffff, 0.7);

		return { object: light };
	});
