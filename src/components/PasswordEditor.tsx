import { ChangePasswordParams } from "@/schemas/users";
import { User } from "@/types/users";
import { Button, Group, PasswordInput } from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";

export function PasswordEditor({
  onSubmit,
}: {
  user?: User;
  onSubmit: (params: ChangePasswordParams) => void;
}) {
  const form = useForm<ChangePasswordParams>({
    mode: "uncontrolled",
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validate: {
      password: isNotEmpty("Enter a password"),
      confirmPassword: isNotEmpty("Confirm the password"),
    },
  });

  return (
    <form onSubmit={form.onSubmit(onSubmit)}>
      <PasswordInput
        variant="filled"
        withAsterisk
        label="Password"
        autoComplete="off"
        mt="md"
        {...form.getInputProps("password")}
      />
      <PasswordInput
        variant="filled"
        withAsterisk
        label="Confirm Password"
        autoComplete="off"
        mt="md"
        {...form.getInputProps("confirmPassword")}
      />
      <Group justify="flex-end" mt="md">
        <Button type="submit">Change Password</Button>
      </Group>
    </form>
  );
}
