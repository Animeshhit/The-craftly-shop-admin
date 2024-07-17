import React, { useState } from "react";

//others
import getToken from "../../helper/token";

import {
  ColumnDef,
  flexRender,
  SortingState,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
} from "@tanstack/react-table";

import axios from "axios";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Label } from "../ui/label";

import { Button } from "../ui/button";
import { Input } from "../ui/input";

//redux
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../store/Slices/userSlice";
import { setCtg } from "../../store/Slices/ctgSlice";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const dispatch = useDispatch();
  const ctgs = useSelector((s: any) => s.ctg);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  // =================================for adding ctg ==================================
  const [ctgInput, setCtgInput] = useState("");
  const AddNewCtg = () => {
    let token = getToken();

    if (!token) {
      alert("Session Expired");
      dispatch(login(false));
      return;
    }
    if (!ctgInput || ctgInput == "") {
      alert("Please Enter a valid categories Name");
      return;
    }
    try {
      axios
        .post(
          `${import.meta.env.VITE_ADMIN_API_URL}/create-new-ctg`,
          {
            name: ctgInput,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        )
        .then((res) => {
          let { data } = res;
          if (Array.isArray(ctgs)) {
            dispatch(setCtg([...ctgs, data.newctg]));
          }
          console.log(data);
          alert(data.message);
        })
        .catch((err) => {
          console.log(err);
          if (err.request.status == 401) {
            alert(err.response.data.message);
          } else if (err.request.status == 403) {
            alert(err.response.data.message);
          } else {
            console.log(err);
            alert("something went wrong");
          }
        });
    } catch (err) {
      console.log(err);
      alert("network connection error");
    } finally {
      setCtgInput("");
    }
  };
  // ====================================================================================

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  return (
    <div>
      <div className="flex mt-12 max-w-[800px] items-center justify-between">
        <Input
          placeholder="Filter categories..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="w-[350px]"
        />
        <Dialog>
          <DialogTrigger asChild>
            <Button>Add Categories</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Categories</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-6 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  placeholder="Enter Categories Name..."
                  value={ctgInput}
                  className="col-span-5"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setCtgInput(e.target.value);
                  }}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={AddNewCtg}>
                Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <div className="rounded-md mt-6 max-w-[800px] border">
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
        <div className="flex items-center justify-end space-x-2 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
