//core
import { NavLink } from "react-router-dom";
import React, { useState } from "react";
import { Loader2 } from "lucide-react";

//others
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { getCategories } from "../../helper/categoriesHelper/ctg";

//redux
import { useSelector } from "react-redux";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  loading: boolean;
  SetPage: React.Dispatch<React.SetStateAction<number>>;
  Next: boolean;
  Prev: boolean;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  loading,
  SetPage,
  Next,
  Prev,
}: DataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnFilters,
    },
  });

  let ctg = useSelector((s: any) => s.ctg);

  return (
    <div className="max-w-6xl">
      <div className="mt-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center py-4">
            <Input
              placeholder="Filter products"
              value={
                (table.getColumn("name")?.getFilterValue() as string) ?? ""
              }
              onChange={(event) =>
                table.getColumn("name")?.setFilterValue(event.target.value)
              }
              className="w-[350px]"
            />
          </div>
          <div className="flex items-center py-4">
            {/* ====================================== */}
            <Select
              onOpenChange={() => {
                !ctg && getCategories();
              }}
              value={
                (table.getColumn("catagories")?.getFilterValue() as string) ??
                ""
              }
              onValueChange={(event) => {
                table.getColumn("catagories")?.setFilterValue(event);
              }}
            >
              <SelectTrigger className="w-[250px]">
                <SelectValue placeholder="Sort by Categories" />
              </SelectTrigger>
              <SelectContent>
                {ctg == null ? (
                  <p className="px-4">Loading..,</p>
                ) : ctg.length ? (
                  ctg.map((c: any) => (
                    <SelectItem value={c.name}>{c.name}</SelectItem>
                  ))
                ) : (
                  "Not Found"
                )}
              </SelectContent>
            </Select>
          </div>
        </div>
        <NavLink to="/addproduct">
          <Button>Create New Product</Button>
        </NavLink>
      </div>
      <div className="rounded-md mt-6 border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
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
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <div className="flex items-center justify-end space-x-2 py-4 px-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => SetPage((value) => value - 1)}
            disabled={loading || !Prev}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                loading...
              </>
            ) : (
              "Previous"
            )}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => SetPage((value) => value + 1)}
            disabled={loading || !Next}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                loading...
              </>
            ) : (
              "Next"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
