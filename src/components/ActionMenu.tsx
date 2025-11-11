"use client";

import {
  Button,
  ButtonVariant,
  Menu,
  MenuDropdown,
  MenuTarget,
} from "@mantine/core";
import { IconDots } from "@tabler/icons-react";
import React from "react";

interface ActionMenuProps {
  variant?: ButtonVariant;
  icon?: React.ComponentType;
  children: React.ReactNode;
}

export function ActionMenu({
  variant = "light",
  icon: Icon,
  children,
}: ActionMenuProps) {
  return (
    <Menu>
      <MenuTarget>
        <Button variant={variant} px="xs">
          {Icon ? <Icon /> : <IconDots size="1.5rem" />}
        </Button>
      </MenuTarget>
      <MenuDropdown>{children}</MenuDropdown>
    </Menu>
  );
}
