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
import { createFacultyAction } from "../actions";

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  image?: string;
  providerAccountId?: string;
};

export function AddFacultyDialog({ onAdded }: { onAdded?: () => void }) {
  const [isPending, startTransition] = useTransition();
  const { register, handleSubmit, reset } = useForm<FormData>();

  const onSubmit = (data: FormData) =>
    startTransition(async () => {
      try {
        const res = await createFacultyAction(data);
        if (res.success) {
          toast.success("Faculty added successfully!");
          reset();
          onAdded?.();
        } else {
          toast.error(res.message || "Faculty already exists!");
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to add faculty.");
      }
    });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Add Faculty</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Faculty</DialogTitle>
          <DialogDescription>
            Create a new faculty account. If this Gmail logs in via Google, it
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
              placeholder="faculty@cvsu.edu.ph"
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
              {isPending ? "Saving..." : "Save Faculty"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
