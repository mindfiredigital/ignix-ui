"use client";

import React, { useCallback, useState } from "react";
import { AnimatePresence, motion, useAnimation } from "framer-motion";
import { TriangleDownIcon, TriangleUpIcon } from "@radix-ui/react-icons";
import { Flex, Table as RadixTable, Theme } from "@radix-ui/themes";
import { cn } from "../../../utils/cn";
import { Pagination, type PaginationProps } from "./pagination";

export type TableSortBy = "asc" | "desc";

export interface TableProps {
  headings: Array<{
    label: React.ReactNode;
    key: string;
    sort: TableSortBy;
  }>;
  data: Array<Record<string, React.ReactNode>>;
  applySort: (key: string, value: TableSortBy) => void;
  variant?: "surface" | "ghost";
  headingVariant?: "row" | "column";
  size?: "sm" | "md" | "lg";
  animationVariant?: "fade" | "slide" | "scale" | "flip" | "elastic";
  showHoverEffects?: boolean;
  showStripes?: boolean;
  showBorders?: boolean;
  glow?: boolean;
  rowKeyExtractor?: (row: Record<string, React.ReactNode>, index: number) => string;
}

const contentAnimations = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.4, ease: "easeInOut" },
  },
  slide: {
    initial: { opacity: 0, y: 20, scale: 0.95 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -20, scale: 0.95 },
    transition: { duration: 0.5, ease: "easeInOut" },
  },
  scale: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 },
    transition: { duration: 0.45, ease: "easeInOut" },
  },
  flip: {
    initial: { opacity: 0, rotateX: -90 },
    animate: { opacity: 1, rotateX: 0 },
    exit: { opacity: 0, rotateX: 90 },
    transition: { duration: 0.6, ease: "easeInOut" },
  },
  elastic: {
    initial: { opacity: 0, scale: 0.3, rotate: -10 },
    animate: { opacity: 1, scale: 1, rotate: 0 },
    exit: { opacity: 0, scale: 0.3, rotate: 10 },
    transition: { type: "spring", stiffness: 300, damping: 20, duration: 0.8 },
  },
};

const sizeConfigs = {
  sm: { fontSize: "text-sm", padding: "py-1 px-2", headingFontSize: "text-sm" },
  md: { fontSize: "text-base", padding: "py-2 px-3", headingFontSize: "text-base" },
  lg: { fontSize: "text-lg", padding: "py-3 px-4", headingFontSize: "text-lg" },
};

function getRowKey(
  row: Record<string, React.ReactNode>,
  index: number,
  headings: Array<{ key: string }>,
  extractor?: (row: Record<string, React.ReactNode>, index: number) => string
) {
  if (extractor) return extractor(row, index);
  // Default stable key: combine cell values
  return headings.map((h) => String(row[h.key] ?? "")).join("|") + `__${index}`;
}

type AnimatedContentProps = {
  content: React.ReactNode;
  changeKey: string;
  animationVariant: keyof typeof contentAnimations;
};

function AnimatedContent({ content, changeKey, animationVariant }: AnimatedContentProps) {
  const controls = useAnimation();

  React.useEffect(() => {
    controls.set(contentAnimations[animationVariant].initial);
    controls.start({
      ...contentAnimations[animationVariant].animate,
      transition: contentAnimations[animationVariant].transition,
    });
  }, [changeKey, animationVariant, controls]);

  return (
    <motion.div animate={controls} initial="initial" exit="exit" role="cell" className="min-w-0">
      {content}
    </motion.div>
  );
}

