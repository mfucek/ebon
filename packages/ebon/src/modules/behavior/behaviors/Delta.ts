import { Behavior } from '../Behavior';

export const Delta = new Behavior<
	{
		delta: number;
	},
	{},
	{}
>() //
	.init(() => {
		return { delta: 0 };
	});
