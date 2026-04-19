import { createFileRoute } from "@tanstack/react-router";
import * as z from "zod/mini";
import { useSearch } from "@tanstack/react-router";

import { AuthLayout } from "@/components/layout/auth-layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

import { UserAuthForm } from "./components/user-auth-form";

const searchSchema = z.object({
  redirect: z.optional(z.string()),
});

function SignIn() {
  const { redirect } = useSearch({ from: "/(auth)/sign-in" });

  return (
    <AuthLayout>
      <Card className="gap-4">
        <CardHeader>
          <CardTitle className="text-lg tracking-tight">Sign in</CardTitle>
          <CardDescription>
            Enter your email and password below to <br />
            log into your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UserAuthForm redirectTo={redirect} />
        </CardContent>
        <CardFooter>
          <p className="px-8 text-center text-muted-foreground text-sm">
            By clicking sign in, you agree to our{" "}
            <a href="/terms" className="underline underline-offset-4 hover:text-primary">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="/privacy" className="underline underline-offset-4 hover:text-primary">
              Privacy Policy
            </a>
            .
          </p>
        </CardFooter>
      </Card>
    </AuthLayout>
  );
}

export const Route = createFileRoute("/(auth)/sign-in")({
  component: SignIn,
  validateSearch: searchSchema,
});
