"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Image from "next/image";

export function DatePicker({
  className,
  isDisabled,
  variant,
}: {
  className?: string;
  isDisabled: boolean;
  variant:string;
}) {
  const [date, setDate] = React.useState<Date>();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          disabled={isDisabled}
     
          className={cn(
            "w-[280px] justify-start text-black   text-left font-normal",
            className,
          )}
        >
          {date ? format(date, "PPP") : <span>mm/dd/yyyy</span>}
          <Image
            src={"/icons/patient-details-calendar.svg"}
            alt="calendar"
            width={18}
            height={18}
            className={`${isDisabled ? "hidden" : ""} absolute bottom-3 right-5`}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="z-[555] w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
