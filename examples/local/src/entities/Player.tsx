// import { Entity, InterfaceAnchored } from 'ebon';
// import { ExampleCube } from '../../behaviors/ExampleCube';
// import { Jumping } from '@/behaviors/Jumping';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { dummyRef } from '../game';
// import { Tooltip } from '../../ui/Tooltip';
// import { Child } from '../Child';
import * as THREE from 'three';
import { ebon } from '../lib/ebon/ebon';

import {
	ApplyTransformToObject,
	Behavior,
	Delta,
	InterfaceAnchored,
	Keyboard,
	MeshObject,
	SceneReference,
	Transform
} from 'ebon';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { Tooltip } from 'ui/Tooltip';

// Player
export const Player = new Behavior() //
	.use(Delta)
	.use(SceneReference)
	.use(MeshObject)
	.use(Transform)
	.use(
		new Keyboard(ebon, {
			up: 'w',
			down: 's',
			left: 'a',
			right: 'd',
			interact: 'e',
			jump: ' '
		}).register()
	)
	.use(ApplyTransformToObject)
	.init((state) => {
		const loader = new GLTFLoader();
		const dracoLoader = new DRACOLoader();
		dracoLoader.setDecoderPath('/examples/jsm/libs/draco/');
		loader.setDRACOLoader(dracoLoader);
		loader.load('models/duck/Duck.gltf', (gltf) => {
			const obj = gltf.scene.children[0].children[0] as THREE.Mesh;

			obj.geometry.applyMatrix4(
				new THREE.Matrix4().makeScale(0.01, 0.01, 0.01)
			);
			obj.geometry.applyMatrix4(new THREE.Matrix4().makeRotationX(Math.PI / 2));

			state.object.copy(obj as THREE.Mesh);
		});
		state.friction.set(25, 25, 0);
		return {
			maxVelocity: 10,
			push: {
				isBeingPushed: false,
				endAge: 0
			}
		};
		// console.log(state.scene);
		// 	const childRef = Child.create(state.scene);
		// 	childRef.actions.setParent(state.this);
		// 	// childRef.actions.setParent()
		// })
		// // .use(InterfaceAnchored((ctx) => <Tooltip text="Player" potato={ctx.nekaj}/>))
	})
	.use(InterfaceAnchored(<Tooltip text="Player" />))
	.action({
		push: (
			{ acceleration, age, push, velocity, friction },
			newAcceleration: THREE.Vector3,
			duration: number
		) => {
			if (push.isBeingPushed) return { state: {} };
			friction.set(0, 0, 0);
			acceleration.copy(newAcceleration);
			push.isBeingPushed = true;
			push.endAge = age + duration;
			return {
				state: {}
			};
		}
	})
	.tick(
		({
			keyboard,
			acceleration,
			position,
			velocity,
			push,
			object,
			age,
			friction
		}) => {
			acceleration.set(0, 0, 0);
			if (position.z <= 0) {
				velocity.z = 0;
				position.z = 0;
			} else {
				acceleration.z = -50;
			}

			if (!push.isBeingPushed) {
				if (keyboard.jump && position.z === 0) velocity.z = 15;
				if (keyboard.left) acceleration.x = 100;
				if (keyboard.right) acceleration.x = -100;
				if (keyboard.up) acceleration.y = -100;
				if (keyboard.down) acceleration.y = 100;
			}

			console.log(push.isBeingPushed);

			if (push.isBeingPushed && push.endAge < age) {
				push.isBeingPushed = false;
				friction.set(25, 25, 0);
			}

			const isGrounded = position.z <= 0;

			const movingDirection = velocity.clone();
			movingDirection.z = 0;
			movingDirection.normalize();

			//apply rotation in line with movement
			const angle = Math.atan2(velocity.y, velocity.x);

			object.rotation.z = angle;

			if (keyboard.interact) {
				dummyRef.actions.tickQuest();
			}
			if (keyboard.jump && isGrounded) {
				// console.log('[Player]: I told the dummy to change color');
				const newColor = dummyRef.actions.tint();
				// console.log('[Player]: I dummy said new color is: ' + newColor + '\n\n');
			}
		}
	);
