import * as React from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const DAYS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

interface SelectDayProps {
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
  triggerId?: string;
  labelledBy?: string;
}

function SelectDay({
  value,
  onValueChange,
  className,
  triggerId,
  labelledBy,
}: SelectDayProps) {
  const [internal, setInternal] = React.useState<string>(value ?? DAYS[0]);
  const current = value ?? internal;

  const handleChange = React.useCallback(
    (next: string) => {
      if (value === undefined) {
        setInternal(next);
      }
      onValueChange?.(next);
    },
    [value, onValueChange]
  );

  return (
    <Select value={current} onValueChange={handleChange}>
      <SelectTrigger
        id={triggerId}
        aria-labelledby={labelledBy}
        className={className ?? "w-52"}
      >
        <SelectValue placeholder="Choose a day">
          {capitalize(current)}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {DAYS.map((label) => (
          <SelectItem key={label} value={label}>
            {capitalize(label)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export { capitalize };
export default SelectDay;
