import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry';

import { Behavior } from '@/modules/behavior/Behavior';
import { ThreeObject } from './ThreeObject';

export const MeshObject = new Behavior() //
	.use(ThreeObject)
	.init(() => {
		// create cube
		const cube: THREE.Mesh<any, any> = new THREE.Mesh(
			new RoundedBoxGeometry(1, 1, 1, 6, 0.2).translate(0, 0, 0.5),
			new THREE.MeshStandardMaterial({ color: '#ff8f87', roughness: 0.2 })
		);
		cube.castShadow = true;
		cube.receiveShadow = false;

		return { object: cube };
	});
