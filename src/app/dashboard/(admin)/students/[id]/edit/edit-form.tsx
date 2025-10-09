"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import { Label } from "@/src/components/ui/label";

export default function EditForm({ user, updateUserAction, id }: any) {
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      try {
        await updateUserAction(id, formData);
        toast.success("Student information updated successfully!");
      } catch (error) {
        console.error(error);
        toast.error("Failed to update student information.");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="studentId">Student ID</Label>
        <Input
          id="studentId"
          name="studentId"
          placeholder="e.g. 2020-XXXXX"
          defaultValue={user.studentId ?? ""}
          className="max-w-xs"
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            name="firstName"
            placeholder="e.g. John"
            defaultValue={user.firstName ?? ""}
            required
          />
        </div>
        <div>
          <Label htmlFor="middleName">
            Middle Name{" "}
            <span className="text-gray-400 text-sm">(optional)</span>
          </Label>
          <Input
            id="middleName"
            name="middleName"
            placeholder="e.g. Van"
            defaultValue={user.middleName ?? ""}
          />
        </div>
        <div>
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            name="lastName"
            placeholder="e.g. Doe"
            defaultValue={user.lastName ?? ""}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            name="email"
            placeholder="e.g. example@school.edu"
            defaultValue={user.email ?? ""}
            required
          />
        </div>
        <div>
          <Label htmlFor="phoneNumber">
            Phone Number{" "}
            <span className="text-gray-400 text-sm">(optional)</span>
          </Label>
          <Input
            id="phoneNumber"
            name="phoneNumber"
            placeholder="e.g. +639123456789"
            defaultValue={user.phoneNumber ?? ""}
          />
        </div>
      </div>

      <Button type="submit" disabled={isPending} className="w-full sm:w-auto">
        {isPending ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  );
}
