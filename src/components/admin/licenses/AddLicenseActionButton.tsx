"use client";

import { Button } from "@/components/ui/button";
import { addLicense } from "@/domains/licenses/triggers";

export function AddLicenseActionButton() {
  return <Button onClick={addLicense}>Add License</Button>;
}
