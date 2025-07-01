import { useState } from 'react';
import { Table } from '../UI/table';

export function TableExample() {
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' as const });
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 2;``

  const data = [
    { id: 1, name: 'John Doe', email: 'john@example.com', status: 'Active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'Inactive' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', status: 'Active' },
    { id: 4, name: 'Alice Johnson', email: 'alice@example.com', status: 'Active' },
  ];

  const handleSort = (key: string, direction: 'asc' | 'desc') => {
    setSortConfig({ key, direction });
    // In a real app, you would sort your data here
    console.log(`Sorting by ${key} in ${direction} order`);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // In a real app, you would fetch the new page of data here
    console.log(`Page changed to ${page}`);
  };

  return (
    <Table
      headings={[
        { label: 'Name', key: 'name', sort: sortConfig.key === 'name' ? sortConfig.direction : 'asc' },
        { label: 'Email', key: 'email', sort: sortConfig.key === 'email' ? sortConfig.direction : 'asc' },
        { label: 'Status', key: 'status', sort: sortConfig.key === 'status' ? sortConfig.direction : 'asc' },
      ]}
      data={data}
      applySort={handleSort}
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={handlePageChange}
      variant="surface"
    />
  );
}

export default TableExample;
