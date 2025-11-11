"use client";

import { createUser } from "@/actions/users";
import { CreateUserParams } from "@/schemas/users";
import { ContextModalProps } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { CreateUserEditor } from "../UserEditor";

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
