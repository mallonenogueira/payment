import path, { resolve } from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    alias: {
      "@": path.resolve(__dirname, './src'),
    },
    setupFiles: ["./src/__test__/setup-postgresql.ts"],
    // setupFiles: ["./src/__test__/setup.ts"],
    poolOptions: {
      forks: {
        minForks: 2,
        // singleFork: true,
      },
    },
  },
});
