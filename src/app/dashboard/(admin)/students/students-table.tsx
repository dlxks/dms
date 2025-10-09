"use client";

import * as React from "react";
import { useDebounce } from "@/src/hooks/useDebounce";
import { fetchUsersAction } from "@/src/app/dashboard/(admin)/students/actions";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table";

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
import DataPagination from "@/src/components/shared/dashboard/DataPagination";

import {
  IconColumns,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconArrowUp,
  IconArrowDown,
} from "@tabler/icons-react";
import { getUserColumns } from "./columns";

// ---------------- TYPES ----------------
type UserItem = {
  id: string;
  studentId?: string | null;
  staffId?: string | null;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string | null;
  session?: { expires: string }[] | null;
  createdAt?: string;
};

type UsersResponse = {
  items: UserItem[];
  page: number;
  pageSize: number;
  pages: number;
};

type UsersTableProps = {
  role: string;
  initialData: UsersResponse;
  editBasePath?: string;
  onDelete?: (id: string) => void;
  onAdd?: () => void;
};

// ---------------- COMPONENT ----------------
export default function UsersTable({ role, initialData }: UsersTableProps) {
  const [page, setPage] = React.useState(initialData.page || 1);
  const [pageSize, setPageSize] = React.useState(initialData.pageSize || 10);
  const [search, setSearch] = React.useState("");
  const debouncedSearch = useDebounce(search, 500);

  const [data, setData] = React.useState<UserItem[]>(initialData.items || []);
  const [totalPages, setTotalPages] = React.useState(initialData.pages || 1);
  const [isLoading, setIsLoading] = React.useState(false);

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  // ---------------- DATA FETCH ----------------
  const fetchData = React.useCallback(
    async (
      opts?: Partial<{ page: number; pageSize: number; search: string }>
    ) => {
      setIsLoading(true);
      try {
        const res = await fetchUsersAction({
          page: opts?.page ?? page,
          pageSize: opts?.pageSize ?? pageSize,
          search: opts?.search ?? debouncedSearch,
          filters: { role },
        });

        setData(
          res.items.map((u: any) => ({
            ...u,
            session: u.sessions ?? [],
          }))
        );
        setTotalPages(res.pages);
        setPage(res.page);
      } catch (e) {
        console.error("Error fetching users:", e);
      } finally {
        setIsLoading(false);
      }
    },
    [page, pageSize, debouncedSearch, role]
  );

  React.useEffect(() => {
    fetchData({ search: debouncedSearch });
  }, [debouncedSearch, page, pageSize, role, fetchData]);

  const columns = React.useMemo(() => getUserColumns(fetchData), [fetchData]);

  const table = useReactTable({
    data,
    columns,
    state: { sorting, columnVisibility, rowSelection },
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getRowId: (row) => row.id,
  });

  // ---------------- RENDER ----------------
  return (
    <div className="space-y-4">
      {/* Header Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Label>Page size:</Label>
          <Select
            value={String(pageSize)}
            onValueChange={(v) => {
              const n = Number(v);
              setPageSize(n);
              setPage(1);
              fetchData({ pageSize: n });
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

        <div className="flex items-center gap-2">
          <Input
            placeholder="Search..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="max-w-sm"
          />

          {/* Column Toggle */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <IconColumns size={18} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllLeafColumns()
                .filter((col) => col.getCanHide())
                .map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    checked={column.getIsVisible()}
                    onCheckedChange={(v) => column.toggleVisibility(!!v)}
                  >
                    {column.columnDef.header as string}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* <Button variant="outline" onClick={() => onAdd?.()}>
            <IconPlus size={16} className="mr-2" />
            Add
          </Button> */}
        </div>
      </div>

      {/* Table */}
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
                              <IconArrowUp size={14} stroke={1.5} />
                            )}
                            {header.column.getIsSorted() === "desc" && (
                              <IconArrowDown size={14} stroke={1.5} />
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
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {Object.keys(rowSelection).length} selected
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setPage(1)}
            disabled={page <= 1}
          >
            <IconChevronsLeft size={16} />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page <= 1}
          >
            <IconChevronLeft size={16} />
          </Button>
          <div className="text-sm">
            Page {page} of {totalPages}
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page >= totalPages}
          >
            <IconChevronRight size={16} />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setPage(totalPages)}
            disabled={page >= totalPages}
          >
            <IconChevronsRight size={16} />
          </Button>
        </div>
      </div>

      <DataPagination
        page={page}
        totalPages={totalPages}
        onPageChange={(p) => setPage(p)}
      />
    </div>
  );
}
