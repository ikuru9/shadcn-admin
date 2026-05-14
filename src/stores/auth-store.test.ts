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
    vi.useFakeTimers();
    clearMock.mockReset();
    ensureQueryDataMock.mockReset();
    setQueryDataMock.mockReset();
    ensureQueryDataMock.mockResolvedValue(undefined);
  });

  it("reset을 호출하면 쿼리 캐시와 메뉴 갱신 타이머를 정리한다", async () => {
    const clearIntervalSpy = vi.spyOn(globalThis, "clearInterval");

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

    await promise;

    expect(ensureQueryDataMock).toHaveBeenCalledTimes(1);

    useAuthStore.getState().reset();

    expect(clearMock).toHaveBeenCalledTimes(1);
    expect(clearIntervalSpy).toHaveBeenCalled();

    await vi.advanceTimersByTimeAsync(60 * 60 * 1000);

    expect(ensureQueryDataMock).toHaveBeenCalledTimes(1);

    clearIntervalSpy.mockRestore();
  });

  it("access token을 설정하면 내 메뉴를 불러오고 1시간마다 다시 불러온다", async () => {
    await useAuthStore.getState().setAccessToken({
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

    await vi.advanceTimersByTimeAsync(60 * 60 * 1000);

    expect(ensureQueryDataMock).toHaveBeenCalledTimes(2);
  });

  it("setAccessToken이 해결되기 전에 내 메뉴 로드를 기다린다", async () => {
    let resolveEnsureQueryData: (() => void) | undefined;
    ensureQueryDataMock.mockImplementation(
      () =>
        new Promise<void>((resolve) => {
          resolveEnsureQueryData = resolve;
        }),
    );

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

  it("메뉴 프리로드가 실패해도 로그인 흐름은 실패하지 않는다", async () => {
    ensureQueryDataMock.mockRejectedValueOnce(new Error("menu fetch failed"));

    await expect(
      useAuthStore.getState().setAccessToken({
        accessToken: "access-token",
        refreshToken: "refresh-token",
        user: {
          id: "user-1",
          name: "Kim",
          email: "kim@example.com",
          authGroupId: "group-1",
        },
      }),
    ).resolves.toBeUndefined();

    expect(ensureQueryDataMock).toHaveBeenCalledTimes(1);
  });
});
