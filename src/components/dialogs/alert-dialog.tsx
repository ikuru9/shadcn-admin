import { Button } from "@/components/ui/button";
import {
  AlertDialogAction,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { OctagonAlert } from "lucide-react";

export interface AlertDialogProps {
  title: string;
  description: string;
  okText?: string;
  onClose: (result: boolean) => void;
  onCancel?: () => void;

  destructive: boolean;
  disabled?: boolean;
  isLoading?: boolean;
}

export function AlertDialog({
  title,
  description,
  okText = "확인",
  onClose,

  destructive,
  disabled = false,
  isLoading,
}: AlertDialogProps) {
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
        <AlertDialogAction>
          <Button
            variant={destructive ? "destructive" : "default"}
            disabled={disabled || isLoading}
            onClick={() => onClose(true)}
          >
            {okText}
          </Button>
        </AlertDialogAction>
      </AlertDialogFooter>
    </>
  );
}
