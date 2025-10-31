"use client";

import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table";
import { useDebounce } from "@/src/hooks/useDebounce";

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/src/components/ui/table";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/src/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
} from "@/src/components/ui/dropdown-menu";

import LoadingState from "@/src/components/shared/LoadingState";
import AddAdviseeDialog from "./add-advisee-dialog";
import { fetchAdviseesAction } from "../actions";
import { getAdviseeColumns } from "../columns";

import {
  IconArrowUp,
  IconArrowDown,
  IconAdjustments,
} from "@tabler/icons-react";
import DataPagination from "@/src/components/shared/data-pagination";

export type AdviseeItem = {
  id: string;
  adviserId: string;
  studentId: string;
  status: "PENDING" | "ACTIVE" | "INACTIVE";
  createdAt: string;
  student: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
  };
  adviser: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    email: string | null;
  };
  members: {
    id: string;
    member: {
      id: string;
      firstName: string | null;
      lastName: string | null;
      email: string | null;
      phoneNumber?: string | null;
    } | null;
  }[];
};

export type AdviseesResponse = {
  items: AdviseeItem[];
  page: number;
  pageSize: number;
  pages: number;
};

export default function AdviseesTable({
  initialData,
  adviserId,
}: {
  initialData: AdviseesResponse;
  adviserId: string;
}) {
  const [page, setPage] = React.useState(initialData.page || 1);
  const [pageSize, setPageSize] = React.useState(initialData.pageSize || 10);
  const [search, setSearch] = React.useState("");
  const debouncedSearch = useDebounce(search, 500);

  const [data, setData] = React.useState<AdviseeItem[]>(
    initialData.items || []
  );
  const [totalPages, setTotalPages] = React.useState(initialData.pages || 1);
  const [isLoading, setIsLoading] = React.useState(false);

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const fetchData = React.useCallback(
    async (
      opts?: Partial<{ page: number; pageSize: number; search: string }>
    ) => {
      setIsLoading(true);
      try {
        const res = await fetchAdviseesAction({
          page: opts?.page ?? page,
          pageSize: opts?.pageSize ?? pageSize,
          search: opts?.search ?? debouncedSearch,
          adviserId, // Important!
        });

        const normalized = res.items.map((item: any) => ({
          ...item,
          createdAt:
            typeof item.createdAt === "string"
              ? item.createdAt
              : item.createdAt?.toISOString?.() ?? "",
        }));

        setData(normalized);
        setTotalPages(res.pages);
        setPage(res.page);
      } catch (error) {
        console.error("Error fetching advisees:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [page, pageSize, debouncedSearch, adviserId]
  );

  React.useEffect(() => {
    fetchData({ search: debouncedSearch });
  }, [debouncedSearch, page, pageSize, fetchData]);

  const columns = React.useMemo(
    () => getAdviseeColumns(fetchData),
    [fetchData]
  );

  const table = useReactTable({
    data,
    columns,
    state: { sorting, columnVisibility, rowSelection },
    enableRowSelection: true,
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getRowId: (row) => row.id,
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Label>Page size:</Label>
          <Select
            value={String(pageSize)}
            onValueChange={(v) => {
              const newSize = Number(v);
              setPageSize(newSize);
              setPage(1);
              fetchData({ pageSize: newSize });
            }}
          >
            <SelectTrigger className="w-[90px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[10, 25, 50, 100].map((n) => (
                <SelectItem key={n} value={String(n)}>
                  {n}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              Controls <IconAdjustments />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64 space-y-2 p-2">
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Search</Label>
              <Input
                placeholder="Search advisees..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />
            </div>
            <Button
              variant="secondary"
              className="w-full justify-start"
              onClick={() =>
                fetchData({ page, pageSize, search: debouncedSearch })
              }
              disabled={isLoading}
            >
              <IconArrowDown size={16} className="rotate-180 mr-2" />
              Refresh Data
            </Button>

            <div className="border-t border-muted pt-2">
              <Label className="text-xs text-muted-foreground">
                Visible Columns
              </Label>
              {table
                .getAllLeafColumns()
                .filter((col) => col.getCanHide())
                .map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    checked={column.getIsVisible()}
                    onCheckedChange={(v) => column.toggleVisibility(!!v)}
                    className="capitalize"
                  >
                    {column.columnDef.header as string}
                  </DropdownMenuCheckboxItem>
                ))}
            </div>

            <div className="border-t border-muted pt-2">
              <AddAdviseeDialog
                adviserId={adviserId}
                onAdded={() => fetchData()}
              />
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {isLoading ? (
        <LoadingState rows={6} />
      ) : (
        <div className="overflow-hidden rounded-lg border">
          <Table>
            <TableHeader className="bg-muted">
              {table.getHeaderGroups().map((hg) => (
                <TableRow key={hg.id}>
                  {hg.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      onClick={
                        header.column.getCanSort()
                          ? header.column.getToggleSortingHandler()
                          : undefined
                      }
                      className={
                        header.column.getCanSort()
                          ? "cursor-pointer select-none"
                          : undefined
                      }
                    >
                      <span className="flex items-center">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {header.column.getCanSort() && (
                          <>
                            {header.column.getIsSorted() === "asc" && (
                              <IconArrowUp size={14} />
                            )}
                            {header.column.getIsSorted() === "desc" && (
                              <IconArrowDown size={14} />
                            )}
                          </>
                        )}
                      </span>
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="text-center py-6 text-muted-foreground"
                  >
                    No advisees found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Pagination controls */}
      <div className="flex items-center justify-between">
        {/* Selected rows */}
        <div className="text-sm text-muted-foreground">
          {Object.keys(rowSelection).length} selected
        </div>

        {/* Pagination buttons */}
        {totalPages > 1 && (
          <DataPagination
            page={page}
            totalPages={totalPages}
            pageSize={pageSize}
            onPageChange={(newPage) => fetchData({ page: newPage })}
            onPageSizeChange={(newSize) => {
              setPageSize(newSize);
              fetchData({ page: 1, pageSize: newSize });
            }}
            disabled={isLoading}
          />
        )}
      </div>
    </div>
  );
}
