import { ccsymbols } from "@/app/fonts";
import { SaveLicenseParams } from "@/schemas/licenses";
import {
  ActionIcon,
  Button,
  ColorInput,
  Group,
  Popover,
  SimpleGrid,
  TextInput,
} from "@mantine/core";
import { isNotEmpty, matches, useForm } from "@mantine/form";
import { License } from "@prisma/client";
import { IconCreativeCommons } from "@tabler/icons-react";
import classes from "./SymbolField.module.css";

export function LicenseEditor({
  license,
  onSubmit,
}: {
  license?: License;
  onSubmit: (params: SaveLicenseParams) => void;
}) {
  const form = useForm<SaveLicenseParams>({
    initialValues: {
      name: license?.name ?? "",
      slug: license?.slug ?? "",
      symbols: license?.symbols ?? "",
      textColor: license?.textColor ?? "#ffffff",
      backgroundColor: license?.backgroundColor ?? "#000000",
    },
    validate: {
      name: isNotEmpty("Enter a license name"),
      slug: matches(
        /^[a-z0-9-]+$/,
        "Only alphanumeric characters and dashes are supported",
      ),
    },
  });

  return (
    <form onSubmit={form.onSubmit(onSubmit)}>
      <TextInput
        variant="filled"
        withAsterisk
        label="Name"
        placeholder="License name"
        data-autofocus
        autoComplete="off"
        {...form.getInputProps("name")}
      />
      <TextInput
        mt="md"
        variant="filled"
        label="Symbols"
        autoComplete="off"
        placeholder="🅭"
        classNames={{
          root: ccsymbols.variable,
          input: classes.input,
        }}
        rightSection={
          <SymbolPicker
            onPick={(symbol) =>
              form.setFieldValue("symbols", form.values.symbols + symbol)
            }
          />
        }
        {...form.getInputProps("symbols")}
      />
      <TextInput
        mt="lg"
        withAsterisk
        variant="filled"
        label="Slug"
        description="A unique and readable word identifying this license in a URL"
        placeholder="License slug"
        data-autofocus
        autoComplete="off"
        {...form.getInputProps("slug")}
        onChange={(e) =>
          form.setFieldValue("slug", e.target.value.trim().toLowerCase())
        }
      />
      <Group mt="md" grow>
        <ColorInput
          variant="filled"
          label="Background Color"
          {...form.getInputProps("backgroundColor")}
        />
        <ColorInput
          variant="filled"
          label="Text Color"
          {...form.getInputProps("textColor")}
        />
      </Group>

      <Group justify="flex-end" mt="md">
        <Button type="submit">Save</Button>
      </Group>
    </form>
  );
}

const symbols = ["⊜", "🅭", "🅮", "🅯", "🄍", "🄎", "🄏"];

function SymbolPicker({ onPick }: { onPick: (symbol: string) => void }) {
  return (
    <Popover width={185} classNames={{ dropdown: ccsymbols.variable }}>
      <Popover.Target>
        <ActionIcon variant="light">
          <IconCreativeCommons />
        </ActionIcon>
      </Popover.Target>
      <Popover.Dropdown>
        <SimpleGrid cols={3} spacing="0" verticalSpacing="0">
          {symbols.map((symbol) => (
            <Button
              key={symbol}
              variant="subtle"
              onClick={() => onPick(symbol)}
              className={classes.button}
            >
              {symbol}
            </Button>
          ))}
        </SimpleGrid>
      </Popover.Dropdown>
    </Popover>
  );
}
