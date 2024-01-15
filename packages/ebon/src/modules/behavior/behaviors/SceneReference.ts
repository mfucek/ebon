import { LiveEntity } from '@/modules/entity/LiveEntity';
import { Scene } from '@/modules/scene/Scene';
import { Behavior } from '../Behavior';

export const SceneReference = new Behavior<
	{
		scene: Scene;
		this: LiveEntity<any, any>;
	},
	{},
	{},
	{}
>() //
	.action({
		destroy: (state) => {
			state.scene.entities.remove(state.this);
			return { state };
		}
	});
