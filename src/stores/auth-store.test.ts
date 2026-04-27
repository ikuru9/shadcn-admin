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

  it("clears the query cache when reset is called", () => {
    useAuthStore.getState().reset();

    expect(clearMock).toHaveBeenCalledTimes(1);
  });

  it("loads my menus when access token is set", () => {
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

  it("waits for my menus to load before resolving setAccessToken", async () => {
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
