import { Behavior } from '../Behavior';

export const Delta = new Behavior<
	{
		delta: number;
	},
	{},
	{},
	{}
>() //
	.init(() => {
		return { delta: 0, age: 0 };
	})
	.tick(({ age, delta }) => {
		return { age: age + delta };
	});
