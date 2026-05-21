// components/ui/form-input.tsx
"use client";

import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { Input } from "@/shadcn/components/input";
import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shadcn/components/form";

export const FormInput = <T extends FieldValues>({
  control,
  name,
  label,
  description,
  optional,
  ...inputProps
}: {
  control: Control<T>;
  name: Path<T>;
  label: string;
  description?: string;
  optional?: boolean;
} & React.ComponentProps<typeof Input>) => (
  <Controller
    name={name}
    control={control}
    render={({ field, fieldState }) => (
      <FormItem>
        <FormLabel>
          {label}{" "}
          {optional && <span className="font-extralight">(opcional)</span>}
        </FormLabel>
        <FormControl>
          <Input
            {...field}
            {...inputProps}
            value={field.value ?? ""}
            aria-invalid={fieldState.invalid}
          />
        </FormControl>
        {description && <FormDescription>{description}</FormDescription>}
        <FormMessage />
      </FormItem>
    )}
  />
);