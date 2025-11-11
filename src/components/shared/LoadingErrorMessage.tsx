import { Alert, Button, Text } from "@mantine/core";

interface LoadingErrorMessageProps {
  noun: string;
  error: Error & { digest?: string };
  onRetry?: () => void;
}

export function LoadingErrorMessage({
  noun,
  error,
  onRetry,
}: LoadingErrorMessageProps) {
  return (
    <Alert variant="light" color="red" title="Something Went Wrong">
      <Text size="sm" mb="md">
        An unexpected error occured while loading {noun}.
        {onRetry ? " Please try again." : null} If the issue persists, contact
        Open Newswire&apos;s maintainer.
      </Text>
      {onRetry ? (
        <Button color="red" onClick={onRetry}>
          Try Again
        </Button>
      ) : null}
      <Text size="xs" c="red" mt="md">
        {error.name}: {error.message}{" "}
        {error.digest ? " - " + error.digest : null}
      </Text>
    </Alert>
  );
}
