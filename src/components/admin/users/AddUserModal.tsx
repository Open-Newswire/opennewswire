"use client";

import { createUser } from "@/domains/users/actions";
import { CreateUserParams } from "@/domains/users/schemas";
import { ContextModalProps } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { CreateUserEditor } from "@/components/admin/users/UserEditor";

export function AddUserModal({ context, id }: ContextModalProps) {
  async function handleSubmit(params: CreateUserParams) {
    await createUser(params);
    context.closeModal(id);

    notifications.show({
      title: "User Created",
      message: `${params.name} has been added as a user.`,
    });
  }

  return <CreateUserEditor onSubmit={handleSubmit} />;
}
