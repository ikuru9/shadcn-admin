"use client";

import * as React from "react";

import { isValid, toDate } from "date-fns";
import { CalendarIcon, MinusIcon } from "lucide-react";

import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { formatDate } from "@/lib/formatter";
import { cn } from "@/lib/utils";

interface DateRangePickerProps {
  from?: Date | null;
  to?: Date | null;
  onChangeFrom?: (date: Date | null) => void;
  onChangeTo?: (date: Date | null) => void;
  onChange?: (range: { from?: Date | null; to?: Date | null } | null) => void;
  disabled?: boolean;
  min?: Date;
  max?: Date;
  placeholder?: { from?: string; to?: string };
}

function DateRangePicker({
  from,
  to,
  onChangeFrom,
  onChangeTo,
  onChange,
  disabled = false,
  min,
  max,
  placeholder,
}: DateRangePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [fromInput, setFromInput] = React.useState(formatDate(from));
  const [toInput, setToInput] = React.useState(formatDate(to));

  React.useEffect(() => {
    setFromInput(formatDate(from));
  }, [from]);

  React.useEffect(() => {
    setToInput(formatDate(to));
  }, [to]);

  const handleSelect = (range: { from?: Date; to?: Date } | undefined) => {
    const newFrom = range?.from ?? null;
    const newTo = range?.to ?? null;
    onChangeFrom?.(newFrom);
    onChangeTo?.(newTo);
    onChange?.({ from: newFrom, to: newTo });
  };

  const handleFromInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setFromInput(newValue);

    if (isValid(newValue)) {
      const dateObj = toDate(newValue);
      if ((!min || dateObj >= min) && (!max || dateObj <= max) && (!to || dateObj <= to)) {
        onChangeFrom?.(dateObj);
        onChange?.({ from: dateObj, to });
      }
    } else if (newValue === "") {
      onChangeFrom?.(null);
      onChange?.({ from: null, to });
    }
  };

  const handleToInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setToInput(newValue);

    if (isValid(newValue)) {
      const dateObj = toDate(newValue);
      if ((!min || dateObj >= min) && (!max || dateObj <= max) && (!from || dateObj >= from)) {
        onChangeTo?.(dateObj);
        onChange?.({ from, to: dateObj });
      }
    } else if (newValue === "") {
      onChangeTo?.(null);
      onChange?.({ from, to: null });
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger>
        <div className={cn("relative flex w-full items-center gap-2", disabled && "pointer-events-none opacity-50")}>
          <div className="relative flex-1">
            <Input
              type="text"
              value={fromInput}
              onChange={handleFromInputChange}
              placeholder={placeholder?.from}
              disabled={disabled}
              mask="datetime"
              maskOptions={{ inputFormat: "yyyy-mm-dd" }}
              aria-label="From Date picker"
              aria-describedby={fromInput ? "selected-date" : undefined}
              className={cn("pr-10", !from && "text-muted-foreground")}
            />
            <CalendarIcon className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </div>
          <MinusIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
          <div className="relative flex-1">
            <Input
              type="text"
              value={toInput}
              onChange={handleToInputChange}
              placeholder={placeholder?.to}
              disabled={disabled}
              mask="datetime"
              maskOptions={{ inputFormat: "yyyy-mm-dd" }}
              aria-label="To Date picker"
              aria-describedby={toInput ? "selected-date" : undefined}
              className={cn("pr-10", !to && "text-muted-foreground")}
            />
            <CalendarIcon className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </div>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="range"
          selected={{
            from: from ?? undefined,
            to: to ?? undefined,
          }}
          onSelect={handleSelect}
          disabled={(date) => {
            if (min && date < min) return true;
            if (max && date > max) return true;
            return false;
          }}
        />
      </PopoverContent>
    </Popover>
  );
}

export { DateRangePicker };
