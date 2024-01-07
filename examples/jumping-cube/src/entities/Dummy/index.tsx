import { Entity, InterfaceAnchored, useNukleusInterface } from 'nukleus';
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry';
import { QuestMarker } from '../../ui/QuestMarker';

export const Dummy = Entity.init(() => {
	// Dummy
	// create cube
	const cube: THREE.Mesh<any, any> = new THREE.Mesh(
		new RoundedBoxGeometry(1, 1, 1, 6, 0.2).translate(0, 0, 0.5),
		new THREE.MeshStandardMaterial({ color: '#ff8f87', roughness: 0.2 })
	);
	cube.castShadow = true;
	cube.receiveShadow = false;
	cube.position.x = 2;
	return { object: cube };
})
	// .use(InterfaceAnchored(<Tooltip text="Dummy" />))
	.use(InterfaceAnchored(<QuestMarker />))
	.init(() => {
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
			useNukleusInterface
				.getState()
				.setElement(state.interfaceId, <QuestMarker disabled />);
			return { state: { ...state, quest: { active: false } } };
		}
	})
	.tick(({ age, object }) => {
		object.rotation.z = age / 1000;
	});
