import { test } from 'vitest';
const sum = (a: number, b: number) => a + b;

test('expect init to have value available as parameter in callback', () => {
	// 	const init = Entity.init(() => {
	// 		const value = 5;
	// 		return { value };
	// 	}).init;

	// 	expectTypeOf(init).toBeFunction();
	// 	expectTypeOf(init).toBeFunction().parameter(0).toBeNumber();
	// });

	// const mount = (props: { name: string }) => {
	// 	return props.name;

	function foo(a: number, b: string) {
		return [a, b];
	}

	// expectTypeOf(foo).parameter(0).toBeString();
	// expectTypeOf(foo).parameter(1).toBeString();
});
