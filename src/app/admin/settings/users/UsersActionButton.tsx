"use client";

import { Button } from "@/components/ui/button";
import { addUser } from "@/triggers/users";

export function UsersActionButton() {
  return <Button onClick={addUser}>Add User</Button>;
}
