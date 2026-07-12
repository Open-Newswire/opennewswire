import { ModalType } from "@/components/shared/modal-types";
import * as actions from "@/domains/licenses/actions";
import { License } from "@/lib/prisma-client";
import { Text } from "@mantine/core";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";

export function addLicense() {
  modals.openContextModal({
    modal: ModalType.AddLicense,
    title: "Add License",
    size: "md",
    innerProps: {},
  });
}

export function editLicense(license: License) {
  modals.openContextModal({
    modal: ModalType.EditLicense,
    title: "Edit License",
    size: "md",
    innerProps: { license },
  });
}

export function deleteLicense(license: License) {
  modals.openConfirmModal({
    title: "Delete License",
    centered: true,
    children: (
      <>
        <Text size="sm">
          Are you sure you want to delete <strong>{license.name}</strong>?
        </Text>
        <Text size="sm" mt="sm">
          Feeds associated this license will <strong>not</strong> be deleted.
        </Text>
      </>
    ),
    labels: { confirm: "Delete License", cancel: "Cancel" },
    confirmProps: { color: "red" },
    onConfirm: async () => {
      await actions.deleteLicense(license.id);

      notifications.show({
        title: "License Deleted",
        message: `${license.name} has been removed.`,
      });
    },
  });
}
