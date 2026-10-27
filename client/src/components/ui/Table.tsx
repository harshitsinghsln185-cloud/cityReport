import React from 'react';
import { Skeleton } from './Skeleton';

export interface TableColumn<T = any> {
  header: string;
  accessor?: keyof T | string;
  className?: string;
  render?: (row: T, index: number) => React.ReactNode;
}

export interface TableProps<T = any> {
  columns: TableColumn<T>[];
  data: T[];
  isLoading?: boolean;
  emptyMessage?: string;
  onRowClick?: (row: T) => void;
  className?: string;
}

export const Table = <T extends Record<string, any>>({
  columns = [],
  data = [],
  isLoading = false,
  emptyMessage = 'No data available',
  onRowClick,
  className = '',
}: TableProps<T>) => {
  return (
    <div className={`w-full overflow-x-auto border border-border rounded-xl bg-white shadow-subtle ${className}`}>
      <table className="w-full text-left border-collapse text-sm">
        <thead className="bg-surfaceAlt/90 backdrop-blur-xs border-b border-border text-muted uppercase text-xs font-semibold tracking-wider sticky top-0 z-10">
          <tr>
            {columns.map((col, idx) => (
              <th
                key={col.header || idx}
                className={`py-3.5 px-4 font-semibold ${col.className || ''}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border text-ink">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, rIdx) => (
              <tr key={rIdx}>
                {columns.map((_, cIdx) => (
                  <td key={cIdx} className="py-4 px-4">
                    <Skeleton className="h-4 w-full" />
                  </td>
                ))}
              </tr>
            ))
          ) : data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="py-12 px-4 text-center text-muted italic"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, rIdx) => (
              <tr
                key={row._id || row.id || rIdx}
                onClick={() => onRowClick && onRowClick(row)}
                className={`transition-colors ${
                  onRowClick
                    ? 'hover:bg-primary-light/40 cursor-pointer'
                    : 'hover:bg-surfaceAlt/50'
                }`}
              >
                {columns.map((col, cIdx) => (
                  <td
                    key={col.header || cIdx}
                    className={`py-3.5 px-4 align-middle ${col.className || ''}`}
                  >
                    {col.render
                      ? col.render(row, rIdx)
                      : col.accessor
                      ? row[col.accessor]
                      : null}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
