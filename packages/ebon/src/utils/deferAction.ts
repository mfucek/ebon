export const deferAction = (action: Function) => {
	setTimeout(() => {
		action();
	}, 50);
};
