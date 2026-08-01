// DataTable.stories.tsx
import type { Meta, StoryObj } from '@storybook/react-vite';
import { DataTable } from './';
import type { Column, BulkAction } from './';
import {
  PersonIcon,
  BackpackIcon,
  CalendarIcon,
  TrashIcon,
  DownloadIcon,
  EnvelopeClosedIcon,
  StarFilledIcon,
  BadgeIcon
} from "@radix-ui/react-icons";
import { Avatar } from '../../../../components/avatar';

/* ============================================
   META
============================================ */

const meta: Meta<typeof DataTable> = {
  title: 'Templates/Pages/DataManagement/DataTable',
  component: DataTable,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A production-grade, reusable Data Table component with sorting, filtering, pagination, ' +
          'column visibility, row selection, bulk actions, and smooth animations. ' +
          'Built with TypeScript, Framer Motion, and Radix UI for accessibility.',
      },
    },
  },
  argTypes: {
    enableRowSelection: {
      control: 'boolean',
      description: 'Enable checkbox selection for rows',
      table: { defaultValue: { summary: 'true' } },
    },
    loading: {
      control: 'boolean',
      description: 'Show loading skeleton state',
      table: { defaultValue: { summary: 'false' } },
    },
    defaultPageSize: {
      control: 'number',
      description: 'Initial number of rows per page',
      table: { defaultValue: { summary: '5' } },
    },
    emptyStateMessage: {
      control: 'text',
      description: 'Message shown when no data is available',
      table: { defaultValue: { summary: 'No data available.' } },
    },
    noResultsMessage: {
      control: 'text',
      description: 'Message shown when search returns no results',
      table: { defaultValue: { summary: 'No results found.' } },
    },
  },
};

export default meta;
type Story = StoryObj<typeof DataTable>;

/* ============================================
   SAMPLE DATA & COLUMNS
============================================ */

// Basic employee data
interface Employee {
  id: number;
  name: string;
  department: string;
  role: string;
  status: 'Active' | 'Pending' | 'Inactive';
  salary: number;
  joinDate: string;
  email: string;
  performance: number;
}

const employees: Employee[] = [
  { id: 1, name: 'Alice Johnson', department: 'Engineering', role: 'Senior Engineer', status: 'Active', salary: 142000, joinDate: 'Nov 1, 2019', email: 'alice@company.com', performance: 4.8 },
  { id: 2, name: 'Bob Martinez', department: 'Design', role: 'Lead Designer', status: 'Active', salary: 128000, joinDate: 'Jan 10, 2023', email: 'bob@company.com', performance: 4.5 },
  { id: 3, name: 'Carol White', department: 'Product', role: 'Product Manager', status: 'Active', salary: 138000, joinDate: 'May 18, 2022', email: 'carol@company.com', performance: 4.9 },
  { id: 4, name: 'David Chen', department: 'Engineering', role: 'Staff Engineer', status: 'Pending', salary: 165000, joinDate: 'Mar 5, 2021', email: 'david@company.com', performance: 4.7 },
  { id: 5, name: 'Eva Müller', department: 'Marketing', role: 'Growth Lead', status: 'Active', salary: 115000, joinDate: 'Aug 22, 2020', email: 'eva@company.com', performance: 4.6 },
  { id: 6, name: 'Frank Williams', department: 'Sales', role: 'Account Executive', status: 'Active', salary: 95000, joinDate: 'Feb 14, 2023', email: 'frank@company.com', performance: 4.2 },
  { id: 7, name: 'Grace Lee', department: 'Engineering', role: 'Frontend Developer', status: 'Active', salary: 108000, joinDate: 'Sep 30, 2022', email: 'grace@company.com', performance: 4.4 },
  { id: 8, name: 'Henry Davis', department: 'HR', role: 'HR Manager', status: 'Inactive', salary: 85000, joinDate: 'Dec 1, 2020', email: 'henry@company.com', performance: 3.9 },
  { id: 9, name: 'Irene Kim', department: 'Product', role: 'Product Designer', status: 'Active', salary: 98000, joinDate: 'Apr 12, 2023', email: 'irene@company.com', performance: 4.3 },
  { id: 10, name: 'Jack Wilson', department: 'Engineering', role: 'Backend Developer', status: 'Pending', salary: 112000, joinDate: 'Jun 7, 2022', email: 'jack@company.com', performance: 4.1 },
  { id: 11, name: 'Kelly Brown', department: 'Marketing', role: 'Content Strategist', status: 'Active', salary: 82000, joinDate: 'Jul 19, 2023', email: 'kelly@company.com', performance: 4.0 },
  { id: 12, name: 'Liam Garcia', department: 'Sales', role: 'Sales Manager', status: 'Active', salary: 125000, joinDate: 'Oct 3, 2021', email: 'liam@company.com', performance: 4.6 },
];

