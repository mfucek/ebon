// import { Behaveiour } from '../behaviour';
import { nanoid } from 'nanoid';
import { LiveEntity } from '../entity/LiveEntity';

import { ActionDict, CleanActionDict } from '../entity/types/action-helpers';
import { Scene } from '../scene/Scene';
import { ActionsNewState, Merge } from './test/test-types';

type InitCallback<ExposedProps, NewProps> = (
	state: ExposedProps
) => NewProps | void;

type TickCallback<State> = (oldState: State) => Partial<State> | void;

type FinalInitCallback<State> = (initialState?: Partial<State>) => State;

type FinalTickCallback<State> = (oldState: State) => State;

export class Behavior<
	State extends {},
	Actions extends {},
	RequiredState extends {},
	RequiredActions extends {}
> {
	_initCb: FinalInitCallback<State>;
	_tickCb: FinalTickCallback<State>;

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
	 * @template initFunction - The function to be called when the entity is created.
	 * Init pipes all new initCallbacks into a finalInitCallback, later to be executed on entity instantiation.
	 */
	init = <NewS extends {}>(
		initFunction: (state: Merge<[State, RequiredState]>) => NewS | void
	) => {
		// types
		type MergedS = Merge<[State, NewS]>;
		type MergedA = ActionsNewState<Actions, MergedS>;
		type MergedRS = RequiredState;
		type MergedRA = ActionsNewState<RequiredActions, MergedS>;

		// implementation
		// pipe result of finalInit into initFunction and set as finalInit in new Entity
		const newInit = (initialState?: Partial<State>) => {
			const oldState = this._initCb(initialState) as State & RequiredState;
			const newState = initFunction(oldState);
			const finalState = { ...oldState, ...newState } as MergedS;
			return finalState;
		};

		const newTick = (_state: State & NewS) => {
			const oldState = this._tickCb(_state) as State & NewS;

			const finalState = { ...oldState };
			return finalState;
		};

		return new Behavior<MergedS, MergedA, MergedRS, MergedRA>({
			prevInit: newInit as FinalInitCallback<MergedS>,
			prevTick: newTick as unknown as FinalTickCallback<MergedS>,
			prevActions: this._rawActions as MergedA,
			prevUsedIds: this._used_ids,
			prevCleanupFunctions: this._cleanupFunctions
		});
	};

	/**
	 * Tick defines how an entity's state changes over time. It receives the current state as an argument, as defined by all the init functions.
	 * Tick can be called multiple times to add more state changes.
	 * @template tickFunction - The function to be called when the entity is ticked.
	 * Tick pipes all new tickCallbacks into a finalTickCallback, later to be executed on every frame.
	 */
	tick = (
		tickFunction: // TickCallback<Merge<[State, RequiredState]>>
		(state: Merge<[State, RequiredState]>) => Partial<State> | void
	) => {
		// types
		type MergedS = State;
		type MergedA = Actions;
		type MergedRS = RequiredState;
		type MergedRA = RequiredActions;

		// implementation
		const newTick = (oldState: State) => {
			const state = this._tickCb(oldState);
			const newState = tickFunction({
				...oldState,
				...state
			} as unknown as Merge<[State, RequiredState]>);
			const finalState = { ...oldState, ...state, ...newState };
			return finalState;
		};

		return new Behavior<MergedS, MergedA, MergedRS, MergedRA>({
			prevInit: this._initCb,
			prevTick: newTick,
			prevActions: this._rawActions,
			prevUsedIds: this._used_ids,
			prevCleanupFunctions: this._cleanupFunctions
		});
	};

	_cleanupFunctions = [] as ((state: any) => void)[];

	cleanup = (fn: (state: State) => void) => {
		this._cleanupFunctions.push(fn);
		return this;
	};

	_rawActions: Actions = {} as Actions;
	actions = {} as CleanActionDict<State, Actions>;

	// /**
	//  * Action lets you define a function that can be called from outside the entity.
	//  * @template name - The name of the action.
	//  * @template actionCb - The function to be called when the action is executed.
	//  */
	action = <NewA extends ActionDict<State>>(newRawActions: NewA) => {
		type MergedS = State;
		type MergedA = Merge<[Actions, NewA]>;
		type MergedRS = RequiredState;
		type MergedRA = RequiredActions;

		return new Behavior<MergedS, MergedA, MergedRS, MergedRA>({
			prevInit: this._initCb,
			prevTick: this._tickCb,
			prevActions: { ...this._rawActions, ...newRawActions },
			prevUsedIds: this._used_ids,
			prevCleanupFunctions: this._cleanupFunctions
		});
	};

	/**
	 * Use lets you use another entity's init and tick functions.
	 * @template newBeh - The entity to be used.
	 */
	use = <
		NewS extends {},
		NewA extends ActionDict<NewS>,
		NewRS extends {},
		NewRA extends ActionDict<NewS>,
		CastActions = ActionsNewState<Actions, {}>,
		CastNewActions = ActionsNewState<NewRA, {}>
	>(
		newBeh: State extends NewRS
			? ActionsNewState<Actions, {}> extends ActionsNewState<NewRA, {}>
				? Behavior<NewS, NewA, NewRS, NewRA>
				: "The current behavior does not satisfy the new behavior' requirements! (Actions) Please check your console for more details."
			: "The current behavior does not satisfy the new behavior' requirements! (State) Please check your console for more details."
	) => {
		const _newBeh = newBeh as unknown as Behavior<NewS, NewA, NewRS, NewRA>;

		// types
		type MergedS = Merge<[State, NewS]>;
		type MergedA = ActionsNewState<Merge<[Actions, NewA]>, MergedS>; // Merge<[Actions, NewA]>;
		type MergedRS = {}; // RequiredState;
		type MergedRA = {}; // RequiredActions;

		// implementation
		const newInit = (initialState?: Partial<State & NewS>) => {
			const oldState = this._initCb(initialState);
			const newState = _newBeh._initCb(oldState as unknown as NewS);

			const finalState = { ...oldState, ...newState };
			return finalState;
		};

		const newTick = (oldState: State & NewS) => {
			const state = this._tickCb(oldState);
			const newState = _newBeh._tickCb({ ...oldState, ...state });

			const finalState = { ...oldState, ...state, ...newState };
			return finalState;
		};

		return new Behavior<MergedS, MergedA, MergedRS, MergedRA>({
			prevInit: newInit as FinalInitCallback<MergedS>,
			prevTick: newTick as unknown as FinalTickCallback<MergedS>,
			prevActions: { ...this._rawActions, ..._newBeh._rawActions } as MergedA,
			prevUsedIds: [...this._used_ids, _newBeh._id],
			prevCleanupFunctions: this._cleanupFunctions
		});
	};

	/**
	 * Require lets you require another entity's state. The later init and tick functions will receive the required state as it was defined by the required entity.
	 * Require can be called multiple times to add more required states.
	 * The require method is used to enforce that when this behavior is used on another, that the other behavior has the required state.
	 * @param newBeh - The behavior to be required.
	 * @returns
	 */
	require = <
		NewS extends {},
		NewA extends ActionDict<NewS>,
		NewRS extends {},
		NewRA extends ActionDict<NewS>
	>(
		newBeh: Behavior<NewS, NewA, NewRS, NewRA>
	) => {
		type MergedS = Merge<[State, NewRS, NewS]>;
		type MergedA = ActionsNewState<
			Merge<[Actions, NewRA, NewA]>,
			Merge<[MergedS, MergedRS]>
		>;
		type MergedRS = Merge<[RequiredState, NewS]>;
		type MergedRA = ActionsNewState<
			Merge<[RequiredActions, NewA]>,
			Merge<[MergedS, MergedRS]>
		>;
		// type MergedS = State & NewRS & NewS;
		// type MergedRS = Omit<RequiredState, keyof NewS> & NewS;

		return this as unknown as Behavior<MergedS, MergedA, MergedRS, MergedRA>;
	};

	create = (scene: Scene, initialState?: Partial<State>) => {
		const liveObject = new LiveEntity(scene, this, initialState);
		scene.addLiveEntity(liveObject as LiveEntity<any, any>);
		return liveObject as LiveEntity<State, Actions>;
	};
}
