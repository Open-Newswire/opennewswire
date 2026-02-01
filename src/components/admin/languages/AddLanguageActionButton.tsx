"use client";

import { Button } from "@/components/ui/button";
import { addLanguage } from "@/domains/languages/triggers";

export function AddLanguageActionButton() {
  return <Button onClick={addLanguage}>Add Language</Button>;
}
