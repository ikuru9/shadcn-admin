import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { AlertDialog } from "@/components/dialogs/alert-dialog";
import { AlertDialog as AlertDialogRoot, AlertDialogContent } from "@/components/ui/alert-dialog";

function renderAlertDialog(props?: Partial<React.ComponentProps<typeof AlertDialog>>) {
  const onConfirm = vi.fn();

  render(
    <AlertDialogRoot open>
      <AlertDialogContent>
        <AlertDialog
          title="Alert title"
          description="Alert description"
          destructive={false}
          onConfirm={onConfirm}
          {...props}
        >
          <div data-testid="alert-body">Alert body</div>
        </AlertDialog>
      </AlertDialogContent>
    </AlertDialogRoot>,
  );

  return { onConfirm };
}

describe("AlertDialog", () => {
  it("제목, 설명, children을 렌더링하고 확인 시 onConfirm을 호출한다", () => {
    const { onConfirm } = renderAlertDialog();

    expect(screen.getByText("Alert title")).toBeInTheDocument();
    expect(screen.getByText("Alert description")).toBeInTheDocument();
    expect(screen.getByTestId("alert-body")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "확인" }));

    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it("disabled가 true이면 확인 버튼이 비활성화된다", () => {
    renderAlertDialog({ disabled: true });

    expect(screen.getByRole("button", { name: "확인" })).toBeDisabled();
  });

  it("isLoading이 true이면 확인 버튼이 비활성화된다", () => {
    renderAlertDialog({ isLoading: true });

    expect(screen.getByRole("button", { name: "확인" })).toBeDisabled();
  });
});
