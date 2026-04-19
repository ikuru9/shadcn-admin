import { createFileRoute } from "@tanstack/react-router";
import { ContentSection } from "@/components/content-section";
import { ProfileForm } from "./components/profile-form";

const SettingsProfile = () => {
  return (
    <ContentSection title="Profile" desc="This is how others will see you on the site.">
      <ProfileForm />
    </ContentSection>
  );
};

export const Route = createFileRoute("/_authenticated/settings/")({
  component: SettingsProfile,
});
