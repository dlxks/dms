"use client";

import * as React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/src/components/ui/form";
import { PhoneInput } from "@/src/components/ui/phone-input";
import { updateInformation } from "../actions";
import { profileSchema } from "@/src/schemas/profile-schema";

export type ProfileProps = {
  id: string;
  studentId?: string;
  staffId?: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
};

interface ProfileFormProps {
  item: ProfileProps | null;
}

type FormSchema = z.infer<typeof profileSchema>;

const ProfileForm = ({ item }: ProfileFormProps) => {
  const form = useForm<FormSchema>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      idNumber: item?.studentId || item?.staffId || "",
      firstName: item?.firstName || "",
      middleName: item?.middleName || "",
      lastName: item?.lastName || "",
      email: item?.email || "",
      phoneNumber: item?.phoneNumber || "",
    },
  });

  const onSubmit = async (data: FormSchema) => {
    React.startTransition(async () => {
      const result = await updateInformation(data);

      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    });
  };

  return (
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mx-auto space-y-6"
        >
          {/* ID Number */}
          <FormField
            control={form.control}
            name="idNumber"
            render={({ field }) => (
              <FormItem className="max-w-xs">
                <FormLabel>ID Number</FormLabel>
                <FormControl>
                  <Input placeholder="Student or Faculty ID" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 space-y-2">
            {/* First Name */}
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. John" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Middle Name */}
            <FormField
              control={form.control}
              name="middleName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Middle Name{" "}
                    <span className="text-gray-500">(optional)</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Van" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Last Name */}
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 space-y-2">
            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="example@domain.com"
                      type="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Phone Number */}
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number (optional)</FormLabel>
                  <FormControl>
                    <PhoneInput
                      {...field}
                      defaultCountry="PH"
                      placeholder="e.g. 0917 123 4567"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button type="submit" className="w-full">
            Update
          </Button>
        </form>
      </Form>
  );
};

export default ProfileForm;
