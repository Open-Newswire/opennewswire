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
import { ArticleRetentionPreference } from "@/domains/app-preferences/schemas";
import { useState } from "react";
import { z } from "zod";

interface ArticleRetentionPreferenceFormProps {
  value: z.infer<(typeof ArticleRetentionPreference)["schema"]>;
}

export function ArticleRetentionPreferenceForm({
  value,
}: ArticleRetentionPreferenceFormProps) {
  const [formValues, setFormValues] = useState(value);

  async function handleChange(
    newValues: z.infer<(typeof ArticleRetentionPreference)["schema"]>,
  ) {
    setFormValues(newValues);
    await setPreference(ArticleRetentionPreference, newValues);
  }

  return (
    <div className="flex items-center gap-1.5 pb-4">
      <span className="text-sm">Keep the last</span>
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
          <SelectItem value="days">days</SelectItem>
          <SelectItem value="weeks">weeks</SelectItem>
          <SelectItem value="months">months</SelectItem>
        </SelectContent>
      </Select>
      <span className="text-sm">of articles or</span>
      <Input
        type="number"
        className="w-20"
        value={formValues.minCount}
        onChange={(e) =>
          handleChange({ ...formValues, minCount: Number(e.target.value) })
        }
      />
      <span className="text-sm">minimum articles per feed.</span>
    </div>
  );
}
