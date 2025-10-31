import DeleteConfirmDialog from "@/src/components/shared/dashboard/delete-dialog";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import {
  IconAlertCircle,
  IconCircleCheckFilled,
  IconDotsVertical,
} from "@tabler/icons-react";
import { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";
import { updateAdviseeStatusAction, deleteAdviseeAction } from "./actions";
import { Checkbox } from "@/src/components/ui/checkbox";
import { AdviseeItem } from "./components/advisees-table";
import AcceptConfirmDialog from "./components/accept-dialog";
import { AdviseeDrawer } from "./components/advisee-drawer";

export function getAdviseeColumns(
  fetchData: () => Promise<void>
): ColumnDef<AdviseeItem>[] {
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
      accessorKey: "studentName",
      header: "Student",
      cell: ({ row }) => {
        const { student } = row.original;
        return (
          <div>
            {student.firstName} {student.lastName}
            <div className="text-xs text-muted-foreground">{student.email}</div>
          </div>
        );
      },
    },

    {
      accessorKey: "members",
      header: "Members",
      cell: ({ row }) => {
        const members = row.original.members || [];

        if (members.length === 0) {
          return (
            <span className="text-muted-foreground text-sm">No members</span>
          );
        }

        return (
          <div className="flex flex-wrap gap-1">
            {members.map((m) => (
              <Badge
                key={m.id}
                variant="secondary"
                className="text-xs px-2 py-1"
              >
                {m.member?.firstName} {m.member?.lastName}
              </Badge>
            ))}
          </div>
        );
      },
    },

    {
      accessorKey: "status",
      header: "Request Status",
      cell: ({ row }) => {
        const status = row.original.status;
        const config = {
          ACTIVE: {
            icon: <IconCircleCheckFilled className="text-green-500" />,
            color: "text-green-500 border border-green-500",
          },
          PENDING: {
            icon: <IconAlertCircle className="text-yellow-500" />,
            color: "text-yellow-500 border border-yellow-500",
          },
          INACTIVE: {
            icon: <IconAlertCircle className="text-gray-400" />,
            color: "text-gray-400 border border-gray-400",
          },
        };

        const { icon, color } = config[status] || config.INACTIVE;

        return (
          <Badge
            variant="outline"
            className={`flex items-center gap-1 px-2 py-0.5 text-sm font-medium ${color}`}
          >
            {icon}
            <span className="capitalize">{status.toLowerCase()}</span>
          </Badge>
        );
      },
    },

    {
      accessorKey: "createdAt",
      header: "Creation Date",
      cell: ({ row }) => {
        const date = new Date(row.original.createdAt);
        return (
          <span className="text-sm text-muted-foreground">
            {isNaN(date.getTime())
              ? "Invalid date"
              : date.toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
          </span>
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
              size="icon"
              className="text-muted-foreground"
            >
              <IconDotsVertical />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-32">
            {/* Accept */}
            <DropdownMenuItem asChild>
              <AcceptConfirmDialog
                itemName={`${row.original.student.firstName} ${row.original.student.lastName}`}
                onConfirm={async () => {
                  const res = await updateAdviseeStatusAction(
                    row.original.id,
                    "ACTIVE"
                  );
                  if (res && res.success) {
                    toast.success("Advisee accepted successfully");
                    await fetchData();
                  } else {
                    toast.error(res?.error || "Failed to accept advisee");
                  }
                }}
              >
                <Button
                  variant={
                    row.original.status !== "PENDING" ? "ghost" : "default"
                  }
                  className="w-full"
                  disabled={row.original.status !== "PENDING"}
                >
                  Accept
                </Button>
              </AcceptConfirmDialog>
            </DropdownMenuItem>

            {/* View */}
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              <AdviseeDrawer item={row.original} fetchData={fetchData} />
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            {/* Delete */}
            <DropdownMenuItem asChild>
              <DeleteConfirmDialog
                itemName={`${row.original.student.firstName} ${row.original.student.lastName}`}
                onConfirm={async () => {
                  const res = await deleteAdviseeAction(row.original.id);
                  if (res.success) {
                    toast.success("Advisee deleted successfully");
                    await fetchData();
                  } else {
                    toast.error("Failed to delete advisee");
                  }
                }}
              >
                <Button
                  variant="ghost"
                  className="w-full text-red-600 hover:bg-red-50"
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
