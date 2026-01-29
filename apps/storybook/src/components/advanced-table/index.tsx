/**
 * AdvancedTable Component
 *
 * A configurable data-table component built specifically for Storybook demos.
 * It showcases:
 * - Headers, rows, and columns driven entirely by props
 * - Striped and alternating row colors
 * - Clickable, sortable column headers with visual sort indicators (↑ / ↓)
 * - Client-side sorting with direction toggle
 * - Pagination controls (first, previous, numbered pages, next, last)
 * - Rows-per-page selector with live updates
 * - Total count and page range display
 * - Filter input above the table with real-time filtering
 * - Clear filter button
 * - Highlighting of matching content in filtered rows
 *
 * The component is optimized with `useMemo`, `useCallback`, and small memoized
 * subcomponents to reduce unnecessary re-renders.
 *
 * @file index.tsx
 */

"use client";

import type React from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Search, X } from "lucide-react";
import { cn } from "../../../utils/cn";
import { Button } from "../button";
import { AnimatedInput } from "../input";

/**
 * Sort direction supported by the table.
 */
export type AdvancedTableSortDirection = "asc" | "desc";

/**
 * Generic table row type.
 */
export type AdvancedTableRow = Record<string, React.ReactNode>;

/**
 * Column configuration key type.
 */
export type AdvancedTableColumnKey = string;

/**
 * Utility to check if a value includes the query (case-insensitive).
 *
 * @param value - String value to inspect.
 * @param query - Filter query.
 */
const includesQuery = (value: string, query: string): boolean => {
  if (!query) return false;
  return value.toLowerCase().includes(query.toLowerCase());
};

/**
 * Renders a string with all instances of the query wrapped in `<mark>` tags.
 *
 * This is used to highlight matching substrings for the active filter query.
 *
 * @param value - Original cell value.
 * @param query - Current filter query.
 */
const HighlightedText: React.FC<{ value: string; query: string }> = ({ value, query }) => {
  if (!query || !includesQuery(value, query)) {
    return <span>{value}</span>;
  }

  const lowerValue = value.toLowerCase();
  const lowerQuery = query.toLowerCase();

  const nodes: React.ReactNode[] = [];
  let startIndex = 0;
  let matchIndex = lowerValue.indexOf(lowerQuery, startIndex);

  while (matchIndex !== -1) {
    if (matchIndex > startIndex) {
      nodes.push(value.slice(startIndex, matchIndex));
    }

    const matchText = value.slice(matchIndex, matchIndex + query.length);
    nodes.push(
      <mark key={matchIndex} className="bg-yellow-200 text-yellow-900 rounded px-0.5">
        {matchText}
      </mark>
    );

    startIndex = matchIndex + query.length;
    matchIndex = lowerValue.indexOf(lowerQuery, startIndex);
  }

  if (startIndex < value.length) {
    nodes.push(value.slice(startIndex));
  }

  return <span>{nodes}</span>;
};

HighlightedText.displayName = "HighlightedText";

export interface AdvancedTableProps {
  /**
   * Optional class name for the outer container.
   */
  className?: string;

  /**
   * Data rows to render in the table.
   *
   * Each row is a record keyed by `columns[i].key`. Values can be any
   * ReactNode; string values participate in client-side filtering/highlighting.
   */
  rows: AdvancedTableRow[];

  /**
   * Columns definition describing which keys to display and their labels.
   *
   * - `sortable`: when explicitly set to `false`, the column will never be
   *   sorted even if `enableSorting` is `true`.
   */
  columns: Array<{ key: AdvancedTableColumnKey; label: string; sortable?: boolean }>;

  /**
   * Enable sorting via clickable column headers.
   *
   * - When `false`, headers are not interactive and content is rendered in
   *   the original data order.
   * - Default: `true`.
   */
  enableSorting?: boolean;

  /**
   * Initial sort key when sorting is enabled.
   *
   * Default: `"name"`.
   */
  defaultSortKey?: AdvancedTableColumnKey;

  /**
   * Initial sort direction when sorting is enabled.
   *
   * Default: `"asc"`.
   */
  defaultSortDirection?: AdvancedTableSortDirection;

