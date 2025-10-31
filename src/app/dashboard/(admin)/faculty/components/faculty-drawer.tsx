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
import { UserItem } from "./columns";
import EditForm from "./edit-form";
import { updateUserAction as serverUpdateUserAction } from "../actions";

interface FacultyDrawerProps {
  item: UserItem;
  fetchData: () => Promise<void>;
}

export const FacultyDrawer: React.FC<FacultyDrawerProps> = ({
  item,
  fetchData,
}) => {
  const isMobile = useIsMobile();
  const [open, setOpen] = React.useState(false);

  // Wrap server update to match EditForm expected type
  const updateUserAction = async (
    id: string,
    formData: FormData
  ): Promise<{ success?: boolean; error?: string }> => {
    try {
      await serverUpdateUserAction(id, formData);
      return { success: true };
    } catch (error: unknown) {
      console.error("Update error:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to update";
      return { success: false, error: errorMessage };
    }
  };

  return (
    <Drawer
      open={open}
      onOpenChange={setOpen}
      direction={isMobile ? "bottom" : "right"}
    >
      <DrawerTrigger asChild>
        <Button variant="ghost" className="w-full justify-start pl-2">
          Edit
        </Button>
      </DrawerTrigger>

      <DrawerContent className="w-full mx-auto py-8">
        <DrawerHeader>
          <DrawerTitle>Edit Information</DrawerTitle>
          <DrawerDescription>
            Update {item.firstName} {item.lastName}’s details below.
          </DrawerDescription>
        </DrawerHeader>

        <div className="px-4 py-2">
          <EditForm
            user={item}
            id={item.id}
            updateUserAction={updateUserAction}
            onUpdated={() => {
              setOpen(false);
              fetchData();
            }}
          />
        </div>

        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline" className="w-full sm:w-auto">
              Close
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
