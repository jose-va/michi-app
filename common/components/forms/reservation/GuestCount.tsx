"use client"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/shadcn/components/select";

export default function GuestCount({ field }: { field: any }) {
  return (
    <Select onValueChange={field.onChange} defaultValue={field.value}>
      <SelectTrigger className="w-full max-w-48">
        <SelectValue placeholder="Comensales" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Introduzca un número</SelectLabel>
          {Array.from({ length: 12 }).map((_, index) => {
            const value = (index + 1).toString();
            return (
              <SelectItem key={value} value={value}>
                {value}
              </SelectItem>
            );
          })}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
