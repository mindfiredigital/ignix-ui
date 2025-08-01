
import React, { useState } from 'react';
import { Breadcrumbs } from '@site/src/components/UI/breadcrumbs';
import VariantSelector from './VariantSelector';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';
import { ChevronRight, Home } from 'lucide-react';

const breadcrumbVariants = ['text', 'step', 'progress', 'custom'];

const BreadcrumbsDemo = () => {
  const [variant, setVariant] = useState('text');
  const [currentStep, setCurrentStep] = useState(1);

  const items = [
    { label: 'Home', href: '#', icon: Home },
    { label: 'Products', href: '#' },
    { label: 'Electronics', href: '#' },
    { label: 'Smartphones' }
  ];

  const steps = ['Cart', 'Shipping', 'Payment', 'Confirmation'];

  const codeString = `
<Breadcrumbs 
  ${variant === 'text' || variant === 'custom' ? `items={[
    { label: 'Home', href: '#', icon: Home },
    { label: 'Products', href: '#' },
    { label: 'Electronics', href: '#' },
    { label: 'Smartphones' }
  ]}` : `steps={['Cart', 'Shipping', 'Payment', 'Confirmation']}
  currentStep={${currentStep}}`}
  separatorIcon={ChevronRight}
  variant="${variant}"
  ${variant === 'progress' ? 'size="lg"' : ''}
  ${variant === 'custom' ? 'bgColor="blue" textColor="white" shape="pill"' : ''}
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
          <div className="mt-4 p-4 border rounded-lg bg-background/50">
            {variant === 'step' || variant === 'progress' ? (
              <div className="space-y-4">
                <Breadcrumbs 
                  steps={steps}
                  currentStep={currentStep}
                  separatorIcon={ChevronRight}
                  variant={variant}
                  size={variant === 'progress' ? 'lg' : 'md'}
                />
                <div className="flex justify-center gap-4 mt-6">
                  <button 
                    onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
                    className="px-4 py-2 bg-muted rounded-lg text-sm font-medium hover:bg-muted/80 transition-colors"
                    disabled={currentStep === 0}
                  >
                    Previous
                  </button>
                  <button 
                    onClick={() => setCurrentStep(prev => Math.min(steps.length - 1, prev + 1))}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                    disabled={currentStep === steps.length - 1}
                  >
                    Next
                  </button>
                </div>
              </div>
            ) : (
              <Breadcrumbs 
                items={items}
                separatorIcon={ChevronRight}
                variant={variant as any}
                currentStep={1}
                bgColor={variant === 'custom' ? 'blue' : undefined}
                textColor={variant === 'custom' ? 'white' : undefined}
                shape={variant === 'custom' ? 'pill' : undefined}
              />
            )}
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
