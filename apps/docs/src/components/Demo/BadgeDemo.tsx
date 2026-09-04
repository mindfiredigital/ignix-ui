import React, { useState } from 'react';
import { Badge } from '@site/src/components/UI/badge';
import VariantSelector from './VariantSelector';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';
import { Mail, Star } from 'lucide-react';

const badgeVariants = [
  'default',
  'secondary',
  'success',
  'warning',
  'destructive',
  'info',
  'purple',
  'outline',
  'notification',
];
const badgeSizes = ['sm', 'md', 'lg'];

const BadgeDemo = () => {
  const [variant, setVariant] = useState('default');
  const [size, setSize] = useState('md');
  const [removed, setRemoved] = useState(false);

  const codeString = `
import { Badge } from '@ignix-ui/badge';

<div className="flex flex-wrap items-center gap-4">
  <Badge variant="${variant}" size="${size}">
    Status
  </Badge>

  <Badge variant="${variant}" size="${size}" icon={<Star className="h-3 w-3" />}>
    Featured
  </Badge>

  <Badge variant="${variant}" size="${size}" onRemove={() => setRemoved(true)}>
    Dismissible
  </Badge>

  <Badge variant="notification" anchor={<Mail className="h-8 w-8" />}>
    3
  </Badge>
</div>
`;

  return (
    <div className="flex flex-col space-y-4 mb-8">
      <div className="flex flex-wrap gap-4 justify-start md:justify-end">
        <VariantSelector variants={badgeVariants} selectedVariant={variant} onSelectVariant={setVariant} type="Variant" />
        <VariantSelector variants={badgeSizes} selectedVariant={size} onSelectVariant={setSize} type="Size" />
      </div>
      <Tabs>
        <TabItem value="preview" label="Preview" default>
          <div className="flex flex-wrap items-center gap-6 border rounded-lg p-4 mt-4">
            <Badge variant={variant as any} size={size as any}>
              Status
            </Badge>

            <Badge variant={variant as any} size={size as any} icon={<Star className="h-3 w-3" />}>
              Featured
            </Badge>

            {!removed ? (
              <Badge variant={variant as any} size={size as any} onRemove={() => setRemoved(true)}>
                Dismissible
              </Badge>
            ) : (
              <button
                type="button"
                className="text-xs text-muted-foreground underline"
                onClick={() => setRemoved(false)}
              >
                Reset dismissed badge
              </button>
            )}

            <div className="flex items-center gap-1">
              <span className="text-sm font-medium">Notifications</span>
              <Badge variant="notification" anchor={<Mail className="h-8 w-8" />}>
                3
              </Badge>
            </div>
          </div>
        </TabItem>
        <TabItem value="code" label="Code">
          <CodeBlock language="tsx" className="whitespace-pre-wrap max-h-[500px] overflow-y-scroll">
            {codeString}
          </CodeBlock>
        </TabItem>
      </Tabs>
    </div>
  );
};

export default BadgeDemo;
