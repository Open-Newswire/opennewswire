"use client";

import { Button } from "@/components/ui/button";
import { addLanguage } from "@/triggers/languages";

export function AddLanguageActionButton() {
  return <Button onClick={addLanguage}>Add Language</Button>;
}
