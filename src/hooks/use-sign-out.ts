import { useAuthStore } from "@/stores/auth-store";
import { useNavigate, useLocation } from "@tanstack/react-router";
import { useDialog } from "./use-dialog";

export function useSignOut(options?: { onConfirm?: () => Promise<void> }) {
  const { confirm } = useDialog();
  const navigate = useNavigate();
  const location = useLocation();
  const { auth } = useAuthStore();

  const runSignOut = async () => {
    auth.reset();
    // Preserve current location for redirect after sign-in
    const currentPath = location.href;

    await options?.onConfirm?.();

    navigate({
      to: "/sign-in",
      search: { redirect: currentPath },
      replace: true,
    });
  };

  const handleSignOut = async () => {
    const result = await confirm({
      title: "로그아웃",
      description: "로그아웃 하시겠습니까?",
      destructive: true,
      className: "sm:max-w-sm",
    });

    if (result) {
      runSignOut();
    }
  };

  return {
    handleSignOut,
  };
}
