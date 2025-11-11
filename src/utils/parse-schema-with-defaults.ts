import { ZodTypeAny, z } from "zod";

export function parseSchemaWithDefaults<T extends ZodTypeAny>(
  schema: T,
  raw: unknown,
): z.infer<T> {
  const result = schema.safeParse(raw);

  if (result.error) {
    const defaults = schema.safeParse({});

    return defaults.data!;
  }

  return result.data;
}
