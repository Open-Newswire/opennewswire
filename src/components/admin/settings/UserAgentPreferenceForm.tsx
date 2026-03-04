"use client";

import { Input } from "@/components/ui/input";
import { setPreference } from "@/domains/app-preferences/actions";
import { UserAgentPreference } from "@/domains/app-preferences/schemas";
import { useState } from "react";
import { z } from "zod";

interface UserAgentPreferenceFormProps {
  value: z.infer<(typeof UserAgentPreference)["schema"]>;
}

export function UserAgentPreferenceForm({
  value,
}: UserAgentPreferenceFormProps) {
  const [formValues, setFormValues] = useState(value);

  async function handleChange(userAgent: string) {
    const newValues = { userAgent };
    setFormValues(newValues);
    await setPreference(UserAgentPreference, newValues);
  }

  return (
    <Input
      type="text"
      value={formValues.userAgent}
      onChange={(e) => handleChange(e.target.value)}
    />
  );
}
