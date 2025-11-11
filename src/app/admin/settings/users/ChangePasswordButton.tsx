"use client";

import { Button } from "@/components/ui/button";
import { changePassword } from "@/triggers/users";

export function ChangePasswordButton() {
  return <Button onClick={changePassword}>Change Password</Button>;
}
