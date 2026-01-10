import { createFileRoute } from "@tanstack/react-router";
import { SignIn } from "@/features/auth/sign-in";
import * as v from "valibot";

const searchSchema = v.object({
  redirect: v.optional(v.string()),
});

export const Route = createFileRoute("/(auth)/sign-in")({
  component: SignIn,
  validateSearch: searchSchema,
});
