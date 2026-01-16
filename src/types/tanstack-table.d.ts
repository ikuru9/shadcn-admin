import "@tanstack/react-table";

declare module "@tanstack/react-table" {
  // biome-ignore lint/correctness/noUnusedVariables: TData, TValue
  interface ColumnMeta<TData, TValue> {
    className?: string; // apply to both th and td
    tdClassName?: string;
    thClassName?: string;
  }
}
