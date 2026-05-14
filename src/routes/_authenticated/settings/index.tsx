import { createFileRoute } from "@tanstack/react-router";
import { ContentSection } from "@/components/content-section";
import { createAuthenticatedBeforeLoad } from "@/routes/_authenticated/-auth-guards";
import { ProfileForm } from "./components/profile-form";

const menuKey = "/settings/";
const SettingsProfile = () => {
  return (
    <ContentSection title="Profile" desc="This is how others will see you on the site.">
      <ProfileForm />
    </ContentSection>
  );
};

export const Route = createFileRoute("/_authenticated/settings/")({
  beforeLoad: createAuthenticatedBeforeLoad(menuKey),
  component: SettingsProfile,
});
