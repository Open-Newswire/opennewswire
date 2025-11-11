"use client";

import { OnSelectHandler, type DateRange } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarDays } from "lucide-react";

export function DatePickerWithRange({
  range,
  onChange,
}: {
  range: DateRange;
  onChange: OnSelectHandler<DateRange | undefined>;
}) {
  return (
    <div className={cn("grid gap-2")}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            id="dates"
            className="justify-between"
          >
            {<CalendarDays />}
            {range?.from && range?.to
              ? `${format(range.from, "LLL dd, y")} - ${format(range.to, "LLL dd, y")}`
              : "Select date"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="range"
            selected={range}
            onSelect={onChange}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
