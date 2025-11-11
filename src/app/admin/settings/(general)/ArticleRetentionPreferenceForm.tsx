"use client";

import { setPreference } from "@/actions/app-preferences";
import { ArticleRetentionPreference } from "@/schemas/app-preferences";
import { Group, NumberInput, Select, Text } from "@mantine/core";
import { useForm } from "@mantine/form";
import { z } from "zod";

interface ArticleRetentionPreferenceFormProps {
  value: z.infer<(typeof ArticleRetentionPreference)["schema"]>;
}

export function ArticleRetentionPreferenceForm({
  value,
}: ArticleRetentionPreferenceFormProps) {
  async function handleSyncFrequencyChange(
    value: z.infer<(typeof ArticleRetentionPreference)["schema"]>,
  ) {
    await setPreference(ArticleRetentionPreference, value);
  }

  const form = useForm({
    mode: "uncontrolled",
    initialValues: value,
    onValuesChange: async (values) => {
      await handleSyncFrequencyChange(values);
    },
  });

  return (
    <Group pb="lg" gap="xs">
      <Text size="sm">Keep the last </Text>
      <NumberInput
        display="inline-block"
        w="5rem"
        {...form.getInputProps("period")}
      />
      <Select
        display="inline-block"
        w="7rem"
        data={["days", "weeks", "months"]}
        {...form.getInputProps("unit")}
      ></Select>
      <Text size="sm">of articles or</Text>
      <NumberInput
        display="inline-block"
        w="5rem"
        {...form.getInputProps("minCount")}
      />
      <Text size="sm">minimum articles per feed.</Text>
    </Group>
  );
}
