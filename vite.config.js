import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const isWeb = process.env.BUILD_TARGET === "web";

export default defineConfig({
  plugins: [react()],
  base: isWeb
    ? "/September-Screens/" // ✅ GitHub Pages
    : "./",                 // ✅ Electron (relative paths)
  build: {
    outDir: "dist",
  },
});
