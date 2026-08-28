import React, { useState } from 'react';
import { Skeleton } from '@site/src/components/UI/skeleton';
import VariantSelector from './VariantSelector';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';

const skeletonVariants = ['rectangular', 'circular', 'text'];
const skeletonAnimations = ['shimmer', 'wave', 'pulse', 'none'];
const skeletonThemes = ['default', 'primary', 'success', 'warning', 'danger'];

const SkeletonDemo = () => {
  const [variant, setVariant] = useState('rectangular');
  const [animation, setAnimation] = useState('shimmer');
  const [theme, setTheme] = useState('default');

  const width = variant === 'circular' ? 64 : (variant === 'text' ? '100%' : '100%');
  const height = variant === 'circular' ? 64 : (variant === 'text' ? 16 : 100);

  const customCodeString = `
import { Skeleton } from '@ignix-ui/skeleton';

<Skeleton
  variant="${variant}"
  width={${typeof width === 'number' ? width : `"${width}"`}}
  height={${typeof height === 'number' ? height : `"${height}"`}}
  animation="${animation}"
  colorTheme="${theme}"
/>
`;

  return (
    <div className="flex flex-col space-y-4 mb-8">
      <div className="flex flex-wrap gap-4 justify-start md:justify-end">
        <VariantSelector
          variants={skeletonVariants}
          selectedVariant={variant}
          onSelectVariant={setVariant}
          type='Variant'
        />
        <VariantSelector
          variants={skeletonAnimations}
          selectedVariant={animation}
          onSelectVariant={setAnimation}
          type='Animation'
        />
        <VariantSelector
          variants={skeletonThemes}
          selectedVariant={theme}
          onSelectVariant={setTheme}
          type='Theme'
        />
      </div>
      <Tabs>
        <TabItem value="preview" label="Preview">
          <div className="flex items-center justify-center border rounded-lg p-8 mt-4 min-h-[160px]">
            <div className="w-full max-w-sm flex justify-center">
              <Skeleton
                variant={variant as any}
                width={width}
                height={height}
                animation={animation as any}
                colorTheme={theme as any}
              />
            </div>
          </div>
        </TabItem>
        <TabItem value="code" label="Code">
          <CodeBlock language="tsx" className='whitespace-pre-wrap max-h-[500px] overflow-y-scroll'>{customCodeString}</CodeBlock>
        </TabItem>
      </Tabs>
    </div>
  );
};

export default SkeletonDemo;
