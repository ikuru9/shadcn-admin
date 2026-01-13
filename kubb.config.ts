import { defineConfig } from "@kubb/core";
import { pluginClient } from "@kubb/plugin-client";
import { pluginMsw } from "@kubb/plugin-msw";
import { pluginOas } from "@kubb/plugin-oas";
import { pluginReactQuery } from "@kubb/plugin-react-query";
import { pluginTs } from "@kubb/plugin-ts";
import { pluginFaker } from "@kubb/plugin-faker";

import { fileURLToPath } from "node:url";

const baseURL = "/api" as const;

export default defineConfig(() => ({
  input: {
    path: "https://petstore3.swagger.io/api/v3/openapi.json",
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
      importPath: "@/lib/client",
      baseURL,
      dataReturnType: "data",
      group: {
        type: "path",
      },
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
      dateParser: "date-fns",
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
