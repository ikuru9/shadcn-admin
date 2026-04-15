import axios, { type AxiosError, type AxiosHeaders, type AxiosRequestConfig, type AxiosResponse } from "axios";

import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from "@/constants/cookie";
import { getCookie, setCookie } from "@/lib/cookies";
import { memoize } from "@/lib/memorize";

declare const AXIOS_BASE: string;
declare const AXIOS_HEADERS: string;

/**
 * Subset of AxiosRequestConfig
 */
export interface RequestConfig<TData = unknown> extends AxiosRequestConfig<TData> {}
/**
 * Subset of AxiosResponse
 */
export interface ResponseConfig<TData = unknown> {
  data: TData;
  status: number;
  statusText: string;
  headers?: AxiosResponse["headers"];
}

export type ResponseErrorConfig<TError = unknown> = TError;

export const axiosInstance = axios.create({
  baseURL: typeof AXIOS_BASE !== "undefined" ? AXIOS_BASE : undefined,
  headers: typeof AXIOS_HEADERS !== "undefined" ? (JSON.parse(AXIOS_HEADERS) as AxiosHeaders) : undefined,
});

type RefreshResponse = { acc: string; re: string };
type RefreshableRequestConfig = AxiosRequestConfig & { _retry?: boolean };

const refreshAccessToken = async (): Promise<string | null> => {
  const refreshToken = getCookie(REFRESH_TOKEN_KEY);
  if (!refreshToken) return null;

  const response = await axiosInstance.post<RefreshResponse>("/auth/refresh", undefined, {
    headers: { Authorization: `Bearer ${refreshToken}` },
  });

  const { acc, re } = response.data;
  setCookie(ACCESS_TOKEN_KEY, acc);
  setCookie(REFRESH_TOKEN_KEY, re);

  const commonHeaders = axiosInstance.defaults.headers?.common as Record<string, string> | undefined;
  if (commonHeaders) {
    commonHeaders.Authorization = `Bearer ${acc}`;
  }

  return acc;
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

    if (config.url?.includes("/auth/refresh")) {
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

export const client = async <TData, TError = unknown, TVariables = unknown>(
  config: RequestConfig<TVariables>,
): Promise<ResponseConfig<TData>> => {
  const token = getCookie(ACCESS_TOKEN_KEY);

  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }

  const promise = axiosInstance
    .request<TVariables, ResponseConfig<TData>>({ ...config })
    .catch((e: AxiosError<TError>) => {
      throw e;
    });

  return promise;
};
