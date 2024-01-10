import { nanoid } from 'nanoid';
import { Behavior, DefaultState } from '../behavior/Behavior';
import { Scene } from '../scene/Scene';
import { CleanActionDict } from './types/action-helpers';

type FinalInitCallback<State> = (initialState?: Partial<State>) => State;
type FinalTickCallback<State> = (state: State) => Partial<State>;

export class LiveEntity<State extends DefaultState, Actions extends {}> {
	state: State;
	_id = nanoid();

	behavior: Behavior<State, Actions>;
	actions: CleanActionDict<State, Actions> = {} as CleanActionDict<
		State,
		Actions
	>;

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

		const state = {
			...behavior._initCb({
				scene: this.scene,
				this: this as LiveEntity<any, any>
			} as Partial<State>),
			...initialState
		};
		this.state = state;

		// Generate action methods that wrap the behavior's _rawactions by passing in state as the first parameter
		this.actions = this._clean(behavior._rawActions);
	}

	_clean = (rawActions: Actions): CleanActionDict<State, Actions> => {
		const cleanActions = {} as CleanActionDict<State, Actions>;
		for (const key in rawActions) {
			const fn = rawActions[key] as Function;
			cleanActions[key] = ((...args: any) => {
				return fn(this.state, ...args).output;
			}) as any;
		}
		return cleanActions;
	};

	executeTick = (delta: number) => {
		const returnedState = this.tickCallback({
			...this.state,
			delta,
			scene: this.scene,
			this: this
		});

		this.state = {
			...this.state,
			...returnedState,
			delta,
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

	is = (behavior: Behavior<any, any>) => {
		return this.behavior._id === behavior._id;
	};
	has = (behavior: Behavior<any, any>) => {
		return this.behavior._used_ids.includes(behavior._id);
	};
}