  /**
   * Enable the filter input above the table.
   *
   * - When `false`, no input/clear button is rendered and no client-side
   *   filtering is applied.
   * - Default: `true`.
   */
  enableFiltering?: boolean;

  /**
   * Custom placeholder for the filter input.
   *
   * Default: `"Filter rows..."`.
   */
  filterPlaceholder?: string;

  /**
   * Enable pagination controls (page buttons and rows-per-page selector).
   *
   * - When `false`, all rows are rendered in a single page and no pagination
   *   UI is displayed.
   * - Default: `true`.
   */
  enablePagination?: boolean;

  /**
   * Initial page index (1-based) when pagination is enabled.
   *
   * Default: `1`.
   */
  initialPage?: number;

  /**
   * Initial rows per page when pagination is enabled.
   *
   * Default: `5`.
   */
  initialRowsPerPage?: number;

  /**
   * Available options for the rows-per-page selector.
   *
   * Default: `[5, 10, 20]`.
   */
  rowsPerPageOptions?: number[];
}

/**
 * AdvancedTable: self-contained table with sorting, pagination, and filtering.
 *
 * This component is designed to meet the full set of requirements for the
 * Storybook table demo, including:
 * - Sorting via clickable column headers
 * - Visual sort direction indicators
 * - Pagination and rows-per-page control
 * - Filter input with real-time filtering and highlight behavior
 *
 * The behavior can be configured via props to showcase:
 * - Base table: sorting/filtering/pagination disabled
 * - Sortable table: only sorting enabled
 * - Filterable table: only filtering enabled
 * - Paginated table: only pagination enabled
 * - Fully-featured table: all behaviors enabled
 */
