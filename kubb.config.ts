import { defineConfig } from "@kubb/core";
import { pluginClient } from "@kubb/plugin-client";
import { pluginMsw } from "@kubb/plugin-msw";
import { pluginOas } from "@kubb/plugin-oas";
import { pluginReactQuery } from "@kubb/plugin-react-query";
import { pluginTs } from "@kubb/plugin-ts";
import { pluginFaker } from "@kubb/plugin-faker";

import { fileURLToPath } from "node:url";

export default defineConfig(() => ({
  input: {
    path: "https://petstore3.swagger.io/api/v3/openapi.json",
  },
  output: {
    path: fileURLToPath(new URL("./src/.gen", import.meta.url)),
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
      dataReturnType: "data",
    }),
    pluginReactQuery({
      client: {
        importPath: "@/lib/client",
      },
    }),
    pluginFaker({
      output: {
        path: fileURLToPath(new URL("./mocks/faker", import.meta.url)),
      },
    }),
    pluginMsw({
      output: {
        path: fileURLToPath(new URL("./mocks/modules", import.meta.url)),
      },
      parser: "faker",
    }),
  ],
}));
