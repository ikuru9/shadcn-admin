import { createEnv } from "@t3-oss/env-core";
import * as z from "zod/mini";

export const env = createEnv({
  clientPrefix: "VITE_",
  client: {
    VITE_APP_TITLE: z.optional(z.string()),
  },

  server: {
    API_SERVER_URL: z.optional(z.string()),
  },

  // Vite exposes build-in vars like DEV and MODE
  shared: {
    NODE_ENV: z.optional(z.enum(["development", "production", "test"])),
    DEV: z.boolean(),
    PROD: z.boolean(),
  },
  /**
   * What object holds the environment variables at runtime. This is usually
   * `process.env` or `import.meta.env`.
   */
  runtimeEnv: import.meta.env,

  /**
   * By default, this library will feed the environment variables directly to
   * the Zod validator.
   *
   * This means that if you have an empty string for a value that is supposed
   * to be a number (e.g. `PORT=` in a ".env" file), Zod will incorrectly flag
   * it as a type mismatch violation. Additionally, if you have an empty string
   * for a value that is supposed to be a string with a default value (e.g.
   * `DOMAIN=` in an ".env" file), the default value will never be applied.
   *
   * In order to solve these issues, we recommend that all new projects
   * explicitly specify this option as true.
   */
  emptyStringAsUndefined: true,
});
