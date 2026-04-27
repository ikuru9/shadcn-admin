import { Link, useNavigate } from "@tanstack/react-router";
import { Loader2, LogIn } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type * as z from "zod/mini";

import { IconFacebook, IconGithub } from "@/assets/brand-icons";
import { PasswordInput } from "@/components/custom-input/password-input";
import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormLabel, FormMessage, FormProvider } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useLogin } from "@/gen/hooks";
import { loginRequestSchema } from "@/gen/zod";
import { cn } from "@/lib/utils";
import { zodMiniResolver } from "@/lib/zod-mini-resolver";
import { useAuthStore } from "@/stores/auth-store";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLFormElement> {
  redirectTo?: string;
}

type UserAuthFormSchema = z.infer<typeof loginRequestSchema>;

export function UserAuthForm({ className, redirectTo, ...props }: UserAuthFormProps) {
  const navigate = useNavigate();
  const { setAccessToken } = useAuthStore();
  const { isPending, mutateAsync: handleLogin } = useLogin({
    mutation: {
      gcTime: Infinity,
      onSuccess: async (response) => {
        await setAccessToken({
          accessToken: response.accessToken,
          refreshToken: response.refreshToken,
          user: response.user,
        });
      },
    },
  });

  const form = useForm<UserAuthFormSchema>({
    resolver: zodMiniResolver(loginRequestSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(data: UserAuthFormSchema) {
    toast.promise(handleLogin({ data }), {
      loading: "Signing in...",
      success: () => {
        const targetPath = redirectTo || "/";
        navigate({ to: targetPath, replace: true });

        return `Welcome back, ${data.email}!`;
      },
      error: "Error",
    });
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={cn("grid gap-3", className)} {...props}>
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
            <FormItem className="relative">
              <FormLabel>Password</FormLabel>
              <FormControl>
                <PasswordInput placeholder="********" {...field} />
              </FormControl>
              <FormMessage />
              <Link
                to="/forgot-password"
                className="absolute inset-e-0 -top-0.5 font-medium text-muted-foreground text-sm hover:opacity-75"
              >
                Forgot password?
              </Link>
            </FormItem>
          )}
        />
        <Button className="mt-2" type="submit" disabled={isPending}>
          {isPending ? <Loader2 className="animate-spin" /> : <LogIn />}
          Sign in
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
          <Button variant="outline" type="button" disabled={isPending}>
            <IconGithub className="h-4 w-4" /> GitHub
          </Button>
          <Button variant="outline" type="button" disabled={isPending}>
            <IconFacebook className="h-4 w-4" /> Facebook
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
