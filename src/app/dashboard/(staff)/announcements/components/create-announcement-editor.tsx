"use client";

import { useState } from "react";
import { SerializedEditorState } from "lexical";
import { Editor } from "@/src/components/blocks/editor-x/editor";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/form";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod/v3";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { cn } from "@/src/lib/utils";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/src/components/ui/popover";
import { Calendar } from "@/src/components/ui/calendar";

// 🧩 Lucide icons
import { CalendarIcon, FileText, Eye, EyeOff, Type } from "lucide-react";
import { formatDate } from "@/src/lib/formatDate";

const formSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long"),
  content: z.any(),
  status: z.enum(["VISIBLE", "HIDDEN"], {
    required_error: "Please select a status",
  }),
  expiryDate: z
    .string()
    .optional()
    .refine(
      (date) => {
        if (!date) return true;
        const selected = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return selected >= today;
      },
      { message: "Expiry date cannot be in the past" }
    ),
});

const initialValue = {
  root: {
    children: [
      {
        children: [
          {
            detail: 0,
            format: 0,
            mode: "normal",
            style: "",
            text: "Welcome",
            type: "text",
            version: 1,
          },
        ],
        direction: "ltr",
        format: "",
        indent: 0,
        type: "paragraph",
        version: 1,
      },
    ],
    direction: "ltr",
    format: "",
    indent: 0,
    type: "root",
    version: 1,
  },
} as unknown as SerializedEditorState;

export default function EditorDemo() {
  const [editorState, setEditorState] =
    useState<SerializedEditorState>(initialValue);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: initialValue,
      status: "VISIBLE",
      expiryDate: "",
    },
  });

  return (
    <div className="max-w-3xl mx-auto space-y-6 p-6 bg-white rounded-2xl shadow-md/20">
      <h2 className="text-xl font-semibold flex items-center gap-2">
        <FileText className="w-5 h-5 text-primary" />
        Create Announcement
      </h2>

      <Form {...form}>
        <form className="space-y-6">
          {/* Title */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Type className="w-4 h-4 text-muted-foreground" />
                  Title
                </FormLabel>
                <FormControl>
                  <Input placeholder="Enter announcement title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Content Editor */}
          <FormItem>
            <FormLabel className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-muted-foreground" />
              Contents
            </FormLabel>
            <Editor
              editorSerializedState={editorState}
              onSerializedChange={(value) => setEditorState(value)}
            />
          </FormItem>

          {/* Status */}
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  {field.value === "VISIBLE" ? (
                    <Eye className="w-4 h-4 text-green-600" />
                  ) : (
                    <EyeOff className="w-4 h-4 text-gray-400" />
                  )}
                  Status
                </FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="VISIBLE">Visible</SelectItem>
                      <SelectItem value="HIDDEN">Hidden</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Expiry Date (optional) */}
          <FormField
            control={form.control}
            name="expiryDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4 text-muted-foreground" />
                  Expiry Date (optional)
                </FormLabel>
                <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        type="button"
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          formatDate(new Date(field.value))
                        ) : (
                          <span>Select a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>

                  <PopoverContent
                    align="start"
                    className="w-auto p-3 space-y-2"
                  >
                    <Calendar
                      mode="single"
                      selected={field.value ? new Date(field.value) : undefined}
                      onSelect={(date) => {
                        field.onChange(date ? date.toISOString() : "");
                        setIsPopoverOpen(false);
                      }}
                      disabled={(date) => {
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        const isPast = date < today;
                        return isPast;
                      }}
                      initialFocus
                    />

                    {/* Clear date only if selected */}
                    {field.value && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="w-full text-muted-foreground hover:text-foreground"
                        onClick={() => {
                          field.onChange("");
                          setIsPopoverOpen(false);
                        }}
                      >
                        Clear date
                      </Button>
                    )}
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit */}
          <Button type="submit" className="w-full">
            Post Announcement
          </Button>
        </form>
      </Form>
    </div>
  );
}
