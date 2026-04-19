import { createFileRoute } from "@tanstack/react-router";
import { ContentSection } from "@/components/content-section";
import { DisplayForm } from "./components/display-form";

const SettingsDisplay = () => {
  return (
    <ContentSection title="Display" desc="Turn items on or off to control what's displayed in the app.">
      <DisplayForm />
    </ContentSection>
  );
};

export const Route = createFileRoute("/_authenticated/settings/display")({
  component: SettingsDisplay,
});
