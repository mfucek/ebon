import * as THREE from 'three';

import { Behavior } from '@/modules/behavior/Behavior';

export const ThreeObject = new Behavior() //
	.init(() => {
		return { object: new THREE.Object3D() };
	});
