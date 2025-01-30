"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import type { PopoverProps } from "@radix-ui/react-popover";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { Season } from "@/types/season";

interface SeasonSwitcherProps extends PopoverProps {
  seasons: Season[];
  currentSeason: Season;
}

export function SeasonSwitcher({
  seasons,
  currentSeason,
  ...props
}: SeasonSwitcherProps) {
  const [open, setOpen] = React.useState(false);
  const [selectedSeason, setSelectedSeason] = React.useState<string>(
    currentSeason._id
  );
  const router = useRouter();

  return (
    <Popover open={open} onOpenChange={setOpen} {...props}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-label="Sezon seç"
          className="w-[200px] justify-between"
        >
          {selectedSeason
            ? seasons.find((season) => season._id === selectedSeason)?.name
            : "Sezon seç..."}
          <CaretSortIcon className="ml-auto h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Sezon ara..." className="h-9" />
          <CommandList>
            <CommandEmpty>Sezon bulunamadı.</CommandEmpty>
            <CommandGroup>
              {seasons.map((season) => (
                <CommandItem
                  key={season._id}
                  onSelect={() => {
                    setSelectedSeason(season._id);
                    setOpen(false);
                    router.push(`/dashboard?season=${season._id}`);
                  }}
                >
                  {season.name}
                  <CheckIcon
                    className={cn(
                      "ml-auto h-4 w-4",
                      selectedSeason === season._id
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
