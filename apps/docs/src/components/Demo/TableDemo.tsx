
import React, { useState } from 'react';
import { Table } from '@site/src/components/UI/table';
import VariantSelector from './VariantSelector';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';

const animationVariants = ['fade', 'slide', 'scale', 'flip', 'elastic'];
const sizeVariants = ['sm', 'md', 'lg'];
const tableVariants = ['surface', 'ghost'];

const TableDemo = () => {
  const [animationVariant, setAnimationVariant] = useState('fade');
  const [size, setSize] = useState('md');
  const [variant, setVariant] = useState('surface');

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
        const aValue = a[key as keyof typeof a];
        const bValue = b[key as keyof typeof b];

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

  const codeString = `
<Table
  headings={headings}
  data={data}
  applySort={handleSort}
  size="${size}"
  animationVariant="${animationVariant}"
  variant="${variant}"
  currentPage={currentPage}
  totalPages={totalPages}
  onPageChange={setCurrentPage}
/>
`;

  return (
    <div className="flex flex-col space-y-4 mb-8">
      <div className="flex flex-wrap gap-4 justify-start md:justify-end ">
        <VariantSelector
          variants={animationVariants}
          selectedVariant={animationVariant}
          onSelectVariant={setAnimationVariant}
          type="Animation"
        />
        <VariantSelector
          variants={sizeVariants}
          selectedVariant={size}
          onSelectVariant={setSize}
          type="Size"
        />
        <VariantSelector
          variants={tableVariants}
          selectedVariant={variant}
          onSelectVariant={setVariant}
          type="Variant"
        />
      </div>
      <Tabs>
        <TabItem value="preview" label="Preview">
          <div className="flex items-center justify-center border rounded-lg p-4 mt-4">
            <Table
              headings={headings}
              data={data}
              applySort={handleSort}
              size={size as any}
              animationVariant={animationVariant as any}
              variant={variant as any}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </TabItem>
        <TabItem value="code" label="Code">
          <CodeBlock language="tsx" className='whitespace-pre-wrap max-h-[500px] overflow-y-scroll'>{codeString}</CodeBlock>
        </TabItem>
      </Tabs>
    </div>
  );
};

export default TableDemo;
