import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Table, type TableProps } from "./index";

const noop = () => {
  // intentional noop for Storybook
};

const meta: Meta<typeof Table> = {
  title: "Components/Table",
  component: Table,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
An animated, sortable data table built on Radix UI Themes with built-in pagination.

**Key features:**
- **Sorting** - click any column header to toggle \`asc ↔ desc\`; the \`applySort\` callback receives the key and new direction.
- **Animation variants** - \`fade\`, \`slide\`, \`scale\`, \`flip\`, \`elastic\` via Framer Motion.
- **Visual knobs** - \`showStripes\`, \`showBorders\`, \`showHoverEffects\`, \`glow\`, \`size\`, \`variant\`.
- **Pagination** - integrated \`<Pagination />\` driven by \`currentPage\`, \`totalPages\`, and \`onPageChange\`.
        `,
      },
    },
  },
  argTypes: {
    variant: { control: "select", options: ["surface", "ghost"] },
    size: { control: "select", options: ["sm", "md", "lg"] },
    animationVariant: { control: "select", options: ["fade", "slide", "scale", "flip", "elastic"] },
    headingVariant: { control: "select", options: ["column", "row"] },
    showHoverEffects: { control: "boolean" },
    showStripes: { control: "boolean" },
    showBorders: { control: "boolean" },
    glow: { control: "boolean" },
    currentPage: { control: { type: "number", min: 1 } },
    totalPages: { control: { type: "number", min: 1 } },
    applySort: { action: "sort applied" },
    onPageChange: { action: "page changed" },
  },
};

export default meta;
type Story = StoryObj<typeof Table>;

const headings: TableProps["headings"] = [
  { label: "Name", key: "name", sort: "asc" },
  { label: "Role", key: "role", sort: "asc" },
  { label: "Department", key: "department", sort: "asc" },
  { label: "Status", key: "status", sort: "asc" },
  { label: "Joined", key: "joined", sort: "desc" },
];

const data: TableProps["data"] = [
  { name: "Alice Martin", role: "Frontend Engineer", department: "Product", status: "Active", joined: "Jan 2021" },
  { name: "Bob Chen", role: "UX Designer", department: "Design", status: "Active", joined: "Mar 2022" },
  { name: "Carol Singh", role: "Engineering Manager", department: "Platform", status: "On Leave", joined: "Jul 2019" },
  { name: "Dave Kim", role: "Backend Engineer", department: "Infrastructure", status: "Active", joined: "Nov 2023" },
  { name: "Eva Rossi", role: "Product Manager", department: "Product", status: "Inactive", joined: "Feb 2020" },
  { name: "Frank Müller", role: "Data Scientist", department: "Analytics", status: "Active", joined: "Sep 2022" },
];

