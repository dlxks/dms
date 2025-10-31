"use client";

import * as React from "react";
import { toast } from "sonner";
import { Button } from "@/src/components/ui/button";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from "@/src/components/ui/drawer";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/src/components/ui/select";
import { useIsMobile } from "@/src/hooks/use-mobile";
import { updateAdviseeAction, getFacultyServer } from "../actions";
import { AdviseeItem } from "./advisees-table";
import { MultiSelect } from "@/src/components/ui/multi-select";

export type AdviseeStatus = "PENDING" | "ACTIVE" | "INACTIVE";

interface AdviseeDrawerProps {
  item: AdviseeItem;
  fetchData: () => Promise<void>;
}

export const AdviseeDrawer: React.FC<AdviseeDrawerProps> = ({
  item,
  fetchData,
}) => {
  const isMobile = useIsMobile();
  const [isDrawerOpen, setDrawerOpen] = React.useState(false);
  const [status, setStatus] = React.useState<AdviseeStatus>(item.status);
  const [faculty, setFaculty] = React.useState<{ id: string; name: string }[]>(
    []
  );
  const [loading, setLoading] = React.useState(false);
  const [selectedMembers, setSelectedMembers] = React.useState<string[]>(
    item.members?.map((m) => m.member?.id || "") || []
  );

  React.useEffect(() => {
    (async () => {
      try {
        const data = await getFacultyServer();
        setFaculty(data);
      } catch (err) {
        console.error("Failed to load faculty:", err);
      }
    })();
  }, []);

  const facultyOptions = faculty.map((f) => ({
    label: f.name,
    value: f.id,
  }));

  const handleSaveChanges = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("adviserId", item.adviserId);
      formData.append("studentId", item.studentId);
      formData.append("status", status);

      selectedMembers.forEach((id) => formData.append("memberIds", id));

      const res = await updateAdviseeAction(item.id, formData);
      if (res.success) {
        toast.success("Advisee updated successfully.");
        await fetchData();
        setDrawerOpen(false);
      } else {
        toast.error(res.message || "Failed to update advisee.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while saving changes.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Drawer
      direction={isMobile ? "bottom" : "right"}
      open={isDrawerOpen}
      onOpenChange={setDrawerOpen}
    >
      <DrawerTrigger asChild>
        <Button variant="ghost" className="w-full">
          View
        </Button>
      </DrawerTrigger>

      <DrawerContent>
        <div className="mx-auto w-full max-w-md">
          <DrawerHeader>
            <DrawerTitle className="text-lg font-semibold">
              Advisee — {item.student.firstName} {item.student.lastName}
            </DrawerTitle>
            <DrawerDescription>
              View and update advisee details.
            </DrawerDescription>
          </DrawerHeader>

          <div className="px-4 py-4 space-y-5">
            {/* Members MultiSelect */}
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                Members (Faculty/Staff):
              </p>
              <MultiSelect
                options={facultyOptions}
                value={selectedMembers}
                onValueChange={setSelectedMembers}
                placeholder="Select members..."
                maxCount={3}
                searchable
              />
            </div>

            {/* Status Select */}
            <div>
              <p className="text-sm font-medium mb-1">Status:</p>
              <Select
                value={status}
                onValueChange={(v) => setStatus(v as AdviseeStatus)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="INACTIVE">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DrawerFooter>
            <Button onClick={handleSaveChanges} disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
            <DrawerClose asChild>
              <Button variant="outline">Close</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
