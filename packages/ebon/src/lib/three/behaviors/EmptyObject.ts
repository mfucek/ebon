import { Behavior } from '@/modules/behavior';
import * as THREE from 'three';

export const EmptyObject = new Behavior() //
	.init(() => {
		return { object: new THREE.Object3D() };
	});
