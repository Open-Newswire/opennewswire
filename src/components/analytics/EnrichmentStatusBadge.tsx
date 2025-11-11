import { Badge } from "@/components/ui/badge";
import { EnrichmentStatus } from "@prisma/client";
import { CircleCheck, CircleX, Clock2 } from "lucide-react";

const EnrichmentStatusRenderProps = {
  [EnrichmentStatus.COMPLETED]: {
    className: "bg-emerald-100 text-emerald-600",
    title: "Enriched",
    Icon: CircleCheck,
  },
  [EnrichmentStatus.PENDING]: {
    className: "bg-zinc-200 text-zinc-600",
    title: "Pending",
    Icon: Clock2,
  },
  [EnrichmentStatus.FAILED]: {
    className: "bg-red-100 text-red-600",
    title: "Failed",
    Icon: CircleX,
  },
};

export function EnrichmentStatusBadge({
  status,
}: {
  status: EnrichmentStatus;
}) {
  const props = EnrichmentStatusRenderProps[status];
  return (
    <Badge className={props.className}>
      <props.Icon size="16" className="!w-4 !h-4" />
      {props.title}
    </Badge>
  );
}
