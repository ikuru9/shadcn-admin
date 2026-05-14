import { AxiosError } from "axios";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { getStateMock, getMyMenuPermissionsQueryOptionsMock } = vi.hoisted(() => ({
  getStateMock: vi.fn(),
  getMyMenuPermissionsQueryOptionsMock: vi.fn(),
}));

vi.mock("@/stores/auth-store", () => ({
  useAuthStore: {
    getState: getStateMock,
  },
}));

vi.mock("@/gen/hooks", () => ({
  getMyMenuPermissionsQueryOptions: (...args: any[]) => getMyMenuPermissionsQueryOptionsMock(...args),
}));

import { createAuthenticatedBeforeLoad } from "./-auth-guards";

describe("createAuthenticatedBeforeLoad", () => {
  beforeEach(() => {
    getStateMock.mockReset();
    getMyMenuPermissionsQueryOptionsMock.mockReset();
  });

  it("로그인이 없으면 sign-in으로 보낸다", async () => {
    getStateMock.mockReturnValue({ accessToken: null });

    const beforeLoad = createAuthenticatedBeforeLoad("/settings/account");

    await expect(
      beforeLoad({
        context: { queryClient: { ensureQueryData: vi.fn() } as any },
        location: { href: "/settings/account" },
      }),
    ).rejects.toMatchObject({ options: { to: "/sign-in" } });
  });

  it("권한이 있으면 메뉴 권한을 확인한다", async () => {
    const ensureQueryData = vi.fn().mockResolvedValue(undefined);
    getStateMock.mockReturnValue({ accessToken: "access-token" });
    getMyMenuPermissionsQueryOptionsMock.mockReturnValue({ queryKey: ["menu"], queryFn: vi.fn() });

    const beforeLoad = createAuthenticatedBeforeLoad("/settings/account");

    await beforeLoad({
      context: { queryClient: { ensureQueryData } as any },
      location: { href: "/settings/account" },
    });

    expect(getMyMenuPermissionsQueryOptionsMock).toHaveBeenCalledWith({ menuKey: "/settings/account" });
    expect(ensureQueryData).toHaveBeenCalledTimes(1);
  });

  it("권한이 없으면 forbidden으로 보낸다", async () => {
    const ensureQueryData = vi.fn().mockRejectedValue(
      new AxiosError("Forbidden", "ERR_BAD_REQUEST", undefined, undefined, {
        status: 403,
        statusText: "Forbidden",
        headers: {},
        config: {},
        data: {},
      } as any),
    );
    getStateMock.mockReturnValue({ accessToken: "access-token" });
    getMyMenuPermissionsQueryOptionsMock.mockReturnValue({ queryKey: ["menu"], queryFn: vi.fn() });

    const beforeLoad = createAuthenticatedBeforeLoad("/settings/account");

    await expect(
      beforeLoad({
        context: { queryClient: { ensureQueryData } as any },
        location: { href: "/settings/account" },
      }),
    ).rejects.toMatchObject({ options: { to: "/403" } });
  });
});
