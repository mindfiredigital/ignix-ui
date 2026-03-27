import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import React, { ReactNode } from "react";
import { Pagination, type PaginationProps } from "./index";

vi.mock("@radix-ui/themes", () => ({
  Text: ({ children, ...rest }: { children: React.ReactNode; [key: string]: unknown }): React.ReactElement =>
    React.createElement("span", rest, children),
}));

vi.mock("lucide-react", () => ({
  ChevronLeft:   (): React.ReactElement => React.createElement("svg", { "data-testid": "icon-chevron-left" }),
  ChevronRight:  (): React.ReactElement => React.createElement("svg", { "data-testid": "icon-chevron-right" }),
  ChevronsLeft:  (): React.ReactElement => React.createElement("svg", { "data-testid": "icon-chevrons-left" }),
  ChevronsRight: (): React.ReactElement => React.createElement("svg", { "data-testid": "icon-chevrons-right" }),
}));

interface ButtonMockProps {
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  "aria-label"?: string;
  "aria-current"?: string;
  variant?: string;
  size?: string;
  [key: string]: unknown;
}

vi.mock("../../button", () => ({
  Button: React.forwardRef<HTMLButtonElement, ButtonMockProps>(
    (
      {
        children,
        onClick,
        disabled,
        "aria-label": ariaLabel,
        "aria-current": ariaCurrent,
        variant: _variant,
        size: _size,
        ...rest
      },
      ref
    ): React.ReactElement =>
      React.createElement(
        "button",
        { ref, onClick, disabled, "aria-label": ariaLabel, "aria-current": ariaCurrent, ...rest }, children as ReactNode
      )
  ),
}));

const defaultProps: PaginationProps = {
  currentPage: 1,
  totalPages: 5,
  onPageChange: vi.fn(),
};

const renderPagination = (overrides: Partial<PaginationProps> = {}): ReturnType<typeof render> =>
  render(<Pagination {...defaultProps} {...overrides} />);

describe("Pagination - null render", () => {
  it("renders nothing when totalPages is 1", () => {
    const { container } = renderPagination({ totalPages: 1, currentPage: 1 });
    expect(container.firstChild).toBeNull();
  });

  it("renders nothing when totalPages is 0", () => {
    const { container } = renderPagination({ totalPages: 0, currentPage: 1 });
    expect(container.firstChild).toBeNull();
  });

  it("renders the component when totalPages is 2", () => {
    renderPagination({ totalPages: 2, currentPage: 1 });
    expect(screen.getByLabelText("First page")).toBeInTheDocument();
  });
});

describe("Pagination - navigation button presence", () => {
  it("renders First, Previous, Next, and Last buttons", () => {
    renderPagination();
    expect(screen.getByLabelText("First page")).toBeInTheDocument();
    expect(screen.getByLabelText("Previous page")).toBeInTheDocument();
    expect(screen.getByLabelText("Next page")).toBeInTheDocument();
    expect(screen.getByLabelText("Last page")).toBeInTheDocument();
  });

  it("renders the correct icons inside each nav button", () => {
    renderPagination();
    expect(screen.getByTestId("icon-chevrons-left")).toBeInTheDocument();
    expect(screen.getByTestId("icon-chevron-left")).toBeInTheDocument();
    expect(screen.getByTestId("icon-chevron-right")).toBeInTheDocument();
    expect(screen.getByTestId("icon-chevrons-right")).toBeInTheDocument();
  });
});

describe("Pagination - navigation button disabled state", () => {
  it("disables First and Previous on page 1", () => {
    renderPagination({ currentPage: 1, totalPages: 5 });
    expect(screen.getByLabelText("First page")).toBeDisabled();
    expect(screen.getByLabelText("Previous page")).toBeDisabled();
  });

  it("enables Next and Last on page 1", () => {
    renderPagination({ currentPage: 1, totalPages: 5 });
    expect(screen.getByLabelText("Next page")).not.toBeDisabled();
    expect(screen.getByLabelText("Last page")).not.toBeDisabled();
  });

  it("disables Next and Last on the final page", () => {
    renderPagination({ currentPage: 5, totalPages: 5 });
    expect(screen.getByLabelText("Next page")).toBeDisabled();
    expect(screen.getByLabelText("Last page")).toBeDisabled();
  });

  it("enables First and Previous on the final page", () => {
    renderPagination({ currentPage: 5, totalPages: 5 });
    expect(screen.getByLabelText("First page")).not.toBeDisabled();
    expect(screen.getByLabelText("Previous page")).not.toBeDisabled();
  });

  it("enables all nav buttons on a middle page", () => {
    renderPagination({ currentPage: 3, totalPages: 5 });
    expect(screen.getByLabelText("First page")).not.toBeDisabled();
    expect(screen.getByLabelText("Previous page")).not.toBeDisabled();
    expect(screen.getByLabelText("Next page")).not.toBeDisabled();
    expect(screen.getByLabelText("Last page")).not.toBeDisabled();
  });
});

