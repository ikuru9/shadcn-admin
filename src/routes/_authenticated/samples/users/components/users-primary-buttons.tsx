import { MailPlus, UserPlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useDialog } from "@/hooks/use-dialog";

import { UsersActionDialog } from "./users-action-dialog";
import { UsersInviteDialog } from "./users-invite-dialog";

export function UsersPrimaryButtons() {
  const { openDialog } = useDialog();
  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        className="space-x-1"
        onClick={() => {
          void openDialog(UsersInviteDialog, { className: "sm:max-w-md" });
        }}
      >
        <span>Invite User</span> <MailPlus size={18} />
      </Button>
      <Button
        className="space-x-1"
        onClick={() => {
          void openDialog(UsersActionDialog, { className: "sm:max-w-lg" });
        }}
      >
        <span>Add User</span> <UserPlus size={18} />
      </Button>
    </div>
  );
}
