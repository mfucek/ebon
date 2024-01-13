import { Behavior, InterfaceAnchored, LiveEntity, MeshObject } from 'ebon';
import { Jumping } from '../../behaviors/Jumping';
import { Movement } from '../../behaviors/Movement';
import { dummyRef } from '../../game';
import { Tooltip } from '../../ui/Tooltip';
import { Child } from '../Child';

// Player
export const Player = new Behavior() //
	.use(MeshObject)
	.use(Movement)
	.use(Jumping)
	.init((state) => {
		console.log(state.scene);
		const childRef = Child.create(state.scene);
		childRef.actions.setParent(state.this as LiveEntity<any, any>);

		// childRef.actions.setParent()
	})
	.use(InterfaceAnchored(<Tooltip text="Player" />))
	// .use(InterfaceAnchored((ctx) => <Tooltip text="Player" potato={ctx.nekaj}/>))
	.tick(({ keyboard, isJumping, age, object }) => {
		if (keyboard.interact) {
			dummyRef.actions.tickQuest();
		}
		if (keyboard.jump && !isJumping) {
			console.log('[Player]: I told the dummy to change color');
			const newColor = dummyRef.actions.tint();
			console.log('[Player]: I dummy said new color is: ' + newColor + '\n\n');

			return { isJumping: true, jumpStart: age };
		}
	});
