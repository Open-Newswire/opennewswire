"use client";

import { LoadingErrorMessage } from "@/components/shared/LoadingErrorMessage";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <LoadingErrorMessage noun="languages" error={error} onRetry={reset} />;
}
