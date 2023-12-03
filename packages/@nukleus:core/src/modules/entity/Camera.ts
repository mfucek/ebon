import * as THREE from 'three';
import { Behavior } from '../behavior/Behavior';

const initializeCamera = new Behavior().init(() => {
	const camera = new THREE.PerspectiveCamera(75, 0.5, 0.1, 1000);
	return { object: camera };
});

export const Camera = new Behavior().use(initializeCamera);
