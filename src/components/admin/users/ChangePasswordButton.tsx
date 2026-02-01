"use client";

import { Button } from "@/components/ui/button";
import { changePassword } from "@/domains/users/triggers";

export function ChangePasswordButton() {
  return <Button onClick={changePassword}>Change Password</Button>;
}
