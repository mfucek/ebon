import { nanoid } from 'nanoid';
import { LiveEntity } from '../entity/LiveEntity';
import {
	FinalInitCallback,
	FinalTickCallback,
	InitCallback,
	TickCallback
} from '../entity/types/Callback';
import { ActionDict } from '../entity/types/action-helpers';
import { Scene } from '../scene/Scene';

export class Behavior<State extends {}, Actions extends {}> {
	_initCb: FinalInitCallback<State>;
	_tickCb: FinalTickCallback<State>;

	_rawActions: Actions = {} as Actions;

	_cleanupFunctions = [] as ((state: State) => void)[];

	_id = nanoid();
	_used_ids: string[] = [];

	constructor(previousProps?: {
		prevInit: FinalInitCallback<State>;
		prevTick: FinalTickCallback<State>;
		prevActions: Actions;
		prevUsedIds: string[];
		prevCleanupFunctions: ((state: State) => void)[];
	}) {
		// blank entity
		if (!previousProps) {
			const blankInit: FinalInitCallback<State> = (initialState) => {
				return initialState as State;
			};
			const blankTick: FinalTickCallback<State> = (oldState) => {
				return oldState;
			};
			this._initCb = blankInit;
			this._tickCb = blankTick;
			this._rawActions = {} as Actions;
			this._used_ids = [this._id];
			return this;
		}

		// recursive call
		this._initCb = previousProps.prevInit;
		this._tickCb = previousProps.prevTick;
		this._rawActions = previousProps.prevActions;
		this._used_ids = [...previousProps.prevUsedIds, this._id];
	}

	/**
	 * Init lets you define the initial states of an entity.
	 * Init can be called multiple times to add more initial states or refine existing ones.
	 * @template newCallback - The function to be called when the entity is created.
	 */
	init = <NewState extends {}>(newCallback: InitCallback<State, NewState>) => {
		// pipe result of finalInit into newCallback and set as finalInit in new Entity
		const newInit = (initialState?: Partial<State>) => {
			const oldState = this._initCb(initialState);
			const newState = newCallback(oldState);
			const finalState = { ...oldState, ...newState } as State & NewState;
			return finalState;
		};

		const newTick = (_state: State & NewState) => {
			const oldState = this._tickCb(_state) as State & NewState;

			const finalState = { ...oldState };
			return finalState;
		};

		return new Behavior<State & NewState, Actions>({
			prevInit: newInit,
			prevTick: newTick,
			prevActions: this._rawActions,
			prevUsedIds: this._used_ids,
			prevCleanupFunctions: this._cleanupFunctions
		});
	};

	/**
	 * Tick defines how an entity's state changes over time. It receives the current state as an argument, as defined by all the init functions.
	 * Tick can be called multiple times to add more state changes.
	 * @template newCallback - The function to be called when the entity is ticked.
	 */
	tick = (newCallback: TickCallback<State>) => {
		const newTick = (oldState: State) => {
			const state = this._tickCb(oldState);
			const newState = newCallback({ ...oldState, ...state });
			const finalState = { ...oldState, ...state, ...newState };
			return finalState;
		};

		return new Behavior<State, Actions>({
			prevInit: this._initCb,
			prevTick: newTick,
			prevActions: this._rawActions,
			prevUsedIds: this._used_ids,
			prevCleanupFunctions: this._cleanupFunctions
		});
	};

	// use implies a new init, which means new static type for internal state
	/**
	 * Use lets you use another entity's init and tick functions.
	 * @template ent - The entity to be used.
	 */
	use = <NewState extends {}, NewActions extends {}>(
		ent: Behavior<NewState, NewActions>
	) => {
		const newInit = (initialState?: Partial<State & NewState>) => {
			const oldState = this._initCb(initialState);
			const newState = ent._initCb(oldState as unknown as NewState);

			const finalState = { ...oldState, ...newState };
			return finalState;
		};

		const newTick = (oldState: State & NewState) => {
			const state = this._tickCb(oldState);
			const newState = ent._tickCb({ ...oldState, ...state });

			const finalState = { ...oldState, ...state, ...newState };
			return finalState;
		};

		type MergedActions = Omit<Actions, keyof NewActions> & NewActions;
		// type MergedActions = Actions & NewActions;
		type MergedState = State & NewState;

		return new Behavior<MergedState, MergedActions>({
			prevInit: newInit,
			prevTick: newTick,
			prevActions: { ...this._rawActions, ...ent._rawActions },
			prevUsedIds: [...this._used_ids, ent._id],
			prevCleanupFunctions: this._cleanupFunctions
		});
	};

	// /**
	//  * Action lets you define a function that can be called from outside the entity.
	//  * @template name - The name of the action.
	//  * @template actionCb - The function to be called when the action is executed.
	//  */
	action = <NewActions extends ActionDict<State>>(rawActions: NewActions) => {
		type MergedActions = Omit<Actions, keyof NewActions> & NewActions;
		// type MergedActions = Actions & NewActions;

		return new Behavior<State, MergedActions>({
			prevInit: this._initCb,
			prevTick: this._tickCb,
			prevActions: { ...this._rawActions, ...rawActions },
			prevUsedIds: this._used_ids,
			prevCleanupFunctions: this._cleanupFunctions
		});
	};

	cleanup = (fn: (state: State) => void) => {
		this._cleanupFunctions.push(fn);
		return this;
	};

	require = <RequiredState extends {}, RequiredActions extends {}>(
		behavior: Behavior<RequiredState, RequiredActions>
	) => {
		return new Behavior<State & RequiredState, Actions & RequiredActions>({
			prevInit: this._initCb as FinalInitCallback<State & RequiredState>,
			prevTick: this._tickCb as unknown as FinalTickCallback<
				State & RequiredState
			>,
			prevActions: this._rawActions as Actions & RequiredActions,
			prevUsedIds: this._used_ids,
			prevCleanupFunctions: this._cleanupFunctions
		});
	};

	create = (scene: Scene, initialState?: Partial<State>) => {
		const liveObject = new LiveEntity(scene, this, initialState);
		scene.addLiveEntity(liveObject as LiveEntity<any, any>);
		return liveObject as LiveEntity<State, Actions>;
	};
}

type GetStateFromBehavior<B extends Behavior<any, any>> = B extends Behavior<
	infer S,
	any
>
	? S
	: never;
type GetStateFromLiveEntity<B extends LiveEntity<any, any>> =
	B extends LiveEntity<infer S, any> ? S : never;

export type GetState<B> = B extends Behavior<any, any>
	? GetStateFromBehavior<B>
	: B extends LiveEntity<any, any>
	? GetStateFromLiveEntity<B>
	: never;

export type GetActions<B extends Behavior<any, any>> = B extends Behavior<
	any,
	infer A
>
	? A
	: never;
