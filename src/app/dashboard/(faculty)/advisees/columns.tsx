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
        const student = row.original.student;
        return (
          <div>
            {student.firstName} {student.lastName}
            <div className="text-xs text-muted-foreground">{student.email}</div>
          </div>
        );
      },
    },
    {
      accessorKey: "phoneNumber",
      header: "Phone",
      cell: ({ row }) => (
        <span>{row.original.student.phoneNumber || "N/A"}</span>
      ),
    },
    {
      accessorKey: "status",
      header: "Request Status",
      cell: ({ row }) => {
        const status = row.original.status;
        const statusConfig = {
          ACTIVE: {
            icon: <IconCircleCheckFilled className="text-green-500" />,
            textColor: "text-green-500",
            borderColor: "border border-green-500",
          },
          PENDING: {
            icon: <IconAlertCircle className="text-yellow-500" />,
            textColor: "text-yellow-500",
            borderColor: "border border-yellow-500",
          },
          INACTIVE: {
            icon: <IconAlertCircle className="text-gray-400" />,
            textColor: "text-gray-400",
            borderColor: "border border-gray-400",
          },
        };

        const { icon, textColor, borderColor } =
          statusConfig[status] || statusConfig.INACTIVE;

        return (
          <Badge
            variant="outline"
            className={`flex items-center gap-1 px-2 py-0.5 text-sm font-medium ${textColor} ${borderColor}`}
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
      cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
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
                    toast.error(
                      (res && res.error) || "Failed to accept advisee"
                    );
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
            <DropdownMenuItem asChild>
              <AdviseeDrawer item={row.original} />
            </DropdownMenuItem>
            <DropdownMenuSeparator />
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
