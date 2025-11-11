"use client";

import { Button } from "@/components/ui/button";
import { addLicense } from "@/triggers/licenses";

export function AddLicenseActionButton() {
  return <Button onClick={addLicense}>Add License</Button>;
}
