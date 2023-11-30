import * as THREE from 'three';
import { Behaveiour } from '../behaviour/Behaveiour';

const initializeCamera = new Behaveiour().init(() => {
	const camera = new THREE.PerspectiveCamera(75, 0.5, 0.1, 1000);
	return { object: camera };
});

export const Camera = new Behaveiour().use(initializeCamera);