export const AdvancedTable: React.FC<AdvancedTableProps> = ({
  className,
  rows,
  columns,
  enableSorting = true,
  defaultSortKey,
  defaultSortDirection = "asc",
  enableFiltering = true,
  filterPlaceholder = "Filter rows...",
  enablePagination = true,
  initialPage = 1,
  initialRowsPerPage = 5 ,
  rowsPerPageOptions = [5, 10, 20],
}) => {
  const effectiveRows = rows;
  const effectiveColumns = columns;

  const initialSortKey: AdvancedTableColumnKey =
    defaultSortKey ?? (effectiveColumns[0]?.key as AdvancedTableColumnKey);

  // Sorting state
  const [sortKey, setSortKey] = useState<AdvancedTableColumnKey>(initialSortKey);
  const [sortDirection, setSortDirection] =
    useState<AdvancedTableSortDirection>(defaultSortDirection);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [rowsPerPage, setRowsPerPage] = useState(initialRowsPerPage);

  // Filter state
  const [filterQuery, setFilterQuery] = useState("");

  const totalCount = effectiveRows.length;
  const normalizedFilter = enableFiltering ? filterQuery.trim().toLowerCase() : "";

  const filteredRows = useMemo<AdvancedTableRow[]>(() => {
    if (!enableFiltering || !normalizedFilter) return effectiveRows;

    return effectiveRows.filter((row) =>
      effectiveColumns.some((column) => {
        const cell = row[column.key];
        if (typeof cell === "string") {
          return includesQuery(cell, normalizedFilter);
        }
        if (typeof cell === "number") {
          return includesQuery(String(cell), normalizedFilter);
        }
        return false;
      })
    );
  }, [enableFiltering, effectiveRows, effectiveColumns, normalizedFilter]);

  const sortedRows = useMemo<AdvancedTableRow[]>(() => {
    if (!enableSorting || !sortKey) return filteredRows;

    const columnForSort = effectiveColumns.find((column) => column.key === sortKey);
    if (!columnForSort || columnForSort.sortable === false) {
      return filteredRows;
    }

    const copy = [...filteredRows];

    // Determine whether the current column should be treated as numeric.
    const columnValues = filteredRows
      .map((row) => row[sortKey])
      .filter((value) => value !== null && value !== undefined);

    const isNumericColumn =
      columnValues.length > 0 &&
      columnValues.every((value) => {
        if (typeof value === "number") return true;
        if (typeof value === "string") {
          const trimmed = value.trim();
          if (!trimmed) return false;
          return !Number.isNaN(Number(trimmed));
        }
        return false;
      });

    copy.sort((a, b) => {
      const aCell = a[sortKey];
      const bCell = b[sortKey];

      if (isNumericColumn) {
        const aNum =
          typeof aCell === "number"
            ? aCell
            : typeof aCell === "string"
              ? Number(aCell.trim()) || 0
              : 0;
        const bNum =
          typeof bCell === "number"
            ? bCell
            : typeof bCell === "string"
              ? Number(bCell.trim()) || 0
              : 0;
        const diff = aNum - bNum;
        return sortDirection === "asc" ? diff : -diff;
      }

      const aValue = String(aCell ?? "");
      const bValue = String(bCell ?? "");
      const compare = aValue.localeCompare(bValue, undefined, { sensitivity: "base" });
      return sortDirection === "asc" ? compare : -compare;
    });

    return copy;
  }, [enableSorting, filteredRows, sortKey, sortDirection, effectiveColumns]);

  const totalFilteredCount = sortedRows.length;

  const totalPages = useMemo(
    () => (enablePagination ? Math.max(1, Math.ceil(totalFilteredCount / rowsPerPage)) : 1),
    [enablePagination, totalFilteredCount, rowsPerPage]
  );

  // Clamp current page when filter or rowsPerPage changes.
  useEffect(() => {
    if (!enablePagination) {
      setCurrentPage(1);
      return;
    }

    setCurrentPage((prev) => {
      if (prev > totalPages) return totalPages;
      if (prev < 1) return 1;
      return prev;
    });
  }, [enablePagination, totalPages]);

  const paginatedRows = useMemo<AdvancedTableRow[]>(() => {
    if (!enablePagination) {
      return sortedRows;
    }
    const startIndex = (currentPage - 1) * rowsPerPage;
    return sortedRows.slice(startIndex, startIndex + rowsPerPage);
  }, [enablePagination, sortedRows, currentPage, rowsPerPage]);

  const handleHeaderClick = useCallback(
    (columnKey: AdvancedTableColumnKey) => {
      if (!enableSorting) return;
      const column = columns.find((col) => col.key === columnKey);
      if (!column || column.sortable === false) return;
      setCurrentPage(1);
      setSortKey((prevKey) => {
        if (prevKey !== columnKey) {
          setSortDirection("asc");
          return columnKey;
        }
        setSortDirection((prevDir) => (prevDir === "asc" ? "desc" : "asc"));
        return prevKey;
      });
    },
    [enableSorting, columns]
  );

  const handlePageChange = useCallback(
    (page: number) => {
      if (!enablePagination) return;
      if (page < 1 || page > totalPages) return;
      setCurrentPage(page);
    },
    [enablePagination, totalPages]
  );

  const handleRowsPerPageChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = Number(event.target.value) || 5;
    setRowsPerPage(value);
    setCurrentPage(1);
  }, []);

  const handleFilterChange = useCallback(
    (value: string) => {
      if (!enableFiltering) return;
      setFilterQuery(value);
      setCurrentPage(1);
    },
    [enableFiltering]
  );

  const handleClearFilter = useCallback(
    () => {
      if (!enableFiltering) return;
      setFilterQuery("");
      setCurrentPage(1);
    },
    [enableFiltering]
  );

  const startRowIndex =
    totalFilteredCount === 0
      ? 0
      : enablePagination
        ? (currentPage - 1) * rowsPerPage + 1
        : 1;
  const endRowIndex = enablePagination
    ? Math.min(currentPage * rowsPerPage, totalFilteredCount)
    : totalFilteredCount;

  const pageNumbers = useMemo(() => {
    if (!enablePagination) return [];
    const pages: number[] = [];
    for (let i = 1; i <= totalPages; i += 1) {
      pages.push(i);
    }
    return pages;
  }, [enablePagination, totalPages]);

  return (
    <div className={cn("w-full max-w-full space-y-4  p-4", className)}>
      {/* Enhanced Filter and Controls Section */}
      {(enableFiltering || enablePagination) && (
        <div className="flex flex-col gap-4 p-4 bg-muted/30 rounded-lg border border-border">
          {/* Filter Section */}
          {enableFiltering && (
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
              <div className="relative flex-1 w-full sm:max-w-md">
                <div className="relative [&>div.group]:mb-0">
                  <AnimatedInput
                    placeholder={filterPlaceholder}
                    variant="clean"
                    value={filterQuery}
                    onChange={handleFilterChange}
                    size="md"
                    icon={Search}
                    labelClassName="ms-5"
                  />
                </div>
              </div>
              {filterQuery && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearFilter}
                  className="shrink-0"
                >
                  <X className="h-4 w-4 mr-2" />
                  Clear filter
                </Button>
              )}
            </div>
          )}

          {/* Pagination Controls */}
          {enablePagination && (
            <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-border">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-foreground">Rows per page:</span>
                <select
                  aria-label="Rows per page"
                  className="h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 transition-colors"
                  value={rowsPerPage}
                  onChange={handleRowsPerPageChange}
                >
                  {rowsPerPageOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Summary and responsive table container */}
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
          <span>
            Showing {startRowIndex}-{endRowIndex} of {totalFilteredCount} matching rows (total dataset: {totalCount})
          </span>
          {enablePagination && (
            <span>
              Page {currentPage} of {totalPages}
            </span>
          )}
        </div>

        <div className="w-full max-w-full overflow-x-auto rounded-lg border border-border bg-background">
          <table className="min-w-[640px] w-full border-collapse text-sm">
            <thead className="bg-muted">
              <tr>
                {effectiveColumns.map((column) => {
                  const isActive = column.key === sortKey;
                  const isSortableColumn = enableSorting && column.sortable !== false;
                  const direction = isActive ? sortDirection : "asc";
                  return (
                    <th
                      key={column.key}
                      scope="col"
                      onClick={isSortableColumn ? () => handleHeaderClick(column.key) : undefined}
                      className={cn(
                        "select-none px-3 py-2 text-left font-semibold border-b border-border",
                        "whitespace-nowrap",
                        isSortableColumn && "cursor-pointer hover:bg-muted/80"
                      )}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span>{column.label}</span>
                        {isSortableColumn && (
                          <span
                            aria-hidden="true"
                            className={cn(
                              "text-xs transition-transform",
                              isActive ? "text-primary" : "text-muted-foreground"
                            )}
                          >
                            {direction === "asc" ? "↑" : "↓"}
                          </span>
                        )}
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {paginatedRows.length === 0 ? (
                <tr>
                  <td
                    colSpan={effectiveColumns.length}
                    className="px-3 py-6 text-center text-sm text-muted-foreground"
                  >
                    No rows match your filter.
                  </td>
                </tr>
              ) : (
                paginatedRows.map((row, rowIndex) => (
                  <tr
                    key={rowIndex}
                    className={cn(
                      "border-b border-border transition-colors",
                      rowIndex % 2 === 1 ? "bg-muted/40" : "bg-background",
                      "hover:bg-primary/5"
                    )}
                  >
                    {effectiveColumns.map((column) => {
                      const cell = row[column.key];
                      const isString = typeof cell === "string";
                      return (
                        <td key={column.key} className="px-3 py-2 whitespace-nowrap">
                          {isString ? (
                            <HighlightedText value={cell as string} query={normalizedFilter} />
                          ) : (
                            cell
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination controls */}
        {enablePagination && totalPages > 1 && (
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
                aria-label="First page"
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                aria-label="Previous page"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <div className="flex flex-wrap items-center gap-1">
                {pageNumbers.map((page) => (
                  <Button
                    key={page}
                    variant={page === currentPage ? "default" : "ghost"}
                    size="sm"
                    onClick={() => handlePageChange(page)}
                    aria-current={page === currentPage ? "page" : undefined}
                  >
                    {page}
                  </Button>
                ))}
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                aria-label="Next page"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
                aria-label="Last page"
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>

            {/* <span className="text-xs text-muted-foreground">
              Page {currentPage} of {totalPages}
            </span> */}
          </div>
        )}
      </div>
    </div>
  );
};

AdvancedTable.displayName = "AdvancedTable";

export default AdvancedTable;

