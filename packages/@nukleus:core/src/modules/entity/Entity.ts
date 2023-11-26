// import { Behaveiour } from '../behaviour';
import { LiveEntity } from './LiveEntity';
import {
	FinalInitCallback,
	FinalTickCallback,
	InitCallback,
	TickCallback
} from './types/Callback';

type DefaultState = {
	delta: number;
};

export class Entity<State extends DefaultState> {
	initCb: FinalInitCallback<State>;
	tickCb: FinalTickCallback<State>;

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
			// this.initCb = (initialState) =>
			// 	initialState ? (initialState as State) : ({} as State);
			// this.tickCb = (oldState) => oldState;
			return this;
		}

		// recursive call
		this.initCb = previousProps.prevInit;
		this.tickCb = previousProps.prevTick;
	}

	// new init means new static type for internal state
	init = <NewState extends {}>(newCallback: InitCallback<State, NewState>) => {
		// pipe result of finalInit into newCallback and set as finalInit in new Entity
		const newInit = (initialState?: Partial<State>) => {
			const oldState = this.initCb(initialState);
			const newState = newCallback(oldState);
			const finalState = { ...oldState, ...newState };
			return finalState;
		};

		const newTick = (_state: State & NewState) => {
			const oldState = this.tickCb(_state) as State & NewState;
			// const oldState = (state: State & NewState) => this.tickCb(state);
			const finalState = { ...oldState };
			return finalState;
		};

		return new Entity<State & NewState>({
			prevInit: newInit,
			prevTick: newTick
		});
	};

	tick = (newCallback: TickCallback<State>) => {
		const newTick = (oldState: State) => {
			const state = this.tickCb(oldState);
			const newState = newCallback({ ...oldState, ...state });
			const finalState = { ...oldState, ...state, ...newState };
			return finalState;
		};
		return new Entity<State>({
			prevInit: this.initCb,
			prevTick: newTick
		});
	};

	// use implies a new init, which means new static type for internal state
	use = <NewState extends DefaultState>(ent: Entity<NewState>) => {
		// use the init and tick functions from the other entity

		const newInit = (initialState?: Partial<State & NewState>) => {
			const oldState = this.initCb(initialState);
			const newState = ent.initCb(oldState as unknown as NewState);

			const finalState = { ...oldState, ...newState };
			return finalState;
		};

		// console.warn(ent.tickCb);

		const newTick = (oldState: State & NewState) => {
			console.error('TEST');
			// new tick not propagating...
			const state = this.tickCb(oldState);
			const newState = ent.tickCb({ ...oldState, ...state });

			const finalState = { ...oldState, ...state, ...newState };
			return finalState;
		};

		console.log(newTick);

		return new Entity<State & NewState>({
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
