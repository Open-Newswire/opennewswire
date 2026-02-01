import * as actions from "@/domains/languages/actions";
import { ModalType } from "@/components/shared/modal-types";
import { Text } from "@mantine/core";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { Language } from "@prisma/client";

export function addLanguage() {
  modals.openContextModal({
    modal: ModalType.AddLanguage,
    title: "Add Language",
    size: "md",
    innerProps: {},
  });
}

export function editLanguage(language: Language) {
  modals.openContextModal({
    modal: ModalType.EditLanguage,
    title: "Edit Language",
    size: "md",
    innerProps: { language },
  });
}

export function deleteLanguage(language: Language) {
  modals.openConfirmModal({
    title: "Delete Language",
    centered: true,
    children: (
      <>
        <Text size="sm">
          Are you sure you want to delete <strong>{language.name}</strong>?
        </Text>
        <Text size="sm" mt="sm">
          Feeds associated this language will not be deleted.
        </Text>
      </>
    ),
    labels: { confirm: "Delete Language", cancel: "Cancel" },
    confirmProps: { color: "red" },
    onConfirm: async () => {
      await actions.deleteLanguage(language.id);

      notifications.show({
        title: "Language Deleted",
        message: `${language.name} has been removed.`,
      });
    },
  });
}

export function reorderLanguages() {
  modals.openContextModal({
    modal: ModalType.ReorderLanguages,
    title: "Reorder Languages",
    size: "lg",
    // removeScrollProps: { enabled: false },
    innerProps: {},
  });
}
