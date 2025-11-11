import { CreateUserParams } from "@/schemas/users";
import { User } from "@/types/users";
import { Button, Group, PasswordInput, TextInput } from "@mantine/core";
import { isEmail, isNotEmpty, useForm } from "@mantine/form";

export function CreateUserEditor({
  onSubmit,
}: {
  user?: User;
  onSubmit: (params: CreateUserParams) => void;
}) {
  const form = useForm<CreateUserParams>({
    mode: "uncontrolled",
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validate: {
      name: isNotEmpty("Enter a name"),
      email: isEmail("Enter a valid email"),
      password: isNotEmpty("Enter a password"),
      confirmPassword: isNotEmpty("Confirm the password"),
    },
  });

  return (
    <form onSubmit={form.onSubmit(onSubmit)}>
      <TextInput
        variant="filled"
        withAsterisk
        label="Name"
        autoComplete="off"
        data-autofocus
        {...form.getInputProps("name")}
      />
      <TextInput
        variant="filled"
        withAsterisk
        label="Email"
        autoComplete="off"
        mt="md"
        {...form.getInputProps("email")}
      />
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
        <Button type="submit">Save</Button>
      </Group>
    </form>
  );
}
