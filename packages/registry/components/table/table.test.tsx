import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeAll, beforeEach } from "vitest";
import { Table, type TableProps } from "./index";

const mockObserve = vi.fn();
const mockUnobserve = vi.fn();
const mockDisconnect = vi.fn();

beforeAll(() => {
  if (typeof globalThis.ResizeObserver === "undefined") {
    globalThis.ResizeObserver = class ResizeObserver {
      observe = mockObserve;
      unobserve = mockUnobserve;
      disconnect = mockDisconnect;
    };
  }
});

vi.mock("@radix-ui/themes", async () => {
  const React = await import("react");
  return {
    Theme: ({ children, ...rest }: any) => {
      const { ...domRest } = rest;
      return React.createElement("div", domRest, children);
    },
    Flex: ({ children, ...rest }: any) =>
      React.createElement("div", rest, children),
    Table: {
      Root: ({ children, ...rest }: any) =>
        React.createElement("table", rest, children),
      Header: ({ children, ...rest }: any) =>
        React.createElement("thead", rest, children),
      Body: ({ children, ...rest }: any) =>
        React.createElement("tbody", rest, children),
      Row: ({ children, ...rest }: any) =>
        React.createElement("tr", rest, children),
      ColumnHeaderCell: ({ children, ...rest }: any) =>
        React.createElement("th", { role: "columnheader", ...rest }, children),
      Cell: ({ children, ...rest }: any) =>
        React.createElement("td", rest, children),
    },
  };
});

vi.mock("@radix-ui/react-icons", async () => {
  const React = await import("react");
  return {
    TriangleUpIcon: (props: any) =>
      React.createElement("svg", { "data-testid": "sort-asc", ...props }),
    TriangleDownIcon: (props: any) =>
      React.createElement("svg", { "data-testid": "sort-desc", ...props }),
  };
});

vi.mock("framer-motion", async () => {
  const React = await import("react");

  const motion = new Proxy(
    {},
    {
      get: (_target, tag: string) =>
        React.forwardRef(
          ({ children, ...rest }: any, ref: any) =>
            React.createElement(tag, { ref, ...rest }, children)
        ),
    }
  );

  return {
    motion,
    AnimatePresence: ({ children }: any) =>
      React.createElement(React.Fragment, null, children),
    useAnimation: () => ({
      set: vi.fn(),
      start: vi.fn(() => Promise.resolve()),
    }),
  };
});

const headings: TableProps["headings"] = [
  { label: "Name", key: "name", sort: "asc" },
  { label: "Role", key: "role", sort: "asc" },
  { label: "Status", key: "status", sort: "asc" },
];

const data: TableProps["data"] = [
  { name: "Alice", role: "Engineer", status: "Active" },
  { name: "Bob", role: "Designer", status: "Inactive" },
  { name: "Carol", role: "Manager", status: "Active" },
];

const defaultProps = {
  headings,
  data,
  applySort: vi.fn(),
  currentPage: 1,
  totalPages: 3,
  onPageChange: vi.fn(),
};

beforeEach(() => {
  defaultProps.applySort.mockClear();
  defaultProps.onPageChange.mockClear();
});

const renderTable = (
  overrides: Partial<typeof defaultProps & Record<string, unknown>> = {}
) => render(<Table {...defaultProps} {...overrides} />);

describe("Table - heading rendering", () => {
  it("renders all column header labels", () => {
    renderTable();
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Role")).toBeInTheDocument();
    expect(screen.getByText("Status")).toBeInTheDocument();
  });

  it("renders the correct number of column header cells", () => {
    renderTable();
    expect(screen.getAllByRole("columnheader")).toHaveLength(headings.length);
  });

  it("renders React node labels (not just strings)", () => {
    const nodeHeadings: TableProps["headings"] = [
      { label: <span data-testid="icon-label">⭐ Name</span>, key: "name", sort: "asc" },
    ];
    renderTable({ headings: nodeHeadings, data: [{ name: "Alice" }] });
    expect(screen.getByTestId("icon-label")).toBeInTheDocument();
  });

  it("sets data-key attribute correctly on each header cell", () => {
    renderTable();
    const nameHeader = screen.getByRole("columnheader", { name: /name/i });
    expect(nameHeader).toHaveAttribute("data-key", "name");
  });

  it("sets data-sort='asc' on a heading with sort='asc'", () => {
    renderTable({
      headings: [{ label: "Name", key: "name", sort: "asc" }],
      data: [],
    });
    expect(
      screen.getByRole("columnheader", { name: /name/i })
    ).toHaveAttribute("data-sort", "asc");
  });

  it("sets data-sort='desc' on a heading with sort='desc'", () => {
    renderTable({
      headings: [{ label: "Name", key: "name", sort: "desc" }],
      data: [],
    });
    expect(
      screen.getByRole("columnheader", { name: /name/i })
    ).toHaveAttribute("data-sort", "desc");
  });

  it("renders the ascending sort icon (TriangleUpIcon) when sort is 'asc'", () => {
    renderTable({
      headings: [{ label: "Name", key: "name", sort: "asc" }],
      data: [],
    });
    expect(screen.getByTestId("sort-asc")).toBeInTheDocument();
  });

  it("renders the descending sort icon (TriangleDownIcon) when sort is 'desc'", () => {
    renderTable({
      headings: [{ label: "Name", key: "name", sort: "desc" }],
      data: [],
    });
    expect(screen.getByTestId("sort-desc")).toBeInTheDocument();
  });
});


