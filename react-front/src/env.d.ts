/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_BACKEND_HOST: string;
	readonly VITE_NODE_ENV: 'development' | 'production';
	readonly VITE_SUBSCRIPTIONS_GOAL: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