const statusBadge = (status: string) => {
  const colors: Record<string, string> = {
    Active: "bg-green-100 text-green-700",
    Inactive: "bg-gray-100 text-gray-500",
    "On Leave": "bg-amber-100 text-amber-700",
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${colors[status] ?? "bg-gray-100 text-gray-500"}`}>
      {status}
    </span>
  );
};

const richData: TableProps["data"] = data.map((row) => ({
  ...row,
  status: statusBadge(row.status as string),
}));

type SortState = Record<string, "asc" | "desc">;

function ControlledTable(
  props: Omit<React.ComponentProps<typeof Table>, "applySort" | "onPageChange" | "currentPage" | "totalPages" | "headings"> & {
    initialPage?: number;
    pageSize?: number;
    sourceData?: TableProps["data"];
    sourceHeadings?: TableProps["headings"];
  }
) {
  const {
    initialPage = 1,
    pageSize = 3,
    sourceData = data,
    sourceHeadings = headings,
    ...rest
  } = props;

  const [page, setPage] = useState(initialPage);
  const [sorts, setSorts] = useState<SortState>({});

  const totalPages = Math.ceil(sourceData.length / pageSize);
  const slicedData = sourceData.slice((page - 1) * pageSize, page * pageSize);

  const currentHeadings: TableProps["headings"] = sourceHeadings.map((h) => ({
    ...h,
    sort: sorts[h.key] ?? h.sort,
  }));

  return (
    <Table
      {...rest}
      headings={currentHeadings}
      data={slicedData}
      currentPage={page}
      totalPages={totalPages}
      onPageChange={setPage}
      applySort={(key, dir) => setSorts((prev) => ({ ...prev, [key]: dir }))}
    />
  );
}

export const Default: Story = {
  name: "Default",
  render: (args) => (
    <div className="w-full rounded-xl bg-white p-6 shadow-sm">
      <ControlledTable {...args} />
    </div>
  ),
  args: {
    variant: "surface",
    size: "md",
    animationVariant: "fade",
    showStripes: true,
    showBorders: true,
    showHoverEffects: true,
    glow: false,
  },
};

export const RichCellContent: Story = {
  name: "Rich cell content – status badges",
  render: (args) => (
    <div className="w-full rounded-xl bg-white p-6 shadow-sm">
      <ControlledTable {...args} sourceData={richData} />
    </div>
  ),
  args: {
    variant: "surface",
    size: "md",
    animationVariant: "fade",
    showStripes: true,
    showBorders: true,
    showHoverEffects: true,
    glow: false,
  },
};

export const AnimationVariants: Story = {
  name: "Animation variants",
  render: (args) => (
    <div className="w-full rounded-xl bg-white p-6 shadow-sm">
      <div className="mb-3 flex items-center gap-2">
        <span className="rounded-full bg-violet-100 px-2.5 py-0.5 text-xs font-medium text-violet-700">
          animationVariant = {args.animationVariant ?? "fade"}
        </span>
      </div>
      <ControlledTable {...args} />
    </div>
  ),
  args: {
    animationVariant: "slide",
    size: "md",
    showStripes: true,
  },
};

export const GhostVariant: Story = {
  name: "Ghost variant",
  render: (args) => (
    <div className="w-full rounded-xl border border-gray-200 bg-gray-50 p-6">
      <p className="mb-4 text-xs text-gray-400">
        The table has <code className="rounded bg-gray-100 px-1 py-0.5 text-gray-600">variant="ghost"</code> — the card border comes from the parent.
      </p>
      <ControlledTable {...args} />
    </div>
  ),
  args: {
    variant: "ghost",
    size: "md",
    showStripes: true,
    showBorders: false,
  },
};

export const Minimal: Story = {
  name: "Minimal",
  render: (args) => (
    <div className="w-full rounded-xl bg-white p-6 shadow-sm">
      <ControlledTable {...args} />
    </div>
  ),
  args: {
    variant: "surface",
    size: "md",
    showStripes: false,
    showBorders: false,
    showHoverEffects: true,
  },
};

export const GlowEffect: Story = {
  name: "Glow effect",
  render: (args) => (
    <div className="w-full rounded-xl bg-gray-950 p-8">
      <ControlledTable {...args} />
    </div>
  ),
  args: {
    variant: "surface",
    size: "md",
    glow: true,
    showStripes: true,
    showBorders: true,
    showHoverEffects: true,
  },
};

export const EmptyState: Story = {
  name: "Empty state",
  render: (args) => (
    <div className="w-full rounded-xl bg-white p-6 shadow-sm">
      <Table
        {...args}
        headings={headings}
        data={[]}
        currentPage={1}
        totalPages={1}
        applySort={noop}
        onPageChange={noop}
      />
      <div className="mt-4 flex flex-col items-center gap-2 py-8 text-center">
        <p className="text-sm font-medium text-gray-600">No records found</p>
        <p className="text-xs text-gray-400">Try adjusting your filters or adding new data.</p>
      </div>
    </div>
  ),
  args: {
    variant: "surface",
    size: "md",
  },
};

export const SinglePage: Story = {
  name: "Single page",
  render: (args) => (
    <div className="w-full rounded-xl bg-white p-6 shadow-sm"> 
      <Table
        {...args}
        headings={headings}
        data={data.slice(0, 2)}
        currentPage={1}
        totalPages={1}
        applySort={noop}
        onPageChange={noop}
      />
    </div>
  ),
  args: {
    variant: "surface",
    size: "md",
    showStripes: true,
    showBorders: true,
  },
};

export const LargeDataset: Story = {
  name: "Large dataset",
  render: (args) => {
    const bigData: TableProps["data"] = Array.from({ length: 50 }, (_, i) => ({
      name: `User ${String(i + 1).padStart(2, "0")}`,
      role: ["Engineer", "Designer", "Manager", "PM", "Analyst"][i % 5],
      department: ["Product", "Platform", "Design", "Data", "Infra"][i % 5],
      status: i % 4 === 0 ? "Inactive" : "Active",
      joined: `${["Jan", "Apr", "Jul", "Oct"][i % 4]} ${2019 + (i % 5)}`,
    }));

    return (
      <div className="w-full rounded-xl bg-white p-6 shadow-sm">
        <ControlledTable {...args} sourceData={bigData} pageSize={5} />
      </div>
    );
  },
  args: {
    variant: "surface",
    size: "md",
    showStripes: true,
    showBorders: true,
    showHoverEffects: true,
    animationVariant: "fade",
  },
};
