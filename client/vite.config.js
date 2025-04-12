import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  base: "/", // Update this if your app is deployed in a subdirectory
  plugins: [react()],
  assetsInclude: ["**/*.lottie"],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
