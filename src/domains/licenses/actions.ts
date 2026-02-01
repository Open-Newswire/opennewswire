"use server";

import { requireAuth } from "@/domains/auth/wrapper";
import { SaveLicenseParams, SaveLicenseSchema } from "@/domains/licenses/schemas";
import * as LicenseService from "@/domains/licenses/service";
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
