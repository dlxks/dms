"use client";

import * as React from "react";
import { Button } from "@/src/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/ui/dialog";
import { Label } from "@/src/components/ui/label";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/src/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/ui/popover";
import { ChevronsUpDown, Loader2 } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { toast } from "sonner";
import { IconPlus } from "@tabler/icons-react";
import { addAdvisee, getStudentsServer } from "../actions";

type Student = { id: string; name: string };

export default function AddAdviseeDialog({ adviserId }: { adviserId: string }) {
  const [open, setOpen] = React.useState(false);
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [students, setStudents] = React.useState<Student[]>([]);
  const [selected, setSelected] = React.useState<Student | null>(null);
  const [note, setNote] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [isSearching, setIsSearching] = React.useState(false);

  // Debounced student search
  React.useEffect(() => {
    let active = true;
    const fetchData = async () => {
      if (!search.trim()) {
        setStudents([]);
        return;
      }
      setIsSearching(true);
      try {
        const result = await getStudentsServer(search);
        if (active) setStudents(result);
      } catch (err) {
        console.error(err);
        toast.error("Failed to search students.");
      } finally {
        setIsSearching(false);
      }
    };
    const timeout = setTimeout(fetchData, 400);
    return () => {
      active = false;
      clearTimeout(timeout);
    };
  }, [search]);

  // Submit handler
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!selected) {
      toast.error("Please select a student first.");
      return;
    }

    setLoading(true);
    try {
      const res = await addAdvisee({ adviserId, studentId: selected.id });

      if (res.success) {
        toast.success(res.message || `Added ${selected.name} as advisee.`);
        setSelected(null);
        setNote("");
        setOpen(false);
      } else {
        toast.error(res.message || "Failed to add advisee.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Unexpected error occurred while adding advisee.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* Trigger */}
      <DialogTrigger asChild>
        <Button variant="default" className="w-full justify-start">
          <IconPlus size={16} className="mr-2" />
          Add Advisee
        </Button>
      </DialogTrigger>

      {/* Content */}
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Advisee</DialogTitle>
          <DialogDescription>
            Search and select a student to add as your advisee.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Student Search */}
          <div className="grid gap-2">
            <Label>Student</Label>
            <Popover open={searchOpen} onOpenChange={setSearchOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  className={cn(
                    "w-full justify-between",
                    !selected && "text-muted-foreground"
                  )}
                >
                  {selected ? selected.name : "Search a student..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>

              <PopoverContent className="p-0 w-[380px]">
                <Command>
                  <CommandInput
                    placeholder="Type to search students..."
                    value={search}
                    onValueChange={setSearch}
                  />
                  <CommandList>
                    <CommandEmpty>
                      {isSearching ? "Searching..." : "No students found."}
                    </CommandEmpty>
                    <CommandGroup>
                      {students.map((s) => (
                        <CommandItem
                          key={s.id}
                          onSelect={() => {
                            setSelected(s);
                            setSearchOpen(false);
                          }}
                        >
                          {s.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          {/* Actions */}
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Close
              </Button>
            </DialogClose>

            <Button
              type="submit"
              variant="default"
              disabled={!selected || loading}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? "Adding..." : "Add Advisee"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
