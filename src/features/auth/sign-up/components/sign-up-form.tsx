import { useState } from "react";
import * as v from "valibot";
import { useForm } from "react-hook-form";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { IconFacebook, IconGithub } from "@/assets/brand-icons";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/password-input";

const formSchema = v.pipe(
  v.object({
    email: v.pipe(v.string(), v.email("Please enter your email")),
    password: v.pipe(
      v.string(),
      v.minLength(1, "Please enter your password"),
      v.minLength(7, "Password must be at least 7 characters long"),
    ),
    confirmPassword: v.pipe(v.string(), v.minLength(1, "Please confirm your password")),
  }),
  v.forward(
    v.check((input) => input.password === input.confirmPassword, "Passwords don't match."),
    ["confirmPassword"],
  ),
);

export function SignUpForm({ className, ...props }: React.HTMLAttributes<HTMLFormElement>) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<v.InferOutput<typeof formSchema>>({
    resolver: valibotResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  function onSubmit(data: v.InferOutput<typeof formSchema>) {
    setIsLoading(true);
    // oxlint-disable-next-line no-console
    console.log(data);

    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("grid gap-3", className)}
        {...props}
      >
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
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <PasswordInput placeholder="********" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <PasswordInput placeholder="********" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="mt-2" disabled={isLoading}>
          Create Account
        </Button>

        <div className="relative my-2">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" className="w-full" type="button" disabled={isLoading}>
            <IconGithub className="h-4 w-4" /> GitHub
          </Button>
          <Button variant="outline" className="w-full" type="button" disabled={isLoading}>
            <IconFacebook className="h-4 w-4" /> Facebook
          </Button>
        </div>
      </form>
    </Form>
  );
}
