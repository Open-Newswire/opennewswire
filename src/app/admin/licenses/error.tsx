"use client";

import { LoadingErrorMessage } from "@/components/shared/LoadingErrorMessage";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <LoadingErrorMessage noun="licenses" error={error} onRetry={reset} />;
}