// Product data for second example
interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  rating: number;
  inStock: boolean;
}

const products: Product[] = [
  { id: 'P001', name: 'Wireless Headphones', category: 'Electronics', price: 99.99, stock: 45, rating: 4.5, inStock: true },
  { id: 'P002', name: 'Smart Watch', category: 'Electronics', price: 199.99, stock: 12, rating: 4.7, inStock: true },
  { id: 'P003', name: 'Desk Lamp', category: 'Home', price: 49.99, stock: 0, rating: 4.2, inStock: false },
  { id: 'P004', name: 'Coffee Mug', category: 'Kitchen', price: 12.99, stock: 120, rating: 4.8, inStock: true },
  { id: 'P005', name: 'Backpack', category: 'Accessories', price: 79.99, stock: 8, rating: 4.4, inStock: true },
];

// Column definitions - using as const to help with type inference
const employeeColumns: Column<Employee>[] = [
  {
    key: 'name',
    title: 'Name',
    sortable: true,
    render: (_value: any, row: Employee) => (
      <div className="flex items-center gap-2">
        <Avatar
        size="sm"
        letters={row.name.split(' ').map(n => n[0]).join('')}
        />
        <div className="flex-1 min-w-0">
          <div className="font-medium text-gray-900">{row.name}</div>
          <div className="text-xs text-gray-500">{row.email}</div>
        </div>
      </div>
    )
  },
  { key: 'department', title: 'Department', sortable: true },
  { key: 'role', title: 'Role', sortable: true },
  {
    key: 'status',
    title: 'Status',
    sortable: true,
    render: (value: any) => {
      const statusColors = {
        Active: 'bg-green-100 text-green-800',
        Pending: 'bg-yellow-100 text-yellow-800',
        Inactive: 'bg-gray-100 text-gray-800'
      };
      return (
        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${statusColors[value as keyof typeof statusColors]}`}>
          {String(value)}
        </span>
      );
    }
  },
  {
    key: 'salary',
    title: 'Salary',
    sortable: true,
    render: (value: any) => (
      <span className="font-medium text-gray-900">
        ${Number(value).toLocaleString()}
      </span>
    )
  },
  { key: 'joinDate', title: 'Join Date', sortable: true },
  {
    key: 'performance',
    title: 'Rating',
    sortable: true,
    render: (value: any) => (
      <div className="flex items-center gap-1">
        <StarFilledIcon className="w-4 h-4 fill-yellow-400 text-yellow-400" />
        <span className="text-sm font-medium">{Number(value).toFixed(1)}</span>
      </div>
    )
  },
];

const productColumns: Column<Product>[] = [
  { key: 'id', title: 'SKU', sortable: true },
  { key: 'name', title: 'Product Name', sortable: true },
  { key: 'category', title: 'Category', sortable: true },
  {
    key: 'price',
    title: 'Price',
    sortable: true,
    render: (value: any) => `$${Number(value).toFixed(2)}`
  },
  {
    key: 'stock',
    title: 'Stock',
    sortable: true,
    render: (value: any) => (
      <span className={Number(value) === 0 ? 'text-red-600 font-medium' : 'text-gray-700'}>
        {Number(value)}
      </span>
    )
  },
  {
    key: 'rating',
    title: 'Rating',
    sortable: true,
    render: (value: any) => (
      <div className="flex items-center gap-1">
        <StarFilledIcon className="w-4 h-4 fill-yellow-400 text-yellow-400" />
        <span>{Number(value).toFixed(1)}</span>
      </div>
    )
  },
  {
    key: 'inStock',
    title: 'Availability',
    sortable: true,
    render: (value: any) => (
      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
        {value ? 'In Stock' : 'Out of Stock'}
      </span>
    )
  },
];

// Bulk actions
const deleteAction: BulkAction<Employee> = {
  label: 'Delete',
  icon: <TrashIcon className="w-4 h-4" />,
  variant: 'destructive',
  onClick: (selectedRows) => {
    console.log('Delete employees:', selectedRows);
    alert(`Deleted ${selectedRows.length} employee(s). Check console for details.`);
  },
};

const exportAction: BulkAction<Employee> = {
  label: 'Export CSV',
  icon: <DownloadIcon className="w-4 h-4" />,
  variant: 'default',
  onClick: (selectedRows) => {
    console.log('Export employees:', selectedRows);
    alert(`Exported ${selectedRows.length} employee(s). Check console for details.`);
  },
};

const emailAction: BulkAction<Employee> = {
  label: 'Send Email',
  icon: <EnvelopeClosedIcon className="w-4 h-4" />,
  variant: 'default',
  onClick: (selectedRows) => {
    const emails = selectedRows.map(row => row.email).join(', ');
    alert(`Sending email to: ${emails}`);
  },
};

const handleSubmit = (action: string, data: any) => {
  console.log(`[DataTable] ${action}:`, data);
};

/* ============================================
  STORIES - Using render functions to maintain type safety
============================================ */

/**
 * Default — complete employee directory with all features enabled.
 */
export const Default: Story = {
  render: () => (
    <DataTable
      data={employees}
      columns={employeeColumns}
      keyExtractor={(row) => row.id}
      enableRowSelection={true}
      bulkActions={[deleteAction, exportAction, emailAction]}
      defaultPageSize={5}
      pageSizeOptions={[5, 10, 25]}
      emptyStateMessage="No employees found."
      noResultsMessage="No employees match your search."
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Complete employee directory with sorting, filtering, pagination, row selection, and bulk actions.',
      },
    },
  },
};

/**
 * Product Catalog — different data structure with custom rendering.
 */
export const ProductCatalog: Story = {
  render: () => (
    <DataTable
      data={products}
      columns={productColumns}
      keyExtractor={(row) => row.id}
      enableRowSelection={true}
      bulkActions={[
        {
          label: 'Export',
          icon: <DownloadIcon className="w-4 h-4" />,
          onClick: (rows) => handleSubmit('export', rows),
        },
      ]}
      defaultPageSize={5}
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Product catalog showcasing different data types, custom renderers, and stock indicators.',
      },
    },
  },
};

/**
 * Loading State — shows skeleton loader while data is being fetched.
 */
export const LoadingState: Story = {
  render: () => (
    <DataTable
      data={[]}
      columns={employeeColumns}
      keyExtractor={(row) => row.id}
      loading={true}
      enableRowSelection={true}
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Loading state displayed while data is being fetched asynchronously.',
      },
    },
  },
};

/**
 * Empty State — no data available.
 */
export const EmptyState: Story = {
  render: () => (
    <DataTable
      data={[]}
      columns={employeeColumns}
      keyExtractor={(row) => row.id}
      emptyStateMessage="No employees found. Add your first team member."
      enableRowSelection={true}
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Empty state displayed when there is no data to show.',
      },
    },
  },
};

/**
 * Without Row Selection — disables checkbox selection.
 */
export const WithoutRowSelection: Story = {
  render: () => (
    <DataTable
      data={employees}
      columns={employeeColumns}
      keyExtractor={(row) => row.id}
      enableRowSelection={false}
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Table variant without row selection checkboxes — useful for read-only views.',
      },
    },
  },
};

/**
 * Custom Page Sizes — different pagination options.
 */
export const CustomPageSizes: Story = {
  render: () => (
    <DataTable
      data={employees}
      columns={employeeColumns}
      keyExtractor={(row) => row.id}
      pageSizeOptions={[10, 25, 50, 100]}
      defaultPageSize={10}
      enableRowSelection={true}
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Custom page size options for different viewing preferences.',
      },
    },
  },
};

/**
 * Large Dataset — demonstrates performance with more rows.
 */
export const LargeDataset: Story = {
  render: () => {
    const largeDataset = [...Array(50)].map((_, i) => ({
      id: i + 1,
      name: `Employee ${i + 1}`,
      department: ['Engineering', 'Design', 'Product', 'Marketing', 'Sales'][i % 5],
      role: ['Developer', 'Designer', 'Manager', 'Lead', 'Associate'][i % 5],
      status: ['Active', 'Pending', 'Inactive'][i % 3] as 'Active' | 'Pending' | 'Inactive',
      salary: 80000 + (i * 1000),
      joinDate: `Jan ${(i % 28) + 1}, 202${i % 3}`,
      email: `employee${i + 1}@company.com`,
      performance: 3 + (i % 20) / 10,
    }));

    return (
      <DataTable
        data={largeDataset}
        columns={employeeColumns}
        keyExtractor={(row) => row.id}
        defaultPageSize={10}
        enableRowSelection={true}
      />
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Performance test with 50+ rows to demonstrate smooth scrolling and pagination.',
      },
    },
  },
};

/**
 * Custom Bulk Actions — demonstrates different action configurations.
 */
export const CustomBulkActions: Story = {
  render: () => (
    <DataTable
      data={employees}
      columns={employeeColumns}
      keyExtractor={(row) => row.id}
      bulkActions={[
        {
          label: 'Archive',
          icon: <BadgeIcon className="w-4 h-4" />,
          variant: 'default',
          onClick: (rows) => alert(`Archived ${rows.length} employee(s)`),
        },
        {
          label: 'Promote',
          icon: <StarFilledIcon className="w-4 h-4" />,
          variant: 'default',
          onClick: (rows) => alert(`Promoted ${rows.length} employee(s)`),
        },
        {
          label: 'Delete',
          icon: <TrashIcon className="w-4 h-4" />,
          variant: 'destructive',
          onClick: (rows) => alert(`Deleted ${rows.length} employee(s)`),
        },
      ]}
      enableRowSelection={true}
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Custom bulk action buttons with different variants and icons.',
      },
    },
  },
};

/**
 * Interactive Demo — with console logging for debugging.
 */
export const InteractiveDemo: Story = {
  render: () => (
    <DataTable
      data={employees}
      columns={employeeColumns}
      keyExtractor={(row) => row.id}
      bulkActions={[
        {
          label: 'Log Selection',
          icon: <PersonIcon className="w-4 h-4" />,
          onClick: (rows) => {
            console.table(rows);
            alert(`Selected ${rows.length} employee(s). Check console for details.`);
          },
        },
      ]}
      enableRowSelection={true}
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Interactive demo with console logging — great for testing selection and action callbacks.',
      },
    },
  },
};

/**
 * Custom Renderers — demonstrates advanced cell rendering.
 */
export const CustomRenderers: Story = {
  render: () => {
    const customColumns: Column<Employee>[] = [
      {
        key: 'name',
        title: 'Team Member',
        sortable: true,
        render: (_, row) => (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-white font-bold">
              {row.name.charAt(0)}
            </div>
            <div>
              <div className="font-semibold">{row.name}</div>
              <div className="text-xs text-gray-500">{row.role}</div>
            </div>
          </div>
        )
      },
      {
        key: 'department',
        title: 'Dept',
        sortable: true,
        render: (value) => (
          <div className="flex items-center gap-2">
            <BackpackIcon className="w-4 h-4 text-gray-400" />
            <span>{String(value)}</span>
          </div>
        )
      },
      {
        key: 'salary',
        title: 'Compensation',
        sortable: true,
        render: (value) => (
          <div className="font-mono text-sm">
            ${Number(value).toLocaleString()}
          </div>
        )
      },
      {
        key: 'joinDate',
        title: 'Start Date',
        sortable: true,
        render: (value) => (
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-gray-400" />
            <span>{String(value)}</span>
          </div>
        )
      },
      {
        key: 'status',
        title: 'Badge',
        sortable: true,
        render: (value) => (
          <div className={`w-2 h-2 rounded-full ${value === 'Active' ? 'bg-green-500' : value === 'Pending' ? 'bg-yellow-500' : 'bg-gray-500'}`} />
        )
      },
    ];

    return (
      <DataTable
        data={employees.slice(0, 5)}
        columns={customColumns}
        keyExtractor={(row) => row.id}
        enableRowSelection={false}
      />
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Advanced custom cell renderers with icons, avatars, and custom formatting.',
      },
    },
  },
};