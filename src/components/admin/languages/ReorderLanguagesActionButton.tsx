"use client";

import { Button } from "@/components/ui/button";
import { reorderLanguages } from "@/domains/languages/triggers";

export function ReorderLanguagesActionButton() {
  return (
    <Button variant="secondary" onClick={reorderLanguages}>
      Reorder
    </Button>
  );
}
