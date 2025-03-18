"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { useUserContext } from "@/context/AuthContext";
import {
  // useDeleteOrderById,
  useGetOrdersById,
} from "@/lib/query/queries";
import { useRouter } from "next/navigation";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Loading from "@/components/Loading";
import { useTheme } from "next-themes";
import LoadingBlack from "@/components/LoadingBlack";
import { format } from "date-fns";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type Order = {
  $id: string;
  address: string;
  target: string;
  phone: string;
  status: string;
  datetime: string | Date;
  courier: { firstName: string; mobile: string };
  price: number;
};

// function DeleteOrder({ orderId }: { orderId: string }) {
//   const queryClient = useQueryClient();
//   const { mutateAsync: deleteOrderById } = useDeleteOrderById();

//   const mutation = useMutation({
//     mutationFn: () => deleteOrderById(orderId),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["orders"] });
//     },
//   });

//   return (
//     <Button onClick={() => mutation.mutate()}>Delete Order</Button>
//   );
// }

const Dashboard = () => {
  const router = useRouter();
  const { user } = useUserContext();
  const { theme } = useTheme();
  const { mutate, data: fetchedOrders, isPending } = useGetOrdersById();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  // const { mutateAsync: deleteOrderById } = useDeleteOrderById();

  const handleViewOrder = async (orderId: string) => {
    router.push(`/dashboard/${orderId}`);
  };

  useEffect(() => {
    if (user) {
      mutate(user.userId);
    }
  }, [user, mutate]);

  // function handleDelete(orderId: string) {
  //   deleteOrderById(orderId);
  // }

  const columns: ColumnDef<Order>[] = [
    {
      accessorKey: "$id",
      header: () => <span className="dark:text-white">Order ID</span>,
      cell: ({ row }) => (
        <Button
          variant="ghost"
          className="font-medium text-black dark:text-white p-0 h-auto "
        >
          {(row.getValue("$id") as string).slice(0, 8)}
        </Button>
      ),
    },
    {
      accessorKey: "target",
      header: () => <span className="dark:text-white">Target</span>,
      cell: ({ row }) => (
        <Button
          variant="ghost"
          className="font-medium text-black dark:text-white p-0 h-auto"
        >
          {row.getValue("target") as string}
        </Button>
      ),
    },
    {
      accessorKey: "address",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <span className="dark:text-white font-bold">Address</span>
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <span className="text-black dark:text-white">
          {row.getValue("address")}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: () => <span className="dark:text-white ">Status</span>,
      cell: ({ row }) => (
        <span
          className={`capitalize px-2 py-1 rounded-md text-xs font-medium border text-white
          ${
            row.getValue("status") === "delivered"
              ? "bg-green-500 border-green-300 dark:border-white/20 dark:bg-opacity-20"
              : row.getValue("status") === "pending"
              ? "bg-yellow-500 border-yellow-300 dark:border-white/20 dark:bg-opacity-20"
              : "bg-red-500 border-red-300 dark:border-white/20 dark:bg-opacity-20"
          }`}
        >
          {row.getValue("status")}
        </span>
      ),
    },

    {
      accessorKey: "datetime",
      header: () => (
        <span className="dark:text-white md:flex hidden">Date & Time</span>
      ),
      cell: ({ row }) => {
        const datetime = row.original.datetime;
        return (
          <span className="text-black dark:text-white md:flex hidden">
            {datetime
              ? `${format(new Date(datetime), "d MMMM yyyy 'at' hh:mm a")}`
              : ""}
          </span>
        );
      },
    },

    {
      accessorKey: "courier",
      header: () => <span className="dark:text-white">Courier</span>,
      cell: ({ row }) => (
        <span className="text-black dark:text-white white:text-black">
          {row.original.courier?.firstName || "Not Assigned"}
        </span>
      ),
    },

    {
      accessorKey: "mobile",
      header: () => <span className="dark:text-white">Phone</span>,
      cell: ({ row }) => (
        <span className="text-black dark:text-white white:text-black">
          {row.original.courier?.mobile}
        </span>
      ),
    },

    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-8 w-8 p-0 text-gray-500 dark:text-white hover:text-black dark:hover:text-gray-300"
            >
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel className="text-black dark:text-white">
              Actions
            </DropdownMenuLabel>
            <DropdownMenuItem
              className="text-black dark:text-white"
              onClick={() => navigator.clipboard.writeText(row.original.$id)}
            >
              Copy Order ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-black dark:text-white"
              onClick={() => handleViewOrder(row.original.$id)}
            >
              View Order
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="dark:text-red bg-red-500"
              // onClick={() => handleDelete(row.original.$id)}
            >
              Delete Order
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const table = useReactTable({
    data: fetchedOrders || [],
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  if (!user || isPending) {
    return theme === "light" ? <LoadingBlack /> : <Loading />;
  }

  if (fetchedOrders?.length === 0)
    return (
      <div className="flex items-center justify-center py-60 text-2xl gap-2">
        No more orders found if you want to create{" "}
        <span
          className="font-extrabold underlined cursor-pointer hover:text-red-500"
          onClick={() => router.push("/dashboard/create")}
        >
          click here
        </span>
      </div>
    );
  return (
    <div className="flex flex-col w-full px-1 sm:px-6 py-6">
      <h1 className="text-2xl font-bold text-center">
        Welcome Back <span className="text-red-500">{user.firstName}</span>
      </h1>
      <div className="flex items-center py-4 space-x-4">
        <Input
          placeholder="Filter by address..."
          value={(table.getColumn("address")?.getFilterValue() as string) ?? ""}
          onChange={(e) =>
            table.getColumn("address")?.setFilterValue(e.target.value)
          }
          className="max-w-sm border-gray-300 shadow-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto dark:text-white ">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-lg border bg-white shadow-md dark:bg-transparent dark:border-none">
        <Table className="text-white">
          <TableHeader className="bg-gray-100 dark:bg-transparent">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="text-gray-700 dark:text--300 font-semibold"
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="dark:text-gray-300">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Dashboard;
// export { DeleteOrder };
