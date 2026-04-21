import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FormControl, FormField, FormItem, FormLabel, FormMessage, FormProvider } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

type ValidationResult =
  | { success: true; data: string }
  | { success: false; error: { issues?: Array<{ message: string }> } };

type ValidationSchema = {
  safeParse: (value: string) => ValidationResult;
};

export type PromptDialogProps = React.PropsWithChildren<{
  title: React.JSX.Element | string;
  description: React.JSX.Element | string;
  promptLabel?: string;
  promptPlaceholder?: string;
  defaultValue?: string;
  confirmText?: string;
  cancelText?: string;
  destructive?: boolean;
  validationSchema?: ValidationSchema;
  onConfirm: (value: string) => void;
  onCancel?: () => void;
}>;

export function PromptDialog({
  title,
  description,
  promptLabel = "Value",
  promptPlaceholder,
  defaultValue = "",
  confirmText = "확인",
  cancelText = "취소",
  destructive,
  validationSchema,
  onConfirm,
  onCancel,
  children,
}: PromptDialogProps) {
  const form = useForm<{ value: string }>({
    mode: "onChange",
    defaultValues: { value: defaultValue },
  });

  const value = form.watch("value");
  const validationResult = validationSchema?.safeParse(value);
  const isValid = validationSchema ? validationResult?.success === true : true;

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(({ value }) => onConfirm(value))} className="flex flex-col gap-4">
        <DialogHeader className="text-start">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <FormField
          control={form.control}
          name="value"
          rules={{
            validate: (inputValue) => {
              if (!validationSchema) return true;

              const result = validationSchema.safeParse(inputValue);
              return result.success ? true : (result.error.issues?.[0]?.message ?? "Invalid value");
            },
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{promptLabel}</FormLabel>
              <FormControl>
                <Input {...field} placeholder={promptPlaceholder} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {children}

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              onCancel?.();
            }}
          >
            {cancelText}
          </Button>
          <Button type="submit" variant={destructive ? "destructive" : "default"} disabled={!isValid}>
            {confirmText}
          </Button>
        </DialogFooter>
      </form>
    </FormProvider>
  );
}
