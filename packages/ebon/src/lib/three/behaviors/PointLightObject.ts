import * as THREE from 'three';

import { Behavior } from '@/modules/behavior/Behavior';
import { ThreeObject } from './ThreeObject';

export const PointLightObject = new Behavior() //
	.use(ThreeObject)
	.init(() => {
		// create light
		const light = new THREE.PointLight(0xffffff, 10);
		light.position.set(3, -2, 3);

		return { object: light };
	});
