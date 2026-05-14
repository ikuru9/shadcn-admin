import { createFileRoute } from "@tanstack/react-router";

import { ContentSection } from "@/components/content-section";
import { createAuthenticatedBeforeLoad } from "@/routes/_authenticated/-auth-guards";
import { NotificationsForm } from "./components/notifications-form";

const menuKey = "/settings/notifications";
const SettingsNotifications = () => {
  return (
    <ContentSection title="Notifications" desc="Configure how you receive notifications.">
      <NotificationsForm />
    </ContentSection>
  );
};

export const Route = createFileRoute("/_authenticated/settings/notifications")({
  beforeLoad: createAuthenticatedBeforeLoad(menuKey),
  component: SettingsNotifications,
});
