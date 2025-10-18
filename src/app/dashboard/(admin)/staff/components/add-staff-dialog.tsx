// app/(dashboard)/users/staff/AddStaffDialog.tsx
"use client";

import React, { useTransition } from "react";
import { Button } from "@/src/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/ui/dialog";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { createStaffAction } from "../actions";

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  image?: string;
  providerAccountId?: string;
};

export function AddStaffDialog({ onAdded }: { onAdded?: () => void }) {
  const [isPending, startTransition] = useTransition();
  const { register, handleSubmit, reset } = useForm<FormData>();

  const onSubmit = (data: FormData) =>
    startTransition(async () => {
      try {
        const res = await createStaffAction(data);
        if (res.success) {
          toast.success("Staff added successfully!");
          reset();
          onAdded?.();
        } else {
          toast.error(res.message || "Staff already exists!");
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to add staff.");
      }
    });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Add Staff</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Staff</DialogTitle>
          <DialogDescription>
            Create a new staff account. If this Gmail logs in via Google, it
            will link to the same account.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>First Name</Label>
              <Input
                {...register("firstName", { required: true })}
                placeholder="John"
              />
            </div>
            <div>
              <Label>Last Name</Label>
              <Input
                {...register("lastName", { required: true })}
                placeholder="Smith"
              />
            </div>
          </div>

          <div>
            <Label>Email (Gmail)</Label>
            <Input
              type="email"
              {...register("email", { required: true })}
              placeholder="staff@cvsu.edu.ph"
            />
          </div>

          <div>
            <Label>Profile Image URL (optional)</Label>
            <Input {...register("image")} placeholder="https://..." />
          </div>
          {/* 
          <div>
            <Label>Google Provider ID (optional)</Label>
            <Input
              {...register("providerAccountId")}
              placeholder="Google OAuth sub ID"
            />
          </div> */}

          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : "Save Staff"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
