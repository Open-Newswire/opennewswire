"use client";

import { Button } from "@/components/ui/button";
import { addUser } from "@/domains/users/triggers";

export function UsersActionButton() {
  return <Button onClick={addUser}>Add User</Button>;
}
