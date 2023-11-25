export type InitCallback<ExposedProps, NewProps> = (
	state: ExposedProps
) => NewProps;

export type TickCallback<State> = (state: State) => Partial<State>;

export type FinalInitCallback<State> = () => State;

export type FinalTickCallback<State> = (state: State) => Partial<State>;
