import { useState } from "react";

import { useNavigate } from "@tanstack/react-router";
import { ArrowRight, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod/mini";

import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormLabel, FormMessage, FormProvider } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { sleep } from "@/lib/sleep";
import { cn } from "@/lib/utils";
import { zodMiniResolver } from "@/lib/zod-mini-resolver";

const formSchema = z.object({
  email: z.email("Please enter your email"),
});

export function ForgotPasswordForm({ className, ...props }: React.HTMLAttributes<HTMLFormElement>) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodMiniResolver(formSchema),
    defaultValues: { email: "" },
  });

  function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true);

    console.log(data);

    toast.promise(sleep(2000), {
      loading: "Sending email...",
      success: () => {
        setIsLoading(false);
        form.reset();
        navigate({ to: "/otp" });
        return `Email sent to ${data.email}`;
      },
      error: "Error",
    });
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={cn("grid gap-2", className)} {...props}>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="name@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="mt-2" disabled={isLoading}>
          Continue
          {isLoading ? <Loader2 className="animate-spin" /> : <ArrowRight />}
        </Button>
      </form>
    </FormProvider>
  );
}
