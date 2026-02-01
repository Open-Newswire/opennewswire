import { Group } from "@mantine/core";
import { ReactNode } from "react";
import classes from "./modal-footer.module.css";

export function ModalFooter({ children }: { children: ReactNode }) {
  return <Group className={classes.footer}>{children}</Group>;
}
