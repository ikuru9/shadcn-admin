import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  useDialog: vi.fn(),
  alertRoot: vi.fn(),
  alertContent: vi.fn(),
  dialogRoot: vi.fn(),
  dialogContent: vi.fn(),
  closeDialog: vi.fn(),
  cancelDialog: vi.fn(),
}));

vi.mock("@/hooks/use-dialog", () => ({
  useDialog: mocks.useDialog,
}));

vi.mock("@/components/ui/alert-dialog", () => ({
  AlertDialog: (props: any) => mocks.alertRoot(props),
  AlertDialogContent: (props: any) => mocks.alertContent(props),
}));

vi.mock("@/components/ui/dialog", () => ({
  Dialog: (props: any) => mocks.dialogRoot(props),
  DialogContent: (props: any) => mocks.dialogContent(props),
}));

import { Dialoger } from "@/components/dialogs/dialoger";

// biome-ignore lint/style/useComponentExportOnlyModules: MockDialogComponent
function MockDialogComponent(props: {
  label?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  className?: string;
}) {
  return <div data-testid={`dialog-component-${props.label}`}>{props.label}</div>;
}

// biome-ignore lint/style/useComponentExportOnlyModules: MockAlertComponent
function MockAlertComponent(props: {
  label?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  className?: string;
}) {
  return <div data-testid={`alert-component-${props.label}`}>{props.label}</div>;
}

describe("Dialoger", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mocks.useDialog.mockReturnValue({
      dialogs: new Map([
        [
          "alert-1",
          {
            component: MockAlertComponent,
            props: { label: "alert", className: "alert-class" },
            open: true,
            surface: "alert",
            resolve: vi.fn(),
          },
        ],
        [
          "dialog-1",
          {
            component: MockDialogComponent,
            props: { label: "dialog", className: "dialog-class" },
            open: true,
            surface: "dialog",
            resolve: vi.fn(),
          },
        ],
        [
          "closed-1",
          {
            component: MockDialogComponent,
            props: { label: "closed" },
            open: false,
            surface: "dialog",
            resolve: vi.fn(),
          },
        ],
      ]),
      closeDialog: mocks.closeDialog,
      cancelDialog: mocks.cancelDialog,
    });

    mocks.alertRoot.mockImplementation(({ children }: any) => <div data-testid="alert-root">{children}</div>);
    mocks.alertContent.mockImplementation(({ children, className, style }: any) => (
      <div data-testid="alert-content" data-classname={className} data-zindex={style?.zIndex}>
        {children}
      </div>
    ));
    mocks.dialogRoot.mockImplementation(({ children }: any) => <div data-testid="dialog-root">{children}</div>);
    mocks.dialogContent.mockImplementation(({ children, className, style }: any) => (
      <div data-testid="dialog-content" data-classname={className} data-zindex={style?.zIndex}>
        {children}
      </div>
    ));
  });

  it("열린 dialog만 렌더링하고 surface에 따라 wrapper를 선택한다", () => {
    render(<Dialoger />);

    expect(screen.getByTestId("alert-root")).toBeInTheDocument();
    expect(screen.getByTestId("dialog-root")).toBeInTheDocument();
    expect(screen.getByTestId("alert-component-alert")).toBeInTheDocument();
    expect(screen.getByTestId("dialog-component-dialog")).toBeInTheDocument();
    expect(screen.queryByTestId("dialog-component-closed")).not.toBeInTheDocument();

    expect(mocks.alertContent).toHaveBeenCalledWith(
      expect.objectContaining({ className: "alert-class", style: { zIndex: 50 } }),
    );
    expect(mocks.dialogContent).toHaveBeenCalledWith(
      expect.objectContaining({ className: "dialog-class", style: { zIndex: 51 } }),
    );
  });

  it("wrapper에는 onOpenChange가 연결되고 inner component에는 className이 전달되지 않는다", () => {
    render(<Dialoger />);

    const alertRootProps = mocks.alertRoot.mock.calls[0]?.[0];
    const dialogRootProps = mocks.dialogRoot.mock.calls[0]?.[0];
    const alertComponentProps = mocks.alertContent.mock.calls[0]?.[0].children.props;
    const dialogComponentProps = mocks.dialogContent.mock.calls[0]?.[0].children.props;

    expect(alertRootProps.onOpenChange).toEqual(expect.any(Function));
    expect(dialogRootProps.onOpenChange).toEqual(expect.any(Function));

    alertRootProps.onOpenChange(false);
    dialogRootProps.onOpenChange(false);

    expect(mocks.cancelDialog).toHaveBeenCalledTimes(2);
    expect(alertComponentProps.className).toBeUndefined();
    expect(dialogComponentProps.className).toBeUndefined();
    expect(alertComponentProps.onConfirm).toBe(mocks.closeDialog);
    expect(alertComponentProps.onCancel).toBe(mocks.cancelDialog);
    expect(dialogComponentProps.onConfirm).toBe(mocks.closeDialog);
    expect(dialogComponentProps.onCancel).toBe(mocks.cancelDialog);
  });
});
