// import { Entity, InterfaceAnchored } from 'ebon';
// import { ExampleCube } from '../../behaviors/ExampleCube';
// import { Jumping } from '@/behaviors/Jumping';
import { Movement } from '../../behaviors/Movement';
import { dummyRef } from '../../game';
// import { Tooltip } from '../../ui/Tooltip';
// import { Child } from '../Child';

import {
	ApplyTransformToObject,
	Behavior,
	Delta,
	MeshObject,
	SceneReference,
	Transform
} from 'ebon';

// Player
export const Player = new Behavior() //
	.use(Delta)
	.use(SceneReference)
	.use(MeshObject)
	.use(Transform)
	.use(Movement)
	.use(ApplyTransformToObject)
	// .use(Jumping)
	.init((state) => {
		// console.log(state.scene);
		// 	const childRef = Child.create(state.scene);
		// 	childRef.actions.setParent(state.this);
		// 	// childRef.actions.setParent()
		// })
		// .use(InterfaceAnchored(<Tooltip text="Player" />))
		// // .use(InterfaceAnchored((ctx) => <Tooltip text="Player" potato={ctx.nekaj}/>))
	})
	.tick((state) => {
		const { keyboard, position } = state;
		const isGrounded = position.z <= 0;
		if (keyboard.interact) {
			dummyRef.actions.tickQuest();
		}
		if (keyboard.jump && isGrounded) {
			console.log('[Player]: I told the dummy to change color');
			const newColor = dummyRef.actions.tint();
			console.log('[Player]: I dummy said new color is: ' + newColor + '\n\n');
		}
	});

const a = new Behavior() //
	.action({ a: (state, a: number) => ({ state, output: 1 }) })
	.action({ b: (state, a: number) => ({ state, output: 1 }) });

const b = new Behavior() //
	.require(a);
