// import { Behavior } from '../Behavior';

// const EmptyBehavior = new Behavior<{}, {}, {}, {}>();

// const Position = new Behavior() //
// 	.init(() => ({ position: { x: 0, y: 0, z: 0 } }))
// 	.action({
// 		hello: (state, message: string) => ({ state: {}, output: 5 })
// 	});

// Position._rawActions.hello;

// Position.actions.hello('asd');

// Position.actions.hello(
// 	// @ts-expect-error
// 	213
// );

// // @ts-expect-error
// Position._rawActions.hello({ position: { x: 0, y: 0, z: 0 } });

// // --------------------------------------------------

// const TestPositionUse = new Behavior() //
// 	.use(Position);

// TestPositionUse._rawActions.hello({ position: { x: 0, y: 0, z: 0 } }, 'asd');

// TestPositionUse._rawActions.hello(
// 	{ position: { x: 0, y: 0, z: 0 } },
// 	// @ts-expect-error
// 	213
// );

// // @ts-expect-error
// TestPositionUse._rawActions.hello({ position: { x: 0, y: 0, z: 0 } });

// // --------------------------------------------------

// const TestPositionRequire = new Behavior() //
// 	.require(Position);

// TestPositionRequire._rawActions.hello(
// 	{ position: { x: 0, y: 0, z: 0 } },
// 	'asd'
// );

// TestPositionRequire._rawActions.hello(
// 	{ position: { x: 0, y: 0, z: 0 } },
// 	// @ts-expect-error
// 	213
// );

// // @ts-expect-error
// TestPositionRequire._rawActions.hello({ position: { x: 0, y: 0, z: 0 } });

// // --------------------------------------------------

// const TestPositionUseUse = new Behavior() //
// 	.use(Position)
// 	.use(EmptyBehavior);

// TestPositionUseUse._rawActions.hello({ position: { x: 0, y: 0, z: 0 } }, 'asd');

// TestPositionUseUse._rawActions.hello(
// 	{ position: { x: 0, y: 0, z: 0 } },
// 	// @ts-expect-error
// 	213
// );

// // @ts-expect-error
// TestPositionUseUse._rawActions.hello({ position: { x: 0, y: 0, z: 0 } });

// // --------------------------------------------------

// const TestPositionRequireUse = new Behavior() //
// 	.require(Position)
// 	.use(EmptyBehavior);

// TestPositionRequireUse._rawActions.hello(
// 	{ position: { x: 0, y: 0, z: 0 } },
// 	'asd'
// );

// TestPositionRequireUse._rawActions.hello(
// 	{ position: { x: 0, y: 0, z: 0 } },
// 	// @ts-expect-error
// 	213
// );

// // @ts-expect-error
// TestPositionRequireUse._rawActions.hello({ position: { x: 0, y: 0, z: 0 } });

// // --------------------------------------------------

// const TestPositionRequireRequire = new Behavior() //
// 	.require(Position)
// 	.require(EmptyBehavior);

// TestPositionRequireRequire._rawActions.hello(
// 	{ position: { x: 0, y: 0, z: 0 } },
// 	'asd'
// );

// TestPositionRequireRequire._rawActions.hello(
// 	{ position: { x: 0, y: 0, z: 0 } },
// 	// @ts-expect-error
// 	213
// );

// // @ts-expect-error
// TestPositionRequireRequire._rawActions.hello({
// 	position: { x: 0, y: 0, z: 0 }
// });

// // --------------------------------------------------

// const Velocity = new Behavior() //
// 	.require(Position)
// 	.init(() => ({ velocity: { x: 0, y: 0, z: 0 } }))
// 	.tick((state) => {
// 		state.position.x += state.velocity.x;
// 		state.position.y += state.velocity.y;
// 		state.position.z += state.velocity.z;
// 	});

// const EmptyObject = new Behavior() //
// 	.init(() => ({ object: { position: { x: 0, y: 0, z: 0 } } }));

// const MapPositionToObject = new Behavior() // needs position so it can map it to mesh
// 	.require(Position)
// 	.require(EmptyObject);
// // .tick((state) => {
// // 	state.object.position.x = state.position.x;
// // 	state.object.position.y = state.position.y;
// // 	state.object.position.z = state.position.z;
// // });

