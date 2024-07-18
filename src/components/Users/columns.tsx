import { ColumnDef } from "@tanstack/react-table";
import moment from "moment";
import { MoreHorizontal, ArrowUpDown } from "lucide-react";

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
import Store from "../../store/store";
import { login } from "../../store/Slices/userSlice";
import axios from "axios";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type User = {
  _id: string;
  username: string | null;
  email: string | null;
  mobile: number;
  isAdmin: boolean;
  createdAt: Date;
};

const changeAccess = async (id: string) => {
  try {
    let token = getToken();
    if (!token) {
      alert("Session Expired");
      Store.dispatch(login(false));
      return;
    }
    axios
      .get(`${import.meta.env.VITE_ADMIN_API_URL}/changeadmin?id=${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        let { data } = res;
        alert(data.message);
      })
      .catch((err) => {
        console.log(err);
        alert("something went wrong");
      });
  } catch (err) {
    console.log(err);
    alert("Network Connection Error");
  }
};

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "username",
    header: "Username",
    cell: ({ row }) => {
      let uname = row.getValue<string | null>("username");
      return (
        <p>
          {uname ? (
            uname
          ) : (
            <span className="bg-zinc-300 py-1 px-2 rounded-full">
              No userName
            </span>
          )}
        </p>
      );
    },
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => {
      let emailValue = row.getValue<string | null>("email");
      return (
        <p>
          {emailValue ? (
            emailValue
          ) : (
            <span className="bg-zinc-300 py-1 px-2 rounded-full">No email</span>
          )}
        </p>
      );
    },
  },
  {
    accessorKey: "mobile",
    header: "Mobile",
  },
  {
    accessorKey: "isAdmin",
    header: "Admin",
    cell: ({ row }) => {
      let isAdmin = row.getValue<boolean>("isAdmin");
      return (
        <div
          className={`py-1 px-4 ${
            isAdmin ? "bg-blue-500 text-white" : "bg-zinc-300"
          } text-center rounded-full`}
        >
          {isAdmin ? "admin" : "user"}
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Joined on
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = row.getValue<string>("createdAt");

      return <div className="px-4">{moment(date).fromNow()}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const user = row.original;

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
              onClick={() => navigator.clipboard.writeText(user._id)}
            >
              Copy User ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Address</DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                changeAccess(user._id);
              }}
            >
              {!user.isAdmin ? "Make Admin" : "Remove Admin"}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="bg-red-500 text-white">
              Delete user
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
