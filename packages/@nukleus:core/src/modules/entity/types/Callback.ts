export type InitCallback<ExposedProps, NewProps> = (
	state: ExposedProps
) => NewProps | void; // add void as possible return type

export type TickCallback<State> = (oldState: State) => Partial<State> | void;

export type FinalInitCallback<State> = (initialState?: Partial<State>) => State;

export type FinalTickCallback<State> = (oldState: State) => State;

export type ActionCallback<State> = (
	oldState: State,
	...args: any[]
) => Partial<State> | void;
