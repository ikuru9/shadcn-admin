import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { UserAuthForm } from "./user-auth-form";

const navigateMock = vi.fn();
const setAccessTokenMock = vi.fn();
const mutateAsyncMock = vi.fn();
const toastPromiseMock = vi.fn();
const useLoginOptionsMock = vi.fn();

vi.mock("@tanstack/react-router", () => ({
  Link: ({ children, to, ...props }: any) => (
    <a href={typeof to === "string" ? to : "#"} {...props}>
      {children}
    </a>
  ),
  useNavigate: () => navigateMock,
}));

vi.mock("sonner", () => ({
  toast: {
    promise: (...args: any[]) => toastPromiseMock(...args),
  },
}));

vi.mock("@/gen/hooks", () => ({
  useLogin: (options: any) => ({
    ...useLoginOptionsMock(options),
    mutateAsync: async (...args: any[]) => {
      const result = await mutateAsyncMock(...args);
      options?.mutation?.onSuccess?.(result);
      return result;
    },
    isPending: false,
  }),
}));

vi.mock("@/stores/auth-store", () => ({
  useAuthStore: () => ({
    setAccessToken: setAccessTokenMock,
  }),
}));

describe("UserAuthForm", () => {
  beforeEach(() => {
    navigateMock.mockReset();
    setAccessTokenMock.mockReset();
    mutateAsyncMock.mockReset();
    toastPromiseMock.mockReset();
    useLoginOptionsMock.mockReset();

    toastPromiseMock.mockImplementation(async (promise: Promise<unknown>, handlers: any) => {
      const result = await promise;
      if (handlers?.success) {
        handlers.success(result);
      }

      return result;
    });

    mutateAsyncMock.mockResolvedValue({
      accessToken: "access-token",
      refreshToken: "refresh-token",
      user: {
        id: "ACC001",
        name: "kim",
        email: "user@example.com",
        authGroupId: "1",
      },
    });

    useLoginOptionsMock.mockReturnValue({});
  });

  it("로그인 mutation 캐시를 reset 전까지 유지하도록 gcTime을 지정한다", () => {
    render(<UserAuthForm redirectTo="/dashboard" />);

    expect(
      useLoginOptionsMock.mock.calls.some(([options]) => options?.mutation?.gcTime === Infinity),
    ).toBe(true);
  });

  it("로그인 성공 시 로그인 훅으로 토큰을 저장하고 리다이렉트한다", async () => {
    let resolveSetAccessToken: (() => void) | undefined;
    setAccessTokenMock.mockImplementation(
      () =>
        new Promise<void>((resolve) => {
          resolveSetAccessToken = resolve;
        }),
    );

    render(<UserAuthForm redirectTo="/dashboard" />);

    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "user@example.com" } });
    fireEvent.change(screen.getByLabelText("Password"), { target: { value: "password123" } });
    fireEvent.click(screen.getByRole("button", { name: "Sign in" }));

    await waitFor(() => {
      expect(mutateAsyncMock).toHaveBeenCalledWith({
        data: {
          email: "user@example.com",
          password: "password123",
        },
      });
    });

    resolveSetAccessToken?.();

    await waitFor(() => {
      expect(setAccessTokenMock).toHaveBeenCalledWith({
        accessToken: "access-token",
        refreshToken: "refresh-token",
        user: {
          id: "ACC001",
          name: "kim",
          email: "user@example.com",
          authGroupId: "1",
        },
      });
    });

    expect(setAccessTokenMock).toHaveBeenCalledWith({
      accessToken: "access-token",
      refreshToken: "refresh-token",
      user: {
        id: "ACC001",
        name: "kim",
        email: "user@example.com",
        authGroupId: "1",
      },
    });
    expect(navigateMock).toHaveBeenCalledWith({
      to: "/dashboard",
      replace: true,
    });
  });
});
