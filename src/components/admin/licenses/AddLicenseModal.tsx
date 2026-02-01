"use client";

import { saveNewLicense } from "@/domains/licenses/actions";
import { SaveLicenseParams } from "@/domains/licenses/schemas";
import { ContextModalProps } from "@mantine/modals";
import { LicenseEditor } from "../licenses/LicenseEditor";

export function AddLicenseModal({ context, id }: ContextModalProps) {
  async function handleSubmit(values: SaveLicenseParams) {
    await saveNewLicense(values);
    context.closeModal(id);
  }

  return <LicenseEditor onSubmit={handleSubmit} />;
}
