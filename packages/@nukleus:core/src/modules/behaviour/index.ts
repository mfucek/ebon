// import { InitCallback } from "../entity/types/Callback";

// class Behaveiour<BState> {

// 	currentInit: () => BState;
// 	currentTick: (state: BState) => Partial<BState>;

// 	constructor(previousProps?: {
// 		previousInit: () => BState;
// 		previousTick: (state: BState) => Partial<BState>;
// 	}) {
// 		// blank behaveiour
// 		if (!previousProps) {
// 			this.currentInit = () => ({} as BState);
// 			this.currentTick = () => ({});
// 			return this;
// 		}

// 		// recursive call
// 		this.currentInit = previousProps.previousInit || (() => ({} as BState));
// 		this.currentTick = previousProps.previousTick || (() => ({} as BState));
// 	}

// 	init = <NewState extends {}>(newCallback: InitCallback<BState, NewState>) => {
// 		// pipe result of finalInit into newCallback and set as finalInit in new Entity
// 		const newInitCallback = () => {
// 			const currentOutput = this.currentInit();
// 			const newOutput = newCallback(currentOutput);
// 			const output = { ...currentOutput, ...newOutput };
// 			return output;
// 		};

// 		const newTickCallback = (_state: BState & NewState) => {
// 			const currentOutput = (state: BState & NewState) =>
// 				this.currentTick(state);
// 			const output = { ...currentOutput };
// 			return output;
// 		};

// 		return new Behaveiour<BState & NewState>({
// 			previousInit: newInitCallback,
// 			previousTick: newTickCallback
// 		});
// 	};

// 	tick = (newCallback: TickCallback<BState>) => {
// 		const newTickCallback = (state: BState) => {
// 			const currentOutput = this.currentTick(state);
// 			const newOutput = newCallback({ ...state, ...currentOutput });
// 			const output = { ...state, ...currentOutput, ...newOutput };
// 			return output;
// 		};
// 		return new Behaveiour<BState>({
// 			previousInit: this.curentInit,
// 			previousTick: newTickCallback
// 		});
// 	};

// 	use = () => {

// 	}
// }

// class Behaveiour<State> extends Entity<State extends {delta: number;}> {

// };
