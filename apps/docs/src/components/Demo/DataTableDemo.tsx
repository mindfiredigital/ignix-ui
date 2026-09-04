import React, { useEffect, useState } from 'react';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';
import { DataTable, Column, BulkAction } from '../UI/data-table';
import { useColorMode } from '@docusaurus/theme-common';
import { DownloadIcon, TrashIcon } from '@radix-ui/react-icons';
import { Avatar } from '../UI/avatar';


interface Employee {
  id: number;
  name: string;
  email: string;
  department: string;
  role: string;
  status: 'active' | 'inactive' | 'pending';
  salary: number;
  joinDate: string;
}

const EMPLOYEES: Employee[] = [
  { id: 1,  name: 'Alice Johnson',  email: 'alice@acme.co',    department: 'Engineering', role: 'Senior Engineer',   status: 'active',   salary: 142000, joinDate: '2021-03-15' },
  { id: 2,  name: 'Bob Martinez',   email: 'bob@acme.co',      department: 'Design',      role: 'Lead Designer',     status: 'active',   salary: 128000, joinDate: '2020-07-22' },
  { id: 3,  name: 'Carol White',    email: 'carol@acme.co',    department: 'Product',     role: 'Product Manager',   status: 'active',   salary: 138000, joinDate: '2019-11-01' },
  { id: 4,  name: 'David Chen',     email: 'david@acme.co',    department: 'Engineering', role: 'Staff Engineer',    status: 'pending',  salary: 165000, joinDate: '2023-01-10' },
  { id: 5,  name: 'Eva Müller',     email: 'eva@acme.co',      department: 'Marketing',   role: 'Growth Lead',       status: 'active',   salary: 115000, joinDate: '2022-05-18' },
  { id: 6,  name: 'Frank Okafor',   email: 'frank@acme.co',    department: 'Sales',       role: 'Account Executive', status: 'inactive', salary: 98000,  joinDate: '2021-08-03' },
  { id: 7,  name: 'Grace Kim',      email: 'grace@acme.co',    department: 'Engineering', role: 'Frontend Engineer', status: 'active',   salary: 125000, joinDate: '2022-09-12' },
  { id: 8,  name: 'Hiro Tanaka',    email: 'hiro@acme.co',     department: 'Data',        role: 'Data Scientist',    status: 'active',   salary: 148000, joinDate: '2020-02-29' },
  { id: 9,  name: 'Isabelle Roy',   email: 'isabelle@acme.co', department: 'Legal',       role: 'General Counsel',   status: 'active',   salary: 175000, joinDate: '2018-06-01' },
  { id: 10, name: 'James Park',     email: 'james@acme.co',    department: 'Engineering', role: 'DevOps Engineer',   status: 'pending',  salary: 132000, joinDate: '2023-04-15' },
  { id: 11, name: 'Keisha Brown',   email: 'keisha@acme.co',   department: 'HR',          role: 'HR Manager',        status: 'active',   salary: 119000, joinDate: '2020-10-07' },
  { id: 12, name: 'Luca Ricci',     email: 'luca@acme.co',     department: 'Finance',     role: 'Financial Analyst', status: 'active',   salary: 112000, joinDate: '2021-06-20' },
];

const STATUS_STYLES: Record<Employee['status'], string> = {
  active:   'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20',
  inactive: 'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground border border-border',
  pending:  'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground border border-border',
};

const columns: Column<Employee>[] = [
  {
    key: 'name',
    title: 'Name',
    sortable: true,
    render: (_, row) => (
      <div className="flex items-center gap-2.5">
        <Avatar
          size="sm"
          letters={row.name.split(' ').map(n => n[0]).join('')}
        />
        <div>
          <div className="font-medium text-foreground text-sm">{row.name}</div>
          <div className="text-xs text-muted-foreground">{row.email}</div>
        </div>
      </div>
    ),
  },
  { key: 'department', title: 'Department', sortable: true },
  { key: 'role',       title: 'Role',       sortable: true },
  {
    key: 'status',
    title: 'Status',
    sortable: true,
    render: (value) => (
      <span className={STATUS_STYLES[value as Employee['status']]}>
        <span className={`w-1.5 h-1.5 rounded-full ${value === 'active' ? 'bg-primary' : value === 'pending' ? 'bg-secondary-foreground/60' : 'bg-muted-foreground'}`} />
        {String(value)}
      </span>
    ),
  },
  {
    key: 'salary',
    title: 'Salary',
    sortable: true,
    align: 'left',
    render: (value: unknown): React.ReactNode => (
      <span className="font-mono text-sm">${(value as number).toLocaleString()}</span>
    ),
  },
  {
    key: 'joinDate',
    title: 'Joined',
    sortable: true,
    render: (value) =>
      new Date(value as string).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
  },
];

const bulkActions: BulkAction<Employee>[] = [
  {
    label: 'Delete',
    icon: <TrashIcon className="w-4 h-4" />,
    variant: 'destructive',
    onClick: (rows) => alert(`Delete ${rows.length} employee(s): ${rows.map((r) => r.name).join(', ')}`),
  },
  {
    label: 'Export CSV',
    variant: 'destructive',
    icon: <DownloadIcon className="w-4 h-4" />,
    onClick: (rows) => {
      const csv = [
        ['Name', 'Email', 'Department', 'Role', 'Status', 'Salary', 'Joined'].join(','),
        ...rows.map((r) =>
          [r.name, r.email, r.department, r.role, r.status, r.salary, r.joinDate].join(',')
        ),
      ].join('\n');
      const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
      Object.assign(document.createElement('a'), { href: url, download: 'employees.csv' }).click();
      URL.revokeObjectURL(url);
    },
  },
];

