"use client";

import { Button } from "@/components/ui/button";
import { addUser } from "@/domains/users/triggers";

export function UsersActionButton() {
  return (
    <Button variant="outline" onClick={addUser}>
      Add User
    </Button>
  );
}
