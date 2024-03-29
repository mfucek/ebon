import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';

import { Behavior } from '@/modules/behavior/Behavior';
import { EmptyObject } from './EmptyObject';

export const MeshObject = new Behavior() //
	.use(EmptyObject)
	.init(() => {
		// create cube
		const cube = new THREE.Mesh(
			new RoundedBoxGeometry(1, 1, 1, 6, 0.2).translate(0, 0, 0.5),
			new THREE.MeshStandardMaterial({ color: '#ff8f87', roughness: 0.2 })
		) as THREE.Mesh<any, any>;
		cube.castShadow = true;
		cube.receiveShadow = false;

		return { object: cube };
	});
