"use client";

import React, { useTransition } from "react";
import { toast } from "sonner";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import { Label } from "@/src/components/ui/label";

interface User {
  staffId?: string | null;
  firstName?: string | null;
  middleName?: string | null;
  lastName?: string | null;
  email?: string | null;
  phoneNumber?: string | null;
}

interface EditFormProps {
  user: User;
  id: string;
  updateUserAction: (
    id: string,
    formData: FormData
  ) => Promise<{ success?: boolean; error?: string }>;
  onUpdated?: () => void;
}

export default function EditForm({
  user,
  updateUserAction,
  id,
  onUpdated,
}: EditFormProps) {
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      try {
        const result = await updateUserAction(id, formData);

        if (result?.success) {
          toast.success("Staff information updated successfully!");
          onUpdated?.();
        } else {
          toast.error(result?.error || "Failed to update staff information.");
        }
      } catch (error) {
        console.error("Update error:", error);
        toast.error("An unexpected error occurred while updating.");
      }
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 px-1 overflow-y-auto max-h-[70vh]"
    >
      {/* Staff ID */}
      <div>
        <Label htmlFor="staffId">ID No.</Label>
        <Input
          id="staffId"
          name="staffId"
          placeholder="e.g. 2020-XXXXX"
          defaultValue={user.staffId ?? ""}
          className="max-w-xs"
          disabled={isPending}
        />
      </div>

      {/* Name Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            name="firstName"
            placeholder="e.g. John"
            defaultValue={user.firstName ?? ""}
            disabled={isPending}
            required
          />
        </div>

        <div>
          <Label htmlFor="middleName">
            Middle Name{" "}
            <span className="text-gray-400 text-xs">(optional)</span>
          </Label>
          <Input
            id="middleName"
            name="middleName"
            placeholder="e.g. Van"
            defaultValue={user.middleName ?? ""}
            disabled={isPending}
          />
        </div>

        <div>
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            name="lastName"
            placeholder="e.g. Doe"
            defaultValue={user.lastName ?? ""}
            disabled={isPending}
            required
          />
        </div>
      </div>

      {/* Contact Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            name="email"
            placeholder="e.g. example@school.edu"
            defaultValue={user.email ?? ""}
            disabled={isPending}
            required
          />
        </div>

        <div>
          <Label htmlFor="phoneNumber">
            Phone Number{" "}
            <span className="text-gray-400 text-xs">(optional)</span>
          </Label>
          <Input
            id="phoneNumber"
            name="phoneNumber"
            placeholder="e.g. +639123456789"
            defaultValue={user.phoneNumber ?? ""}
            disabled={isPending}
          />
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end pt-2">
        <Button type="submit" disabled={isPending} className="w-full sm:w-auto">
          {isPending ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}
