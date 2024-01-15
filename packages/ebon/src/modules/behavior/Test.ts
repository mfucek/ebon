/**
 * Merge two object types together, but override the second type with the first type.
 */
type Merge<A, B> = Omit<A, keyof B> & B;
type MergeExample = Merge<{ a: 2; b: 3 }, { a: 1 }>;

/**
 * Get the subset of State that is required by Required.
 */
type Subset<State, Required> = State extends Required ? State : never;
type SubsetExample = Subset<{ a: 2; b: 3 }, { a: 2 }>;

class Beh<State extends {}, RequiredState extends {}> {
	constructor() {}

	// @TODO: The use method should throw a type error if the used behavior requires state that is not present in the current behavior.

	// If Typescript allowed this syntax it would look like this:
	// use = <NewS extends {}, S extends NewRS>(oldTest: Beh<NewS, NewRS>) => {

	/**
	 * Use lets you use another entity's init and tick functions.
	 * @template newBeh - The new behavior to be used.
	 */
	use = <NewS extends {}, NewRS extends {}>(
		newBeh: State extends NewRS ? Beh<NewS, NewRS> : 'neki string'
	) => {
		type MergedS = Merge<State, NewS>;
		type MergedRS = {};

		return new Beh<MergedS, MergedRS>();

		// This commented out approach returned never if the Limiter was not satisfied.
		// type O = S extends NewRS ? Beh<MergedS, MergedRS> : never;
		// return newBeh as unknown as O;
	};

	/**
	 * Init lets you define the initial states of an entity.
	 * Init can be called multiple times to add more initial states or refine existing ones.
	 * @template newCallback - The function to be called when the entity is created.
	 * Init pipes all new initCallbacks into a finalInitCallback, later to be executed on entity instantiation.
	 */
	init = <NewS extends {}>(
		initFunction: (state: State & RequiredState) => NewS | void
	) => {
		type MergedS = State & NewS;

		return new Beh<MergedS, RequiredState>();
	};

	/**
	 * Tick defines how an entity's state changes over time. It receives the current state as an argument, as defined by all the init functions.
	 * Tick can be called multiple times to add more state changes.
	 * @template newCallback - The function to be called when the entity is ticked.
	 * Tick pipes all new tickCallbacks into a finalTickCallback, later to be executed on every frame.
	 */
	tick = (
		tickFunction: (state: State & RequiredState) => Partial<State> | void
	) => {
		return this;
	};

	/**
	 * Require lets you require another entity's state. The later init and tick functions will receive the required state as it was defined by the required entity.
	 * Require can be called multiple times to add more required states.
	 * The require method is used to enforce that when this behavior is used on another, that the other behavior has the required state.
	 * @param newBeh - The behavior to be required.
	 * @returns
	 */
	require = <NewS extends {}, NewRS extends {}>(newBeh: Beh<NewS, NewRS>) => {
		type MergedS = State & NewRS & NewS;
		type MergedRS = Omit<RequiredState, keyof NewS> & NewS;

		return newBeh as unknown as Beh<MergedS, MergedRS>;
	};
}

/// -------------------------------------------------------

const Position = new Beh() //
	.init(() => ({ position: { x: 0, y: 0, z: 0 } }));

const Velocity = new Beh() //
	.require(Position)
	.init(() => ({ velocity: { x: 0, y: 0, z: 0 } }))
	.tick((state) => {
		state.position.x += state.velocity.x;
		state.position.y += state.velocity.y;
		state.position.z += state.velocity.z;
	});

const EmptyObject = new Beh() //
	.init(() => ({ object: { position: { x: 0, y: 0, z: 0 } } }));

const MeshObject = new Beh() //
	.use(EmptyObject)
	.init(({ object }) => ({ object: { ...object, mesh: "hello I'm a mesh!" } }));

const MapPositionToObject = new Beh() // needs position so it can map it to mesh
	.require(Position)
	.require(EmptyObject)
	.tick((state) => {
		state.object.position.x = state.position.x;
		state.object.position.y = state.position.y;
		state.object.position.z = state.position.z;
	});

const StateBehavior = new Beh() //
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

const playerIsNear = false;
const ChangeStateIfPlayerIsNear = new Beh() //
	.require(StateBehavior)
	.require(Position)
	.tick((state) => {
		if (playerIsNear) {
			state.current_state = 'follow_player';
		}
	});

/// -------------------------------------------------------

const CompleteObject = new Beh() // position -> velocity -> mesh -> map position to mesh
	.use(StateBehavior)
	.use(Position)
	.use(Velocity)
	.use(EmptyObject)
	.use(MapPositionToObject);

const ObjectWithMissingObject = new Beh() // object is missing so MapPositionToObject should throw a typeerror on the parameter.
	// .require(MeshObject)
	.use(Position)
	// @ts-expect-error
	.use(MapPositionToObject); // this should fail because object is missing from state.

const ObjectWithCustomPosition = new Beh() // position is custom but still has x, y, z properties, and should pass.
	.init(() => ({ position: { x: 0, y: 0, z: 0 } }))
	.require(EmptyObject) // this shold pass
	.use(MapPositionToObject);

const ObjectWithCustomPositionButMissingZProperty = new Beh() // position is custom but missing z property, and should fail.
	.init(() => ({ position: { x: 0, y: 0 } }))
	.require(EmptyObject)
	// @ts-expect-error
	.use(MapPositionToObject); // this should fail because position is missing z property

/// -------------------------------------------------------

// Example of how these behaviors would be used in a game engine:

// const scene = new Scene()
// const player = CompleteObject.create(scene);
// CompleteObject.create(scene);

// the create method on Behavior would return a "LiveEntity" object with executeInit & executeTick methods
// Only the "LiveEntity" object would contain an actual state object, where the state before was only a type.

// and then the scene would call player.executeInit() on instantiation, and player.executeTick() every frame.
