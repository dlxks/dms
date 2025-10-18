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
import { updateUserAction } from "../actions";
import { UserItem } from "./columns";
import EditForm from "./edit-form";

interface StudentDrawerProps {
  item: UserItem;
  fetchData: () => Promise<void>;
}

export const StudentDrawer: React.FC<StudentDrawerProps> = ({
  item,
  fetchData,
}) => {
  const isMobile = useIsMobile();
  const [open, setOpen] = React.useState(false);

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
          <DrawerTitle>Edit Student Information</DrawerTitle>
          <DrawerDescription>
            Update {item.firstName} {item.lastName}’s details below.
          </DrawerDescription>
        </DrawerHeader>

        <div className="px-4 py-2">
          <EditForm
            user={item}
            updateUserAction={updateUserAction}
            id={item.id}
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
