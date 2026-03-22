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
import { SyncFrequencyPreference } from "@/domains/app-preferences/schemas";
import { useState } from "react";
import { z } from "zod";

interface SyncFrequencyPreferenceFormProps {
  value: z.infer<(typeof SyncFrequencyPreference)["schema"]>;
}

export function SyncFrequencyPreferenceForm({
  value,
}: SyncFrequencyPreferenceFormProps) {
  const [formValues, setFormValues] = useState(value);

  async function handleChange(
    newValues: z.infer<(typeof SyncFrequencyPreference)["schema"]>,
  ) {
    setFormValues(newValues);
    await setPreference(SyncFrequencyPreference, newValues);
  }

  return (
    <div className="flex items-center gap-1.5">
      <span className="text-sm">Automatically sync all active feeds every</span>
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
          <SelectItem value="minutes">minutes</SelectItem>
          <SelectItem value="hours">hours</SelectItem>
          <SelectItem value="days">days</SelectItem>
        </SelectContent>
      </Select>
      <span className="text-sm">.</span>
    </div>
  );
}
