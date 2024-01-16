// import { Behaveiour } from '../behaviour';
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

export class Behavior<
	State extends {},
	Actions extends {},
	RequiredState extends {},
	RequiredActions extends {}
> {
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
	 * Init pipes all new initCallbacks into a finalInitCallback, later to be executed on entity instantiation.
	 */
	init = <NewS extends {}>(newCallback: InitCallback<State, NewS>) => {
		// pipe result of finalInit into newCallback and set as finalInit in new Entity
		const newInit = (initialState?: Partial<State>) => {
			const oldState = this._initCb(initialState);
			const newState = newCallback(oldState);
			const finalState = { ...oldState, ...newState } as State & NewS;
			return finalState;
		};

		const newTick = (_state: State & NewS) => {
			const oldState = this._tickCb(_state) as State & NewS;

			const finalState = { ...oldState };
			return finalState;
		};

		return new Behavior<State & NewS, Actions, RequiredState, RequiredActions>({
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
	 * Tick pipes all new tickCallbacks into a finalTickCallback, later to be executed on every frame.
	 */
	tick = (newCallback: TickCallback<State>) => {
		const newTick = (oldState: State) => {
			const state = this._tickCb(oldState);
			const newState = newCallback({ ...oldState, ...state });
			const finalState = { ...oldState, ...state, ...newState };
			return finalState;
		};
		return new Behavior<State, Actions, RequiredState, RequiredActions>({
			prevInit: this._initCb,
			prevTick: newTick,
			prevActions: this._rawActions,
			prevUsedIds: this._used_ids,
			prevCleanupFunctions: this._cleanupFunctions
		});
	};

	/**
	 * Use lets you use another entity's init and tick functions.
	 * @template ent - The entity to be used.
	 */
	use = <
		NewS extends {},
		NewA extends ActionDict<State>,
		NewRS extends {},
		NewRA extends {}
	>(
		ent: State extends NewRS
			? Behavior<NewS, NewA, NewRS, NewRA>
			: "The current behavior does not satisfy the new behavior' requirements! Please check your console for more details."
	) => {
		const _ent = ent as unknown as Behavior<NewS, NewA, NewRS, NewRA>;

		const newInit = (initialState?: Partial<State & NewS>) => {
			const oldState = this._initCb(initialState);
			const newState = _ent._initCb(oldState as unknown as NewS);

			const finalState = { ...oldState, ...newState };
			return finalState;
		};

		const newTick = (oldState: State & NewS) => {
			const state = this._tickCb(oldState);
			const newState = _ent._tickCb({ ...oldState, ...state });

			const finalState = { ...oldState, ...state, ...newState };
			return finalState;
		};

		type ActionsType = Omit<Actions, keyof NewA> & NewA;

		return new Behavior<
			State & NewS,
			ActionsType,
			RequiredState,
			RequiredActions
		>({
			prevInit: newInit,
			prevTick: newTick,
			prevActions: { ...this._rawActions, ..._ent._rawActions },
			prevUsedIds: [...this._used_ids, _ent._id],
			prevCleanupFunctions: this._cleanupFunctions
		});
	};

	// /**
	//  * Action lets you define a function that can be called from outside the entity.
	//  * @template name - The name of the action.
	//  * @template actionCb - The function to be called when the action is executed.
	//  */
	action = <NewA extends ActionDict<State>>(rawActions: NewA) => {
		type MergedActionsType = Omit<Actions, keyof NewA> & NewA;

		return new Behavior<
			State,
			MergedActionsType,
			RequiredState,
			RequiredActions
		>({
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

	/**
	 * Require lets you require another entity's state. The later init and tick functions will receive the required state as it was defined by the required entity.
	 * Require can be called multiple times to add more required states.
	 * The require method is used to enforce that when this behavior is used on another, that the other behavior has the required state.
	 * @param newBeh - The behavior to be required.
	 * @returns
	 */
	require = <
		NewS extends {},
		NewRS extends {},
		NewA extends {},
		NewRA extends {}
	>(
		newBeh: Behavior<NewS, NewRS, NewA, NewRA>
	) => {
		type MergedS = State & NewRS & NewS;
		type MergedRS = Omit<RequiredState, keyof NewS> & NewS;

		return new Behavior<MergedS, Actions, MergedRS, RequiredActions>();
	};

	create = (scene: Scene, initialState?: Partial<State>) => {
		const liveObject = new LiveEntity(scene, this, initialState);
		scene.addLiveEntity(liveObject as LiveEntity<any, any>);
		return liveObject as LiveEntity<State, Actions>;
	};
}
