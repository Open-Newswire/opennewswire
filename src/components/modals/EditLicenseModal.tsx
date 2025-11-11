"use client";

import { updateLicense } from "@/actions/licenses";
import { SaveLicenseParams } from "@/schemas/licenses";
import { ContextModalProps } from "@mantine/modals";
import { License } from "@prisma/client";
import { LicenseEditor } from "../licenses/LicenseEditor";

export function EditLicenseModal({
  context,
  id,
  innerProps,
}: ContextModalProps<{ license: License }>) {
  async function handleSubmit(values: SaveLicenseParams) {
    await updateLicense(innerProps.license.id, values);
    context.closeModal(id);
  }

  return <LicenseEditor license={innerProps.license} onSubmit={handleSubmit} />;
}
