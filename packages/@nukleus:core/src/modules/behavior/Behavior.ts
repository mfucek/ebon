// import { Behaveiour } from '../behaviour';
import { LiveEntity } from '../entity/LiveEntity';
import {
	FinalInitCallback,
	FinalTickCallback,
	InitCallback,
	TickCallback
} from '../entity/types/Callback';

type DefaultState = {
	delta: number;
};

export class Behavior<State extends DefaultState> {
	private initCb: FinalInitCallback<State>;
	private tickCb: FinalTickCallback<State>;

	constructor(previousProps?: {
		prevInit: FinalInitCallback<State>;
		prevTick: FinalTickCallback<State>;
	}) {
		// blank entity
		if (!previousProps) {
			const blankInit: FinalInitCallback<State> = (initialState) => {
				return initialState as State;
			};
			const blankTick: FinalTickCallback<State> = (oldState) => {
				return oldState;
			};
			this.initCb = blankInit;
			this.tickCb = blankTick;

			return this;
		}

		// recursive call
		this.initCb = previousProps.prevInit;
		this.tickCb = previousProps.prevTick;
	}

	/**
	 * Init lets you define the initial states of an entity.
	 * Init can be called multiple times to add more initial states or refine existing ones.
	 * @template newCallback - The function to be called when the entity is created.
	 */
	init = <NewState extends {}>(newCallback: InitCallback<State, NewState>) => {
		// pipe result of finalInit into newCallback and set as finalInit in new Entity
		const newInit = (initialState?: Partial<State>) => {
			const oldState = this.initCb(initialState);
			const newState = newCallback(oldState);
			const finalState = { ...oldState, ...newState } as State & NewState;
			return finalState;
		};

		const newTick = (_state: State & NewState) => {
			const oldState = this.tickCb(_state) as State & NewState;

			const finalState = { ...oldState };
			return finalState;
		};

		return new Behavior<State & NewState>({
			prevInit: newInit,
			prevTick: newTick
		});
	};

	/**
	 * Tick defines how an entity's state changes over time. It receives the current state as an argument, as defined by all the init functions.
	 * Tick can be called multiple times to add more state changes.
	 * @template newCallback - The function to be called when the entity is ticked.
	 */
	tick = (newCallback: TickCallback<State>) => {
		const newTick = (oldState: State) => {
			const state = this.tickCb(oldState);
			const newState = newCallback({ ...oldState, ...state });
			const finalState = { ...oldState, ...state, ...newState };
			return finalState;
		};
		return new Behavior<State>({
			prevInit: this.initCb,
			prevTick: newTick
		});
	};

	// use implies a new init, which means new static type for internal state
	/**
	 * Use lets you use another entity's init and tick functions.
	 * @template ent - The entity to be used.
	 */
	use = <NewState extends DefaultState>(ent: Behavior<NewState>) => {
		const newInit = (initialState?: Partial<State & NewState>) => {
			const oldState = this.initCb(initialState);
			const newState = ent.initCb(oldState as unknown as NewState);

			const finalState = { ...oldState, ...newState };
			return finalState;
		};

		const newTick = (oldState: State & NewState) => {
			const state = this.tickCb(oldState);
			const newState = ent.tickCb({ ...oldState, ...state });

			const finalState = { ...oldState, ...state, ...newState };
			return finalState;
		};

		return new Behavior<State & NewState>({
			prevInit: newInit,
			prevTick: newTick
		});
	};

	create = (initialState?: Partial<State>) => {
		const liveObject = new LiveEntity(
			{
				init: this.initCb,
				tick: this.tickCb
			},
			initialState
		);
		return liveObject;
	};
}
