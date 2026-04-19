import { createFileRoute } from "@tanstack/react-router";
import { ContentSection } from "@/components/content-section";
import { NotificationsForm } from "./components/notifications-form";

const SettingsNotifications = () => {
  return (
    <ContentSection title="Notifications" desc="Configure how you receive notifications.">
      <NotificationsForm />
    </ContentSection>
  );
};

export const Route = createFileRoute("/_authenticated/settings/notifications")({
  component: SettingsNotifications,
});
