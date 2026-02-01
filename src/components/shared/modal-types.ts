import { AddFeedModal } from "@/components/admin/feeds/AddFeedModal";
import { ExportAnalyticsReportModal } from "@/components/admin/analytics/ExportAnalyticsReportModal";
import { ReorderLanguagesModal } from "@/components/admin/languages/ReorderLanguagesModal";
import { ModalProps } from "@mantine/core";
import { AddLanguageModal } from "@/components/admin/languages/AddLanguageModal";
import { AddLicenseModal } from "@/components/admin/licenses/AddLicenseModal";
import { AddUserModal } from "@/components/admin/users/AddUserModal";
import { ChangePasswordModal } from "@/components/admin/users/ChangePasswordModal";
import { EditFeedModal } from "@/components/admin/feeds/EditFeedModal";
import { EditLanguageModal } from "@/components/admin/languages/EditLanguageModal";
import { EditLicenseModal } from "@/components/admin/licenses/EditLicenseModal";
import { FindFeedModal } from "@/components/admin/feeds/FindFeedModal";
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
