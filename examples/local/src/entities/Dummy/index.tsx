import { Entity, InterfaceAnchored, useEbonInterface } from 'ebon';
import { ExampleCube } from '../../behaviors/ExampleCube';
import { QuestMarker } from '../../ui/QuestMarker';

export const Dummy = Entity.use(ExampleCube)
	.use(InterfaceAnchored(<QuestMarker />))
	.init(({ position }) => {
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
