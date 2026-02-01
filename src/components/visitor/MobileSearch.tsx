import { CloseButton, rem, TextInput } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import { useQueryState } from "nuqs";
import { useRef, useState } from "react";

const icon = <IconSearch style={{ width: rem(22), height: rem(22) }} />;

export function MobileSearch() {
  const [query, setQuery] = useQueryState("search", {
    defaultValue: "",
    throttleMs: 500,
    shallow: false,
  });
  const [input, setInput] = useState(query);
  const ref = useRef<HTMLInputElement>(null);

  function handleSubmit() {
    if (input) {
      setQuery(input);
    }
  }

  return (
    <TextInput
      autoFocus
      ref={ref}
      size="md"
      data-autofocus
      leftSection={icon}
      variant="filled"
      placeholder="Search articles"
      value={input}
      onChange={(e) => setInput(e.target.value)}
      onKeyUp={(e) => {
        if (e.key === "Enter") {
          handleSubmit();
        }
      }}
      rightSection={
        <CloseButton
          aria-label="Clear input"
          onClick={() => {
            setQuery("");
            setInput("");
            if (ref.current) {
              ref.current.value = "";
            }
          }}
          style={{ display: query ? undefined : "none" }}
        />
      }
    />
  );
}
