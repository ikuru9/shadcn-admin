import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { ConfirmDialog } from "@/components/dialogs/confirm-dialog";
import { Dialog, DialogContent } from "@/components/ui/dialog";

function renderConfirmDialog(props?: Partial<React.ComponentProps<typeof ConfirmDialog>>) {
  const onConfirm = vi.fn();
  const onCancel = vi.fn();

  render(
    <Dialog open>
      <DialogContent showCloseButton={false}>
        <ConfirmDialog
          title="Confirm title"
          description="Confirm description"
          onConfirm={onConfirm}
          onCancel={onCancel}
          {...props}
        >
          <div data-testid="confirm-body">Confirm body</div>
        </ConfirmDialog>
      </DialogContent>
    </Dialog>,
  );

  return { onConfirm, onCancel };
}

describe("ConfirmDialog", () => {
  it("제목, 설명, children을 렌더링하고 확인/취소 동작을 호출한다", () => {
    const { onConfirm, onCancel } = renderConfirmDialog();

    expect(screen.getByText("Confirm title")).toBeInTheDocument();
    expect(screen.getByText("Confirm description")).toBeInTheDocument();
    expect(screen.getByTestId("confirm-body")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "취소" }));
    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(onConfirm).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole("button", { name: "확인" }));
    expect(onConfirm).toHaveBeenCalledWith(true);
  });

  it("isPending이면 두 버튼이 모두 비활성화된다", () => {
    renderConfirmDialog({ isPending: true });

    expect(screen.getByRole("button", { name: "취소" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "확인" })).toBeDisabled();
  });

  it("disabled가 true이면 확인 버튼이 비활성화된다", () => {
    renderConfirmDialog({ disabled: true });

    expect(screen.getByRole("button", { name: "확인" })).toBeDisabled();
  });
});
