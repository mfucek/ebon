import { Behavior, Transform } from '@/modules/behavior';
import { EmptyObject } from './EmptyObject';

export const ApplyTransformToObject = new Behavior() //
	.require(Transform)
	.require(EmptyObject)
	.tick((state) => {
		state.object.position.copy(state.position);
	});
