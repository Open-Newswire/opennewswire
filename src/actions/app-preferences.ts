"use server";

import { requireAuth } from "@/actions/auth-wrapper";
import * as AppPreferencesService from "@/services/app-preferences";
import { AppPreference, AppPreferenceSchema } from "@/types/app-preferences";
import { z } from "zod";

export const getPreference = requireAuth(async function getPreference<
  S extends AppPreferenceSchema,
>(preference: AppPreference<S>) {
  return AppPreferencesService.getPreference(preference);
});

export const setPreference = requireAuth(async function setPreference<
  S extends AppPreferenceSchema,
>(preference: AppPreference<S>, value: z.infer<S>) {
  return AppPreferencesService.setPreference(preference, value);
});

export const getDiagnosticsReport = requireAuth(
  async function getDiagnosticsReport() {
    return AppPreferencesService.getDiagnosticsReport();
  },
);

export const runDiagnosticFix = requireAuth(async function runDiagnosticFix() {
  await AppPreferencesService.runDiagnosticFix();
});
