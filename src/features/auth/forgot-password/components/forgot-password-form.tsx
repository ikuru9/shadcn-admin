import { useState } from "react";

import { valibotResolver } from "@hookform/resolvers/valibot";
import { useNavigate } from "@tanstack/react-router";
import { ArrowRight, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as v from "valibot";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn, sleep } from "@/lib/utils";

const formSchema = v.object({
  email: v.pipe(v.string(), v.email("Please enter your email")),
});

export function ForgotPasswordForm({ className, ...props }: React.HTMLAttributes<HTMLFormElement>) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<v.InferOutput<typeof formSchema>>({
    resolver: valibotResolver(formSchema),
    defaultValues: { email: "" },
  });

  function onSubmit(data: v.InferOutput<typeof formSchema>) {
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
    <Form {...form}>
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
    </Form>
  );
}
