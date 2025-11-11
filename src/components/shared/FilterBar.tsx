import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import styles from "./filterbar.module.css";

export function FilterBar({
  children,
  accessory,
}: {
  children: ReactNode;
  accessory?: ReactNode;
}) {
  return (
    <div className="flex relative justify-between">
      <div
        className={cn(
          "overflow-x-auto flex gap-4 pb-2 mb-2",
          accessory ? "pr-6" : "pr-0",
          styles["filter-container"],
        )}
      >
        {children}
      </div>
      <div className={cn("flex pb-4 relative", styles["filter-accessory"])}>
        {accessory}
      </div>
    </div>
  );
}
