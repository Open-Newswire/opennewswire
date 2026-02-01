"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function QueryAwareNavButton({
  title,
  subpath,
}: {
  title: string;
  subpath: string;
}) {
  const router = useRouter();

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() =>
        router.push(`/admin/analytics/${subpath}${window.location.search}`)
      }
    >
      {title}
    </Button>
  );
}
