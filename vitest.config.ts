import { defineConfig } from "vitest/config";
import { playwright } from "@vitest/browser-playwright";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    globals: true,
    include: ["tests/**/*.{test,spec}.{ts,tsx}"],
    browser: {
      enabled: true,
      provider: playwright(),
      // https://vitest.dev/config/browser/playwright
      instances: [
        { browser: "chromium" },
        // { browser: "firefox" },
        // { browser: "webkit" },
      ],
      // Optional: run in headed mode during development
      headless: process.env.CI ? true : false,
    },
  },
});
