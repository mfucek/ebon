import { Behavior, Transform } from '@/modules/behavior';

export const ApplyTransformToObject = new Behavior() //
	.require(Transform)
	.tick((state) => {
		state.object.position.copy(state.position);
	});
