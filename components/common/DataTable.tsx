import type { ReactNode } from "react";

import EmptyState from "./EmptyState";
import LoadingSpinner from "./LoadingSpinner";

export interface DataTableColumn<T> {
  key: keyof T | string;
  header: ReactNode;
  className?: string;
  render?: (row: T) => ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: DataTableColumn<T>[];

  loading?: boolean;

  emptyTitle?: string;
  emptyDescription?: string;

  rowKey: (row: T) => string;

  className?: string;
}

export default function DataTable<T>({
  data,
  columns,
  loading = false,
  emptyTitle = "No Data",
  emptyDescription = "There are no records available.",
  rowKey,
  className,
}: Readonly<DataTableProps<T>>) {
  if (loading) {
    return (
      <LoadingSpinner
        fullScreen
        text="Loading data..."
      />
    );
  }

  if (data.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
      />
    );
  }

  return (
    <div
      className={[
        "overflow-hidden",
        "rounded-3xl",
        "border",
        "border-white/10",
        "bg-slate-900",
        className ?? "",
      ].join(" ")}
    >
      <div className="overflow-x-auto">

        <table className="min-w-full">

          <thead className="bg-slate-950">

            <tr>

              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className={[
                    "whitespace-nowrap",
                    "px-6",
                    "py-4",
                    "text-left",
                    "text-sm",
                    "font-bold",
                    "uppercase",
                    "tracking-wider",
                    "text-slate-300",
                    column.className ?? "",
                  ].join(" ")}
                >
                  {column.header}
                </th>
              ))}

            </tr>

          </thead>

          <tbody>

            {data.map((row) => (
              <tr
                key={rowKey(row)}
                className="
                  border-t
                  border-white/5
                  transition
                  hover:bg-white/[0.03]
                "
              >
                {columns.map((column) => (
                  <td
                    key={String(column.key)}
                    className={[
                      "px-6",
                      "py-4",
                      "align-middle",
                      "text-sm",
                      "text-slate-300",
                      column.className ?? "",
                    ].join(" ")}
                  >
                    {column.render
                      ? column.render(row)
                      : String(
                          row[
                            column.key as keyof T
                          ] ?? "",
                        )}
                  </td>
                ))}
              </tr>
            ))}

          </tbody>

        </table>

      </div>
    </div>
  );
}