"use client";

import { setPreference } from "@/domains/app-preferences/actions";
import { SyncFrequencyPreference } from "@/domains/app-preferences/schemas";
import { Group, NumberInput, Select, Text } from "@mantine/core";
import { useForm } from "@mantine/form";
import { z } from "zod";

interface SyncFrequencyPreferenceFormProps {
  value: z.infer<(typeof SyncFrequencyPreference)["schema"]>;
}

export function SyncFrequencyPreferenceForm({
  value,
}: SyncFrequencyPreferenceFormProps) {
  async function handleSyncFrequencyChange(
    value: z.infer<(typeof SyncFrequencyPreference)["schema"]>,
  ) {
    await setPreference(SyncFrequencyPreference, value);
  }

  const form = useForm({
    mode: "uncontrolled",
    initialValues: value,
    onValuesChange: async (values) => {
      await handleSyncFrequencyChange(values);
    },
  });

  return (
    <Group gap="xs">
      <Text size="sm">Automatically sync all active feeds every </Text>
      <NumberInput
        disabled
        display="inline-block"
        w="5rem"
        {...form.getInputProps("period")}
      />
      <Select
        disabled
        display="inline-block"
        w="7rem"
        data={["minutes", "hours", "days"]}
        {...form.getInputProps("unit")}
      ></Select>
      <Text size="sm">.</Text>
    </Group>
  );
}
