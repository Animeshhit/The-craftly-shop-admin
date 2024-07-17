//core
import { NavLink } from "react-router-dom";
import { useState } from "react";

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
}

export function DataTable<TData, TValue>({
  columns,
  data,
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

  // ==================================Categories=====================
  let ctg = useSelector((s: any) => s.ctg);

  // const getAllCtg = () => {
  //   try {
  //     axios
  //       .get(`${import.meta.env.VITE_BASE_API_URL}/categories`)
  //       .then((res) => {
  //         let { data } = res;
  //         //for this api only
  //         // let uniqueCtgs = data.filter(
  //         //   (
  //         //     item: CategoriesData,
  //         //     index: Number,
  //         //     self: CategoriesData[] | []
  //         //   ) => index == self.findIndex((t: any) => t.name == item.name)
  //         // );
  //         setCtg(data);
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //         alert("something went wrong");
  //         setCtg([]);
  //       });
  //   } catch (err) {
  //     console.log(err);
  //     alert("Network connection error");
  //     setCtg([]);
  //   }
  // };

  // useEffect(() => {
  //   getAllCtg();
  // }, []);

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
      </div>
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
  );
}
