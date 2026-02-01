"use client";

import { updateLanguage } from "@/domains/languages/actions";
import { SaveLanguageParams } from "@/domains/languages/schemas";
import { ContextModalProps } from "@mantine/modals";
import { Language } from "@prisma/client";
import { LanguageEditor } from "@/components/admin/languages/LanguageEditor";

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
