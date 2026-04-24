// @vitest-environment jsdom
import { type AxiosAdapter, type AxiosRequestConfig, type AxiosResponse, type InternalAxiosRequestConfig } from "axios";
import { afterEach, describe, expect, it } from "vitest";

import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from "@/constants/cookie";
import { axiosInstance } from "@/lib/client";
import { removeCookie, setCookie } from "@/lib/cookies";
import { login } from "@/gen/clients/auth/login";
import { getMyMenus } from "@/gen/clients/users/getMyMenus";

const createResponse = <TData>(config: AxiosRequestConfig, data: TData, status = 200): AxiosResponse<TData> => ({
  data,
  status,
  statusText: "OK",
  headers: {},
  config: config as InternalAxiosRequestConfig,
  request: {} as unknown,
});

describe("auth API contract", () => {
  afterEach(() => {
    removeCookie(ACCESS_TOKEN_KEY);
    removeCookie(REFRESH_TOKEN_KEY);
  });

  const withAdapter = async <T>(adapter: AxiosAdapter, run: () => Promise<T>) => {
    const previousAdapter = axiosInstance.defaults.adapter;
    axiosInstance.defaults.adapter = adapter;

    try {
      return await run();
    } finally {
      axiosInstance.defaults.adapter = previousAdapter;
    }
  };

  it("POST /auth/login returns accessToken and refreshToken", async () => {
    removeCookie(ACCESS_TOKEN_KEY);

    const response = await withAdapter(
      async (config) => {
        expect(config.url).toBe("/api/auth/login");
        expect(config.method).toBe("post");

        const payload = typeof config.data === "string" ? JSON.parse(config.data) : config.data;
        expect(payload).toEqual({ email: "user@example.com", password: "secret" });

        return createResponse(config, { accessToken: "access-token", refreshToken: "refresh-token" });
      },
      async () => login({ data: { email: "user@example.com", password: "secret" } }),
    );

    expect(response).toEqual({ accessToken: "access-token", refreshToken: "refresh-token" });
  });

  it("GET /users/my-menus sends the bearer token and returns menu keys", async () => {
    setCookie(ACCESS_TOKEN_KEY, "access-token");

    const adapter: AxiosAdapter = async (config) => {
      expect(config.url).toBe("/api/users/my-menus");
      expect(config.method).toBe("get");

      const headers = config.headers as Record<string, string> | undefined;
      expect(headers?.Authorization ?? headers?.authorization).toBe("Bearer access-token");

      return createResponse(config, { menuKeys: ["dashboard", "users"] });
    };

    const response = await withAdapter(adapter, async () => getMyMenus());

    expect(response.menuKeys).toEqual(["dashboard", "users"]);
  });
});
