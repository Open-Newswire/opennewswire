"use client";

import { runDiagnosticFix } from "@/domains/app-preferences/actions";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function DiagnosticFixButton() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleFix = async () => {
    setIsLoading(true);
    try {
      await runDiagnosticFix();
      router.refresh();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleFix}
      className="bg-yellow-500 hover:bg-yellow-600"
      disabled={isLoading}
    >
      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      Fix Now
    </Button>
  );
}
