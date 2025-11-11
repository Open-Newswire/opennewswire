"use client";

import { updateLanguage } from "@/actions/languages";
import { SaveLanguageParams } from "@/schemas/languages";
import { ContextModalProps } from "@mantine/modals";
import { Language } from "@prisma/client";
import { LanguageEditor } from "../LanguageEditor";

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
