import { rem, TextInput, TextInputProps } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";

export function SearchTextInput(props: TextInputProps) {
  return (
    <TextInput
      leftSection={<IconSearch style={{ width: rem(16), height: rem(16) }} />}
      placeholder="Search..."
      {...props}
    />
  );
}