export const DataTableDemo = () => {
  const { colorMode } = useColorMode();
  const [enableRowSelection, setEnableRowSelection] = useState(true);
  const [loading, setLoading] = useState(false);
  const [emptyState, setEmptyState] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    setTheme(colorMode === 'dark' ? 'dark' : 'light');
  }, [colorMode]);

  const generateCodeString = () => `
  import { DataTable, Column, BulkAction } from '@ignix-ui/data-table';
  import { Avatar } from '../UI/avatar';
  import { DownloadIcon, TrashIcon } from '@radix-ui/react-icons';
  
  interface Employee {
    id: number;
    name: string;
    email: string;
    department: string;
    role: string;
    status: 'active' | 'inactive' | 'pending';
    salary: number;
    joinDate: string;
  }
  
  const STATUS_STYLES: Record<Employee['status'], string> = {
    active:   'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20',
    inactive: 'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground border border-border',
    pending:  'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground border border-border',
  };
  
  const columns: Column<Employee>[] = [
    {
      key: 'name',
      title: 'Name',
      sortable: true,
      render: (_, row) => (
        <div className="flex items-center gap-2.5">
          <Avatar
            size="sm"
            letters={row.name.split(' ').map(n => n[0]).join('')}
          />
          <div>
            <div className="font-medium text-foreground text-sm">{row.name}</div>
            <div className="text-xs text-muted-foreground">{row.email}</div>
          </div>
        </div>
      ),
    },
    { key: 'department', title: 'Department', sortable: true },
    { key: 'role',       title: 'Role',       sortable: true },
    {
      key: 'status',
      title: 'Status',
      sortable: true,
      render: (value) => (
        <span className={STATUS_STYLES[value as Employee['status']]}>
          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
          {String(value)}
        </span>
      ),
    },
    {
      key: 'salary',
      title: 'Salary',
      sortable: true,
      render: (value) => (
        <span className="font-mono text-sm">
          \${value?.toLocaleString()}
        </span>
      ),
    },
    {
      key: 'joinDate',
      title: 'Joined',
      sortable: true,
      render: (value) =>
        new Date(value as string).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        }),
    },
  ];
  
  const bulkActions: BulkAction<Employee>[] = [
    {
      label: 'Delete',
      icon: <TrashIcon className="w-4 h-4" />,
      variant: 'destructive',
      onClick: (rows) => {
        console.log('Deleting:', rows);
      },
    },
    {
      label: 'Export CSV',
      variant: 'destructive',
      icon: <DownloadIcon className="w-4 h-4" />,
      onClick: (rows) => {
        const csv = [
          ['Name', 'Email', 'Department', 'Role', 'Status', 'Salary', 'Joined'].join(','),
          ...rows.map((r) =>
            [r.name, r.email, r.department, r.role, r.status, r.salary, r.joinDate].join(',')
          ),
        ].join('\\n');
        const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
        Object.assign(document.createElement('a'), {
          href: url,
          download: 'employees.csv',
        }).click();
        URL.revokeObjectURL(url);
      },
    },
  ];
  
  <DataTable<Employee>
    data={employees}
    columns={columns}
    keyExtractor={(row) => row.id}
    theme="${theme}"
    enableRowSelection={${enableRowSelection}}
    loading={${loading}}
    defaultPageSize={5}
    pageSizeOptions={[5, 10, 25, 50]}
    bulkActions={bulkActions}
    emptyStateMessage="No employees found."
    noResultsMessage="No results match your search."
    onRowClick={(row) => console.log('clicked', row)}
  />
  `;

  const preview = (
    <DataTable
      key={`${enableRowSelection}-${loading}`}
      data={(loading || emptyState) ? [] : EMPLOYEES}
      columns={columns}
      keyExtractor={(row) => row.id}
      theme={theme}
      enableRowSelection={enableRowSelection}
      loading={loading}
      defaultPageSize={5}
      pageSizeOptions={[5, 10, 25, 50]}
      bulkActions={bulkActions}
      emptyStateMessage="No employees found."
      noResultsMessage="No results match your search query."
      onRowClick={(row) => console.log('[DataTable] row click', row)}
    />
  );

  return (
    <div className="space-y-6 mb-8">
      {/* Feature toggles */}
      <div className="flex flex-wrap gap-4 justify-start sm:justify-end">
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={enableRowSelection}
              onChange={(e) => setEnableRowSelection(e.target.checked)}
              className="rounded"
            />
            <span className="text-sm">Row Selection</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={loading}
              onChange={(e) => setLoading(e.target.checked)}
              className="rounded"
            />
            <span className="text-sm">Loading State</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={emptyState}
              onChange={(e) => setEmptyState(e.target.checked)}
              className="rounded"
            />
            <span className="text-sm">Empty State</span>
          </label>
        </div>
      </div>

      {/* Preview + Code tabs */}
      <Tabs>
        <TabItem value="preview" label="Preview">
          <div className="border border-gray-300 rounded-lg overflow-hidden">
            <div className="p-3">{preview}</div>
          </div>
        </TabItem>
        <TabItem value="code" label="Code">
          <CodeBlock language="tsx">{generateCodeString()}</CodeBlock>
        </TabItem>
      </Tabs>
    </div>
  );
};
