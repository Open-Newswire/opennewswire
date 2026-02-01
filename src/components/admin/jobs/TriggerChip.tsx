import { Pill } from "@mantine/core";
import { Trigger } from "@prisma/client";
import { IconBolt, IconRefresh } from "@tabler/icons-react";
import classes from "./TriggerChip.module.css";

const triggerStyles = {
  [Trigger.MANUAL]: {
    title: "Manual",
    bg: "blue.1",
    color: "blue.9",
    Icon: IconBolt,
  },
  [Trigger.AUTOMATIC]: {
    title: "Automatic",
    bg: "green.1",
    color: "green.9",
    Icon: IconRefresh,
  },
};

export function TriggerChip({ trigger }: { trigger: Trigger }) {
  const { title, color, bg, Icon } = triggerStyles[trigger];
  return (
    <Pill
      c={color}
      bg={bg}
      classNames={{
        root: classes.root,
        label: classes.label,
      }}
    >
      <Icon />
      {title}
    </Pill>
  );
}
