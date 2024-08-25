//core

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

import getToken from "../../helper/token";
import axios from "axios";

//redux
import { login } from "../../store/Slices/userSlice";
import Store from "../../store/store";
import { setProgress } from "../../store/Slices/LoadingSlice";
import { setDrafts } from "../../store/Slices/draftsSlice";
import moveProducts from "../../helper/move/moveProducts";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Drafts = {
  _id: string;
  name: string;
  catagories: string;
  discount: Number;
  productImage: string;
  createdAt: number;
  isFeatured: boolean;
  isBestSeller: boolean;
  isAvailable: boolean;
};

const deleteDraftProduct = async (id: string, drafts: any) => {
  try {
    let token = getToken();
    if (!token) {
      alert("Session Expired 🤞");
      Store.dispatch(login(false));
      return;
    }
    Store.dispatch(setProgress(30));
    axios
      .delete(
        `${import.meta.env.VITE_ADMIN_API_URL}/deleteadraftproduct?id=${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((_) => {
        let updatedProducts = drafts.filter((p: any) => {
          return p._id !== id;
        });
        Store.dispatch(setProgress(100));
        Store.dispatch(setDrafts(updatedProducts));
      })
      .catch((err) => {
        console.log(err);
        Store.dispatch(setProgress(100));
        alert("Something Went Wrong");
      });
  } catch (err) {
    console.log(err);
    Store.dispatch(setProgress(100));
    alert("Network Connection Error");
  }
};

export const columns: ColumnDef<Drafts>[] = [
  {
    accessorKey: "name",
    header: "Product",
    cell: ({ row }) => {
      const name = row.getValue<string>("name");
      const image = row.original.productImage;

      return (
        <div className="flex items-center">
          <img
            loading="lazy"
            src={image}
            alt={name}
            className="w-10 h-10 rounded-md mr-4 bg-zinc-800 blur"
            onLoad={(e: any) => {
              e.target.classList.remove("blur");
            }}
          />
          <div className="capitalize">{name}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "isFeatured",
    header: "Type",
    cell: ({ row }) => {
      const isFeatured = row.getValue<boolean>("isFeatured");
      const isBestSeller = row.original.isBestSeller;
      return (
        <>
          {isFeatured && (
            <div className="bg-blue-500 text-white w-max px-2 py-1 rounded-full">
              Featured
            </div>
          )}
          {isBestSeller && (
            <div className="bg-rose-500 text-white w-max px-2 py-1 rounded-full">
              Best seller
            </div>
          )}
        </>
      );
    },
  },
  {
    accessorKey: "isAvailable",
    header: "isDeleted",
    cell: ({ row }) => {
      const isDeleted = row.getValue<boolean>("isAvailable");
      return (
        <>
          {!isDeleted ? (
            <div
              className={`bg-red-500 text-white w-max px-2 py-1 rounded-full`}
            >
              True
            </div>
          ) : (
            <div
              className={`bg-blue-500 text-white w-max px-2 py-1 rounded-full`}
            >
              False
            </div>
          )}
        </>
      );
    },
  },
  {
    accessorKey: "catagories",
    header: "Categories",
    cell: ({ row }) => {
      const name = row.getValue<string>("catagories");
      return (
        <div className="flex items-center gap-2 bg-zinc-200 w-max px-2 py-1 rounded-full">
          <img src="/headphone.svg" className="w-5 h-5" />
          {name}
        </div>
      );
    },
  },
  {
    accessorKey: "discount",
    header: "Price",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("discount"));
      const formatted = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
      }).format(amount);

      return <div className="font-medium">{formatted}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const product = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              className="flex items-center gap-2"
              onClick={() => navigator.clipboard.writeText(product._id)}
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 15 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1 9.50006C1 10.3285 1.67157 11.0001 2.5 11.0001H4L4 10.0001H2.5C2.22386 10.0001 2 9.7762 2 9.50006L2 2.50006C2 2.22392 2.22386 2.00006 2.5 2.00006L9.5 2.00006C9.77614 2.00006 10 2.22392 10 2.50006V4.00002H5.5C4.67158 4.00002 4 4.67159 4 5.50002V12.5C4 13.3284 4.67158 14 5.5 14H12.5C13.3284 14 14 13.3284 14 12.5V5.50002C14 4.67159 13.3284 4.00002 12.5 4.00002H11V2.50006C11 1.67163 10.3284 1.00006 9.5 1.00006H2.5C1.67157 1.00006 1 1.67163 1 2.50006V9.50006ZM5 5.50002C5 5.22388 5.22386 5.00002 5.5 5.00002H12.5C12.7761 5.00002 13 5.22388 13 5.50002V12.5C13 12.7762 12.7761 13 12.5 13H5.5C5.22386 13 5 12.7762 5 12.5V5.50002Z"
                  fill="currentColor"
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                ></path>
              </svg>
              Copy product ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="flex items-center gap-2"
              onClick={() => moveProducts(row.original._id, "PUBLIC")}
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 15 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7.81819 0.93179C7.64245 0.756054 7.35753 0.756054 7.18179 0.93179L5.43179 2.68179C5.25605 2.85753 5.25605 3.14245 5.43179 3.31819C5.60753 3.49392 5.89245 3.49392 6.06819 3.31819L6.99999 2.38638V5.49999C6.99999 5.77613 7.22385 5.99999 7.49999 5.99999C7.77613 5.99999 7.99999 5.77613 7.99999 5.49999V2.38638L8.93179 3.31819C9.10753 3.49392 9.39245 3.49392 9.56819 3.31819C9.74392 3.14245 9.74392 2.85753 9.56819 2.68179L7.81819 0.93179ZM7.99999 9.49999C7.99999 9.22385 7.77613 8.99999 7.49999 8.99999C7.22385 8.99999 6.99999 9.22385 6.99999 9.49999V12.6136L6.06819 11.6818C5.89245 11.5061 5.60753 11.5061 5.43179 11.6818C5.25605 11.8575 5.25605 12.1424 5.43179 12.3182L7.18179 14.0682C7.35753 14.2439 7.64245 14.2439 7.81819 14.0682L9.56819 12.3182C9.74392 12.1424 9.74392 11.8575 9.56819 11.6818C9.39245 11.5061 9.10753 11.5061 8.93179 11.6818L7.99999 12.6136V9.49999ZM8.99999 7.49999C8.99999 7.22385 9.22385 6.99999 9.49999 6.99999H12.6136L11.6818 6.06819C11.5061 5.89245 11.5061 5.60753 11.6818 5.43179C11.8575 5.25605 12.1424 5.25605 12.3182 5.43179L14.0682 7.18179C14.2439 7.35753 14.2439 7.64245 14.0682 7.81819L12.3182 9.56819C12.1424 9.74392 11.8575 9.74392 11.6818 9.56819C11.5061 9.39245 11.5061 9.10753 11.6818 8.93179L12.6136 7.99999H9.49999C9.22385 7.99999 8.99999 7.77613 8.99999 7.49999ZM3.31819 6.06819L2.38638 6.99999H5.49999C5.77613 6.99999 5.99999 7.22385 5.99999 7.49999C5.99999 7.77613 5.77613 7.99999 5.49999 7.99999H2.38638L3.31819 8.93179C3.49392 9.10753 3.49392 9.39245 3.31819 9.56819C3.14245 9.74392 2.85753 9.74392 2.68179 9.56819L0.93179 7.81819C0.756054 7.64245 0.756054 7.35753 0.93179 7.18179L2.68179 5.43179C2.85753 5.25605 3.14245 5.25605 3.31819 5.43179C3.49392 5.60753 3.49392 5.89245 3.31819 6.06819Z"
                  fill="currentColor"
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                ></path>
              </svg>
              Move To Pubilc
            </DropdownMenuItem>
            {/* <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
              <NavLink
                className="flex w-full items-center gap-2 cursor-pointer"
                to={`/editproduct/${product._id}`}
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 15 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M11.8536 1.14645C11.6583 0.951184 11.3417 0.951184 11.1465 1.14645L3.71455 8.57836C3.62459 8.66832 3.55263 8.77461 3.50251 8.89155L2.04044 12.303C1.9599 12.491 2.00189 12.709 2.14646 12.8536C2.29103 12.9981 2.50905 13.0401 2.69697 12.9596L6.10847 11.4975C6.2254 11.4474 6.3317 11.3754 6.42166 11.2855L13.8536 3.85355C14.0488 3.65829 14.0488 3.34171 13.8536 3.14645L11.8536 1.14645ZM4.42166 9.28547L11.5 2.20711L12.7929 3.5L5.71455 10.5784L4.21924 11.2192L3.78081 10.7808L4.42166 9.28547Z"
                    fill="currentColor"
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                  ></path>
                </svg>
                Edit
              </NavLink>
            </DropdownMenuItem> */}
            {/* <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
              <a
                className="flex w-full items-center gap-2 cursor-pointer"
                target="_blank"
                href={`${import.meta.env.VITE_FRONTENDUI}/product/${
                  product.catagories
                }/${product._id}`}
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 15 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7.5 11C4.80285 11 2.52952 9.62184 1.09622 7.50001C2.52952 5.37816 4.80285 4 7.5 4C10.1971 4 12.4705 5.37816 13.9038 7.50001C12.4705 9.62183 10.1971 11 7.5 11ZM7.5 3C4.30786 3 1.65639 4.70638 0.0760002 7.23501C-0.0253338 7.39715 -0.0253334 7.60288 0.0760014 7.76501C1.65639 10.2936 4.30786 12 7.5 12C10.6921 12 13.3436 10.2936 14.924 7.76501C15.0253 7.60288 15.0253 7.39715 14.924 7.23501C13.3436 4.70638 10.6921 3 7.5 3ZM7.5 9.5C8.60457 9.5 9.5 8.60457 9.5 7.5C9.5 6.39543 8.60457 5.5 7.5 5.5C6.39543 5.5 5.5 6.39543 5.5 7.5C5.5 8.60457 6.39543 9.5 7.5 9.5Z"
                    fill="currentColor"
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                  ></path>
                </svg>
                View
              </a>
            </DropdownMenuItem> */}
            <DropdownMenuSeparator />
            {row.original.isAvailable && (
              <DropdownMenuItem
                onClick={() => {
                  deleteDraftProduct(product._id, Store.getState().drafts);
                }}
                className="flex items-center gap-2 cursor-pointer bg-red-500 text-white"
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 15 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5.5 1C5.22386 1 5 1.22386 5 1.5C5 1.77614 5.22386 2 5.5 2H9.5C9.77614 2 10 1.77614 10 1.5C10 1.22386 9.77614 1 9.5 1H5.5ZM3 3.5C3 3.22386 3.22386 3 3.5 3H5H10H11.5C11.7761 3 12 3.22386 12 3.5C12 3.77614 11.7761 4 11.5 4H11V12C11 12.5523 10.5523 13 10 13H5C4.44772 13 4 12.5523 4 12V4L3.5 4C3.22386 4 3 3.77614 3 3.5ZM5 4H10V12H5V4Z"
                    fill="currentColor"
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                  ></path>
                </svg>
                Delete
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
