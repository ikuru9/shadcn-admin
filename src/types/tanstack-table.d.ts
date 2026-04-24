import "@tanstack/react-table";
import type * as React from "react";

declare module "@tanstack/react-table" {
  interface ColumnMeta<TData, TValue> {
    className?: string; // apply to both th and td
    tdClassName?: string;
    thClassName?: string;
    customFilterOptions?: {
      title: string;
      multiple: boolean;
      options?: Array<{
        label: string;
        value: string;
        icon?: React.ComponentType<{ className?: string }>;
      }>;
      serialize?: (value: unknown) => unknown;
      deserialize?: (value: unknown) => unknown;
    };
  }
}
