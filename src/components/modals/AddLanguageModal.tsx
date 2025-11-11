"use client";

import { saveNewLanguage } from "@/actions/languages";
import { SaveLanguageParams } from "@/schemas/languages";
import { ContextModalProps } from "@mantine/modals";
import { LanguageEditor } from "../LanguageEditor";

export function AddLanguageModal({ context, id }: ContextModalProps) {
  async function handleSubmit(params: SaveLanguageParams) {
    await saveNewLanguage(params);
    context.closeModal(id);
  }

  return <LanguageEditor onSubmit={handleSubmit} />;
}
