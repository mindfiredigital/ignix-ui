import { Button, Flex, Text } from "@radix-ui/themes";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { useCallback } from "react";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const handleFirstPage = useCallback(() => {
    if (currentPage > 1) {
      onPageChange(1);
    }
  }, [currentPage, onPageChange]);

  const handlePreviousPage = useCallback(() => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  }, [currentPage, onPageChange]);

  const handleNextPage = useCallback(() => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  }, [currentPage, totalPages, onPageChange]);

  const handleLastPage = useCallback(() => {
    if (currentPage < totalPages) {
      onPageChange(totalPages);
    }
  }, [currentPage, totalPages, onPageChange]);

  if (totalPages <= 1) return null;

  return (
    <Flex align="center" gap="2" justify="center" py="4">
      <Button
        variant="soft"
        size="1"
        onClick={handleFirstPage}
        disabled={currentPage === 1}
        aria-label="First page"
      >
        <ChevronsLeft size={16} />
      </Button>
      <Button
        variant="soft"
        size="1"
        onClick={handlePreviousPage}
        disabled={currentPage === 1}
        aria-label="Previous page"
      >
        <ChevronLeft size={16} />
      </Button>
      <Text size="2">
        Page {currentPage} of {totalPages}
      </Text>
      <Button
        variant="soft"
        size="1"
        onClick={handleNextPage}
        disabled={currentPage === totalPages}
        aria-label="Next page"
      >
        <ChevronRight size={16} />
      </Button>
      <Button
        variant="soft"
        size="1"
        onClick={handleLastPage}
        disabled={currentPage === totalPages}
        aria-label="Last page"
      >
        <ChevronsRight size={16} />
      </Button>
    </Flex>
  );
}
