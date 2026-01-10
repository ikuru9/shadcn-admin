import { Button } from "@/components/ui/button";
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { OctagonAlert } from "lucide-react";

export interface ConfirmDialogProps {
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  onClose: (result: boolean) => void;
  onCancel?: () => void;

  destructive?: boolean;
  disabled?: boolean;
  isLoading?: boolean;
}

export function ConfirmDialog({
  title,
  description,
  confirmText = "확인",
  cancelText = "취소",
  onClose,
  onCancel,

  destructive,
  disabled = false,
  isLoading,
}: ConfirmDialogProps) {
  return (
    <>
      <AlertDialogHeader className="rounded-none">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3 py-3 border-b">
            {destructive && (
              <OctagonAlert className="size-5 shrink-0 text-destructive fill-destructive/10" />
            )}
            <AlertDialogTitle>{title}</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="py-3">{description}</AlertDialogDescription>
        </div>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel
          render={
            <Button
              variant="outline"
              disabled={isLoading}
              onClick={() => {
                onCancel?.();
                onClose(false);
              }}
            >
              {cancelText}
            </Button>
          }
        />
        <AlertDialogAction
          render={
            <Button
              variant={destructive ? "destructive" : "default"}
              disabled={disabled || isLoading}
              onClick={() => onClose(true)}
            >
              {confirmText}
            </Button>
          }
        />
      </AlertDialogFooter>
    </>
  );
}
