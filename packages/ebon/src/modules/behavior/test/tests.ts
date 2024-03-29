import { _Behavior } from './_Behavior';

const EmptyBehavior = new _Behavior<{}, {}, {}, {}>();

const Position = new _Behavior() //
	.init(() => ({ position: { x: 0, y: 0, z: 0 } }))
	.action({
		hello: (state, message: string) => ({ state: {}, output: 5 })
	});

Position._rawActions.hello;

Position.actions.hello('asd');

Position.actions.hello(
	// @ts-expect-error
	213
);

// @ts-expect-error
Position._rawActions.hello({ position: { x: 0, y: 0, z: 0 } });

// --------------------------------------------------

const TestPositionUse = new _Behavior() //
	.use(Position);

TestPositionUse._rawActions.hello({ position: { x: 0, y: 0, z: 0 } }, 'asd');

TestPositionUse._rawActions.hello(
	{ position: { x: 0, y: 0, z: 0 } },
	// @ts-expect-error
	213
);

// @ts-expect-error
TestPositionUse._rawActions.hello({ position: { x: 0, y: 0, z: 0 } });

// --------------------------------------------------

const TestPositionRequire = new _Behavior() //
	.require(Position);

TestPositionRequire._rawActions.hello(
	{ position: { x: 0, y: 0, z: 0 } },
	'asd'
);

TestPositionRequire._rawActions.hello(
	{ position: { x: 0, y: 0, z: 0 } },
	// @ts-expect-error
	213
);

// @ts-expect-error
TestPositionRequire._rawActions.hello({ position: { x: 0, y: 0, z: 0 } });

// --------------------------------------------------

const TestPositionUseUse = new _Behavior() //
	.use(Position)
	.use(EmptyBehavior);

TestPositionUseUse._rawActions.hello({ position: { x: 0, y: 0, z: 0 } }, 'asd');

TestPositionUseUse._rawActions.hello(
	{ position: { x: 0, y: 0, z: 0 } },
	// @ts-expect-error
	213
);

// @ts-expect-error
TestPositionUseUse._rawActions.hello({ position: { x: 0, y: 0, z: 0 } });

// --------------------------------------------------

const TestPositionRequireUse = new _Behavior() //
	.require(Position)
	.use(EmptyBehavior);

TestPositionRequireUse._rawActions.hello(
	{ position: { x: 0, y: 0, z: 0 } },
	'asd'
);

TestPositionRequireUse._rawActions.hello(
	{ position: { x: 0, y: 0, z: 0 } },
	// @ts-expect-error
	213
);

// @ts-expect-error
TestPositionRequireUse._rawActions.hello({ position: { x: 0, y: 0, z: 0 } });

// --------------------------------------------------

const TestPositionRequireRequire = new _Behavior() //
	.require(Position)
	.require(EmptyBehavior);

TestPositionRequireRequire._rawActions.hello(
	{ position: { x: 0, y: 0, z: 0 } },
	'asd'
);

TestPositionRequireRequire._rawActions.hello(
	{ position: { x: 0, y: 0, z: 0 } },
	// @ts-expect-error
	213
);

// @ts-expect-error
TestPositionRequireRequire._rawActions.hello({
	position: { x: 0, y: 0, z: 0 }
});

// --------------------------------------------------

const Velocity = new _Behavior() //
	.require(Position)
	.init(() => ({ velocity: { x: 0, y: 0, z: 0 } }))
	.tick((state) => {
		state.position.x += state.velocity.x;
		state.position.y += state.velocity.y;
		state.position.z += state.velocity.z;
	});

const EmptyObject = new _Behavior() //
	.init(() => ({ object: { position: { x: 0, y: 0, z: 0 } } }));

const MapPositionToObject = new _Behavior() // needs position so it can map it to mesh
	.require(Position)
	.require(EmptyObject);
// .tick((state) => {
// 	state.object.position.x = state.position.x;
// 	state.object.position.y = state.position.y;
// 	state.object.position.z = state.position.z;
// });

