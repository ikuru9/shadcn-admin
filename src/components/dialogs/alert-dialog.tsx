import {
  AlertDialogAction,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

export type AlertDialogProps = React.PropsWithChildren<{
  title: React.JSX.Element | string;
  description: React.JSX.Element | string;
  okText?: string;
  onClose: (result: boolean) => void;
  onCancel?: () => void;

  destructive: boolean;
  disabled?: boolean;
  isLoading?: boolean;
}>;

export function AlertDialog({
  title,
  description,
  children,

  okText = "확인",
  onClose,

  destructive,
  disabled = false,
  isLoading,
}: AlertDialogProps) {
  return (
    <>
      <AlertDialogHeader className="rounded-none">
        <AlertDialogHeader className="text-start">
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div>{description}</div>
          </AlertDialogDescription>
        </AlertDialogHeader>
      </AlertDialogHeader>
      {children}
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
