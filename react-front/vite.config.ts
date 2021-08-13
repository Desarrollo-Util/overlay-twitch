import reactRefresh from "@vitejs/plugin-react-refresh";
import { resolve } from "path";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [reactRefresh()],
  build: {
    outDir: resolve(__dirname, "../public"),
  },
});
