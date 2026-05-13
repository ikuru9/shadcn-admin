import { beforeEach, describe, expect, it, vi } from "vitest";

import { authUserQueryKey } from "@/constants/client-query-key";

const { clearMock } = vi.hoisted(() => ({
  clearMock: vi.fn(),
}));

const { ensureQueryDataMock } = vi.hoisted(() => ({
  ensureQueryDataMock: vi.fn(),
}));

const { setQueryDataMock } = vi.hoisted(() => ({
  setQueryDataMock: vi.fn(),
}));

let resolveEnsureQueryData: (() => void) | undefined;

vi.mock("@/context/tanstack-query/query-client-store", () => ({
  getQueryClient: () => ({
    ensureQueryData: ensureQueryDataMock,
    setQueryData: setQueryDataMock,
    clear: vi.fn(),
  }),
  clearQueryClientCache: clearMock,
}));

vi.mock("@/lib/cookies", () => ({
  getCookie: vi.fn(() => null),
  removeCookie: vi.fn(),
  setCookie: vi.fn(),
}));

import { useAuthStore } from "./auth-store";

describe("useAuthStore", () => {
  beforeEach(() => {
    clearMock.mockReset();
    ensureQueryDataMock.mockReset();
    setQueryDataMock.mockReset();
    resolveEnsureQueryData = undefined;
    ensureQueryDataMock.mockImplementation(
      () =>
        new Promise<void>((resolve) => {
          resolveEnsureQueryData = resolve;
        }),
    );
  });

  it("reset을 호출하면 쿼리 캐시를 비운다", () => {
    useAuthStore.getState().reset();

    expect(clearMock).toHaveBeenCalledTimes(1);
  });

  it("access token을 설정하면 내 메뉴를 불러온다", () => {
    useAuthStore.getState().setAccessToken({
      accessToken: "access-token",
      refreshToken: "refresh-token",
      user: {
        id: "user-1",
        name: "Kim",
        email: "kim@example.com",
        authGroupId: "group-1",
      },
    });

    expect(setQueryDataMock).toHaveBeenCalledWith(authUserQueryKey, {
      id: "user-1",
      name: "Kim",
      email: "kim@example.com",
      authGroupId: "group-1",
    });
    expect(ensureQueryDataMock).toHaveBeenCalledTimes(1);

    resolveEnsureQueryData?.();
  });

  it("setAccessToken이 해결되기 전에 내 메뉴 로드를 기다린다", async () => {
    const promise = useAuthStore.getState().setAccessToken({
      accessToken: "access-token",
      refreshToken: "refresh-token",
      user: {
        id: "user-1",
        name: "Kim",
        email: "kim@example.com",
        authGroupId: "group-1",
      },
    });

    let settled = false;
    promise.then(() => {
      settled = true;
    });

    await Promise.resolve();

    expect(settled).toBe(false);

    resolveEnsureQueryData?.();

    await promise;

    expect(settled).toBe(true);
  });
});
