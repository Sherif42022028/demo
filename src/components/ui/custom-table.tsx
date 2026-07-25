import React from "react";
import { cn } from "@/lib/utils";
import { Search, AlertCircle, RefreshCw, FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface Column<T> {
  header: string;
  accessorKey?: keyof T;
  cell?: (item: T) => React.ReactNode;
  className?: string;
}

interface CustomTableProps<T> {
  columns: Column<T>[];
  data: T[];
  searchPlaceholder?: string;
  onSearch?: (query: string) => void;
  isLoading?: boolean;
  isError?: boolean;
  errorMessage?: string;
  onRetry?: () => void;
  emptyMessage?: string;
  emptyAction?: React.ReactNode;
  actions?: React.ReactNode;
}

export function CustomTable<T extends { id?: string | number }>({
  columns,
  data,
  searchPlaceholder = "بحث...",
  onSearch,
  isLoading = false,
  isError = false,
  errorMessage = "تعذر الاتصال بالخادم، أعد المحاولة",
  onRetry,
  emptyMessage = "لا توجد بيانات متاحة حالياً",
  emptyAction,
  actions,
}: CustomTableProps<T>) {
  return (
    <div className="w-full space-y-4">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        {onSearch && (
          <div className="relative w-full sm:w-72">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              onChange={(e) => onSearch(e.target.value)}
              className="w-full pr-9 pl-4 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
        )}
        {actions && <div className="flex items-center gap-2 mr-auto">{actions}</div>}
      </div>

      {/* Table Structure */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <table className="w-full text-right text-sm dir-rtl">
          <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-800">
            <tr>
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  className={cn("px-4 py-3.5 text-xs uppercase tracking-wider font-extrabold", col.className)}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {isLoading ? (
              // Skeleton Loader Rows
              [1, 2, 3, 4].map((i) => (
                <tr key={i} className="animate-pulse">
                  {columns.map((_, cIdx) => (
                    <td key={cIdx} className="px-4 py-4">
                      <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
                    </td>
                  ))}
                </tr>
              ))
            ) : isError ? (
              // Error State with Retry Button
              <tr>
                <td colSpan={columns.length} className="py-12 text-center text-slate-500">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <AlertCircle className="h-8 w-8 text-rose-500" />
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300">{errorMessage}</p>
                    {onRetry && (
                      <Button variant="outline" size="sm" onClick={onRetry} className="gap-2 text-xs">
                        <RefreshCw className="h-3.5 w-3.5" />
                        <span>إعادة المحاولة</span>
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              // Actionable Empty State
              <tr>
                <td colSpan={columns.length} className="py-12 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <FolderOpen className="h-10 w-10 text-slate-300 dark:text-slate-700" />
                    <p className="text-xs font-bold text-slate-600 dark:text-slate-400">{emptyMessage}</p>
                    {emptyAction && <div className="mt-1">{emptyAction}</div>}
                  </div>
                </td>
              </tr>
            ) : (
              data.map((row, rowIdx) => (
                <tr
                  key={row.id ?? rowIdx}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                >
                  {columns.map((col, colIdx) => (
                    <td key={colIdx} className={cn("px-4 py-3.5 whitespace-nowrap text-slate-700 dark:text-slate-200 font-medium", col.className)}>
                      {col.cell
                        ? col.cell(row)
                        : col.accessorKey
                        ? String(row[col.accessorKey] ?? "")
                        : null}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