describe("Table - row and cell rendering", () => {
  it("renders the correct number of rows (header + data rows)", () => {
    renderTable();
    expect(screen.getAllByRole("row")).toHaveLength(data.length + 1);
  });

  it("renders unique cell text values", () => {
    renderTable();
    ["Alice", "Engineer", "Bob", "Designer", "Inactive", "Carol", "Manager"].forEach(
      (text) => expect(screen.getByText(text)).toBeInTheDocument()
    );
  });

  it("renders cell text values that appear multiple times (e.g. 'Active')", () => {
    renderTable();
    const activeEls = screen.getAllByText("Active");
    expect(activeEls).toHaveLength(2);
    activeEls.forEach((el) => expect(el).toBeInTheDocument());
  });

  it("renders React node cell values", () => {
    const reactData = [
      { name: <strong data-testid="bold-name">Dave</strong>, role: "Dev", status: "Active" },
    ];
    renderTable({ data: reactData });
    expect(screen.getByTestId("bold-name")).toBeInTheDocument();
  });

  it("renders gracefully when a cell key is missing from a row", () => {
    const sparseData = [{ name: "Alice" }]; 
    expect(() => renderTable({ headings, data: sparseData })).not.toThrow();
    expect(screen.getByText("Alice")).toBeInTheDocument();
  });

  it("renders an empty body without error when data is an empty array", () => {
    renderTable({ data: [] });
    expect(screen.getAllByRole("row")).toHaveLength(1); 
  });

  it("renders 100 rows without error", () => {
    const bigData = Array.from({ length: 100 }, (_, i) => ({
      name: `User ${i}`,
      role: "Dev",
      status: "Active",
    }));
    expect(() => renderTable({ data: bigData })).not.toThrow();
    expect(screen.getAllByRole("row")).toHaveLength(101);
  });

  it("wraps cell content in AnimatedContent (div[role=cell])", () => {
    renderTable({ data: [{ name: "Alice", role: "Engineer", status: "Active" }] });
    const animatedCells = screen.getAllByRole("cell");
    expect(animatedCells.length).toBeGreaterThanOrEqual(3);
  });
});

describe("Table - sorting", () => {
  let applySort: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    applySort = vi.fn();
  });

  it("calls applySort with key and toggled direction asc → desc", async () => {
    renderTable({
      applySort,
      headings: [{ label: "Name", key: "name", sort: "asc" }],
      data: [],
    });
    await userEvent.click(screen.getByRole("columnheader", { name: /name/i }));
    expect(applySort).toHaveBeenCalledWith("name", "desc");
  });

  it("calls applySort with key and toggled direction desc → asc", async () => {
    renderTable({
      applySort,
      headings: [{ label: "Role", key: "role", sort: "desc" }],
      data: [],
    });
    await userEvent.click(screen.getByRole("columnheader", { name: /role/i }));
    expect(applySort).toHaveBeenCalledWith("role", "asc");
  });

  it("calls applySort exactly once per click", async () => {
    renderTable({ applySort });
    await userEvent.click(screen.getByRole("columnheader", { name: /name/i }));
    expect(applySort).toHaveBeenCalledTimes(1);
  });

  it("calls applySort with the correct key when multiple columns exist", async () => {
    renderTable({ applySort });
    await userEvent.click(screen.getByRole("columnheader", { name: /status/i }));
    expect(applySort).toHaveBeenCalledWith("status", "desc");
  });

  it("does not mix up keys when clicking different headers sequentially", async () => {
    renderTable({ applySort });
    await userEvent.click(screen.getByRole("columnheader", { name: /name/i }));
    await userEvent.click(screen.getByRole("columnheader", { name: /role/i }));
    expect(applySort).toHaveBeenNthCalledWith(1, "name", "desc");
    expect(applySort).toHaveBeenNthCalledWith(2, "role", "desc");
  });

  it("does not call applySort before any header is clicked", () => {
    renderTable({ applySort, data: [] });
    expect(applySort).not.toHaveBeenCalled();
  });
});

