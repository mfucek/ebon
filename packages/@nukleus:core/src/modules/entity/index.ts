// ------

// const Skeleton = new Entity()
// 	.init(() => {
// 		const a = 2;
// 		return { a };
// 	})
// 	.init(() => {
// 		const b = 'b';
// 		return { b } as const;
// 	})
// 	.init(({ a, b }) => {
// 		const c = a.toString() + b;
// 		return { c };
// 	})
// 	.tick(({ a, b, c }) => {
// 		return {};
// 	});

// const skeleton = Skeleton.create();

// const a = skeleton.state.b;
// //    ^?

// skeleton.executeTick(1);
