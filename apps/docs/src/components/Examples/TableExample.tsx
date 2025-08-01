import { useState } from 'react';
import { Table } from '../UI/table';

export function TableExample() {
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' as const });
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 2;

  const [data, setData] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', status: 'Active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'Inactive' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', status: 'Active' },
    { id: 4, name: 'Alice Johnson', email: 'alice@example.com', status: 'Active' },
  ]);

  const handleSort = (key: string, direction: 'asc' | 'desc') => {
    setSortConfig({ key, direction });
    
    setData(prevData => {
      const sortedData = [...prevData].sort((a, b) => {
        // Handle different data types appropriately
        const aValue = a[key as keyof typeof a];
        const bValue = b[key as keyof typeof b];
        
        // Convert to string for case-insensitive comparison
        const valueA = String(aValue).toLowerCase();
        const valueB = String(bValue).toLowerCase();
        
        if (valueA < valueB) {
          return direction === 'asc' ? -1 : 1;
        }
        if (valueA > valueB) {
          return direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
      
      return sortedData;
    });
  };

  const headings = [
    { label: 'Name', key: 'name', sort: sortConfig.key === 'name' ? sortConfig.direction : 'asc' },
    { label: 'Email', key: 'email', sort: sortConfig.key === 'email' ? sortConfig.direction : 'asc' },
    { label: 'Status', key: 'status', sort: sortConfig.key === 'status' ? sortConfig.direction : 'asc' },
  ];

  return (
    <div className='flex items-center justify-center'>
      <Table
        headings={headings}
        data={data}
        applySort={handleSort}
        size="lg"
        animationVariant="elastic"
        showHoverEffects={true}
        showStripes={true}
        variant="surface"
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}

export default TableExample;
