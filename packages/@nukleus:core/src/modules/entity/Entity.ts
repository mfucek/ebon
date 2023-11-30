import * as THREE from 'three';
import { Behaveiour } from '../behaviour/Behaveiour';

const initializeThreeObject = new Behaveiour().init(() => {
	const cube: THREE.Mesh<any, any> = new THREE.Mesh(
		new THREE.BoxGeometry().translate(0, 0, 0.5),
		new THREE.MeshPhongMaterial({ color: 0x444444 })
	);
	return { object: cube };
});

export const Entity = new Behaveiour().use(initializeThreeObject);
