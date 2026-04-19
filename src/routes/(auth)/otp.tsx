import { createFileRoute, Link } from "@tanstack/react-router";

import { AuthLayout } from "@/components/layout/auth-layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

import { OtpForm } from "./components/otp-form";

function Otp() {
  return (
    <AuthLayout>
      <Card className="gap-4">
        <CardHeader>
          <CardTitle className="text-base tracking-tight">Two-factor Authentication</CardTitle>
          <CardDescription>
            Please enter the authentication code. <br /> We have sent the authentication code to your email.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <OtpForm />
        </CardContent>
        <CardFooter>
          <p className="px-8 text-center text-muted-foreground text-sm">
            Haven&apos;t received it?{" "}
            <Link to="/sign-in" className="underline underline-offset-4 hover:text-primary">
              Resend a new code.
            </Link>
            .
          </p>
        </CardFooter>
      </Card>
    </AuthLayout>
  );
}

export const Route = createFileRoute("/(auth)/otp")({
  component: Otp,
});