function ColumnTable(props: TableProps) {
  const {
    headings,
    data,
    applySort,
    variant = "surface",
    size = "md",
    animationVariant = "fade",
    showHoverEffects = true,
    showStripes = true,
    showBorders = true,
    glow = false,
    rowKeyExtractor,
  } = props;

  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const [hoveredColumn, setHoveredColumn] = useState<string | null>(null);
  const config = sizeConfigs[size];

  const handleSort = useCallback(
    (ev: React.MouseEvent<HTMLTableCellElement, MouseEvent>) => {
      const target = ev.currentTarget;
      const key = target.getAttribute("data-key");
      const currentSort = target.getAttribute("data-sort");
      if (key && currentSort) {
        applySort(key, currentSort === "asc" ? "desc" : "asc");
      }
    },
    [applySort]
  );

  return (
    <div className="relative w-full rounded-lg overflow-hidden shadow-md">
      {glow && (
        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary to-primary opacity-30 blur-lg pointer-events-none animate-pulse" />
      )}
      <RadixTable.Root
        className={cn(
          "w-full border-collapse",
          variant === "ghost" ? "border border-transparent" : "border border-primary dark:border-gray-700"
        )}
      >
        <RadixTable.Header className="bg-gray-50 dark:bg-gray-800">
          <RadixTable.Row>
            {headings.map(({ label, key, sort }) => (
              <RadixTable.ColumnHeaderCell
                key={key}
                data-key={key}
                data-sort={sort}
                onClick={handleSort}
                onMouseEnter={() => setHoveredColumn(key)}
                onMouseLeave={() => setHoveredColumn(null)}
                className={cn(
                  "relative select-none cursor-pointer px-3 first:rounded-l-lg last:rounded-r-lg text-left font-semibold",
                  config.padding,
                  config.headingFontSize,
                  "border-r last:border-r-0 text-gray-700 dark:text-gray-300",
                  showHoverEffects && hoveredColumn === key ? "bg-gray-100 dark:bg-gray-700" : "",
                  glow ? "text-primary" : "",
                  showBorders && "border-gray-300 dark:border-gray-600"
                )}
              >
                <Flex justify="between" align="center">
                  <div className="truncate">{label}</div>
                  <div className="flex items-center gap-1 shrink-0">
                    {sort === "asc" ? (
                      <TriangleUpIcon className="w-4 h-4 text-primary" />
                    ) : (
                      <TriangleDownIcon className="w-4 h-4 text-primary" />
                    )}
                  </div>
                </Flex>
              </RadixTable.ColumnHeaderCell>
            ))}
          </RadixTable.Row>
        </RadixTable.Header>
        <RadixTable.Body>
          <AnimatePresence mode="wait">
            {data.map((row, index) => {
              const rowKey = getRowKey(row, index, headings, rowKeyExtractor);
              return (
                <motion.tr
                  key={rowKey}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className={cn(
                    "cursor-default",
                    showStripes && index % 2 === 1 ? "bg-gray-50 dark:bg-gray-800" : "",
                    showHoverEffects ? "hover:bg-primary dark:hover:bg-primary" : "",
                    showBorders ? "border-b border-gray-200 dark:border-gray-700" : ""
                  )}
                  onMouseEnter={() => setHoveredRow(index)}
                  onMouseLeave={() => setHoveredRow(null)}
                  style={{ zIndex: hoveredRow === index ? 10 : "auto" }}
                >
                  {headings.map(({ key }) => {
                    return (
                      <RadixTable.Cell
                        key={`${rowKey}-${key}`}
                        className={cn(
                          "select-text truncate max-w-[200px] whitespace-nowrap px-3",
                          config.padding,
                          config.fontSize,
                          showBorders ? "border-r border-gray-200 dark:border-gray-700" : "",
                          showHoverEffects && hoveredRow === index ? "font-semibold" : ""
                        )}
                      >
                        <AnimatedContent
                          animationVariant={animationVariant}
                          changeKey={`${rowKey}-${key}-${String(row[key] ?? "")}`}
                          content={row[key] ?? ""}
                        />
                      </RadixTable.Cell>
                    );
                  })}
                </motion.tr>
              );
            })}
          </AnimatePresence>
        </RadixTable.Body>
      </RadixTable.Root>
    </div>
  );
}

function RowTable(props: TableProps) {
  // Similar to ColumnTable, but transposed heading/data cells for Row Headings style.
  // Implement if needed or fallback to ColumnTable
  // For brevity, not implemented here.
  return <ColumnTable {...props} />;
}

export function Table(props: TableProps & Partial<PaginationProps> & { currentPage: number; totalPages: number; onPageChange: (page: number) => void }) {
  const {
    headingVariant = "column",
    currentPage,
    totalPages,
    onPageChange,
    ...rest
  } = props;

  const TableContent = headingVariant === "row" ? RowTable : ColumnTable;

  return (
    <Theme radius="large" appearance="inherit" {...rest}>
      <Flex direction="column" align="center" gap="6" className="w-full">
        <TableContent {...rest} />
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
      </Flex>
    </Theme>
  );
}
