import { createFileRoute } from "@tanstack/react-router";

import { ContentSection } from "@/components/content-section";

import { AppearanceForm } from "./components/appearance-form";

const SettingsAppearance = () => {
  return (
    <ContentSection
      title="Appearance"
      desc="Customize the appearance of the app. Automatically switch between day and night themes."
    >
      <AppearanceForm />
    </ContentSection>
  );
};

export const Route = createFileRoute("/_authenticated/settings/appearance")({
  component: SettingsAppearance,
});
