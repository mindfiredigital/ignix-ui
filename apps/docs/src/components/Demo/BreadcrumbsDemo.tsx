
import React, { useState } from 'react';
import { Breadcrumbs } from '@site/src/components/UI/breadcrumbs';
import VariantSelector from './VariantSelector';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';
import { ChevronRight } from 'lucide-react';

const breadcrumbVariants = ['text', 'step', 'custom'];

const BreadcrumbsDemo = () => {
  const [variant, setVariant] = useState('text');

  const codeString = `
<Breadcrumbs 
  items={[
    { label: 'Home', href: '#' },
    { label: 'Products', href: '#' },
    { label: 'Electronics', href: '#' },
    { label: 'Smartphones' }
  ]}
  separatorIcon={ChevronRight}
  variant="${variant}"
/>
`;

  return (
    <div className="flex flex-col space-y-4 mb-8">
      <VariantSelector
        variants={breadcrumbVariants}
        selectedVariant={variant}
        onSelectVariant={setVariant}
      />
      <Tabs>
        <TabItem value="preview" label="Preview">
          <div className="p-4 border rounded-lg mt-4">
            <Breadcrumbs
              items={[
                { label: 'Home', href: '#' },
                { label: 'Products', href: '#' },
                { label: 'Electronics', href: '#' },
                { label: 'Smartphones' },
              ]}
              separatorIcon={ChevronRight}
              variant={variant as any}
            />
          </div>
        </TabItem>
        <TabItem value="code" label="Code">
          <CodeBlock language="tsx">{codeString}</CodeBlock>
        </TabItem>
      </Tabs>
    </div>
  );
};

export default BreadcrumbsDemo;
