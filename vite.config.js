import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",
    sourcemap: false,
    rollupOptions: {
      output: {
        // Separa vendor libs do código da aplicação
        manualChunks: {
          react:    ["react", "react-dom"],
          recharts: ["recharts"],
        },
      },
    },
  },
  server: {
    port: 3000,
    open: true,
  },
});
