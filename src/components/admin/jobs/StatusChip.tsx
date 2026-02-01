import { Pill } from "@mantine/core";
import { Status } from "@prisma/client";

const statusStyles = {
  [Status.COMPLETED]: {
    title: "Completed",
    bg: "green.1",
    color: "green.9",
  },
  [Status.FAILED]: {
    title: "Failed",
    bg: "red.1",
    color: "red.9",
  },
  [Status.IN_PROGRESS]: {
    title: "In Progress",
    bg: "blue.1",
    color: "blue.9",
  },
  [Status.NOT_STARTED]: {
    title: "Not Started",
    bg: "grey.1",
    color: "grey.9",
  },
};

export function StatusChip({ status }: { status: Status }) {
  const { title, color, bg } = statusStyles[status];
  return (
    <Pill c={color} bg={bg}>
      {title}
    </Pill>
  );
}