const StateBehavior = new _Behavior() //
	.init(
		() =>
			({ current_state: 'idle' } as { current_state: 'idle' | 'follow_player' })
	)
	.tick((state) => {
		if (state.current_state === 'idle') {
			// do idle stuff
		}
		if (state.current_state === 'follow_player') {
			// do follow player stuff
		}
	});

/// -------------------------------------------------------------------------

const CompleteWorkingTest = new _Behavior()
	.use(Position)
	.use(EmptyObject)
	.use(StateBehavior)
	.use(Velocity)
	.use(MapPositionToObject);

CompleteWorkingTest._rawActions.hello(
	{
		object: { position: { x: 0, y: 0, z: 0 } },
		position: { x: 0, y: 0, z: 0 },
		current_state: 'idle',
		velocity: {
			x: 0,
			y: 0,
			z: 0
		}
	},
	'asd'
);
CompleteWorkingTest.actions.hello(
	// @ts-expect-error
	213
);
// @ts-expect-error
CompleteWorkingTest._rawActions.hello({
	object: { position: { x: 0, y: 0, z: 0 } }
});

const MissingObjectErrorTest = new _Behavior()
	// .use(MeshObject)
	.use(Position)
	// @ts-expect-error
	.use(MapPositionToObject); // this should fail because object is missing from state.

const CustomObjectTestWorking = new _Behavior() // position is custom but still has x, y, z properties, and should pass.
	.init(() => ({ position: { x: 0, y: 0, z: 0 } }))
	.action({
		hello: (state, message: string) => ({ state, output: 5 })
	})
	.use(EmptyObject)
	.use(MapPositionToObject);

const CustomObjectMissingPropertyErrorTest = new _Behavior() // position is custom but missing z property, and should fail.
	.init(() => ({ position: { x: 0, y: 0 } }))
	.action({
		hello: (state, message: string) => ({ state, output: 5 })
	})
	.use(EmptyObject)
	// @ts-expect-error
	.use(MapPositionToObject); // this should fail because position is missing z property

const CustomObjectMissingActionErrorTest = new _Behavior() // position is custom but missing z property, and should fail.
	.init(() => ({ position: { x: 0, y: 0, z: 0 } }))
	.use(EmptyObject)
	// @ts-expect-error
	.use(MapPositionToObject); // this should fail because position is missing z property

const Position2 = new _Behavior() //
	.init(() => ({ position: { x: 0, y: 0, z: 0 } }))
	.action({
		hello: (state, message: string) => ({
			state: {},
			output: 5
		})
	});

const TestGood = new _Behavior() //
	.use(Position2)
	.use(
		new _Behavior<
			//
			{},
			{},
			{},
			{}
		>()
	);

TestGood._rawActions.hello({ position: { x: 0, y: 0, z: 0 } }, 'asd');

TestGood._rawActions.hello(
	{ position: { x: 0, y: 0, z: 0 } },
	// @ts-expect-error
	213
);

const TestBad = new _Behavior() //
	.use(Position2)
	.use(new _Behavior());

TestBad._rawActions.hello({ position: { x: 0, y: 0, z: 0 } }, 'asd');

TestBad._rawActions.hello(
	{ position: { x: 0, y: 0, z: 0 } },
	// @ts-expect-error
	213
);

// --------------------------------------------------

const OneProp = new _Behavior() //
	.init(() => ({ a: 0 }))
	.init(() => ({ b: 0 }));

const Test = new _Behavior() //
	.require(OneProp)
	.init(() => ({ a: 'a' }));

const OverrideProp = new _Behavior() //
	.use(OneProp)
	.use(Test)
	.tick((state) => {
		state.a;
	})
	.init((state) => {
		return { newA: state.a };
	})
	.tick((state) => {
		state.a;
		state.newA;
	})
	// .actions({
	// 	test: (state, a: number) => ({ state, output: 5 })
	// })
	.init(() => ({ focus: null as null | number }))
	.action({
		focus: (state, newFocus: number | null) => ({ state, output: newFocus })
	});

const Camera = new _Behavior() //
	.init(() => ({ focus: null as null | number }))
	.action({
		focus: (state, newFocus: number | null) => ({ state, output: newFocus })
	});
