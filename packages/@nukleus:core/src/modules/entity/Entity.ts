import { LiveEntity } from './LiveEntity';
import {
	FinalInitCallback,
	FinalTickCallback,
	InitCallback,
	TickCallback
} from './types/Callback';

type InitialState = {
	delta: number;
};

export class Entity<State extends InitialState> {
	curentInit: FinalInitCallback<State>;
	currentTick: FinalTickCallback<State>;

	constructor(previousProps?: {
		previousInit: FinalInitCallback<State>;
		previousTick: FinalTickCallback<State>;
	}) {
		// blank entity
		if (previousProps === undefined) {
			this.curentInit = () => ({} as State);
			this.currentTick = () => ({});
			return this;
		}

		// recursive call
		this.curentInit = previousProps.previousInit || (() => ({} as State));
		this.currentTick = previousProps.previousTick || (() => ({} as State));
		return this;
	}

	init = <NewState extends {}>(newCallback: InitCallback<State, NewState>) => {
		// pipe result of finalInit into newCallback and set as finalInit in new Entity
		const newInitCallback = () => {
			const currentOutput = this.curentInit();
			const newOutput = newCallback(currentOutput);
			const output = { ...currentOutput, ...newOutput };
			return output;
		};

		const newTickCallback = (_state: State & NewState) => {
			const currentOutput = (state: State & NewState) =>
				this.currentTick(state);
			const output = { ...currentOutput };
			return output;
		};

		return new Entity<State & NewState>({
			previousInit: newInitCallback,
			previousTick: newTickCallback
		});
	};

	tick = (newCallback: TickCallback<State>) => {
		const newTickCallback = (state: State) => {
			const currentOutput = this.currentTick(state);
			const newOutput = newCallback({ ...state, ...currentOutput });
			const output = { ...state, ...currentOutput, ...newOutput };
			return output;
		};
		return new Entity<State>({
			previousInit: this.curentInit,
			previousTick: newTickCallback
		});
	};

	create = () => {
		const liveObject = new LiveEntity({
			init: this.curentInit,
			tick: this.currentTick
		});
		return liveObject;
	};
}
