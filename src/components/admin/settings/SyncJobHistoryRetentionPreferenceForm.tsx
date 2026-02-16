"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { setPreference } from "@/domains/app-preferences/actions";
import { SyncJobHistoryRetentionPreference } from "@/domains/app-preferences/schemas";
import { useState } from "react";
import { z } from "zod";

export function SyncJobHistoryRetentionPreferenceForm({
  value,
}: {
  value: z.infer<(typeof SyncJobHistoryRetentionPreference)["schema"]>;
}) {
  const [formValues, setFormValues] = useState(value);

  async function handleChange(
    newValues: z.infer<(typeof SyncJobHistoryRetentionPreference)["schema"]>,
  ) {
    setFormValues(newValues);
    await setPreference(SyncJobHistoryRetentionPreference, newValues);
  }

  return (
    <div className="flex items-center gap-1.5 pb-4">
      <span className="text-sm">Keep sync job history for</span>
      <Input
        type="number"
        className="w-20"
        value={formValues.period}
        onChange={(e) =>
          handleChange({ ...formValues, period: Number(e.target.value) })
        }
      />
      <Select
        value={formValues.unit}
        onValueChange={(unit) =>
          handleChange({
            ...formValues,
            unit: unit as typeof formValues.unit,
          })
        }
      >
        <SelectTrigger className="w-28">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="hours">hours</SelectItem>
          <SelectItem value="days">days</SelectItem>
          <SelectItem value="weeks">weeks</SelectItem>
          <SelectItem value="months">months</SelectItem>
        </SelectContent>
      </Select>
      <span className="text-sm">.</span>
    </div>
  );
}
