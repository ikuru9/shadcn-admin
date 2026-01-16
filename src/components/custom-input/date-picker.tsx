"use client";

import * as React from "react";

import { isValid, toDate } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { formatDate } from "@/lib/formatter";
import { cn } from "@/lib/utils";

interface DatePickerProps {
  value?: Date | null;
  onChange?: (date: Date | null) => void;
  placeholder?: string;
  disabled?: boolean;
  min?: Date;
  max?: Date;
  className?: string;
}

function DatePicker({
  value,
  onChange,
  placeholder = "Pick a date",
  disabled = false,
  min,
  max,
  className,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState(formatDate(value));

  React.useEffect(() => {
    setInputValue(formatDate(value));
  }, [value]);

  const handleSelect = (date: Date | undefined) => {
    onChange?.(date ?? null);
    setOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);

    if (isValid(newValue)) {
      const dateObj = toDate(newValue);
      if ((!min || dateObj >= min) && (!max || dateObj <= max)) {
        onChange?.(dateObj);
      }
    } else if (newValue === "") {
      onChange?.(null);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger>
        <div className="relative w-full">
          <Input
            value={inputValue}
            onChange={handleInputChange}
            placeholder={placeholder}
            disabled={disabled}
            mask="datetime"
            maskOptions={{ inputFormat: "yyyy-mm-dd" }}
            aria-label="Date picker"
            aria-describedby={value ? "selected-date" : undefined}
            className={cn("pr-10", !value && "text-muted-foreground", className)}
          />
          <CalendarIcon className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={value ?? undefined}
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

export { DatePicker };
