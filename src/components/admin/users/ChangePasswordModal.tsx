"use client";

import { changePassword } from "@/domains/users/actions";
import { ChangePasswordParams } from "@/domains/users/schemas";
import { ContextModalProps } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { PasswordEditor } from "@/components/admin/users/PasswordEditor";

export function ChangePasswordModal({ context, id }: ContextModalProps) {
  async function handleSubmit(params: ChangePasswordParams) {
    context.closeModal(id);

    await changePassword(params);

    notifications.show({
      title: "Password Changed",
      message: `Your password has been updated.`,
    });
  }

  return <PasswordEditor onSubmit={handleSubmit} />;
}
