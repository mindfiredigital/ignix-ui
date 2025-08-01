import { Text } from "@radix-ui/themes";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import React, { useCallback, useMemo } from "react";
import { Button } from "../../button";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
}

const DOTS = "...";

const range = (start: number, end: number) => {
  const length = end - start + 1;
  return Array.from({ length }, (_, idx) => idx + start);
};

const usePagination = ({
  currentPage,
  totalPages,
  siblingCount = 1,
}: Omit<PaginationProps, "onPageChange">) => {
  const paginationRange = useMemo(() => {
    const totalPageNumbers = siblingCount + 5;

    if (totalPageNumbers >= totalPages) {
      return range(1, totalPages);
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPages - 2;

    const firstPageIndex = 1;
    const lastPageIndex = totalPages;

    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = 3 + 2 * siblingCount;
      const leftRange = range(1, leftItemCount);
      return [...leftRange, DOTS, totalPages];
    }

    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = 3 + 2 * siblingCount;
      const rightRange = range(totalPages - rightItemCount + 1, totalPages);
      return [firstPageIndex, DOTS, ...rightRange];
    }

    if (shouldShowLeftDots && shouldShowRightDots) {
      const middleRange = range(leftSiblingIndex, rightSiblingIndex);
      return [firstPageIndex, DOTS, ...middleRange, DOTS, lastPageIndex];
    }

    return range(1, totalPages);
  }, [totalPages, siblingCount, currentPage]);

  return paginationRange;
};

export const Pagination = React.memo(function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
}: PaginationProps) {
  const paginationRange = usePagination({ currentPage, totalPages, siblingCount });

  const handleFirstPage = useCallback(() => onPageChange(1), [onPageChange]);
  const handlePreviousPage = useCallback(() => onPageChange(currentPage - 1), [currentPage, onPageChange]);
  const handleNextPage = useCallback(() => onPageChange(currentPage + 1), [currentPage, onPageChange]);
  const handleLastPage = useCallback(() => onPageChange(totalPages), [totalPages, onPageChange]);

  if (totalPages <= 1) return null;

  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  return (
    <div className="flex justify-center gap-2 py-4">
      <Button variant="outline" size="md" onClick={handleFirstPage} disabled={isFirstPage} aria-label="First page">
        <ChevronsLeft size={16} />
      </Button>
      <Button variant="outline" size="md" onClick={handlePreviousPage} disabled={isFirstPage} aria-label="Previous page">
        <ChevronLeft size={16} />
      </Button>

      {paginationRange?.map((pageNumber, index) => {
        if (pageNumber === DOTS) {
          return (
            <Text key={`${DOTS}-${index}`} size="2" className="px-2">
              &#8230;
            </Text>
          );
        }

        return (
          <Button
            key={pageNumber}
            variant={pageNumber === currentPage ? "default" : "ghost"}
            size="md"
            onClick={() => onPageChange(pageNumber as number)}
            disabled={pageNumber === currentPage}
            aria-current={pageNumber === currentPage ? "page" : undefined}
          >
            {pageNumber}
          </Button>
        );
      })}

      <Button variant="outline" size="md" onClick={handleNextPage} disabled={isLastPage} aria-label="Next page">
        <ChevronRight size={16} />
      </Button>
      <Button variant="outline" size="md" onClick={handleLastPage} disabled={isLastPage} aria-label="Last page">
        <ChevronsRight size={16} />
      </Button>
    </div>
  );
});

Pagination.displayName = "Pagination";