/**
 * ListWithStatusDemo Component
 * 
 * Interactive demo component for showcasing the ListWithStatus component
 * with various configurations including type, spacing, and status options.
 * 
 * @component
 * @file
 */

import React, { useEffect, useState, useCallback } from 'react';
import { ListWithStatus, type ListItemWithStatus } from '@site/src/components/UI/list-with-status';
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
 * Available status types
 */
// const statusTypes: Array<ListItemWithStatus['status']> = ['success', 'error', 'warning', 'info', 'pending'];

/**
 * Default list items for demonstration
 */
const defaultItems: ListItemWithStatus[] = [
    {
        id: '1',
        title: 'Payment Processed',
        description: 'Your payment has been successfully processed',
        status: 'success',
    },
    {
        id: '2',
        title: 'Order Failed',
        description: 'Unable to process your order',
        status: 'error',
    },
    {
        id: '3',
        title: 'Review Required',
        description: 'Your order needs manual review',
        status: 'warning',
    },
    {
        id: '4',
        title: 'Processing',
        description: 'Your order is being processed',
        status: 'pending',
    },
];

/**
 * Main ListWithStatusDemo component
 * 
 * Provides an interactive interface to explore ListWithStatus component
 * with different configurations and live preview.
 */
const ListWithStatusDemo = () => {
    const [type, setType] = useState<'unordered' | 'ordered' | undefined>('unordered');
    const [spacing, setSpacing] = useState<'sm' | 'md' | 'lg'>('md');
    const [items, setItems] = useState<ListItemWithStatus[]>();

    /**
     * Memoized click handler
     */
    const handleItemClick = useCallback((item: ListItemWithStatus, index: number) => {
        console.log('Clicked item:', item, 'at index:', index);
    }, []);

    /**
     * Generate code string based on current configuration
     */
    const codeString = `
const items = ${JSON.stringify(items, null, 2)};

<ListWithStatus 
  items={items}
  ${type ? `type="${type}"` : ''}
  spacing="${spacing}"
  ${items && items.length > 0 ? 'onItemClick={(item, index) => console.log(item, index)}' : ''}
/>
`;

    useEffect(() => {
        setItems(defaultItems);
    }, []);

    return (
        <div className="flex flex-col space-y-4 mb-8">
            {/* Variant Selectors */}
            <div className="flex flex-wrap gap-4 justify-start md:justify-end">
                <VariantSelector
                    variants={['none', ...listTypes]}
                    selectedVariant={type || 'none'}
                    onSelectVariant={(val) => setType(val === 'none' ? undefined : val as 'unordered' | 'ordered')}
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
                        <ListWithStatus
                            items={items || []}
                            type={type}
                            spacing={spacing}
                            onItemClick={handleItemClick}
                        />
                    </div>
                    <p className="text-sm text-muted-foreground mt-4">
                        💡 Click on items to see the click handler in action (check console).
                    </p>
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
 * Status variants demo
 * 
 * Shows all available status types side by side.
 */
export const StatusVariantsDemo = () => {
    const items: ListItemWithStatus[] = [
        {
            id: '1',
            title: 'Success Status',
            description: 'Operation completed successfully',
            status: 'success',
        },
        {
            id: '2',
            title: 'Error Status',
            description: 'An error occurred during processing',
            status: 'error',
        },
        {
            id: '3',
            title: 'Warning Status',
            description: 'Please review this item',
            status: 'warning',
        },
        {
            id: '4',
            title: 'Info Status',
            description: 'Additional information available',
            status: 'info',
        },
        {
            id: '5',
            title: 'Pending Status',
            description: 'Waiting for processing',
            status: 'pending',
        },
    ];

    const codeString = `
const items = [
  {
    id: '1',
    title: 'Success Status',
    description: 'Operation completed successfully',
    status: 'success',
  },
  {
    id: '2',
    title: 'Error Status',
    description: 'An error occurred during processing',
    status: 'error',
  },
  // ... more items
];

<ListWithStatus items={items} />
`;

    return (
        <div className="space-y-6 mb-8">
            <Tabs>
                <TabItem value="preview" label="Preview" default>
                    <div className="p-6 border rounded-lg">
                        <ListWithStatus items={items} />
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
 * Ordered list demo
 * 
 * Shows ListWithStatus with ordered (numbered) markers.
 */
export const OrderedListExample = () => {
    const items: ListItemWithStatus[] = [
        {
            id: '1',
            title: 'Step 1: Gather requirements',
            description: 'Collect all necessary information',
            status: 'success',
        },
        {
            id: '2',
            title: 'Step 2: Design the solution',
            description: 'Create a detailed design plan',
            status: 'pending',
        },
        {
            id: '3',
            title: 'Step 3: Implement features',
            description: 'Build and test the solution',
            status: 'pending',
        },
    ];

    const codeString = `
<ListWithStatus
  type="ordered"
  items={items}
/>
`;

    return (
        <div className="space-y-6 mb-8">
            <Tabs>
                <TabItem value="preview" label="Preview" default>
                    <div className="p-6 border rounded-lg">
                        <ListWithStatus
                            type="ordered"
                            items={items}
                        />
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
 * Custom content demo
 * 
 * Shows ListWithStatus with custom content instead of title/description.
 */
export const CustomContentExample = () => {
    const items: ListItemWithStatus[] = [
        {
            id: '1',
            title: 'Analytics Dashboard',
            description: 'Last updated 2 hours ago',
            status: 'success',
            customContent: (
                <div className="flex flex-col">
                    <span className="font-medium">Analytics Dashboard</span>
                    <span className="text-xs text-muted-foreground">
                        Last updated 2 hours ago
                    </span>
                </div>
            ),
        },
        {
            id: '2',
            title: 'Marketing Campaign',
            description: 'Running · Ends in 3 days',
            status: 'info',
            customContent: (
                <div className="flex flex-col">
                    <span className="font-medium">Marketing Campaign</span>
                    <span className="text-xs text-muted-foreground">
                        Running · Ends in 3 days
                    </span>
                </div>
            ),
        },
        {
            id: '3',
            title: 'Billing Integration',
            description: 'In review · 4 comments',
            status: 'warning',
            customContent: (
                <div className="flex flex-col">
                    <span className="font-medium">Billing Integration</span>
                    <span className="text-xs text-muted-foreground">
                        In review · 4 comments
                    </span>
                </div>
            ),
        },
    ];

    const codeString = `
const items = [
  {
    id: '1',
    title: 'Analytics Dashboard',
    status: 'success',
    customContent: (
      <div className="flex flex-col">
        <span className="font-medium">Analytics Dashboard</span>
        <span className="text-xs text-muted-foreground">Last updated 2 hours ago</span>
      </div>
    ),
  },
  // ... more items
];

<ListWithStatus items={items} spacing="lg" />
`;

    return (
        <div className="space-y-6 mb-8">
            <Tabs>
                <TabItem value="preview" label="Preview" default>
                    <div className="p-6 border rounded-lg">
                        <ListWithStatus
                            items={items}
                            spacing="lg"
                        />
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
 * Spacing variants demo
 * 
 * Shows different spacing options side by side.
 */
export const SpacingVariantsDemo = () => {
    const items: ListItemWithStatus[] = [
        {
            id: '1',
            title: 'Item one',
            status: 'success',
        },
        {
            id: '2',
            title: 'Item two',
            status: 'info',
        },
        {
            id: '3',
            title: 'Item three',
            status: 'warning',
        },
    ];

    const codeString = `
<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
  <div>
    <h3 className="text-sm font-semibold mb-2">Small Spacing</h3>
    <ListWithStatus items={items} spacing="sm" />
  </div>
  <div>
    <h3 className="text-sm font-semibold mb-2">Medium Spacing</h3>
    <ListWithStatus items={items} spacing="md" />
  </div>
  <div>
    <h3 className="text-sm font-semibold mb-2">Large Spacing</h3>
    <ListWithStatus items={items} spacing="lg" />
  </div>
</div>
`;

    return (
        <div className="space-y-6 mb-8">
            <Tabs>
                <TabItem value="preview" label="Preview" default>
                    <div className="p-6 border rounded-lg">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div>
                                <h3 className="text-sm font-semibold mb-2">Small Spacing</h3>
                                <ListWithStatus items={items} spacing="sm" />
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold mb-2">Medium Spacing</h3>
                                <ListWithStatus items={items} spacing="md" />
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold mb-2">Large Spacing</h3>
                                <ListWithStatus items={items} spacing="lg" />
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

export default ListWithStatusDemo;
