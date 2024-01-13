import { Behavior, Transform } from '@/modules/behavior';
import { ThreeObject } from './ThreeObject';

export const ApplyTransform = new Behavior() //
	.require(Transform)
	.require(ThreeObject)
	.tick(({ object, position, scale, rotation, parent }) => {
		if (!parent) {
			object.position.copy(position);
			object.scale.copy(scale);
			object.rotation.copy(rotation);
			return;
		}

		object.position.copy(parent.state.position).add(position);
		// object.scale.copy(parent.state.scale).multiply(scale);
	});