// const StateBehavior = new Behavior() //
// 	.init(
// 		() =>
// 			({ current_state: 'idle' } as { current_state: 'idle' | 'follow_player' })
// 	)
// 	.tick((state) => {
// 		if (state.current_state === 'idle') {
// 			// do idle stuff
// 		}
// 		if (state.current_state === 'follow_player') {
// 			// do follow player stuff
// 		}
// 	});

// /// -------------------------------------------------------------------------

// const CompleteWorkingTest = new Behavior()
// 	.use(Position)
// 	.use(EmptyObject)
// 	.use(StateBehavior)
// 	.use(Velocity)
// 	.use(MapPositionToObject);

// CompleteWorkingTest._rawActions.hello(
// 	{
// 		object: { position: { x: 0, y: 0, z: 0 } },
// 		position: { x: 0, y: 0, z: 0 },
// 		current_state: 'idle',
// 		velocity: {
// 			x: 0,
// 			y: 0,
// 			z: 0
// 		}
// 	},
// 	'asd'
// );
// CompleteWorkingTest.actions.hello(
// 	// @ts-expect-error
// 	213
// );
// // @ts-expect-error
// CompleteWorkingTest._rawActions.hello({
// 	object: { position: { x: 0, y: 0, z: 0 } }
// });

// const MissingObjectErrorTest = new Behavior()
// 	// .use(MeshObject)
// 	.use(Position)
// 	// @ts-expect-error
// 	.use(MapPositionToObject); // this should fail because object is missing from state.

// const CustomObjectTestWorking = new Behavior() // position is custom but still has x, y, z properties, and should pass.
// 	.init(() => ({ position: { x: 0, y: 0, z: 0 } }))
// 	.action({
// 		hello: (state, message: string) => ({ state, output: 5 })
// 	})
// 	.use(EmptyObject)
// 	.use(MapPositionToObject);

// const CustomObjectMissingPropertyErrorTest = new Behavior() // position is custom but missing z property, and should fail.
// 	.init(() => ({ position: { x: 0, y: 0 } }))
// 	.action({
// 		hello: (state, message: string) => ({ state, output: 5 })
// 	})
// 	.use(EmptyObject)
// 	// @ts-expect-error
// 	.use(MapPositionToObject); // this should fail because position is missing z property

// const CustomObjectMissingActionErrorTest = new Behavior() // position is custom but missing z property, and should fail.
// 	.init(() => ({ position: { x: 0, y: 0, z: 0 } }))
// 	.use(EmptyObject)
// 	// @ts-expect-error
// 	.use(MapPositionToObject); // this should fail because position is missing z property

// const Position2 = new Behavior() //
// 	.init(() => ({ position: { x: 0, y: 0, z: 0 } }))
// 	.action({
// 		hello: (state, message: string) => ({
// 			state: {},
// 			output: 5
// 		})
// 	});

// const TestGood = new Behavior() //
// 	.use(Position2)
// 	.use(
// 		new Behavior<
// 			//
// 			{},
// 			{},
// 			{},
// 			{}
// 		>()
// 	);

// TestGood._rawActions.hello({ position: { x: 0, y: 0, z: 0 } }, 'asd');

// TestGood._rawActions.hello(
// 	{ position: { x: 0, y: 0, z: 0 } },
// 	// @ts-expect-error
// 	213
// );

// const TestBad = new Behavior() //
// 	.use(Position2)
// 	.use(new Behavior());

// TestBad._rawActions.hello({ position: { x: 0, y: 0, z: 0 } }, 'asd');

// TestBad._rawActions.hello(
// 	{ position: { x: 0, y: 0, z: 0 } },
// 	// @ts-expect-error
// 	213
// );

// // --------------------------------------------------

// const OneProp = new Behavior() //
// 	.init(() => ({ a: 0 }))
// 	.init(() => ({ b: 0 }));

// const Test = new Behavior() //
// 	.require(OneProp)
// 	.init(() => ({ a: 'a' }));

// const OverrideProp = new Behavior() //
// 	.use(OneProp)
// 	.use(Test)
// 	.tick((state) => {
// 		state.a;
// 	})
// 	.init((state) => {
// 		return { newA: state.a };
// 	})
// 	.tick((state) => {
// 		state.a;
// 		state.newA;
// 	})
// 	.action({
// 		test: (state, a: number) => ({ state, output: 5 })
// 	});
