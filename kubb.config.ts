import { defineConfig } from "@kubb/core";
import { pluginClient } from "@kubb/plugin-client";
import { pluginFaker } from "@kubb/plugin-faker";
import { pluginMsw } from "@kubb/plugin-msw";
import { pluginOas } from "@kubb/plugin-oas";
import { pluginReactQuery } from "@kubb/plugin-react-query";
import { pluginTs } from "@kubb/plugin-ts";
import { pluginZod } from '@kubb/plugin-zod'
import { loadEnv } from "vite";

import { fileURLToPath } from "node:url";

const baseURL = "/api" as const;

const rootDir = fileURLToPath(new URL(".", import.meta.url));
const mode = process.env.NODE_ENV ?? "development";
const env = loadEnv(mode, rootDir, "");

export default defineConfig(() => ({
  input: {
    path: `${env.API_SERVER_URL}/api/v3/openapi.json`,
  },
  output: {
    path: fileURLToPath(new URL("./src/gen", import.meta.url)),
    clean: true,
    format: false,
    lint: false,
    barrelType: false,
  },
  plugins: [
    pluginOas(),
    pluginTs(),
    pluginClient({
      client: "axios",
      baseURL,
      dataReturnType: "data",
      group: {
        type: "path",
      },
    }),
    pluginZod({
      mini: true,
    }),
    pluginReactQuery({
      client: {
        importPath: "@/lib/client",
      },
      group: {
        type: "path",
      },
    }),
    pluginFaker({
      output: {
        path: fileURLToPath(new URL("./mocks/faker", import.meta.url)),
      },
      group: {
        type: "path",
      },
      dateParser: "faker",
    }),
    pluginMsw({
      parser: "faker",
      baseURL,
      output: {
        path: fileURLToPath(new URL("./mocks/modules", import.meta.url)),
      },
      group: {
        type: "path",
      },
      handlers: true,
    }),
  ],
}));