describe("Pagination - navigation button callbacks", () => {
  let onPageChange: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    onPageChange = vi.fn();
  });

  it("calls onPageChange(1) when First is clicked", async () => {
    renderPagination({ currentPage: 4, totalPages: 5, onPageChange });
    await userEvent.click(screen.getByLabelText("First page"));
    expect(onPageChange).toHaveBeenCalledWith(1);
    expect(onPageChange).toHaveBeenCalledTimes(1);
  });

  it("calls onPageChange(currentPage - 1) when Previous is clicked", async () => {
    renderPagination({ currentPage: 4, totalPages: 5, onPageChange });
    await userEvent.click(screen.getByLabelText("Previous page"));
    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  it("calls onPageChange(currentPage + 1) when Next is clicked", async () => {
    renderPagination({ currentPage: 2, totalPages: 5, onPageChange });
    await userEvent.click(screen.getByLabelText("Next page"));
    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  it("calls onPageChange(totalPages) when Last is clicked", async () => {
    renderPagination({ currentPage: 2, totalPages: 5, onPageChange });
    await userEvent.click(screen.getByLabelText("Last page"));
    expect(onPageChange).toHaveBeenCalledWith(5);
  });

  it("does not call onPageChange when First is clicked on page 1 (disabled)", async () => {
    renderPagination({ currentPage: 1, totalPages: 5, onPageChange });
    await userEvent.click(screen.getByLabelText("First page"));
    expect(onPageChange).not.toHaveBeenCalled();
  });

  it("does not call onPageChange when Last is clicked on the final page (disabled)", async () => {
    renderPagination({ currentPage: 5, totalPages: 5, onPageChange });
    await userEvent.click(screen.getByLabelText("Last page"));
    expect(onPageChange).not.toHaveBeenCalled();
  });
});

describe("Pagination - page number buttons", () => {
  it("renders all page numbers when totalPages fits within the window", () => {
    renderPagination({ currentPage: 1, totalPages: 5 });
    [1, 2, 3, 4, 5].forEach((n) =>
      expect(screen.getByRole("button", { name: String(n) })).toBeInTheDocument()
    );
  });

  it("marks the current page button as disabled", () => {
    renderPagination({ currentPage: 3, totalPages: 5 });
    expect(screen.getByRole("button", { name: "3" })).toBeDisabled();
  });

  it("does not disable non-current page buttons", () => {
    renderPagination({ currentPage: 3, totalPages: 5 });
    [1, 2, 4, 5].forEach((n) =>
      expect(screen.getByRole("button", { name: String(n) })).not.toBeDisabled()
    );
  });

  it("sets aria-current='page' on the active page button", () => {
    renderPagination({ currentPage: 2, totalPages: 5 });
    expect(screen.getByRole("button", { name: "2" })).toHaveAttribute("aria-current", "page");
  });

  it("does not set aria-current on non-active page buttons", () => {
    renderPagination({ currentPage: 2, totalPages: 5 });
    [1, 3, 4, 5].forEach((n) =>
      expect(screen.getByRole("button", { name: String(n) })).not.toHaveAttribute("aria-current")
    );
  });

  it("calls onPageChange with the correct page when a page button is clicked", async () => {
    const onPageChange = vi.fn();
    renderPagination({ currentPage: 1, totalPages: 5, onPageChange });
    await userEvent.click(screen.getByRole("button", { name: "4" }));
    expect(onPageChange).toHaveBeenCalledWith(4);
  });

  it("does not call onPageChange when the current page button is clicked (disabled)", async () => {
    const onPageChange = vi.fn();
    renderPagination({ currentPage: 3, totalPages: 5, onPageChange });
    await userEvent.click(screen.getByRole("button", { name: "3" }));
    expect(onPageChange).not.toHaveBeenCalled();
  });
});

describe("Pagination - dots (ellipsis) rendering", () => {
  it("shows no dots when all pages fit in the window", () => {
    renderPagination({ currentPage: 1, totalPages: 5 });
    expect(screen.queryByText("…")).not.toBeInTheDocument();
  });

  it("shows right dots but not left dots near the start", () => {
    renderPagination({ currentPage: 1, totalPages: 10 });
    const dots = screen.getAllByText("…");
    expect(dots).toHaveLength(1);
    [1, 2, 3].forEach((n) =>
      expect(screen.getByRole("button", { name: String(n) })).toBeInTheDocument()
    );
    expect(screen.getByRole("button", { name: "10" })).toBeInTheDocument();
  });

  it("shows left dots but not right dots near the end", () => {
    renderPagination({ currentPage: 10, totalPages: 10 });
    const dots = screen.getAllByText("…");
    expect(dots).toHaveLength(1);
    [8, 9, 10].forEach((n) =>
      expect(screen.getByRole("button", { name: String(n) })).toBeInTheDocument()
    );
    expect(screen.getByRole("button", { name: "1" })).toBeInTheDocument();
  });

  it("shows both left and right dots in the middle", () => {
    renderPagination({ currentPage: 5, totalPages: 10 });
    const dots = screen.getAllByText("…");
    expect(dots).toHaveLength(2);
    expect(screen.getByRole("button", { name: "1" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "10" })).toBeInTheDocument();
    [4, 5, 6].forEach((n) =>
      expect(screen.getByRole("button", { name: String(n) })).toBeInTheDocument()
    );
  });
});

describe("Pagination - siblingCount", () => {
  it("shows more adjacent pages when siblingCount=2", () => {
    renderPagination({ currentPage: 10, totalPages: 20, siblingCount: 2 });
    [8, 9, 10, 11, 12].forEach((n) =>
      expect(screen.getByRole("button", { name: String(n) })).toBeInTheDocument()
    );
  });

  it("shows fewer adjacent pages when siblingCount=0", () => {
    renderPagination({ currentPage: 5, totalPages: 10, siblingCount: 0 });
    expect(screen.getByRole("button", { name: "5" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "4" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "6" })).not.toBeInTheDocument();
  });

  it("uses siblingCount=1 as the default", () => {
    renderPagination({ currentPage: 5, totalPages: 10 });
    [4, 5, 6].forEach((n) =>
      expect(screen.getByRole("button", { name: String(n) })).toBeInTheDocument()
    );
  });
});

describe("Pagination - edge cases", () => {
  it("renders correctly with only 2 pages", () => {
    renderPagination({ currentPage: 1, totalPages: 2 });
    expect(screen.getByRole("button", { name: "1" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "2" })).toBeInTheDocument();
  });

  it("renders correctly on the exact boundary (totalPages = siblingCount + 5)", () => {
    renderPagination({ currentPage: 1, totalPages: 6 });
    [1, 2, 3, 4, 5, 6].forEach((n) =>
      expect(screen.getByRole("button", { name: String(n) })).toBeInTheDocument()
    );
    expect(screen.queryByText("…")).not.toBeInTheDocument();
  });

  it("renders correctly just above the boundary (totalPages = siblingCount + 6)", () => {
    renderPagination({ currentPage: 1, totalPages: 7 });
    expect(screen.getByText("…")).toBeInTheDocument();
  });

  it("renders a single page range without crashing", () => {
    expect(() => renderPagination({ currentPage: 1, totalPages: 2 })).not.toThrow();
  });

  it("re-renders correctly when currentPage changes", () => {
    const { rerender } = renderPagination({ currentPage: 1, totalPages: 5 });
    expect(screen.getByRole("button", { name: "1" })).toBeDisabled();

    rerender(<Pagination currentPage={3} totalPages={5} onPageChange={vi.fn()} />);
    expect(screen.getByRole("button", { name: "3" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "1" })).not.toBeDisabled();
  });

  it("re-renders correctly when totalPages changes", () => {
    const { rerender } = renderPagination({ currentPage: 1, totalPages: 5 });
    expect(screen.getByRole("button", { name: "5" })).toBeInTheDocument();

    rerender(<Pagination currentPage={1} totalPages={8} onPageChange={vi.fn()} />);
    expect(screen.getByRole("button", { name: "8" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "5" })).toBeInTheDocument();
  });

  it("becomes null when totalPages drops to 1 on re-render", () => {
    const { rerender, container } = renderPagination({ currentPage: 1, totalPages: 5 });
    expect(container.firstChild).not.toBeNull();

    rerender(<Pagination currentPage={1} totalPages={1} onPageChange={vi.fn()} />);
    expect(container.firstChild).toBeNull();
  });
});

describe("Pagination - displayName", () => {
  it("has the correct displayName for React DevTools", () => {
    expect(Pagination.displayName).toBe("Pagination");
  });
});