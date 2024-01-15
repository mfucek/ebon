import { Behavior } from '../Behavior';

export const Age = new Behavior()
	.init(() => {
		return { age: 0 };
	})
	.tick(({ age, delta }) => {
		return { age: age + delta };
	});
