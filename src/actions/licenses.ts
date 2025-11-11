"use server";

import { requireAuth } from "@/actions/auth-wrapper";
import { SaveLicenseParams, SaveLicenseSchema } from "@/schemas/licenses";
import * as LicenseService from "@/services/licenses";
import { parseSchemaWithDefaults } from "@/utils/parse-schema-with-defaults";
import { revalidatePath } from "next/cache";

export async function fetchLicenses() {
  return LicenseService.fetchLicenses();
}

export const saveNewLicense = requireAuth(async function saveNewLicense(
  untrustedParams: SaveLicenseParams,
) {
  const params = parseSchemaWithDefaults(SaveLicenseSchema, untrustedParams);
  const license = await LicenseService.saveLicense(params);

  revalidatePath("/admin/licenses");

  return license;
});

export const updateLicense = requireAuth(async function updateLicense(
  id: string,
  untrustedParams: SaveLicenseParams,
) {
  const params = parseSchemaWithDefaults(SaveLicenseSchema, untrustedParams);
  const license = await LicenseService.updateLicense(id, params);

  revalidatePath(`/admin/licenses/${id}`);

  return license;
});

export const deleteLicense = requireAuth(async function deleteLicense(
  id: string,
) {
  await LicenseService.deleteLicense(id);

  revalidatePath("/admin/licenses");
});
