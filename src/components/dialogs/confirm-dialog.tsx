import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export type ConfirmDialogProps = React.PropsWithChildren<{
  title: React.JSX.Element | string;
  description: React.JSX.Element | string;
  confirmText?: string;
  cancelText?: string;
  onClose: (result: boolean) => void;
  onCancel?: () => void;

  destructive?: boolean;
  disabled?: boolean;
  isPending?: boolean;
}>;

export function ConfirmDialog({
  title,
  description,
  children,
  confirmText = "확인",
  cancelText = "취소",
  onClose,
  onCancel,

  destructive,
  disabled = false,
  isPending,
}: ConfirmDialogProps) {
  return (
    <>
      <AlertDialogHeader className="rounded-none">
        <AlertDialogHeader className="text-start">
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
      </AlertDialogHeader>
      {children}
      <AlertDialogFooter>
        <AlertDialogCancel
          variant="outline"
          disabled={isPending}
          onClick={() => {
            onCancel?.();
            onClose(false);
          }}
        >
          {cancelText}
        </AlertDialogCancel>
        <AlertDialogAction
          variant={destructive ? "destructive" : "default"}
          disabled={disabled || isPending}
          onClick={() => onClose(true)}
        >
          {confirmText}
        </AlertDialogAction>
      </AlertDialogFooter>
    </>
  );
}
