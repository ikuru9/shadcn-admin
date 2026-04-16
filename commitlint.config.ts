import type { UserConfig } from "@commitlint/types";

const config: UserConfig = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "subject-case": [0], // 한국어 허용 (case 검사 비활성)
    "subject-empty": [2, "never"],
    "type-empty": [2, "never"],
    "type-enum": [
      2,
      "always",
      ["feat", "fix", "refactor", "perf", "test", "build", "ci", "docs", "style", "chore", "config"],
    ],
  },
};

export default config;
