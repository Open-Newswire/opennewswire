"use client";

import { getFeedSummary } from "@/domains/feeds/actions";
import { FeedPreview } from "@/domains/feeds/types";
import isValidUrl from "@/utils/is-valid-url";
import { Button, Group, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { ContextModalProps } from "@mantine/modals";
import { useState } from "react";

export function FindFeedModal({
  context,
  id,
  innerProps,
}: ContextModalProps<{ onNext: (feed: FeedPreview) => void }>) {
  const [isLoading, setLoading] = useState(false);
  const [erroredUrl, setErroredUrl] = useState<string>();
  const form = useForm({
    initialValues: {
      url: "",
    },
    validate: {
      url: (value) => (isValidUrl(value) ? null : "Enter a valid url"),
    },
  });

  async function handleSubmit(values: { url: string }) {
    setLoading(true);
    try {
      const result = await getFeedSummary(values.url);
      innerProps.onNext(result);
      context.closeModal(id);
    } catch (e) {
      form.setFieldError(
        "url",
        "Open Newswire was unable to verify this URL as a valid feed",
      );
      setErroredUrl(values.url);
    } finally {
      setLoading(false);
    }
  }

  async function handleContinue() {
    if (!erroredUrl) {
      return;
    }

    innerProps.onNext({ url: erroredUrl });
  }

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <TextInput
        variant="filled"
        withAsterisk
        label="Feed URL"
        placeholder="https://url.to/feed"
        data-autofocus
        {...form.getInputProps("url")}
      />
      <Group justify="flex-end" mt="md">
        {erroredUrl == form.values.url ? (
          <Button variant="default" onClick={handleContinue}>
            Continue Anyway
          </Button>
        ) : null}
        <Button type="submit" loading={isLoading}>
          {erroredUrl == form.values.url ? "Try Again" : "Next"}
        </Button>
      </Group>
    </form>
  );
}
