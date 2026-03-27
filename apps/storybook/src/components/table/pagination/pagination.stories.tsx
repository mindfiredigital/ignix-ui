import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Pagination } from "../pagination/index";

const meta: Meta<typeof Pagination> = {
  title: "Components/Table/Pagination",
  component: Pagination,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
A fully accessible, keyboard-navigable pagination component that supports:
- **Smart ellipsis** - collapses distant page ranges into "…" to keep the UI compact.
- **Sibling control** - tune how many page numbers appear around the active page via \`siblingCount\`.
- **Navigation shortcuts** - jump directly to the first or last page.
- **Aria compliant** - \`aria-label\` on nav buttons and \`aria-current="page"\` on the active page.
        `,
      },
    },
  },
  argTypes: {
    currentPage: {
      control: { type: "number", min: 1 },
    },
    totalPages: {
      control: { type: "number", min: 2 },
    },
    siblingCount: {
      control: { type: "number", min: 0, max: 4 },
    },
    onPageChange: {
      action: "page changed",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Pagination>;

function ControlledPagination(props: React.ComponentProps<typeof Pagination>) {
  const [page, setPage] = useState(props.currentPage);
  return (
    <Pagination
      {...props}
      currentPage={page}
      onPageChange={(p) => {
        setPage(p);
        props.onPageChange(p);
      }}
    />
  );
}

export const Default: Story = {
  name: "Default",
  render: (args) => (
    <div className="flex min-h-24 w-full min-w-96 flex-col items-center justify-center rounded-xl bg-white p-8 shadow-sm">
      <ControlledPagination {...args} />
    </div>
  ),
  args: {
    currentPage: 1,
    totalPages: 10,
    siblingCount: 1,
  },
};

export const MiddlePage: Story = {
  name: "Middle page",
  render: (args) => (
    <div className="flex min-h-24 w-full min-w-96 flex-col items-center justify-center rounded-xl bg-white p-8 shadow-sm">
      <ControlledPagination {...args} />
    </div>
  ),
  args: {
    currentPage: 10,
    totalPages: 20,
    siblingCount: 1,
  },
};

export const LastPage: Story = {
  name: "Last page",
  render: (args) => (
    <div className="flex min-h-24 w-full min-w-96 flex-col items-center justify-center rounded-xl bg-white p-8 shadow-sm">
      <ControlledPagination {...args} />
    </div>
  ),
  args: {
    currentPage: 20,
    totalPages: 20,
    siblingCount: 1,
  },
};

export const TwoPages: Story = {
  name: "Minimal",
  render: (args) => (
    <div className="flex min-h-24 w-full min-w-96 flex-col items-center justify-center rounded-xl bg-white p-8 shadow-sm">
      <ControlledPagination {...args} />
    </div>
  ),
  args: {
    currentPage: 1,
    totalPages: 2,
    siblingCount: 1,
  },
};

export const NoEllipsis: Story = {
  name: "No ellipsis",
  render: (args) => (
    <div className="flex min-h-24 w-full min-w-96 flex-col items-center justify-center rounded-xl bg-white p-8 shadow-sm">
      <ControlledPagination {...args} />
    </div>
  ),
  args: {
    currentPage: 3,
    totalPages: 6,
    siblingCount: 1,
  },
};

export const WiderSiblingCount: Story = {
  name: "siblingCount=2",
  render: (args) => (
    <div className="flex min-h-24 w-full min-w-[32rem] flex-col items-center justify-center rounded-xl bg-white p-8 shadow-sm">
      <div className="mb-3 flex items-center gap-2">
        <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700">
          siblingCount = 2
        </span>
      </div>
      <ControlledPagination {...args} />
    </div>
  ),
  args: {
    currentPage: 10,
    totalPages: 20,
    siblingCount: 2,
  },
};

export const NarrowSiblingCount: Story = {
  name: "siblingCount=0",
  render: (args) => (
    <div className="flex min-h-24 w-full min-w-96 flex-col items-center justify-center rounded-xl bg-white p-8 shadow-sm">
      <div className="mb-3 flex items-center gap-2">
        <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700">
          siblingCount = 0
        </span>
      </div>
      <ControlledPagination {...args} />
    </div>
  ),
  args: {
    currentPage: 10,
    totalPages: 20,
    siblingCount: 0,
  },
};

export const LargePageCount: Story = {
  name: "Large dataset",
  render: (args) => (
    <div className="flex min-h-24 w-full min-w-96 flex-col items-center justify-center rounded-xl bg-white p-8 shadow-sm">
      <ControlledPagination {...args} />
    </div>
  ),
  args: {
    currentPage: 50,
    totalPages: 100,
    siblingCount: 1,
  },
};

export const NearStart: Story = {
  name: "Near start",
  render: (args) => (
    <div className="flex min-h-24 w-full min-w-96 flex-col items-center justify-center rounded-xl bg-white p-8 shadow-sm">
      <ControlledPagination {...args} />
    </div>
  ),
  args: {
    currentPage: 2,
    totalPages: 20,
    siblingCount: 1,
  },
};

export const NearEnd: Story = {
  name: "Near end",
  render: (args) => (
    <div className="flex min-h-24 w-full min-w-96 flex-col items-center justify-center rounded-xl bg-white p-8 shadow-sm">
      <ControlledPagination {...args} />
    </div>
  ),
  args: {
    currentPage: 19,
    totalPages: 20,
    siblingCount: 1,
  },
};

export const SiblingCountComparison: Story = {
  name: "Comparison – siblingCount variants",
  render: () => {
    const [pages, setPages] = useState({ s0: 10, s1: 10, s2: 10 });
    return (
      <div className="flex w-full min-w-[36rem] flex-col gap-6 rounded-xl bg-white p-8 shadow-sm">
        {(
          [
            { key: "s0", label: "siblingCount = 0", count: 0, badge: "bg-amber-100 text-amber-700" },
            { key: "s1", label: "siblingCount = 1", count: 1, badge: "bg-blue-100 text-blue-700" },
            { key: "s2", label: "siblingCount = 2", count: 2, badge: "bg-green-100 text-green-700" },
          ] as const
        ).map(({ key, label, count, badge }, i, arr) => (
          <div key={key} className="flex flex-col gap-2">
            <span className={`self-start rounded-full px-2.5 py-0.5 text-xs font-medium ${badge}`}>
              {label}
            </span>
            <Pagination
              currentPage={pages[key]}
              totalPages={20}
              siblingCount={count}
              onPageChange={(p) => setPages((prev) => ({ ...prev, [key]: p }))}
            />
            {i < arr.length - 1 && <div className="h-px bg-gray-100" />}
          </div>
        ))}
      </div>
    );
  },
  args: {},
};
