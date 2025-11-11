"use client";

import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { utc } from "@date-fns/utc";

export function DatePicker({
  value,
  onChange,
  className,
}: {
  value?: Date;
  onChange: (date?: Date) => void;
  className?: string;
}) {
  return (
    <div className={cn("grid gap-2")}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !value && "text-muted-foreground",
              className,
            )}
          >
            {value ? format(value, "LLL dd, y", { in: utc }) : "Select date"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 z-999" align="start">
          <Calendar
            mode="single"
            initialFocus
            selected={value}
            onSelect={onChange}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
