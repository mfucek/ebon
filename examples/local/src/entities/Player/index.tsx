// import { Entity, InterfaceAnchored } from 'ebon';
// import { Jumping } from '../../Jumping';
// import { ExampleCube } from '../../behaviors/ExampleCube';
import { Movement } from '../../behaviors/Movement';
// import { dummyRef } from '../../game';
// import { Tooltip } from '../../ui/Tooltip';
// import { Child } from '../Child';

import {
	Age,
	ApplyTransformToObject,
	Behavior,
	Delta,
	MeshObject,
	Transform
} from 'ebon';

// Player
export const Player = new Behavior() //
	.use(Delta)
	.use(Age)
	.use(MeshObject)
	.use(Transform)
	.use(Movement)
	.use(ApplyTransformToObject);
// .use(Jumping)
// .init((state) => {
// 	console.log(state.scene);
// 	const childRef = Child.create(state.scene);
// 	childRef.actions.setParent(state.this);

// 	// childRef.actions.setParent()
// })
// .use(InterfaceAnchored(<Tooltip text="Player" />))
// // .use(InterfaceAnchored((ctx) => <Tooltip text="Player" potato={ctx.nekaj}/>))
// .tick(({ keyboard, isJumping, age, object }) => {
// 	if (keyboard.interact) {
// 		dummyRef.actions.tickQuest();
// 	}
// 	if (keyboard.jump && !isJumping) {
// 		console.log('[Player]: I told the dummy to change color');
// 		const newColor = dummyRef.actions.tint();
// 		console.log('[Player]: I dummy said new color is: ' + newColor + '\n\n');

// 		return { isJumping: true, jumpStart: age };
// 	}
// });
