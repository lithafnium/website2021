import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    // Order matters: more specific alias first.
    alias: [
      { find: "@app/assets", replacement: path.resolve(__dirname, "src/assets") },
      { find: "@app", replacement: path.resolve(__dirname, "src") },
    ],
  },
  server: {
    port: 8080,
  },
});
