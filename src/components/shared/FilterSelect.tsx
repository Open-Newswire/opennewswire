import { Button, Combobox, Divider, useCombobox } from "@mantine/core";
import { ReactNode } from "react";

export interface FilterSelectOption {
  label: string;
  value: string;
}

export function FilterSelect({
  value,
  onChange,
  defaultOption,
  data,
  leftSection,
  isLoading,
  disabled,
}: {
  value: string | null;
  onChange: (value: string | null) => void;
  defaultOption: FilterSelectOption;
  data: FilterSelectOption[];
  leftSection?: ReactNode;
  isLoading?: boolean;
  disabled?: boolean;
}) {
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

  const options = data.map((item) => (
    <Combobox.Option value={item.value} key={item.value}>
      {item.label}
    </Combobox.Option>
  ));

  if (isLoading) {
    return (
      <Button size="xs" leftSection={leftSection} variant="default" disabled>
        {defaultOption.label}
      </Button>
    );
  }

  return (
    <Combobox
      disabled={disabled}
      store={combobox}
      withinPortal={false}
      transitionProps={{ duration: 200, transition: "fade" }}
      position="bottom-start"
      onOptionSubmit={(val) => {
        onChange(val);
        combobox.closeDropdown();
      }}
    >
      <Combobox.Target>
        <Button
          size="xs"
          variant={value && value !== defaultOption.value ? "light" : "default"}
          leftSection={leftSection}
          onClick={() => combobox.toggleDropdown()}
        >
          {value && value !== defaultOption.value
            ? data.find((option) => option.value === value)?.label
            : defaultOption.label}
        </Button>
      </Combobox.Target>

      <Combobox.Dropdown miw="10rem" mah="25rem" style={{ overflowY: "auto" }}>
        <Combobox.Option value={defaultOption.value}>
          {defaultOption.label}
        </Combobox.Option>
        <Divider />
        <Combobox.Options>{options}</Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
}
