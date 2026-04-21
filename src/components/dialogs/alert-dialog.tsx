import {
  AlertDialogAction,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export type AlertDialogProps = React.PropsWithChildren<{
  title: React.JSX.Element | string;
  description: React.JSX.Element | string;
  okText?: string;
  onConfirm: () => void;
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
  onConfirm,

  destructive,
  disabled = false,
  isLoading,
}: AlertDialogProps) {
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
        <AlertDialogAction
          variant={destructive ? "destructive" : "default"}
          disabled={disabled || isLoading}
          onClick={() => onConfirm()}
        >
          {okText}
        </AlertDialogAction>
      </AlertDialogFooter>
    </>
  );
}
