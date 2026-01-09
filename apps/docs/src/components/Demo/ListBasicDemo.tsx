/**
 * ListBasicDemo Component
 * 
 * Interactive demo component for showcasing the ListBasic component
 * with various configurations including type, spacing, and content options.
 * 
 * @component
 * @file
 */

import React, { useEffect, useState } from 'react';
import { ListBasic } from '@site/src/components/UI/list-basic';
import VariantSelector from './VariantSelector';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';

/**
 * Available list types
 */
const listTypes = ['unordered', 'ordered'];

/**
 * Available spacing options
 */
const spacingOptions = ['sm', 'md', 'lg'];

/**
 * Default list items for demonstration
 */
const defaultItems = [
    'First item',
    'Second item',
    'Third item',
    'Fourth item',
];

/**
 * Main ListBasicDemo component
 * 
 * Provides an interactive interface to explore ListBasic component
 * with different configurations and live preview.
 */
const ListBasicDemo = () => {
    const [type, setType] = useState<'unordered' | 'ordered'>('unordered');
    const [spacing, setSpacing] = useState<'sm' | 'md' | 'lg'>('md');
    const [items, setItems] = useState<string[]>();

    /**
     * Generate code string based on current configuration
     */
    const codeString = `
<ListBasic 
  items={${JSON.stringify(items)}}
  type="${type}"
  spacing="${spacing}"
/>
`;

    useEffect(()=>{
        setItems(defaultItems);
    },[])

    return (
        <div className="flex flex-col space-y-4 mb-8">
            {/* Variant Selectors */}
            <div className="flex flex-wrap gap-4 justify-start md:justify-end">
                <VariantSelector
                    variants={listTypes}
                    selectedVariant={type}
                    onSelectVariant={(val) => setType(val as 'unordered' | 'ordered')}
                    type="Type"
                />
                <VariantSelector
                    variants={spacingOptions}
                    selectedVariant={spacing}
                    onSelectVariant={(val) => setSpacing(val as 'sm' | 'md' | 'lg')}
                    type="Spacing"
                />
            </div>

            {/* Preview and Code Tabs */}
            <Tabs>
                <TabItem value="preview" label="Preview" default>
                    <div className="p-6 border rounded-lg mt-4">
                        <ListBasic
                            items={items}
                            type={type}
                            spacing={spacing}
                        />
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

/**
 * Spacing comparison demo
 * 
 * Shows all three spacing variants side by side for visual comparison.
 */
export const SpacingComparison = () => {
    const codeString = `
<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
  <div>
    <h3 className="text-sm font-semibold mb-2">Small Spacing</h3>
    <ListBasic
      items={['Item one', 'Item two', 'Item three']}
      type="unordered"
      spacing="sm"
    />
  </div>
  <div>
    <h3 className="text-sm font-semibold mb-2">Medium Spacing</h3>
    <ListBasic
      items={['Item one', 'Item two', 'Item three']}
      type="unordered"
      spacing="md"
    />
  </div>
  <div>
    <h3 className="text-sm font-semibold mb-2">Large Spacing</h3>
    <ListBasic
      items={['Item one', 'Item two', 'Item three']}
      type="unordered"
      spacing="lg"
    />
  </div>
</div>
`;

    return (
        <div className="space-y-6 mb-8">
            <h3 className="text-lg font-semibold">Spacing Variants</h3>
            <Tabs>
                <TabItem value="preview" label="Preview" default>
                    <div className="p-6 border rounded-lg">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div>
                                <h3 className="text-sm font-semibold mb-2">Small Spacing</h3>
                                <ListBasic
                                    items={['Item one', 'Item two', 'Item three']}
                                    type="unordered"
                                    spacing="sm"
                                />
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold mb-2">Medium Spacing</h3>
                                <ListBasic
                                    items={['Item one', 'Item two', 'Item three']}
                                    type="unordered"
                                    spacing="md"
                                />
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold mb-2">Large Spacing</h3>
                                <ListBasic
                                    items={['Item one', 'Item two', 'Item three']}
                                    type="unordered"
                                    spacing="lg"
                                />
                            </div>
                        </div>
                    </div>
                </TabItem>
                <TabItem value="code" label="Code">
                    <CodeBlock language="tsx" className="text-sm">
                        {codeString}
                    </CodeBlock>
                </TabItem>
            </Tabs>
        </div>
    );
};

/**
 * Type comparison demo
 * 
 * Shows unordered and ordered list types side by side.
 */
export const TypeComparison = () => {
    const codeString = `
<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
  <div>
    <h3 className="text-sm font-semibold mb-2">Unordered List</h3>
    <ListBasic
      items={['Bullet point one', 'Bullet point two', 'Bullet point three']}
      type="unordered"
      spacing="md"
    />
  </div>
  <div>
    <h3 className="text-sm font-semibold mb-2">Ordered List</h3>
    <ListBasic
      items={['Numbered item one', 'Numbered item two', 'Numbered item three']}
      type="ordered"
      spacing="md"
    />
  </div>
</div>
`;

    return (
        <div className="space-y-6 mb-8">
            <h3 className="text-lg font-semibold">List Types</h3>
            <Tabs>
                <TabItem value="preview" label="Preview" default>
                    <div className="p-6 border rounded-lg">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <h3 className="text-sm font-semibold mb-2">Unordered List</h3>
                                <ListBasic
                                    items={['Bullet point one', 'Bullet point two', 'Bullet point three']}
                                    type="unordered"
                                    spacing="md"
                                />
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold mb-2">Ordered List</h3>
                                <ListBasic
                                    items={['Numbered item one', 'Numbered item two', 'Numbered item three']}
                                    type="ordered"
                                    spacing="md"
                                />
                            </div>
                        </div>
                    </div>
                </TabItem>
                <TabItem value="code" label="Code">
                    <CodeBlock language="tsx" className="text-sm">
                        {codeString}
                    </CodeBlock>
                </TabItem>
            </Tabs>
        </div>
    );
};

/**
 * Children example demo
 * 
 * Demonstrates using children prop instead of items prop
 * for more complex content.
 */
export const ChildrenExample = () => {
    const codeString = `
<ListBasic type="unordered" spacing="md">
  <li>
    <strong>Bold item</strong> with additional text
  </li>
  <li>
    Item with <a href="#" className="text-primary underline">a link</a>
  </li>
  <li>
    <em>Italic item</em> for emphasis
  </li>
  <li>
    Item with <code className="bg-muted px-1 py-0.5 rounded">code</code> inline
  </li>
</ListBasic>
`;

    return (
        <div className="space-y-6 mb-8">
            <h3 className="text-lg font-semibold">Using Children</h3>
            <Tabs>
                <TabItem value="preview" label="Preview" default>
                    <div className="p-6 border rounded-lg">
                        <ListBasic type="unordered" spacing="md">
                            <li>
                                <strong>Bold item</strong> with additional text
                            </li>
                            <li>
                                Item with <a href="#" className="text-primary underline">a link</a>
                            </li>
                            <li>
                                <em>Italic item</em> for emphasis
                            </li>
                            <li>
                                Item with <code className="bg-muted px-1 py-0.5 rounded">code</code> inline
                            </li>
                        </ListBasic>
                    </div>
                </TabItem>
                <TabItem value="code" label="Code">
                    <CodeBlock language="tsx" className="text-sm">
                        {codeString}
                    </CodeBlock>
                </TabItem>
            </Tabs>
        </div>
    );
};

export default ListBasicDemo;

