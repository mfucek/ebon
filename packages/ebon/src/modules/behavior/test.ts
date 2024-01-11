class Aspect {
	public static readonly name = 'aspect';
	public static readonly priority = 0;
	public static readonly dependencies = ['behavior'];
	public static readonly events = ['test'];
	public static readonly behaviors = {
		test: {
			async test() {
				return 'test';
			}
		}
	};
}
