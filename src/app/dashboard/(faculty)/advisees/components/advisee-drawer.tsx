"use client";

import * as React from "react";

import { Button } from "@/src/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/src/components/ui/drawer";
import { useIsMobile } from "@/src/hooks/use-mobile";
import { AdviseeItem } from "./advisees-table";
import { AdviseeStatus } from "@/src/app/generated/prisma";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { toast } from "sonner";
import { updateAdviseeStatusAction } from "../actions";

interface AdviseeDrawerProps {
  item: AdviseeItem;
}

export const AdviseeDrawer: React.FC<AdviseeDrawerProps> = ({ item }) => {
  const isMobile = useIsMobile();

  const [status, setStatus] = React.useState<AdviseeStatus>(item.status);
  const [loading, setLoading] = React.useState(false);

  async function handleUpdateStatus() {
    try {
      setLoading(true);
      const res = await updateAdviseeStatusAction(item.id, status);

      if (res.success) {
        toast.success(`Status updated to ${status}`);
      } else {
        toast.error(res.error || "Failed to update status");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Drawer direction={isMobile ? "bottom" : "right"}>
      <DrawerTrigger asChild>
        <Button variant="ghost" className="w-full">
          View
        </Button>
      </DrawerTrigger>

      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>
              {item.student.firstName} {item.student.lastName}
            </DrawerTitle>
            <DrawerDescription>
              View or update advisee information.
            </DrawerDescription>
          </DrawerHeader>

          <div className="space-y-4 px-4 py-2">
            <p className="text-sm text-muted-foreground mb-1">
              Request Status:{" "}
            </p>
            <Select
              value={status}
              onValueChange={(v) => setStatus(v as AdviseeStatus)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={AdviseeStatus.PENDING}>Pending</SelectItem>
                <SelectItem value={AdviseeStatus.ACTIVE}>Active</SelectItem>
                <SelectItem value={AdviseeStatus.INACTIVE}>Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DrawerFooter>
            <Button onClick={handleUpdateStatus} disabled={loading}>
              {loading ? "Updating..." : "Update Status"}
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
