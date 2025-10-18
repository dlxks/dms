// columns.tsx
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { Checkbox } from "@/src/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import { IconDotsVertical } from "@tabler/icons-react";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import DeleteConfirmDialog from "@/src/components/shared/dashboard/delete-dialog";
import { deleteUserAction } from "../actions";
import { toast } from "sonner";
import { StudentDrawer } from "./student-drawer";

export type UserSession = { expires: string };

export type UserItem = {
  id: string;
  studentId?: string | null;
  staffId?: string | null;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string | null;
  session?: UserSession[] | null;
  createdAt?: string;
};

export function getUserColumns(
  fetchData: () => Promise<void>
): ColumnDef<UserItem>[] {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <div className="flex items-center justify-center">
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && undefined)
            }
            onCheckedChange={(v) => table.toggleAllPageRowsSelected(!!v)}
            aria-label="Select all rows"
          />
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex items-center justify-center">
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(v) => row.toggleSelected(!!v)}
            aria-label="Select row"
          />
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
    },

    {
      accessorKey: "studentId",
      header: "Student ID",
      cell: ({ row }) => (
        <div className="font-mono text-sm">
          {row.original.studentId || "N/A"}
        </div>
      ),
    },

    { accessorKey: "firstName", header: "First Name" },
    { accessorKey: "lastName", header: "Last Name" },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => (
        <div className="truncate max-w-[220px]">{row.original.email}</div>
      ),
    },
    {
      accessorKey: "phoneNumber",
      header: "Phone",
      cell: ({ row }) => <span>{row.original.phoneNumber || "N/A"}</span>,
    },
    {
      accessorKey: "session",
      header: "Session",
      enableSorting: false,
      cell: ({ row }) => {
        const sessions = Array.isArray(row.original.session)
          ? row.original.session
          : [];
        const hasActiveSession = sessions.some(
          (s) => s?.expires && new Date(s.expires) > new Date()
        );

        return (
          <Badge
            variant="secondary"
            className={
              hasActiveSession
                ? "bg-emerald-500 text-white hover:bg-emerald-600"
                : "bg-red-500 text-white hover:bg-red-600"
            }
          >
            {hasActiveSession ? "Active" : "Inactive"}
          </Badge>
        );
      },
    },

    {
      id: "actions",
      header: "",
      enableSorting: false,
      enableHiding: false,
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
              size="icon"
            >
              <IconDotsVertical />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-32">
            <DropdownMenuItem asChild>
              <StudentDrawer item={row.original} fetchData={fetchData} />
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <DeleteConfirmDialog
                itemName={`${row.original.firstName} ${row.original.lastName}`}
                onConfirm={async () => {
                  const res = await deleteUserAction(row.original.id);
                  if (res.success) {
                    toast.success("User deleted successfully");
                    await fetchData();
                  } else {
                    toast.error("Failed to delete user");
                  }
                }}
              >
                <Button
                  variant="ghost"
                  className="w-full justify-start text-red-600 hover:bg-red-50 pl-2"
                >
                  Delete
                </Button>
              </DeleteConfirmDialog>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];
}
