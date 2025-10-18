"use client";

import React, { useTransition } from "react";
import { toast } from "sonner";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import { Label } from "@/src/components/ui/label";

export interface User {
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
  id,
  updateUserAction,
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
          toast.success("Faculty information updated successfully!");
          onUpdated?.();
        } else {
          toast.error(result?.error || "Failed to update faculty information.");
        }
      } catch (error) {
        console.error("Update error:", error);
        toast.error("An unexpected error occurred while updating.");
      }
    });
  };

  const inputProps = (
    name: keyof User,
    placeholder: string,
    required = false
  ) => ({
    id: name,
    name,
    placeholder,
    defaultValue: user[name] ?? "",
    disabled: isPending,
    required,
    className: "w-full",
  });

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 px-1 overflow-y-auto max-h-[70vh]"
    >
      {/* Faculty ID */}
      <div>
        <Label htmlFor="staffId">Faculty ID</Label>
        <Input
          {...inputProps("staffId", "e.g. 2020-XXXXX")}
          className="max-w-xs"
        />
      </div>

      {/* Name Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="firstName">First Name</Label>
          <Input {...inputProps("firstName", "e.g. John", true)} />
        </div>

        <div>
          <Label htmlFor="middleName">
            Middle Name{" "}
            <span className="text-gray-400 text-xs">(optional)</span>
          </Label>
          <Input {...inputProps("middleName", "e.g. Van")} />
        </div>

        <div>
          <Label htmlFor="lastName">Last Name</Label>
          <Input {...inputProps("lastName", "e.g. Doe", true)} />
        </div>
      </div>

      {/* Contact Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            {...inputProps("email", "e.g. example@school.edu", true)}
            type="email"
          />
        </div>

        <div>
          <Label htmlFor="phoneNumber">
            Phone Number{" "}
            <span className="text-gray-400 text-xs">(optional)</span>
          </Label>
          <Input {...inputProps("phoneNumber", "e.g. +639123456789")} />
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
