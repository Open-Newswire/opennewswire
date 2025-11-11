"use client";

import { setPreference } from "@/actions/app-preferences";
import { SyncJobHistoryRetentionPreference } from "@/schemas/app-preferences";
import { Group, NumberInput, Select, Text } from "@mantine/core";
import { useForm } from "@mantine/form";
import { z } from "zod";

export function SyncJobHistoryRetentionPreferenceForm({
  value,
}: {
  value: z.infer<(typeof SyncJobHistoryRetentionPreference)["schema"]>;
}) {
  async function handleSyncFrequencyChange(
    value: z.infer<(typeof SyncJobHistoryRetentionPreference)["schema"]>,
  ) {
    await setPreference(SyncJobHistoryRetentionPreference, value);
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
      <Text size="sm">Keep sync job history for </Text>
      <NumberInput
        display="inline-block"
        w="5rem"
        {...form.getInputProps("period")}
      />
      <Select
        display="inline-block"
        w="6rem"
        data={["hours", "days", "weeks", "months"]}
        {...form.getInputProps("unit")}
      ></Select>
      <Text size="sm">.</Text>
    </Group>
  );
}
