import { Badge } from "@/components/ui/badge";
import { AnalyticsEventType } from "@prisma/client";
import { MousePointer2, Search } from "lucide-react";

const EventTypeRenderProps = {
  [AnalyticsEventType.INTERACTION]: {
    className: "bg-emerald-100 text-emerald-600",
    title: "Interaction",
    Icon: MousePointer2,
  },
  [AnalyticsEventType.QUERY]: {
    className: "bg-blue-100 text-blue-600",
    title: "Query",
    Icon: Search,
  },
};

export function EventTypeBadge({ type }: { type: AnalyticsEventType }) {
  const props = EventTypeRenderProps[type];
  return (
    <Badge className={props.className}>
      <props.Icon size="16" className="!w-4 !h-4" />
      {props.title}
    </Badge>
  );
}
