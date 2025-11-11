import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { CheckIcon } from "lucide-react";
import { ReactElement } from "react";

interface DataTableFacetedFilterProps<TData, TValue> {
  title?: string;
  options: {
    label: string;
    value: string;
  }[];
  value: string | null;
  onChange: (value: string | null) => void;
  icon?: ReactElement;
  allLabel?: string;
  searchable?: boolean;
}

export function DataTableFacetedFilter<TData, TValue>({
  title,
  options,
  onChange,
  value,
  icon,
  allLabel = "All",
  searchable,
}: DataTableFacetedFilterProps<TData, TValue>) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm">
          {icon || null}
          {title}
          {value && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <div className="hidden space-x-1 lg:flex">
                {options
                  .filter((option) => option.value === value)
                  .map((option) => (
                    <Badge
                      variant="secondary"
                      key={option.value}
                      className="rounded-sm px-1 font-normal"
                    >
                      {option.label}
                    </Badge>
                  ))}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[250px] p-0" align="start">
        <Command>
          {searchable ? <CommandInput placeholder={title} /> : null}
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <>
              <CommandGroup>
                <SelectableCommandItem
                  isSelected={value === null}
                  value="default"
                  label={allLabel}
                  onChange={() => onChange(null)}
                />
              </CommandGroup>
              {options.length ? <CommandSeparator /> : null}
            </>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = value === option.value;
                return (
                  <SelectableCommandItem
                    key={option.value}
                    isSelected={isSelected}
                    value={option.value}
                    label={option.label}
                    onChange={onChange}
                  />
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

interface DataTableToggleFilterProps {
  title?: string;
  value: string;
  onClick: () => void;
  icon?: ReactElement;
}

export function DataTableToggleFilter({
  icon,
  title,
  value,
  onClick,
}: DataTableToggleFilterProps) {
  return (
    <Button variant="outline" size="sm" onClick={onClick}>
      {icon || null}
      {title}
      {value && (
        <>
          <Separator orientation="vertical" className="mx-2 h-4" />
          <Badge variant="secondary" className="rounded-sm px-1 font-normal">
            {value}
          </Badge>
        </>
      )}
    </Button>
  );
}

function SelectableCommandItem({
  isSelected,
  value,
  label,
  onChange,
}: {
  isSelected: boolean;
  value: string;
  label: string;
  onChange: (value: string) => void;
}) {
  return (
    <CommandItem
      key={value}
      onSelect={() => {
        onChange(value);
      }}
    >
      <span className="pointer-events-none flex items-center justify-center p-0.5">
        <CheckIcon
          className="size-4 mr-2"
          color="black"
          visibility={isSelected ? "visible" : "hidden"}
        />
        <Label>{label}</Label>
      </span>
    </CommandItem>
  );
}
