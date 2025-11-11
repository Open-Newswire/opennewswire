import { Button, CloseButton, rem, TextInput } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import { useQueryState } from "nuqs";
import { useRef, useState } from "react";

const icon = <IconSearch style={{ width: rem(16), height: rem(16) }} />;

export function DesktopSearch() {
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
      ref={ref}
      leftSection={icon}
      variant="filled"
      placeholder="Search articles"
      w="60%"
      maw="40rem"
      visibleFrom="sm"
      value={input}
      onChange={(e) => setInput(e.target.value)}
      onKeyUp={(e) => {
        if (e.key === "Enter") {
          handleSubmit();
        }
      }}
      rightSectionWidth="auto"
      rightSection={
        query ? (
          <CloseButton
            mx="0.2rem"
            aria-label="Clear search"
            onClick={() => {
              setInput("");
              setQuery("");
              if (ref.current) {
                ref.current.value = "";
              }
            }}
          />
        ) : (
          <Button
            bg={input?.length === 0 ? "gray.3" : undefined}
            disabled={input?.length === 0}
            variant="filled"
            size="compact-sm"
            mx="0.3rem"
            onClick={handleSubmit}
          >
            Search
          </Button>
        )
      }
    />
  );
}
