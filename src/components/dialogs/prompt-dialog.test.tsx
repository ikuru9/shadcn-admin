import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { PromptDialog } from "@/components/dialogs/prompt-dialog";
import { Dialog, DialogContent } from "@/components/ui/dialog";

function renderPromptDialog(children: React.ReactNode) {
  return render(
    <Dialog open>
      <DialogContent showCloseButton={false}>{children}</DialogContent>
    </Dialog>,
  );
}

describe("PromptDialog", () => {
  it("validationSchema가 없으면 confirm 버튼이 활성화된다", () => {
    const onConfirm = vi.fn();

    renderPromptDialog(
      <PromptDialog title="Prompt" description="Enter value" onConfirm={onConfirm} onCancel={vi.fn()} />,
    );

    expect(screen.getByRole("button", { name: "확인" })).toBeEnabled();
  });

  it("defaultValue를 입력 필드에 반영하고 submit 시 그대로 전달한다", async () => {
    const onConfirm = vi.fn();

    renderPromptDialog(
      <PromptDialog
        title="Prompt"
        description="Enter value"
        defaultValue="hello"
        onConfirm={onConfirm}
        onCancel={vi.fn()}
      />,
    );

    expect(screen.getByRole("textbox")).toHaveValue("hello");

    const dialog = screen.getByRole("dialog");
    const form = dialog.querySelector("form");

    if (!form) {
      throw new Error("Prompt form not found");
    }

    fireEvent.submit(form);

    await waitFor(() => {
      expect(onConfirm).toHaveBeenCalledWith("hello");
    });
  });

  it("validationSchema가 있으면 invalid 상태에서 confirm 버튼이 비활성화되고 메시지를 보여준다", async () => {
    const onConfirm = vi.fn();
    const validationSchema = {
      safeParse: (value: string) =>
        value === "ok"
          ? { success: true as const, data: value }
          : {
              success: false as const,
              error: { issues: [{ message: "Value must be ok" }] },
            },
    };

    renderPromptDialog(
      <PromptDialog
        title="Prompt"
        description="Enter value"
        onConfirm={onConfirm}
        onCancel={vi.fn()}
        validationSchema={validationSchema}
      />,
    );

    expect(screen.getByRole("button", { name: "확인" })).toBeDisabled();

    fireEvent.change(screen.getByRole("textbox"), { target: { value: "nope" } });

    await waitFor(() => {
      expect(screen.getByText("Value must be ok")).toBeInTheDocument();
    });
    expect(screen.getByRole("button", { name: "확인" })).toBeDisabled();
  });

  it("validationSchema가 있으면 valid 값 입력 후 confirm을 호출한다", async () => {
    const onConfirm = vi.fn();
    const validationSchema = {
      safeParse: (value: string) =>
        value === "ok"
          ? { success: true as const, data: value }
          : {
              success: false as const,
              error: { issues: [{ message: "Value must be ok" }] },
            },
    };

    renderPromptDialog(
      <PromptDialog
        title="Prompt"
        description="Enter value"
        onConfirm={onConfirm}
        onCancel={vi.fn()}
        validationSchema={validationSchema}
      />,
    );

    fireEvent.change(screen.getByRole("textbox"), { target: { value: "ok" } });

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "확인" })).toBeEnabled();
    });

    const dialog = screen.getByRole("dialog");
    const form = dialog.querySelector("form");

    if (!form) {
      throw new Error("Prompt form not found");
    }

    fireEvent.submit(form);

    await waitFor(() => {
      expect(onConfirm).toHaveBeenCalledWith("ok");
    });
  });

  it("cancel 버튼을 누르면 onCancel을 호출한다", () => {
    const onCancel = vi.fn();

    renderPromptDialog(
      <PromptDialog title="Prompt" description="Enter value" onConfirm={vi.fn()} onCancel={onCancel} />,
    );

    fireEvent.click(screen.getByRole("button", { name: "취소" }));

    expect(onCancel).toHaveBeenCalledTimes(1);
  });
});
