import { Box, Group, Pagination, Select, Text } from "@mantine/core";

interface PaginationBarProps {
  page: number;
  size: number;
  totalPages: number;
  totalItems: number;
  noun?: string;
  onPageChange: (nextPage: number) => void;
  onSizeChange: (sextSIzr: number) => void;
}

export function PaginationBar({
  page,
  size,
  totalPages,
  totalItems,
  noun = "item",
  onPageChange,
  onSizeChange,
}: PaginationBarProps) {
  return (
    <Group w="100%" justify="space-between" my="lg" px="md">
      <Text size="sm">
        <strong>
          {page * size - size + 1} -{" "}
          {page * size < totalItems ? page * size : totalItems}
        </strong>{" "}
        of <strong>{totalItems}</strong> {noun}
      </Text>
      <Pagination
        size="sm"
        value={page}
        total={totalPages}
        onChange={onPageChange}
        siblings={1}
        boundaries={0}
      />
      <Box>
        <Group>
          <Select
            size="xs"
            w="5rem"
            withCheckIcon={false}
            comboboxProps={{ transitionProps: { transition: "fade" } }}
            data={["10", "25", "50"]}
            value={size.toString()}
            onChange={(val) => onSizeChange(Number(val))}
          />
          <Text size="sm">{noun}</Text>
        </Group>
      </Box>
    </Group>
  );
}
