import { ThreeObject } from '@/lib/three/behaviors/ThreeObject';
import { Behavior } from '../Behavior';
import { Translation } from './Translation';

export const AbsolutePosition = new Behavior() //
	.require(ThreeObject)
	.use(Translation)
	.tick(({ position, object }) => {
		object.position.copy(position);
	});
