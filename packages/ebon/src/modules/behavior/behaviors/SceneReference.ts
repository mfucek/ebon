import { LiveEntity } from '@/modules/entity/LiveEntity';
import { Scene } from '@/modules/scene/Scene';
import { Behavior } from '../Behavior';

export const SceneReference = new Behavior<
	{
		scene: Scene;
		this: LiveEntity<{}, {}>;
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

export const imperativeThisReference = <S extends {}, A extends {}>(
	thisBeh: Behavior<S, A, any, any>
) => {
	const SceneReference = new Behavior<
		{
			scene: Scene;
			this: LiveEntity<S, A>;
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
	return SceneReference;
};
