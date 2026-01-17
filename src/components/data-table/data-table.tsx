import { type Cell, flexRender, type Row, type Table as TanStackTable } from "@tanstack/react-table";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

/**
 * 행(Row) 이벤트 핸들러 타입
 *
 * TypeScript는 메서드 축약 표현(method shorthand)에서 타입 추론을 잘 하지 못합니다.
 * Mapped type을 사용할 경우 `{ onClick(event, row) {} }`와 같은 축약 표현에서
 * event와 row의 타입이 추론되지 않아 명시적 타입 어노테이션이 필요합니다.
 *
 * 따라서 명시적인 타입을 정의하여 메서드 축약 표현에서도 타입이 추론되도록 합니다.
 */
type RowEventHandlers<TData> = {
  onClick?: (event: React.MouseEvent<HTMLTableRowElement>, row: Row<TData>) => void;
  onDoubleClick?: (event: React.MouseEvent<HTMLTableRowElement>, row: Row<TData>) => void;
  onContextMenu?: (event: React.MouseEvent<HTMLTableRowElement>, row: Row<TData>) => void;
  onMouseEnter?: (event: React.MouseEvent<HTMLTableRowElement>, row: Row<TData>) => void;
  onMouseLeave?: (event: React.MouseEvent<HTMLTableRowElement>, row: Row<TData>) => void;
  onMouseMove?: (event: React.MouseEvent<HTMLTableRowElement>, row: Row<TData>) => void;
  onMouseDown?: (event: React.MouseEvent<HTMLTableRowElement>, row: Row<TData>) => void;
  onMouseUp?: (event: React.MouseEvent<HTMLTableRowElement>, row: Row<TData>) => void;
  onMouseOver?: (event: React.MouseEvent<HTMLTableRowElement>, row: Row<TData>) => void;
  onMouseOut?: (event: React.MouseEvent<HTMLTableRowElement>, row: Row<TData>) => void;
  onAuxClick?: (event: React.MouseEvent<HTMLTableRowElement>, row: Row<TData>) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLTableRowElement>, row: Row<TData>) => void;
  onKeyUp?: (event: React.KeyboardEvent<HTMLTableRowElement>, row: Row<TData>) => void;
  onKeyPress?: (event: React.KeyboardEvent<HTMLTableRowElement>, row: Row<TData>) => void;
  onFocus?: (event: React.FocusEvent<HTMLTableRowElement>, row: Row<TData>) => void;
  onBlur?: (event: React.FocusEvent<HTMLTableRowElement>, row: Row<TData>) => void;
};

/**
 * 셀(Cell) 이벤트 핸들러 타입
 *
 * TypeScript는 메서드 축약 표현(method shorthand)에서 타입 추론을 잘 하지 못합니다.
 * Mapped type을 사용할 경우 `{ onClick(event, cell) {} }`와 같은 축약 표현에서
 * event와 cell의 타입이 추론되지 않아 명시적 타입 어노테이션이 필요합니다.
 *
 * 따라서 명시적인 타입을 정의하여 메서드 축약 표현에서도 타입이 추론되도록 합니다.
 */
type CellEventHandlers<TData> = {
  onClick?: (event: React.MouseEvent<HTMLTableCellElement>, cell: Cell<TData, unknown>) => void;
  onDoubleClick?: (event: React.MouseEvent<HTMLTableCellElement>, cell: Cell<TData, unknown>) => void;
  onContextMenu?: (event: React.MouseEvent<HTMLTableCellElement>, cell: Cell<TData, unknown>) => void;
  onMouseEnter?: (event: React.MouseEvent<HTMLTableCellElement>, cell: Cell<TData, unknown>) => void;
  onMouseLeave?: (event: React.MouseEvent<HTMLTableCellElement>, cell: Cell<TData, unknown>) => void;
  onMouseMove?: (event: React.MouseEvent<HTMLTableCellElement>, cell: Cell<TData, unknown>) => void;
  onMouseDown?: (event: React.MouseEvent<HTMLTableCellElement>, cell: Cell<TData, unknown>) => void;
  onMouseUp?: (event: React.MouseEvent<HTMLTableCellElement>, cell: Cell<TData, unknown>) => void;
  onMouseOver?: (event: React.MouseEvent<HTMLTableCellElement>, cell: Cell<TData, unknown>) => void;
  onMouseOut?: (event: React.MouseEvent<HTMLTableCellElement>, cell: Cell<TData, unknown>) => void;
  onAuxClick?: (event: React.MouseEvent<HTMLTableCellElement>, cell: Cell<TData, unknown>) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLTableCellElement>, cell: Cell<TData, unknown>) => void;
  onKeyUp?: (event: React.KeyboardEvent<HTMLTableCellElement>, cell: Cell<TData, unknown>) => void;
  onKeyPress?: (event: React.KeyboardEvent<HTMLTableCellElement>, cell: Cell<TData, unknown>) => void;
  onFocus?: (event: React.FocusEvent<HTMLTableCellElement>, cell: Cell<TData, unknown>) => void;
  onBlur?: (event: React.FocusEvent<HTMLTableCellElement>, cell: Cell<TData, unknown>) => void;
};

