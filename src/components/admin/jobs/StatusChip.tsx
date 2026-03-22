import { Badge } from "@/components/ui/badge";
import { Status } from "@prisma/client";

const statusStyles: Record<
  Status,
  { title: string; className: string }
> = {
  [Status.COMPLETED]: {
    title: "Completed",
    className: "bg-green-100 text-green-900 border-green-200",
  },
  [Status.FAILED]: {
    title: "Failed",
    className: "bg-red-100 text-red-900 border-red-200",
  },
  [Status.IN_PROGRESS]: {
    title: "In Progress",
    className: "bg-blue-100 text-blue-900 border-blue-200",
  },
  [Status.NOT_STARTED]: {
    title: "Not Started",
    className: "bg-gray-100 text-gray-900 border-gray-200",
  },
};

export function StatusChip({ status }: { status: Status }) {
  const { title, className } = statusStyles[status];
  return (
    <Badge variant="outline" className={className}>
      {title}
    </Badge>
  );
}
