import * as React from "react";
import type { ReactNode } from "react";
import { MotionCard } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export interface DataTableColumn<T> {
  id: string;
  header: string;
  width?: string;
  cell: (row: T) => ReactNode;
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  rowKey: (row: T, index: number) => React.Key;
  onRowClick?: (row: T) => void;
  selectedRowKey?: React.Key;
}

export function DataTable<T>({
  columns,
  data,
  rowKey,
  onRowClick,
  selectedRowKey,
}: DataTableProps<T>) {
  return (
    <MotionCard className="overflow-hidden rounded-[22px] border-border bg-card shadow-soft">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead>
            <tr className="border-b border-border">
              {columns.map((column) => (
                <th
                  key={column.id}
                  style={column.width ? { width: column.width } : undefined}
                  className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground"
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => {
              const key = rowKey(row, index);
              const isSelected =
                selectedRowKey !== undefined && selectedRowKey === key;

              return (
                <tr
                  key={key}
                  onClick={() => onRowClick?.(row)}
                  className={[
                    "border-b border-border/50 transition-colors duration-150",
                    index % 2 === 1 ? "bg-muted/25" : "",
                    isSelected ? "bg-selected-row-bg" : "",
                    onRowClick ? "cursor-pointer hover:bg-selected-row-bg" : "",
                  ].join(" ")}
                >
                  {columns.map((column) => (
                    <td key={column.id} className="px-4 py-3 text-sm">
                      {column.cell(row)}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </MotionCard>
  );
}

export function HealthScoreBadge({ score }: { score: number }) {
  if (score >= 80) {
    return (
      <Badge className="border-0 bg-success/10 text-success">Strong</Badge>
    );
  }

  if (score >= 60) {
    return (
      <Badge className="border-0 bg-warning/10 text-warning">Average</Badge>
    );
  }

  return (
    <Badge className="border-0 bg-danger/10 text-danger">Needs Attention</Badge>
  );
}

export function StatusBadge({ status }: { status: string }) {
  if (status === "Active") {
    return (
      <Badge className="border-0 bg-success/10 text-success">Active</Badge>
    );
  }

  if (status === "Completed") {
    return <Badge className="border-0 bg-info/10 text-info">Completed</Badge>;
  }

  return (
    <Badge className="border-0 bg-muted text-muted-foreground">{status}</Badge>
  );
}
