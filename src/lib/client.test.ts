// @vitest-environment jsdom
import {
  type AxiosAdapter,
  AxiosError,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from "@/constants/cookie";
import { axiosInstance, client } from "@/lib/client";
import { getCookie, removeCookie, setCookie } from "@/lib/cookies";

const waitForTick = () => new Promise((resolve) => setTimeout(resolve, 0));

const createResponse = <TData>(config: AxiosRequestConfig, data: TData, status: number): AxiosResponse<TData> => ({
  data,
  status,
  statusText: status === 200 ? "OK" : "Unauthorized",
  headers: {},
  config: config as InternalAxiosRequestConfig,
  request: {} as unknown,
});

const createError = (config: AxiosRequestConfig, response: AxiosResponse) =>
  Promise.reject(new AxiosError("Unauthorized", "ERR_BAD_REQUEST", config as InternalAxiosRequestConfig, {}, response));

describe("client 토큰 재발급", () => {
  beforeEach(() => {
    removeCookie(ACCESS_TOKEN_KEY);
    removeCookie(REFRESH_TOKEN_KEY);
    const commonHeaders = axiosInstance.defaults.headers?.common as Record<string, string> | undefined;
    if (commonHeaders) {
      delete commonHeaders.Authorization;
    }
  });

  afterEach(() => {
    removeCookie(ACCESS_TOKEN_KEY);
    removeCookie(REFRESH_TOKEN_KEY);
  });

  it("401이면 토큰을 한 번만 재발급하고 대기 후 재시도한다", async () => {
    setCookie(ACCESS_TOKEN_KEY, "old-access");
    setCookie(REFRESH_TOKEN_KEY, "refresh-token");

    let refreshCalls = 0;

    const adapter: AxiosAdapter = async (config) => {
      const url = config.url ?? "";
      const headers = config.headers as Record<string, string> | undefined;
      const auth = headers?.Authorization;

      if (url === "/auth/refresh") {
        refreshCalls += 1;
        await waitForTick();
        return createResponse(config, { acc: "new-access", re: "new-refresh" }, 200);
      }

      if (url === "/protected") {
        if (auth === "Bearer old-access") {
          const response = createResponse(config, { message: "unauthorized" }, 401);
          return createError(config, response);
        }

        if (auth === "Bearer new-access") {
          return createResponse(config, { ok: true }, 200);
        }

        const response = createResponse(config, { message: "unauthorized" }, 401);
        return createError(config, response);
      }

      return createResponse(config, {}, 200);
    };

    axiosInstance.defaults.adapter = adapter;

    const [first, second] = await Promise.all([
      client({ url: "/protected", method: "GET" }),
      client({ url: "/protected", method: "GET" }),
    ]);

    expect(first.data).toEqual({ ok: true });
    expect(second.data).toEqual({ ok: true });
    expect(refreshCalls).toBe(1);
    expect(getCookie(ACCESS_TOKEN_KEY)).toBe("new-access");
    expect(getCookie(REFRESH_TOKEN_KEY)).toBe("new-refresh");
  });

  it("재시도 후에도 401이면 에러를 반환한다", async () => {
    setCookie(ACCESS_TOKEN_KEY, "old-access");
    setCookie(REFRESH_TOKEN_KEY, "refresh-token");

    const adapter: AxiosAdapter = async (config) => {
      const url = config.url ?? "";
      const headers = config.headers as Record<string, string> | undefined;
      const auth = headers?.Authorization;

      if (url === "/auth/refresh") {
        return createResponse(config, { acc: "new-access", re: "new-refresh" }, 200);
      }

      if (url === "/protected") {
        if (auth === "Bearer old-access" || auth === "Bearer new-access") {
          const response = createResponse(config, { message: "unauthorized" }, 401);
          return createError(config, response);
        }
      }

      const response = createResponse(config, { message: "unauthorized" }, 401);
      return createError(config, response);
    };

    axiosInstance.defaults.adapter = adapter;

    await expect(client({ url: "/protected", method: "GET" })).rejects.toMatchObject({
      response: { status: 401 },
    });
  });
});
