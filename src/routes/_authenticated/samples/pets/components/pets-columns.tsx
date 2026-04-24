import { Link } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import { pascalCase } from "es-toolkit";

import { DataTableColumnHeader } from "@/components/data-table";
import { LongText } from "@/components/long-text";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { petsStatuses } from "@/constants/pets";
import { type Pet, petStatusEnum } from "@/gen/types/Pet";
import { cn } from "@/lib/utils";

import { DataTableRowActions } from "./data-table-row-actions";

const petStatusFilterOptions = Object.values(petStatusEnum).map((value) => ({
  value,
  label: pascalCase(value),
}));

export const petsColumns: ColumnDef<Pet>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        indeterminate={table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-0.5"
      />
    ),
    meta: {
      className: cn("max-md:sticky start-0 z-10 rounded-tl-[inherit]"),
    },
    cell: ({ row }) => (
      <div data-select-cell>
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="translate-y-0.5"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: ({ column }) => <DataTableColumnHeader column={column} title="ID" />,
    cell: ({ row }) => {
      const id = row.original.id;

      if (id == null) {
        return <div className="w-fit ps-3">-</div>;
      }

      return (
        <LongText className="w-fit ps-3">
          <Link to="/samples/pets/$id" params={{ id: String(id) }} className="underline-offset-4 hover:underline">
            {id}
          </Link>
        </LongText>
      );
    },
    meta: {
      className: cn("max-md:sticky start-6 @4xl/content:table-cell @4xl/content:drop-shadow-none"),
    },
    enableHiding: false,
    enableSorting: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
    cell: ({ row }) => {
      const id = row.original.id;

      if (id == null) {
        return <LongText className="max-w-36">{row.getValue("name")}</LongText>;
      }

      return (
        <LongText className="max-w-36">
          <Link to="/samples/pets/$id" params={{ id: String(id) }} className="underline-offset-4 hover:underline">
            {row.getValue("name")}
          </Link>
        </LongText>
      );
    },
    meta: {
      className: "w-36",
    },
    enableSorting: false,
  },
  {
    accessorKey: "category",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Category" />,
    cell: ({ row }) => {
      const category = row.original.category;
      return <div>{category?.name || "N/A"}</div>;
    },
    enableSorting: false,
  },
  {
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => {
      const { status } = row.original;
      const badgeColor = status ? petsStatuses.get(status) : undefined;
      return (
        <div className="flex space-x-2">
          <Badge variant="outline" className={cn("capitalize", badgeColor)}>
            {status || "Unknown"}
          </Badge>
        </div>
      );
    },
    meta: {
      customFilterOptions: {
        title: "Status",
        multiple: false,
        options: petStatusFilterOptions,
      },
    },
    enableHiding: false,
    enableSorting: false,
  },
  {
    id: "actions",
    cell: DataTableRowActions,
  },
];
