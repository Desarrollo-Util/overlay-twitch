import reactRefresh from '@vitejs/plugin-react-refresh';
import { resolve } from 'path';
import { defineConfig } from 'vite';
import reactJsx from 'vite-react-jsx';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [reactRefresh(), reactJsx()],
	build: {
		outDir: resolve(__dirname, '../public'),
	},
});
