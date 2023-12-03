import * as THREE from 'three';
import { Behavior } from '../behavior/Behavior';

const initializeThreeObject = new Behavior().init(() => {
	const cube: THREE.Mesh<any, any> = new THREE.Mesh(
		new THREE.BoxGeometry().translate(0, 0, 0.5),
		new THREE.MeshPhongMaterial({ color: 0x444444 })
	);
	return { object: cube };
});

export const Entity = new Behavior().use(initializeThreeObject);
