import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		// configure @ as root
		// root: 'packages/core',
		// configure @ as root
		// alias: {
		// 	'@/': './src/'
		// }
	},
	plugins: [tsconfigPaths()]
});
