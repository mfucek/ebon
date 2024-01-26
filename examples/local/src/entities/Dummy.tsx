import {
	ApplyTransformToObject,
	Behavior,
	Delta,
	EmptyObject,
	InterfaceAnchored,
	MeshObject,
	Transform,
	useEbonInterface
} from 'ebon';
import * as THREE from 'three';
import { Mesh } from 'three';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { QuestMarker } from '../ui/QuestMarker';

export const Dummy = new Behavior() //
	.use(Delta)
	.use(EmptyObject)
	.use(Transform)
	.use(ApplyTransformToObject)
	.use(InterfaceAnchored(<QuestMarker />))
	.use(MeshObject)
	.init(({ object, position }) => {
		const loader = new GLTFLoader();
		const dracoLoader = new DRACOLoader();
		dracoLoader.setDecoderPath('/examples/jsm/libs/draco/');
		loader.setDRACOLoader(dracoLoader);
		loader.load('models/duck/Duck.gltf', (gltf) => {
			const obj = gltf.scene.children[0].children[0] as Mesh;

			obj.geometry.applyMatrix4(
				new THREE.Matrix4().makeScale(0.01, 0.01, 0.01)
			);
			obj.geometry.applyMatrix4(new THREE.Matrix4().makeRotationX(Math.PI / 2));

			object.copy(obj as Mesh);
		});
		position.x = 2;
		return { quest: { active: true } };
	})
	.action({
		tint: (state) => {
			console.log('[Dummy]: Tinting...');
			const randomColor = Math.floor(Math.random() * 16777215)
				.toString(16)
				.padStart(6, '0');
			state.object.material.color.set('#' + randomColor);

			return { state, output: '#' + randomColor };
		},
		tickQuest: (state) => {
			useEbonInterface
				.getState()
				.setElement(state.interfaceId, <QuestMarker disabled />);
			return { state: { ...state, quest: { active: false } } };
		}
	})
	.tick(({ age, object }) => {
		object.rotation.z = age / 1000;
	});
