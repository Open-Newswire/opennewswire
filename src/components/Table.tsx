import { SortDirection } from "@/domains/shared/types";
import {
  ActionIcon,
  Center,
  Group,
  MantineStyleProps,
  Menu,
  MenuDropdown,
  MenuTarget,
  TableTd,
  TableTh,
  TableTr,
  Text,
  UnstyledButton,
} from "@mantine/core";
import {
  IconBolt,
  IconCaretDown,
  IconCaretUp,
  IconCaretUpDown,
  IconDots,
} from "@tabler/icons-react";
import React, { ReactNode } from "react";

export function TableThAction(props: MantineStyleProps) {
  return (
    <TableTh w={50} {...props}>
      <IconBolt size="1rem" style={{ margin: "auto", display: "block" }} />
    </TableTh>
  );
}

export function TableActionMenu({ children }: { children: React.ReactNode }) {
  return (
    <Menu>
      <MenuTarget>
        <ActionIcon variant="subtle">
          <IconDots size="1rem" />
        </ActionIcon>
      </MenuTarget>
      <MenuDropdown>{children}</MenuDropdown>
    </Menu>
  );
}

export function TableTrLabeled({
  label,
  children,
  ...props
}: {
  label: string;
  children: React.ReactNode;
} & MantineStyleProps) {
  return (
    <TableTr>
      <TableTd w="300" {...props}>
        <Text size="sm" fw={700}>
          {label}
        </Text>
      </TableTd>
      <TableTd>{children}</TableTd>
    </TableTr>
  );
}

const sortDirectionIconMap = {
  [SortDirection.Asc]: IconCaretDown,
  [SortDirection.Desc]: IconCaretUp,
  [SortDirection.None]: IconCaretUpDown,
};

interface TableThSortProps {
  sortField: string;
  sortDirection?: SortDirection;
  onChange?: (direction: SortDirection) => void;
  children: ReactNode;
}

export function TableThSortNew({
  sortField,
  onChange,
  sortDirection,
  children,
  ...props
}: TableThSortProps & MantineStyleProps) {
  const Icon = sortDirectionIconMap[sortDirection ?? SortDirection.None];

  function handleClick() {
    if (sortDirection === SortDirection.None) {
      onChange!(SortDirection.Asc);
    } else if (sortDirection === SortDirection.Asc) {
      onChange!(SortDirection.Desc);
    } else if (sortDirection === SortDirection.Desc) {
      onChange!(SortDirection.Asc);
    }
  }

  return (
    <TableTh {...props}>
      <UnstyledButton onClick={handleClick} w="100%">
        <Group justify="space-between">
          <Text fw={600} fz="sm">
            {children}
          </Text>
          <Center>
            <Icon size={18} stroke={2} />
          </Center>
        </Group>
      </UnstyledButton>
    </TableTh>
  );
}

interface Sort {
  sortBy: string;
  sortDirection: SortDirection;
}

interface TableThSortGroupProps {
  children: React.ReactNode;
  sort: Sort;
  onChange: (sort: Sort) => void;
}

export function TableThSortGroup({
  children,
  sort,
  onChange,
}: TableThSortGroupProps) {
  return React.Children.map(children, (child) => {
    // @ts-ignore
    if (React.isValidElement(child) && child.props && child.props.sortField) {
      // @ts-ignore
      const sortBy = child.props.sortField;
      const sortDirection =
        sort.sortBy === sortBy ? sort.sortDirection : SortDirection.None;
      const onChangeChild = (sortDirection: SortDirection) =>
        onChange({ sortDirection, sortBy });

      return React.cloneElement(child, {
        // @ts-ignore New props aren't typesafe
        sortDirection,
        onChange: onChangeChild,
      });
    }

    return child;
  });
}
