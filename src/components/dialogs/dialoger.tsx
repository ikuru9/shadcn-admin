import { AlertDialog, AlertDialogContent } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useDialog } from "@/hooks/use-dialog";
import { cn } from "@/lib/utils";

export function Dialoger() {
  const { dialogs, closeDialog, cancelDialog } = useDialog();

  return (
    <>
      {Array.from(dialogs.entries()).map(([key, dialog], index) => {
        const { component: Component, props: _props, open, isAlertDialog } = dialog;
        if (!Component || !open) return null;

        const props = (() => {
          const { className: _, ...props } = _props;
          return props;
        })();

        const zIndex = 50 + index; // Base z-index for dialogs

        if (isAlertDialog) {
          return (
            <AlertDialog key={key} open={open} onOpenChange={(open) => !open && cancelDialog()}>
              <AlertDialogContent className={cn(_props.className && _props.className)} style={{ zIndex }}>
                <Component {...props} onClose={closeDialog} onCancel={cancelDialog} />
              </AlertDialogContent>
            </AlertDialog>
          );
        }
        return (
          <Dialog key={key} open={open} onOpenChange={(open) => !open && cancelDialog()}>
            <DialogContent className={cn(_props.className && _props.className)} style={{ zIndex }}>
              <Component {...props} onClose={closeDialog} onCancel={cancelDialog} />
            </DialogContent>
          </Dialog>
        );
      })}
    </>
  );
}
