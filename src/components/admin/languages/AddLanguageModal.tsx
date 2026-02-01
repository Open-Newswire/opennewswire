"use client";

import { saveNewLanguage } from "@/domains/languages/actions";
import { SaveLanguageParams } from "@/domains/languages/schemas";
import { ContextModalProps } from "@mantine/modals";
import { LanguageEditor } from "@/components/admin/languages/LanguageEditor";

export function AddLanguageModal({ context, id }: ContextModalProps) {
  async function handleSubmit(params: SaveLanguageParams) {
    await saveNewLanguage(params);
    context.closeModal(id);
  }

  return <LanguageEditor onSubmit={handleSubmit} />;
}
