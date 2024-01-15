import { Behavior } from '../Behavior';
import { Delta } from './Delta';

export const Age = new Behavior()
	.require(Delta)
	.init(() => {
		return { age: 0 };
	})
	.tick(({ age, delta }) => {
		return { age: age + delta };
	});
