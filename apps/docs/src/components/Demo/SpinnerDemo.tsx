
import React, { useState } from 'react';
import { Spinner } from '@site/src/components/UI/spinner';
import VariantSelector from './VariantSelector';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';

const spinnerVariants = ['default', 'bars', 'dots-bounce'];

const SpinnerDemo = () => {
  const [variant, setVariant] = useState('default');

  const codeString = `
<Spinner size={40} variant="${variant}" color="border-primary" />
`;

  return (
    <div className="flex flex-col space-y-4 mb-8">
      <VariantSelector
        variants={spinnerVariants}
        selectedVariant={variant}
        onSelectVariant={setVariant}
        type="Variant"
      />

      <Tabs>
        <TabItem value="preview" label="Preview">
          <div className="w-full p-8 space-y-8 border rounded-lg mt-4">
            <div className="p-6 rounded-lg">
              <div className="flex items-center justify-center gap-8">
                {variant === 'default' && (
                  <Spinner size={40} variant={variant as any} color="border-primary" />
                )}
                {variant === 'bars' && (
                  <Spinner size={40} variant="bars" color="bg-primary" />
                )}
                {variant === 'dots-bounce' && (
                  <Spinner size={40} variant="dots-bounce" color="bg-primary" />
                )}
              </div>
            </div>  
          </div>
        </TabItem>
        <TabItem value="code" label="Code">
          <CodeBlock language="tsx">{codeString}</CodeBlock>
        </TabItem>
      </Tabs>
    </div>
  );
};

export default SpinnerDemo;
