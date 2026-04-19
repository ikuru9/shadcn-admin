import { createFileRoute } from "@tanstack/react-router";
import { ContentSection } from "@/components/content-section";
import { AccountForm } from "./components/account-form";

const SettingsAccount = () => {
  return (
    <ContentSection title="Account" desc="Update your account settings. Set your preferred language and timezone.">
      <AccountForm />
    </ContentSection>
  );
};

export const Route = createFileRoute("/_authenticated/settings/account")({
  component: SettingsAccount,
});
