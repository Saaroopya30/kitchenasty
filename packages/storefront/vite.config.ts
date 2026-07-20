import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import istanbul from "vite-plugin-istanbul";

export default defineConfig({
  plugins: [react(),
    istanbul({
    include: "src/**/*",
    exclude: [
      "node_modules",
      "test",
      "tests",
      "e2e",
      "**/*.test.*",
      "**/*.spec.*",
    ],
    extension: [".js", ".jsx", ".ts", ".tsx"],
    requireEnv: false,
    forceBuildInstrument: true,
  }),
  ],
  server: {
    port: 5174,
    proxy: {
      '/api': 'http://localhost:3000',
      '/uploads': 'http://localhost:3000',
      '/socket.io': { target: 'http://localhost:3000', ws: true },
    },
  },
});
