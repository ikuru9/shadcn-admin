import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { authUserQueryKey } from "@/constants/client-query-key";

import { NavUser } from "./nav-user";

const useSidebarMock = vi.fn();
const useSignOutMock = vi.fn();

vi.mock("@/components/layout/sidebar-context", () => ({
  SidebarContext: React.createContext(null),
  useSidebar: () => useSidebarMock(),
}));

vi.mock("@/hooks/use-sign-out", () => ({
  useSignOut: () => useSignOutMock(),
}));

describe("NavUser", () => {
  beforeEach(() => {
    useSidebarMock.mockReset();
    useSignOutMock.mockReset();

    useSidebarMock.mockReturnValue({ isMobile: false });
    useSignOutMock.mockReturnValue({ handleSignOut: vi.fn() });
  });

  it("renders the cached auth user name and email", () => {
    const queryClient = new QueryClient();
    queryClient.setQueryData(authUserQueryKey, {
      id: "user-1",
      name: "Kim",
      email: "kim@example.com",
      authGroupId: "group-1",
    });

    render(
      <QueryClientProvider client={queryClient}>
        <NavUser
          user={{
            name: "Fallback",
            email: "fallback@example.com",
            avatar: "/avatars/fallback.jpg",
          }}
        />
      </QueryClientProvider>,
    );

    expect(screen.getByText("Kim")).toBeInTheDocument();
    expect(screen.getByText("kim@example.com")).toBeInTheDocument();
  });
});
