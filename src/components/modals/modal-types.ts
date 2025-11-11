import { AddFeedModal } from "@/components/modals/AddFeedModal";
import { ExportAnalyticsReportModal } from "@/components/modals/ExportAnalyticsReportModal";
import { ReorderLanguagesModal } from "@/components/modals/ReorderLanguagesModal";
import { ModalProps } from "@mantine/core";
import { AddLanguageModal } from "./AddLanguageModal";
import { AddLicenseModal } from "./AddLicenseModal";
import { AddUserModal } from "./AddUserModal";
import { ChangePasswordModal } from "./ChangePasswordModal";
import { EditFeedModal } from "./EditFeedModal";
import { EditLanguageModal } from "./EditLanguageModal";
import { EditLicenseModal } from "./EditLicenseModal";
import { FindFeedModal } from "./FindFeedModal";
import classes from "./modals.module.css";

export enum ModalType {
  AddFeed = "addFeed",
  FindFeed = "findFeed",
  EditFeed = "editFeed",
  AddLicense = "addLicense",
  EditLicense = "editLicense",
  AddLanguage = "addLanguage",
  EditLanguage = "editLanguage",
  ReorderLanguages = "reorderLanguages",
  AddUser = "addUser",
  ChangePassword = "changePassword",
  ExportAnalyticsReport = "exportAnalyticsReport",
}

export const modals = {
  [ModalType.AddFeed]: AddFeedModal,
  [ModalType.FindFeed]: FindFeedModal,
  [ModalType.EditFeed]: EditFeedModal,
  [ModalType.AddLicense]: AddLicenseModal,
  [ModalType.EditLicense]: EditLicenseModal,
  [ModalType.AddLanguage]: AddLanguageModal,
  [ModalType.EditLanguage]: EditLanguageModal,
  [ModalType.AddUser]: AddUserModal,
  [ModalType.ChangePassword]: ChangePasswordModal,
  [ModalType.ReorderLanguages]: ReorderLanguagesModal,
  [ModalType.ExportAnalyticsReport]: ExportAnalyticsReportModal,
};

export const modalProps: Partial<ModalProps> = {
  centered: true,
  transitionProps: {
    transition: "pop",
  },
  overlayProps: {
    backgroundOpacity: 0.55,
    blur: 3,
  },
  classNames: {
    title: classes.title,
  },
};

declare module "@mantine/modals" {
  export interface MantineModalsOverride {
    modals: typeof modals;
  }
}
