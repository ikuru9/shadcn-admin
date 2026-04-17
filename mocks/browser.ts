"use client";

import { http, passthrough } from "msw";
import { setupWorker } from "msw/browser";

import { handlers } from "./handlers";

export const worker = setupWorker(
  ...handlers.concat([
    http.all("/__tsd/*", () => {
      return passthrough();
    }),
  ]),
);
