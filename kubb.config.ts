import { defineConfig } from "@kubb/core";
import { pluginClient } from "@kubb/plugin-client";
import { pluginFaker } from "@kubb/plugin-faker";
import { pluginMsw } from "@kubb/plugin-msw";
import { pluginOas } from "@kubb/plugin-oas";
import { pluginReactQuery } from "@kubb/plugin-react-query";
import { pluginTs } from "@kubb/plugin-ts";
import { pluginZod } from "@kubb/plugin-zod";

import { fileURLToPath } from "node:url";

const baseURL = "/api" as const;

export default defineConfig(() => ({
  input: {
    path: fileURLToPath(new URL("./oas-api.yaml", import.meta.url)),
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
      importPath: "@/lib/client",
      baseURL,
      dataReturnType: "data",
      group: {
        type: "path",
      },
      paramsType: "object",
    }),
    pluginZod({
      group: {
        type: "path",
      },
      version: "4",
      mini: true,
      unknownType: "unknown",
    }),
    pluginReactQuery({
      client: {
        importPath: "@/lib/client",
      },
      group: {
        type: "path",
      },
      paramsType: "object",
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
