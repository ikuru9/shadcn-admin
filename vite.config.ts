import { defineConfig } from "vite";
import { devtools } from "@tanstack/devtools-vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { compression } from "vite-plugin-compression2";

import { tanstackRouter } from "@tanstack/router-plugin/vite";
import { fileURLToPath } from "node:url";
import { playwright } from "@vitest/browser-playwright";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    devtools(),
    tanstackRouter({
      target: "react",
      autoCodeSplitting: true,
    }),
    viteReact(),
    tailwindcss(),
    compression({
      algorithms: ["gzip", "brotliCompress"],
      exclude: [/\.(br)$/, /\.(gz)$/, /\.(png|jpe?g|gif|webp|woff2?)$/],
      threshold: 1501, // 1.5KB 미만은 무시 (효율성)
      skipIfLargerOrEqual: true, // 압축본이 더 크면 무시
    }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  optimizeDeps: {
    include: [
      "axios",
      "date-fns",
      "clsx",
      "class-variance-authority",
      "@radix-ui/react-alert-dialog",
      "@radix-ui/react-dialog",
      "@radix-ui/react-popover",
    ],
  },
  esbuild: {
    pure:
      mode === "production"
        ? [
            "console.log",
            "console.info",
            "console.debug",
            "console.trace",
            "console.group", // 그룹 시작 제거
            "console.groupCollapsed",
            "console.groupEnd", // 그룹 종료 제거
            "console.table", // 테이블 출력 제거
            "console.time", // 타이머 제거
            "console.timeEnd",
            "console.count", // 카운터 제거
          ]
        : [],
  },
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      external: (_id) => {
        // const pattern = /node_modules\/(@faker-js\/faker|msw)/;
        // if (pattern.test(id)) {
        //   return true;
        // }

        return false;
      },
      output: {
        // 가독성을 위해 에셋 이름을 깔끔하게 정리
        assetFileNames: "assets/[name]-[hash][extname]",
        chunkFileNames: "assets/[name]-[hash].js",
        entryFileNames: "assets/[name]-[hash].js",
      },
    },
  },
  test: {
    globals: true,
    include: ["**/*.{test,spec}.{ts,tsx}"],
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
    setupFiles: [`${fileURLToPath(new URL("./src", import.meta.url))}/vitest.setup.ts`],
  },
}));
