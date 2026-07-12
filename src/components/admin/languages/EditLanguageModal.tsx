"use client";

import { LanguageEditor } from "@/components/admin/languages/LanguageEditor";
import { updateLanguage } from "@/domains/languages/actions";
import { SaveLanguageParams } from "@/domains/languages/schemas";
import { Language } from "@/lib/prisma-client";
import { ContextModalProps } from "@mantine/modals";

export function EditLanguageModal({
  context,
  id,
  innerProps,
}: ContextModalProps<{ language: Language }>) {
  async function handleSubmit(params: SaveLanguageParams) {
    await updateLanguage(innerProps.language.id, params);
    context.closeModal(id);
  }

  return (
    <LanguageEditor language={innerProps.language} onSubmit={handleSubmit} />
  );
}
