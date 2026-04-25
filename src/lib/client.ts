import axios, { type AxiosError, type AxiosHeaders, type AxiosRequestConfig } from "axios";

import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from "@/constants/cookie";
import { refreshToken } from "@/gen/clients";
import { getCookie, setCookie } from "@/lib/cookies";
import { memoize } from "@/lib/memorize";

declare const AXIOS_BASE: string;
declare const AXIOS_HEADERS: string;

export type RequestConfig<TData = unknown> = {
  url?: string;
  method: "GET" | "PUT" | "PATCH" | "POST" | "DELETE";
  params?: object;
  data?: TData | FormData;
  responseType?: "arraybuffer" | "blob" | "document" | "json" | "text" | "stream";
  signal?: AbortSignal;
  headers?: HeadersInit;
};

export type ResponseConfig<TData = unknown> = {
  data: TData;
  status: number;
  statusText: string;
};

export type ResponseErrorConfig<TError = unknown> = TError;

export const axiosInstance = axios.create({
  baseURL: typeof AXIOS_BASE !== "undefined" ? AXIOS_BASE : undefined,
  headers: typeof AXIOS_HEADERS !== "undefined" ? (JSON.parse(AXIOS_HEADERS) as AxiosHeaders) : undefined,
});

type RefreshableRequestConfig = AxiosRequestConfig & { _retry?: boolean };

const refreshAccessToken = async (): Promise<string | null> => {
  const currentRefreshToken = getCookie(REFRESH_TOKEN_KEY);
  if (!currentRefreshToken) return null;

  const response = await refreshToken({
    data: {
      refreshToken: currentRefreshToken,
    },
  });

  const { accessToken, refreshToken: newRefreshToken } = response;
  setCookie(ACCESS_TOKEN_KEY, accessToken);
  setCookie(REFRESH_TOKEN_KEY, newRefreshToken);

  const commonHeaders = axiosInstance.defaults.headers?.common as Record<string, string> | undefined;
  if (commonHeaders) {
    commonHeaders.Authorization = `Bearer ${accessToken}`;
  }

  return accessToken;
};

const getRefreshedAccessToken = memoize(async () => {
  try {
    return await refreshAccessToken();
  } catch {
    return null;
  }
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const status = error.response?.status;
    if (status !== 401) {
      throw error;
    }

    const config = error.config as RefreshableRequestConfig | undefined;
    if (!config) {
      throw error;
    }

    if (config.url?.startsWith("/api/auth/refresh")) {
      throw error;
    }

    if (config._retry) {
      throw error;
    }

    config._retry = true;

    const accessToken = await getRefreshedAccessToken();
    if (!accessToken) {
      throw error;
    }

    config.headers = {
      ...(config.headers ?? {}),
      Authorization: `Bearer ${accessToken}`,
    };

    return axiosInstance.request(config);
  },
);

// The Client type alias is required when using query plugins
export type Client = <TData, _TError = unknown, TVariables = unknown>(
  config: RequestConfig<TVariables>,
) => Promise<ResponseConfig<TData>>;

export const client: Client = async <TData, TError = unknown, TVariables = unknown>(
  config: RequestConfig<TVariables>,
): Promise<ResponseConfig<TData>> => {
  const headers: HeadersInit = {};
  const token = getCookie(ACCESS_TOKEN_KEY);

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const promise = axiosInstance
    .request<TVariables, ResponseConfig<TData>>({ ...config, headers })
    .catch((e: AxiosError<TError>) => {
      throw e;
    });

  return promise;
};

export default client;
