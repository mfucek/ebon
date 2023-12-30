// import { Behaveiour } from '../behaviour';
import { nanoid } from 'nanoid';
import { LiveEntity } from '../entity/LiveEntity';
import {
	FinalInitCallback,
	FinalTickCallback,
	InitCallback,
	TickCallback
} from '../entity/types/Callback';

export type DefaultState = {
	delta: number;
};

export class Behavior<State extends DefaultState> {
	_initCb: FinalInitCallback<State>;
	_tickCb: FinalTickCallback<State>;

	_id = nanoid();

	constructor(previousProps?: {
		prevInit: FinalInitCallback<State>;
		prevTick: FinalTickCallback<State>;
		prevActions: Record<string, TickCallback<State>>;
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
			this.actions = {};

			return this;
		}

		// recursive call
		this._initCb = previousProps.prevInit;
		this._tickCb = previousProps.prevTick;
		this.actions = previousProps.prevActions;
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

		return new Behavior<State & NewState>({
			prevInit: newInit,
			prevTick: newTick,
			prevActions: this.actions as Record<
				string,
				TickCallback<State & NewState>
			>
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
		return new Behavior<State>({
			prevInit: this._initCb,
			prevTick: newTick,
			prevActions: this.actions
		});
	};

	// use implies a new init, which means new static type for internal state
	/**
	 * Use lets you use another entity's init and tick functions.
	 * @template ent - The entity to be used.
	 */
	use = <NewState extends DefaultState>(ent: Behavior<NewState>) => {
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

		return new Behavior<State & NewState>({
			prevInit: newInit,
			prevTick: newTick,
			prevActions: { ...this.actions, ...ent.actions } as Record<
				string,
				TickCallback<State & NewState>
			>
		});
	};

	actions: Record<string, TickCallback<State>> = {};

	/**
	 * Action lets you define a function that can be called from outside the entity.
	 * @template name - The name of the action.
	 * @template actionCb - The function to be called when the action is executed.
	 */
	action = (name: string, actionCb: TickCallback<State>) => {
		this.actions[name] = actionCb;
		return this;
	};

	create = (initialState?: Partial<State>) => {
		const liveObject = new LiveEntity(this, initialState);
		return liveObject;
	};
}
