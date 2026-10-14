import { defineConfig } from "vite";

export default defineConfig({
  root: "src/client",
  esbuild: { jsx: "automatic" },
  build: { outDir: "../../dist/client", emptyOutDir: true },
  server: {
    host: "0.0.0.0", port: 5173, strictPort: true,
    proxy: { "/socket": { target: "http://localhost:3100", ws: true }, "/health": "http://localhost:3100" },
  },
});
