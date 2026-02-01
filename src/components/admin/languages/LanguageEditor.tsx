import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field";
import { Form, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { SaveLanguageParams, SaveLanguageSchema } from "@/domains/languages/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Language } from "@prisma/client";
import { Controller, useForm } from "react-hook-form";

export function LanguageEditor({
  language,
  onSubmit,
}: {
  language?: Language;
  onSubmit: (params: SaveLanguageParams) => Promise<void>;
}) {
  const form = useForm<SaveLanguageParams>({
    resolver: zodResolver(SaveLanguageSchema),
    defaultValues: {
      name: language?.name ?? "",
      slug: language?.slug ?? "",
      isRtl: language?.isRtl ?? false,
    },
  });
  const isSubmitting = form.formState.isSubmitting;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((data) => onSubmit(data))}>
        <FieldSet disabled={isSubmitting}>
          <FieldGroup>
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="language-form-name">Name</FieldLabel>
                  <Input
                    {...field}
                    id="language-form-name"
                    data-autofocus
                    autoComplete="off"
                    data-1p-ignore
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="slug"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="language-form-slug">Slug</FieldLabel>
                  <Input
                    {...field}
                    id="language-form-slug"
                    autoComplete="off"
                    data-1p-ignore
                  />
                  <FieldDescription>
                    A short, unique identifier used for this language in URLs
                  </FieldDescription>
                  <FormMessage />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="isRtl"
              control={form.control}
              render={({ field, fieldState }) => (
                <FieldSet data-invalid={fieldState.invalid}>
                  <FieldGroup data-slot="checkbox-group">
                    <Field orientation="horizontal">
                      <Checkbox
                        id="form-rhf-checkbox-responses"
                        name={field.name}
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                      <FieldLabel htmlFor="form-rhf-checkbox-responses">
                        Right-to-Left (RTL) Language
                      </FieldLabel>
                    </Field>
                  </FieldGroup>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </FieldSet>
              )}
            />
            <FieldSeparator />
            <Field orientation="horizontal" className="flex-row-reverse">
              <Button type="submit">
                {form.formState.isSubmitting ? <Spinner /> : "Save"}
              </Button>
            </Field>
          </FieldGroup>
        </FieldSet>
      </form>
    </Form>
  );
}
