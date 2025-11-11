"use client";

import { setPreference } from "@/actions/app-preferences";
import { EventsHistoryRetentionPreference } from "@/schemas/app-preferences";
import { Group, NumberInput, Select, Text } from "@mantine/core";
import { useForm } from "@mantine/form";
import { z } from "zod";

export function EventsHistoryRetentionPreferenceForm({
  value,
}: {
  value: z.infer<(typeof EventsHistoryRetentionPreference)["schema"]>;
}) {
  async function handleEventsHistoryRetentionChange(
    value: z.infer<(typeof EventsHistoryRetentionPreference)["schema"]>,
  ) {
    await setPreference(EventsHistoryRetentionPreference, value);
  }

  const form = useForm({
    mode: "uncontrolled",
    initialValues: value,
    onValuesChange: async (values) => {
      await handleEventsHistoryRetentionChange(values);
    },
  });

  return (
    <Group pb="lg" gap="xs">
      <Text size="sm">Keep event history for </Text>
      <NumberInput
        display="inline-block"
        w="5rem"
        {...form.getInputProps("period")}
      />
      <Select
        display="inline-block"
        w="6rem"
        data={["days", "weeks", "months"]}
        {...form.getInputProps("unit")}
      ></Select>
      <Text size="sm">.</Text>
    </Group>
  );
}
