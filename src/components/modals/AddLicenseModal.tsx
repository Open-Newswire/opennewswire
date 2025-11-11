"use client";

import { saveNewLicense } from "@/actions/licenses";
import { SaveLicenseParams } from "@/schemas/licenses";
import { ContextModalProps } from "@mantine/modals";
import { LicenseEditor } from "../licenses/LicenseEditor";

export function AddLicenseModal({ context, id }: ContextModalProps) {
  async function handleSubmit(values: SaveLicenseParams) {
    await saveNewLicense(values);
    context.closeModal(id);
  }

  return <LicenseEditor onSubmit={handleSubmit} />;
}
