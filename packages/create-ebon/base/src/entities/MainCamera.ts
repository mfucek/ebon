import {
	ApplyTransformToObject,
	Behavior,
	CameraObject,
	Delta,
	SceneReference,
	Transform,
	deferAction
} from 'ebon';
import * as THREE from 'three';
import { playerRef } from '../game';

const cameraOffset = new THREE.Vector3(0, 5, 4).multiplyScalar(1.5);

export const MainCamera = new Behavior()
	.use(Delta)
	.use(SceneReference)
	.use(CameraObject)
	.use(Transform)
	.use(ApplyTransformToObject)
	.init(({ position, object, ...state }) => {
		deferAction(() => {
			state.this.actions.makeActive();
		});

		position.copy(cameraOffset);
		object.position.copy(cameraOffset);
		object.lookAt(0, 0, 0);
		return { focus: playerRef };
	})
	.tick(({ position, object, age, focus }) => {
		if (!focus) {
			return;
		}

		position.lerpVectors(
			position.clone(),
			focus.state.position.clone().add(cameraOffset),
			0.2
		);
	});
