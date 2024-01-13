import { nanoid } from 'nanoid';
import { Behavior, GetActions, GetState } from '../behavior/Behavior';
import { Delta } from '../behavior/behaviors/Delta';
import { Scene } from '../scene/Scene';
import { CleanActionDict } from './types/action-helpers';

type FinalInitCallback<State> = (initialState?: Partial<State>) => State;
type FinalTickCallback<State> = (state: State) => Partial<State>;

export class LiveEntity<State extends {}, Actions extends {}> {
	state: State;
	_id = nanoid();

	behavior: Behavior<State, Actions>;
	actions: CleanActionDict<State, Actions> = {} as CleanActionDict<
		State,
		Actions
	>;
	_rawActions: Actions = {} as Actions;

	private tickCallback: FinalTickCallback<State>;

	private scene: Scene;

	constructor(
		scene: Scene,
		behavior: Behavior<State, Actions>,
		initialState?: Partial<State>
	) {
		this.tickCallback = behavior._tickCb;

		// Execute initialization
		this.scene = scene;
		this.behavior = behavior;
		this._rawActions = behavior._rawActions;

		const state = {
			...behavior._initCb({
				scene: this.scene,
				this: this
			} as unknown as Partial<State>),
			...initialState
		};
		this.state = state;

		// Generate action methods that wrap the behavior's _rawactions by passing in state as the first parameter
		this.actions = this._clean(behavior._rawActions) as CleanActionDict<
			GetState<typeof behavior>,
			GetActions<typeof behavior>
		>;
	}

	_clean = (rawActions: Actions): CleanActionDict<State, Actions> => {
		const cleanActions = {} as CleanActionDict<State, Actions>;
		for (const key in rawActions) {
			const fn = rawActions[key] as Function;
			cleanActions[key] = ((...args: any) => {
				return fn(this.state, ...args).output;
			}) as any;
		}
		return cleanActions as CleanActionDict<State, Actions>;
	};

	executeTick = (stateOverride: GetState<typeof Delta> & { scene: Scene }) => {
		const returnedState = this.tickCallback({
			...this.state,
			delta: stateOverride.delta,
			scene: this.scene,
			this: this
		});

		this.state = {
			...this.state,
			...returnedState,
			delta: stateOverride.delta,
			scene: this.scene,
			this: this
		};
		// Merge returned state with current state
		// for (const key in returnedState) {
		// 	this.state[key] = returnedState[key];
		// }
	};

	destroy = () => {
		this.behavior._cleanupFunctions.forEach((fn) => {
			fn(this.state);
		});
		// remove from scene
		this.scene.entities.remove(this);
	};

	is = <B extends Behavior<any, any>>(behavior: B) => {
		if (this.behavior._id !== behavior._id) {
			return false;
		}
		// @TODO fix unknown type
		return this as unknown as LiveEntity<GetState<B>, GetActions<B>>;
	};
	has = <B extends Behavior<any, any>>(behavior: B) => {
		// return this.behavior._used_ids.includes(behavior._id);
		if (!this.behavior._used_ids.includes(behavior._id)) {
			return false;
		}
		// @TODO fix unknown type
		return this as unknown as LiveEntity<GetState<B>, GetActions<B>>;
	};
}

export const initialVal = new Behavior() //
	.init(() => {
		return { val: 1 };
	})
	.action({
		log: (state) => {
			return { state, output: state.val };
		}
	});

const overrideVal = new Behavior() //
	.init(() => {
		return { val: '2' };
	});

const relbeh = new Behavior() //
	.require(overrideVal)
	.tick(({ val }) => {
		val;
		//^?
	});

const Child = new Behavior() //
	.use(initialVal)
	.tick(({ val }) => {
		val;
		//^?
	})
	.use(relbeh)
	.tick(({ val }) => {
		val;
		//^?
	})
	.action({
		test: (state, a: number) => {
			return { state, output: a };
		}
	});

const le = Child.create(new Scene());

le._rawActions.log;
//             ^?

le.actions.log;
//         ^?

le.state.val;
//       ^?

// const le2 = Child.create(new Scene());
// le2.actions.test(2);
// le2._rawActions.test({val: 2}, 2)

// type A = GetActions<typeof Child>;
// const a2 = {} as A;

// type B = CleanActionDict<GetState<typeof Child>, A>;
