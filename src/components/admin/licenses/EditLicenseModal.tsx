"use client";

import { updateLicense } from "@/domains/licenses/actions";
import { SaveLicenseParams } from "@/domains/licenses/schemas";
import { License } from "@/lib/prisma-client";
import { ContextModalProps } from "@mantine/modals";
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
