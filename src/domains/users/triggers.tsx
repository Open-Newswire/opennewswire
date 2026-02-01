import * as actions from "@/domains/users/actions";
import { ModalType } from "@/components/shared/modal-types";
import { User } from "@/domains/users/types";
import { Text } from "@mantine/core";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";

export function addUser() {
  modals.openContextModal({
    modal: ModalType.AddUser,
    title: "Add User",
    size: "md",
    innerProps: {},
  });
}

export function changePassword() {
  modals.openContextModal({
    modal: ModalType.ChangePassword,
    title: "Change Password",
    size: "md",
    innerProps: {},
  });
}

export function removeUser(user: User) {
  modals.openConfirmModal({
    title: "Remove User",
    centered: true,
    children: (
      <>
        <Text size="sm">
          Are you sure you want to remove <strong>{user.name}</strong>?
        </Text>
        <Text size="sm" mt="sm">
          {user.name} will no longer have access to the Open Newswire admin
          panel.
        </Text>
      </>
    ),
    labels: { confirm: "Remove User", cancel: "Cancel" },
    confirmProps: { color: "red" },
    onConfirm: async () => {
      await actions.deleteUser(user.id);

      notifications.show({
        title: "User Removed",
        message: `${user.name} has been removed.`,
      });
    },
  });
}
