import { ModalType } from "@/components/modals/modal-types";
import { modals } from "@mantine/modals";

export function exportReport() {
  modals.openContextModal({
    modal: ModalType.ExportAnalyticsReport,
    title: "Export Report",
    size: "lg",
    innerProps: {},
  });
}
