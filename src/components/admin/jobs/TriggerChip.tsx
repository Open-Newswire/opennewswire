import { Badge } from "@/components/ui/badge";
import { Trigger } from "@prisma/client";
import { RefreshCw, Zap } from "lucide-react";

const triggerStyles: Record<
  Trigger,
  { title: string; className: string; Icon: React.FC<{ className?: string }> }
> = {
  [Trigger.MANUAL]: {
    title: "Manual",
    className: "bg-blue-100 text-blue-900 border-blue-200",
    Icon: Zap,
  },
  [Trigger.AUTOMATIC]: {
    title: "Automatic",
    className: "bg-green-100 text-green-900 border-green-200",
    Icon: RefreshCw,
  },
};

export function TriggerChip({ trigger }: { trigger: Trigger }) {
  const { title, className, Icon } = triggerStyles[trigger];
  return (
    <Badge variant="outline" className={className}>
      <Icon className="h-3 w-3" />
      {title}
    </Badge>
  );
}