type TableCellProps = React.ComponentProps<typeof TableCell>;
type TableRowProps = React.ComponentProps<typeof TableRow>;

function wrapCellHandler<TData>(
  handler: (
    event: Parameters<NonNullable<TableCellProps[keyof TableCellProps]>>[0],
    cell: Cell<TData, unknown>,
  ) => void,
  cell: Cell<TData, unknown>,
): TableCellProps[keyof TableCellProps] {
  return ((event: Parameters<NonNullable<TableCellProps[keyof TableCellProps]>>[0]) => {
    handler(event, cell);
  }) as TableCellProps[keyof TableCellProps];
}

function wrapRowHandler<TData>(
  handler: (event: Parameters<NonNullable<TableRowProps[keyof TableRowProps]>>[0], row: Row<TData>) => void,
  row: Row<TData>,
): TableRowProps[keyof TableRowProps] {
  return ((event: Parameters<NonNullable<TableRowProps[keyof TableRowProps]>>[0]) => {
    handler(event, row);
  }) as TableRowProps[keyof TableRowProps];
}

interface DataTableProps<TData> {
  table: TanStackTable<TData>;
  customProps?: {
    row?: Omit<React.ComponentProps<typeof TableRow>, `on${string}`> & RowEventHandlers<TData>;
    cell?: Record<string, Omit<React.ComponentProps<typeof TableCell>, `on${string}`> & CellEventHandlers<TData>>;
  };
}

function DataTable<TData>({ table, customProps }: DataTableProps<TData>) {
  const headerGroups = table.getHeaderGroups();
  const columns = table.getAllColumns();
  const rows = table.getRowModel().rows;

  const getCellProps = (cell: Cell<TData, unknown>) => {
    const cellProps = customProps?.cell?.[cell.column.id];

    if (!cellProps) {
      return undefined;
    }

    const resolvedProps: Partial<TableCellProps> = {};

    for (const [key, value] of Object.entries(cellProps)) {
      if (key.startsWith("on") && typeof value === "function") {
        const handler = wrapCellHandler<TData>(
          value as (
            event: Parameters<NonNullable<TableCellProps[keyof TableCellProps]>>[0],
            cell: Cell<TData, unknown>,
          ) => void,
          cell,
        );
        (resolvedProps as Partial<TableCellProps>)[key as keyof TableCellProps] = handler as unknown;
      } else {
        resolvedProps[key as keyof TableCellProps] = value;
      }
    }

    return resolvedProps;
  };

  const getRowProps = (row: Row<TData>) => {
    if (!customProps?.row) {
      return undefined;
    }

    const rowProps = customProps.row;
    const resolvedProps: Partial<TableRowProps> = {};

    for (const [key, value] of Object.entries(rowProps)) {
      if (key.startsWith("on") && typeof value === "function") {
        const handler = wrapRowHandler<TData>(
          value as (event: Parameters<NonNullable<TableRowProps[keyof TableRowProps]>>[0], row: Row<TData>) => void,
          row,
        );
        (resolvedProps as Partial<TableRowProps>)[key as keyof TableRowProps] = handler as unknown;
      } else {
        resolvedProps[key as keyof TableRowProps] = value;
      }
    }

    return resolvedProps;
  };

  return (
    <Table>
      <TableHeader>
        {headerGroups.map((headerGroup) => (
          <TableRow key={headerGroup.id} className="group/row">
            {headerGroup.headers.map((header) => (
              <TableHead
                key={header.id}
                colSpan={header.colSpan}
                className={cn(
                  "bg-background group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted",
                  header.column.columnDef.meta?.className,
                  header.column.columnDef.meta?.thClassName,
                )}
              >
                {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {rows?.length ? (
          rows.map((row) => (
            <TableRow
              key={row.id}
              data-state={row.getIsSelected() && "selected"}
              className="group/row"
              {...getRowProps(row)}
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell
                  key={cell.id}
                  className={cn(
                    "bg-background group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted",
                    cell.column.columnDef.meta?.className,
                    cell.column.columnDef.meta?.tdClassName,
                  )}
                  {...getCellProps(cell)}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={columns.length} className="h-24 text-center">
              No results.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

export { DataTable };