describe("Table - pagination integration", () => {
  it("renders page number buttons when totalPages > 1", () => {
    renderTable({ totalPages: 5, currentPage: 1 });
    expect(screen.getByRole("button", { name: "2" })).toBeInTheDocument();
  });

  it("calls onPageChange when a page button is clicked", async () => {
    const onPageChange = vi.fn();
    renderTable({ totalPages: 5, currentPage: 1, onPageChange });
    await userEvent.click(screen.getByRole("button", { name: "2" }));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it("marks the current page button as disabled", () => {
    renderTable({ currentPage: 3, totalPages: 5 });
    expect(screen.getByRole("button", { name: "3" })).toBeDisabled();
  });

  it("disables First and Previous on page 1", () => {
    renderTable({ currentPage: 1, totalPages: 5 });
    expect(screen.getByLabelText("First page")).toBeDisabled();
    expect(screen.getByLabelText("Previous page")).toBeDisabled();
  });

  it("disables Next and Last on the final page", () => {
    renderTable({ currentPage: 5, totalPages: 5 });
    expect(screen.getByLabelText("Next page")).toBeDisabled();
    expect(screen.getByLabelText("Last page")).toBeDisabled();
  });
});

describe("Table - visual prop variants (smoke)", () => {
  const smokeMatrix: Array<Partial<typeof defaultProps & Record<string, unknown>>> = [
    { variant: "ghost" },
    { variant: "surface" },
    { size: "sm" },
    { size: "md" },
    { size: "lg" },
    { showStripes: false },
    { showStripes: true },
    { showBorders: false },
    { showBorders: true },
    { showHoverEffects: false },
    { showHoverEffects: true },
    { glow: true },
    { glow: false },
    { animationVariant: "fade" },
    { animationVariant: "slide" },
    { animationVariant: "scale" },
    { animationVariant: "flip" },
    { animationVariant: "elastic" },
    { headingVariant: "column" },
    { headingVariant: "row" },
  ];

  smokeMatrix.forEach((props) => {
    const label = Object.entries(props)
      .map(([k, v]) => `${k}=${v}`)
      .join(", ");
    it(`renders without error when ${label}`, () => {
      expect(() => renderTable(props)).not.toThrow();
    });
  });
});

describe("Table - rowKeyExtractor", () => {
  it("accepts a custom extractor without crashing", () => {
    const extractor = vi.fn((_, i) => `row-${i}`);
    expect(() => renderTable({ rowKeyExtractor: extractor })).not.toThrow();
  });

  it("calls the extractor at least once per data row", () => {
    const extractor = vi.fn((_, i) => `row-${i}`);
    renderTable({ rowKeyExtractor: extractor });
    expect(extractor.mock.calls.length).toBeGreaterThanOrEqual(data.length);
  });

  it("passes the row object and index to the extractor", () => {
    const extractor = vi.fn((_, i) => `row-${i}`);
    renderTable({
      data: [{ name: "Alice", role: "Eng", status: "Active" }],
      rowKeyExtractor: extractor,
    });
    expect(extractor).toHaveBeenCalledWith(
      expect.objectContaining({ name: "Alice" }),
      0
    );
  });
});

describe("Table - prop updates", () => {
  it("updates displayed data when data prop changes", () => {
    const { rerender } = renderTable({
      data: [{ name: "Alice", role: "Eng", status: "Active" }],
    });
    expect(screen.getByText("Alice")).toBeInTheDocument();

    rerender(
      <Table
        {...defaultProps}
        data={[{ name: "Zara", role: "PM", status: "Active" }]}
        currentPage={1}
        totalPages={1}
      />
    );
    expect(screen.queryByText("Alice")).not.toBeInTheDocument();
    expect(screen.getByText("Zara")).toBeInTheDocument();
  });

  it("updates the active pagination page when currentPage prop changes", () => {
    const { rerender } = renderTable({ currentPage: 1, totalPages: 5 });
    expect(screen.getByRole("button", { name: "1" })).toBeDisabled();

    rerender(<Table {...defaultProps} currentPage={3} totalPages={5} />);
    expect(screen.getByRole("button", { name: "3" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "1" })).not.toBeDisabled();
  });

  it("re-renders with new headings without error", () => {
    const { rerender } = renderTable();
    expect(() =>
      rerender(
        <Table
          {...defaultProps}
          headings={[{ label: "Email", key: "email", sort: "asc" }]}
          data={[{ email: "alice@example.com" }]}
        />
      )
    ).not.toThrow();
    expect(screen.getByText("Email")).toBeInTheDocument();
  });
});

describe("Table - glow prop", () => {
  it("renders the glow overlay div when glow=true", () => {
    const { container } = renderTable({ glow: true });
    const glowEl = container.querySelector(".animate-pulse.blur-lg");
    expect(glowEl).toBeInTheDocument();
  });

  it("does not render the glow overlay div when glow=false", () => {
    const { container } = renderTable({ glow: false });
    const glowEl = container.querySelector(".animate-pulse.blur-lg");
    expect(glowEl).not.toBeInTheDocument();
  });
});

describe("Table - AnimatedContent animation variants", () => {
  const variants = ["fade", "slide", "scale", "flip", "elastic"] as const;

  variants.forEach((variant) => {
    it(`renders cell content correctly for animationVariant="${variant}"`, () => {
      renderTable({
        animationVariant: variant,
        data: [{ name: "Alice", role: "Engineer", status: "Active" }],
      });
      expect(screen.getByText("Alice")).toBeInTheDocument();
      expect(screen.getByText("Engineer")).toBeInTheDocument();
    });
  });
});