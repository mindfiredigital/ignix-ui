/**
 * ListWithActionsDemo Component
 * 
 * Interactive demo component for showcasing the ListWithActions component
 * with various configurations including type, spacing, and action options.
 * 
 * @component
 * @file
 */

import React, { useEffect, useState, useCallback } from 'react';
import { ListWithActions, type ListAction } from '@site/src/components/UI/list-with-actions';
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
    'Design landing page',
    'Implement authentication flow',
    'Review pull requests',
    'Prepare release notes',
];

/**
 * Main ListWithActionsDemo component
 * 
 * Provides an interactive interface to explore ListWithActions component
 * with different configurations and live preview.
 */
const ListWithActionsDemo = () => {
    const [type, setType] = useState<'unordered' | 'ordered' | undefined>('unordered');
    const [spacing, setSpacing] = useState<'sm' | 'md' | 'lg'>('md');
    const [items, setItems] = useState<string[]>();

    /**
     * Memoized action handlers to prevent unnecessary re-renders
     */
    const handleEdit = useCallback((index: number) => {
        console.log('Edit item at index', index);
    }, []);

    const handleView = useCallback((index: number) => {
        console.log('View item at index', index);
    }, []);

    const handleDelete = useCallback((index: number) => {
        console.log('Delete item at index', index);
    }, []);

    /**
     * Actions array - memoized to prevent recreation on every render
     */
    const actions: ListAction[] = [
        { id: 'view', label: 'View', ariaLabel: 'View item', onClick: handleView },
        { id: 'edit', label: 'Edit', ariaLabel: 'Edit item', onClick: handleEdit },
        { id: 'delete', label: 'Delete', ariaLabel: 'Delete item', onClick: handleDelete },
    ];

    /**
     * Generate code string based on current configuration
     */
    const codeString = `
const actions = [
  { id: 'view', label: 'View', onClick: (index) => console.log('View', index) },
  { id: 'edit', label: 'Edit', onClick: (index) => console.log('Edit', index) },
  { id: 'delete', label: 'Delete', onClick: (index) => console.log('Delete', index) },
];

<ListWithActions 
  items={${JSON.stringify(items)}}
  actions={actions}
  ${type ? `type="${type}"` : ''}
  spacing="${spacing}"
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
                        <ListWithActions
                            items={items || []}
                            actions={actions}
                            type={type}
                            spacing={spacing}
                        />
                    </div>
                    <p className="text-sm text-muted-foreground mt-4">
                        💡 Hover over items or use Tab to focus them to see the action buttons. On mobile, actions are always visible.
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
 * Actions behavior demo
 * 
 * Shows how actions appear on hover/focus and are always visible on mobile.
 */
export const ActionsBehavior = () => {
    const handleEdit = useCallback((index: number) => {
        console.log('Edit', index);
    }, []);

    const handleView = useCallback((index: number) => {
        console.log('View', index);
    }, []);

    const handleDelete = useCallback((index: number) => {
        console.log('Delete', index);
    }, []);

    const actions: ListAction[] = [
        { id: 'view', label: 'View', onClick: handleView },
        { id: 'edit', label: 'Edit', onClick: handleEdit },
        { id: 'delete', label: 'Delete', onClick: handleDelete },
    ];

    const codeString = `
<ListWithActions
  items={['Item 1', 'Item 2', 'Item 3']}
  actions={actions}
/>
`;

    return (
        <div className="space-y-6 mb-8">
            {/* <h3 className="text-lg font-semibold">Actions Behavior</h3> */}
            <Tabs>
                <TabItem value="preview" label="Preview" default>
                    <div className="p-6 border rounded-lg">
                        <ListWithActions
                            items={['Task 1', 'Task 2', 'Task 3']}
                            actions={actions}
                        />
                        <p className="text-sm text-muted-foreground mt-4">
                            Hover over items or press Tab to focus them. Actions appear on hover/focus on desktop and are always visible on mobile.
                        </p>
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
 * Shows ListWithActions with ordered (numbered) markers.
 */
export const OrderedListExample = () => {
    const handleEdit = useCallback((index: number) => {
        console.log('Edit', index);
    }, []);

    const handleView = useCallback((index: number) => {
        console.log('View', index);
    }, []);

    const actions: ListAction[] = [
        { id: 'view', label: 'View', onClick: handleView },
        { id: 'edit', label: 'Edit', onClick: handleEdit },
    ];

    const codeString = `
<ListWithActions
  type="ordered"
  items={[
    'Step 1: Gather requirements',
    'Step 2: Design the solution',
    'Step 3: Implement features',
  ]}
  actions={actions}
/>
`;

    return (
        <div className="space-y-6 mb-8">
            {/* <h3 className="text-lg font-semibold">Ordered List</h3> */}
            <Tabs>
                <TabItem value="preview" label="Preview" default>
                    <div className="p-6 border rounded-lg">
                        <ListWithActions
                            type="ordered"
                            items={[
                                'Step 1: Gather requirements',
                                'Step 2: Design the solution',
                                'Step 3: Implement features',
                            ]}
                            actions={actions}
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
 * Rich content demo
 * 
 * Shows ListWithActions with complex JSX content in items.
 */
export const RichContentExample = () => {
    const handleEdit = useCallback((index: number) => {
        console.log('Edit', index);
    }, []);

    const handleView = useCallback((index: number) => {
        console.log('View', index);
    }, []);

    const handleDelete = useCallback((index: number) => {
        console.log('Delete', index);
    }, []);

    const actions: ListAction[] = [
        { id: 'view', label: 'View', onClick: handleView },
        { id: 'edit', label: 'Edit', onClick: handleEdit },
        { id: 'delete', label: 'Delete', onClick: handleDelete },
    ];

    const items = [
        (
            <div className="flex flex-col">
                <span className="font-medium">Analytics Dashboard</span>
                <span className="text-xs text-muted-foreground">
                    Last updated 2 hours ago
                </span>
            </div>
        ),
        (
            <div className="flex flex-col">
                <span className="font-medium">Marketing Campaign</span>
                <span className="text-xs text-muted-foreground">
                    Running · Ends in 3 days
                </span>
            </div>
        ),
        (
            <div className="flex flex-col">
                <span className="font-medium">Billing Integration</span>
                <span className="text-xs text-muted-foreground">
                    In review · 4 comments
                </span>
            </div>
        ),
    ];

    const codeString = `
const items = [
  <div className="flex flex-col">
    <span className="font-medium">Analytics Dashboard</span>
    <span className="text-xs text-muted-foreground">Last updated 2 hours ago</span>
  </div>,
  // ... more items
];

<ListWithActions
  items={items}
  actions={actions}
  spacing="lg"
/>
`;

    return (
        <div className="space-y-6 mb-8">
            {/* <h3 className="text-lg font-semibold">Rich Content</h3> */}
            <Tabs>
                <TabItem value="preview" label="Preview" default>
                    <div className="p-6 border rounded-lg">
                        <ListWithActions
                            items={items}
                            actions={actions}
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

export default ListWithActionsDemo;

