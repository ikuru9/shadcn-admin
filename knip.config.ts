import type { KnipConfig } from "knip";

const config: KnipConfig = {
  entry: ["kubb.config.ts", "mocks/browser.ts"],
  project: ["src/**/*.{ts,tsx}", "mocks/**/*.{ts,tsx}", "!src/**/*.d.ts", "!src/gen/**", "!src/routeTree.gen.ts"],
  ignoreDependencies: ["@faker-js/faker", "tailwindcss", "tw-animate-css"],
  ignoreFiles: ["mocks/server.ts"],
  ignoreIssues: {
    "src/components/ui/**": ["exports", "types"],
    "src/gen/**": ["exports", "types"],
    "src/routeTree.gen.ts": ["exports", "types"],
    "mocks/faker/**": ["exports", "types"],
    "mocks/modules/**": ["exports", "types"],
  },
  ignoreExportsUsedInFile: {
    type: true,
    interface: true,
  },
};

export default config;
