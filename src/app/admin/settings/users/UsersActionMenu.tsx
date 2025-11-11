"use client";

import { TableActionMenu } from "@/components/Table";
import { removeUser } from "@/triggers/users";
import { User } from "@/types/users";
import { MenuItem } from "@mantine/core";

export function UsersActionMenu({ user }: { user: User }) {
  return (
    <TableActionMenu>
      <MenuItem color="red" onClick={() => removeUser(user)}>
        Delete User
      </MenuItem>
    </TableActionMenu>
  );
}
