export type InitCallback<ExposedProps, NewProps> = (
	state: ExposedProps
) => NewProps; // add void as possible return type

export type TickCallback<State> = (oldState: State) => Partial<State>;

export type FinalInitCallback<State> = (initialState?: Partial<State>) => State;

export type FinalTickCallback<State> = (oldState: State) => Partial<State>;
