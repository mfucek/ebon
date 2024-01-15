import * as THREE from 'three';

import { GetState, Transform } from '@/modules/behavior';
import { Behavior } from '@/modules/behavior/Behavior';
import { SceneReference } from '@/modules/behavior/behaviors/SceneReference';
import { LiveEntity } from '@/modules/entity/LiveEntity';
import { EmptyObject } from './EmptyObject';

export const CameraObject = new Behavior() //
	.require(SceneReference)
	.use(EmptyObject)
	// ovaj require mozda treba da ispliva skroz na vrh! ako se koristi top-level. pa je potreban kao argument za create
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
		},
		makeActive: (state) => {
			state.scene.setCamera(state.object);
			return { state };
		}
	});
