import * as THREE from 'three';

import { Transform } from '@/modules/behavior';
import { Behavior, GetState } from '@/modules/behavior/Behavior';
import { LiveEntity } from '@/modules/entity/LiveEntity';
import { ThreeObject } from './ThreeObject';

export const CameraObject = new Behavior() //
	.use(ThreeObject)
	.init<{
		object: THREE.PerspectiveCamera;
		focus: LiveEntity<GetState<typeof Transform>, {}> | null;
	}>(() => {
		// create camera
		const camera = new THREE.PerspectiveCamera(75, 0.5, 0.1, 1000);
		camera.up.set(0, 0, 1);
		camera.position.set(-2, 5, 3).multiplyScalar(2);
		camera.lookAt(0, 0, 0);

		return { object: camera, focus: null };
	})
	.action({
		focus: (state, target: LiveEntity<GetState<typeof Transform>, {}>) => {
			return { state: { ...state, target } };
		}
	});
