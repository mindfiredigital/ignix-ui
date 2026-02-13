/**
 * ListWithAvatarsDemo Component
 * 
 * Interactive demo component for showcasing the ListWithAvatars component
 * with various configurations including avatar sizes, shapes, spacing, and profile links.
 * 
 * @component
 * @file
 */

import React, { useEffect, useState, useCallback } from 'react';
import { ListWithAvatars, type ListItemWithAvatar } from '@site/src/components/UI/list-with-avatars';
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
 * Available avatar sizes
 */
const avatarSizes = ['sm', 'md', 'lg', 'xl'];

/**
 * Available avatar shapes
 */
const avatarShapes = ['circle', 'square', 'rounded'];

/**
 * Default list items for demonstration
 */
const defaultItems: ListItemWithAvatar[] = [
    {
        id: '1',
        name: 'John Doe',
        description: 'Software Engineer',
        profileLink: '/profile/john-doe',
        avatarSrc: 'https://i.pravatar.cc/150?img=1',
        avatarAlt: 'John Doe',
    },
    {
        id: '2',
        name: 'Jane Smith',
        description: 'Product Designer',
        profileLink: '/profile/jane-smith',
        avatarSrc: 'https://i.pravatar.cc/150?img=2',
        avatarAlt: 'Jane Smith',
    },
    {
        id: '3',
        name: 'Bob Johnson',
        description: 'UX Researcher',
        profileLink: '/profile/bob-johnson',
        avatarLetters: 'BJ',
    },
    {
        id: '4',
        name: 'Alice Williams',
        description: 'Frontend Developer',
        profileLink: '/profile/alice-williams',
        avatarSrc: 'https://i.pravatar.cc/150?img=4',
        avatarAlt: 'Alice Williams',
    },
];

/**
 * Main ListWithAvatarsDemo component
 * 
 * Provides an interactive interface to explore ListWithAvatars component
 * with different configurations and live preview.
 */
const ListWithAvatarsDemo = () => {
    const [type, setType] = useState<'unordered' | 'ordered' | undefined>();
    const [spacing, setSpacing] = useState<'sm' | 'md' | 'lg'>('md');
    const [avatarSize, setAvatarSize] = useState<'sm' | 'md' | 'lg' | 'xl'>('md');
    const [avatarShape, setAvatarShape] = useState<'circle' | 'square' | 'rounded'>('circle');
    const [items, setItems] = useState<ListItemWithAvatar[]>();

    /**
     * Memoized click handler to prevent unnecessary re-renders
     */
    const handleItemClick = useCallback((item: ListItemWithAvatar, index: number) => {
        console.log('Clicked item:', item.name, 'at index:', index);
    }, []);

    /**
     * Generate code string based on current configuration
     */
    const codeString = `
const items = ${JSON.stringify(items, null, 2)};

<ListWithAvatars 
  items={items}
  ${type ? `type="${type}"` : ''}
  spacing="${spacing}"
  avatarSize="${avatarSize}"
  avatarShape="${avatarShape}"
  showProfileLinks={true}
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
                <VariantSelector
                    variants={avatarSizes}
                    selectedVariant={avatarSize}
                    onSelectVariant={(val) => setAvatarSize(val as 'sm' | 'md' | 'lg' | 'xl')}
                    type="Avatar Size"
                />
                <VariantSelector
                    variants={avatarShapes}
                    selectedVariant={avatarShape}
                    onSelectVariant={(val) => setAvatarShape(val as 'circle' | 'square' | 'rounded')}
                    type="Avatar Shape"
                />
            </div>

            {/* Preview and Code Tabs */}
            <Tabs>
                <TabItem value="preview" label="Preview" default>
                    <div className="p-6 border rounded-lg mt-4">
                        <ListWithAvatars
                            items={items || []}
                            type={type}
                            spacing={spacing}
                            avatarSize={avatarSize}
                            avatarShape={avatarShape}
                            showProfileLinks={true}
                            onItemClick={handleItemClick}
                        />
                    </div>
                    <p className="text-sm text-muted-foreground mt-4">
                        Click on items to navigate to their profiles. Avatars are aligned on the left, with names and descriptions on the right.
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
 * Avatar alignment demo
 * 
 * Shows how avatars are consistently aligned on the left side.
 */
export const AvatarAlignment = () => {
    const items: ListItemWithAvatar[] = [
        {
            id: '1',
            name: 'Sarah Chen',
            description: 'Engineering Manager',
            profileLink: '/profile/sarah-chen',
            avatarSrc: 'https://i.pravatar.cc/150?img=5',
            avatarAlt: 'Sarah Chen',
        },
        {
            id: '2',
            name: 'Michael Torres',
            description: 'Senior Frontend Developer',
            profileLink: '/profile/michael-torres',
            avatarSrc: 'https://i.pravatar.cc/150?img=6',
            avatarAlt: 'Michael Torres',
        },
        {
            id: '3',
            name: 'Emily Davis',
            description: 'Product Manager',
            profileLink: '/profile/emily-davis',
            avatarLetters: 'ED',
        },
    ];

    const codeString = `
<ListWithAvatars
  items={items}
  spacing="md"
  avatarSize="md"
/>
`;

    return (
        <div className="space-y-6 mb-8">
            {/* <h3 className="text-lg font-semibold">Avatar Alignment</h3> */}
            <Tabs>
                <TabItem value="preview" label="Preview" default>
                    <div className="p-6 border rounded-lg">
                        <ListWithAvatars
                            items={items}
                            spacing="md"
                            avatarSize="md"
                        />
                        <p className="text-sm text-muted-foreground mt-4">
                            Avatars are consistently aligned on the left, ensuring a clean and organized appearance.
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
 * Profile links demo
 * 
 * Shows how profile links work and are functional.
 */
export const ProfileLinks = () => {
    const items: ListItemWithAvatar[] = [
        {
            id: '1',
            name: 'John Doe',
            description: 'Software Engineer',
            profileLink: '/profile/john-doe',
            avatarSrc: 'https://i.pravatar.cc/150?img=1',
            avatarAlt: 'John Doe',
        },
        {
            id: '2',
            name: 'Jane Smith',
            description: 'Product Designer',
            profileLink: '/profile/jane-smith',
            avatarSrc: 'https://i.pravatar.cc/150?img=2',
            avatarAlt: 'Jane Smith',
        },
        {
            id: '3',
            name: 'Bob Johnson',
            description: 'UX Researcher',
            profileLink: '/profile/bob-johnson',
            avatarLetters: 'BJ',
        },
    ];

    const codeString = `
const items = [
  {
    id: '1',
    name: 'John Doe',
    description: 'Software Engineer',
    profileLink: '/profile/john-doe',
    avatarSrc: '/avatars/john.jpg',
    avatarAlt: 'John Doe',
  },
  // ... more items
];

<ListWithAvatars
  items={items}
  showProfileLinks={true}
/>
`;

    return (
        <div className="space-y-6 mb-8">
            {/* <h3 className="text-lg font-semibold">Profile Links</h3> */}
            <Tabs>
                <TabItem value="preview" label="Preview" default>
                    <div className="p-6 border rounded-lg">
                        <ListWithAvatars
                            items={items}
                            showProfileLinks={true}
                        />
                        <p className="text-sm text-muted-foreground mt-4">
                            Click on any item to navigate to the profile. Links are fully functional and accessible.
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
 * Avatar variants demo
 * 
 * Shows different avatar sizes and shapes.
 */
export const AvatarVariants = () => {
    const items: ListItemWithAvatar[] = [
        {
            id: '1',
            name: 'Small Avatar',
            description: 'Size: sm',
            profileLink: '/profile/1',
            avatarLetters: 'SA',
            avatarSize: 'sm',
        },
        {
            id: '2',
            name: 'Medium Avatar',
            description: 'Size: md',
            profileLink: '/profile/2',
            avatarLetters: 'MA',
            avatarSize: 'md',
        },
        {
            id: '3',
            name: 'Large Avatar',
            description: 'Size: lg',
            profileLink: '/profile/3',
            avatarLetters: 'LA',
            avatarSize: 'lg',
        },
    ];

    const codeString = `
<ListWithAvatars
  items={items}
  spacing="md"
/>
`;

    return (
        <div className="space-y-6 mb-8">
            {/* <h3 className="text-lg font-semibold">Avatar Variants</h3> */}
            <Tabs>
                <TabItem value="preview" label="Preview" default>
                    <div className="space-y-8">
                        <div>
                            <h4 className="text-sm font-semibold mb-2">Different Sizes</h4>
                            <div className="p-6 border rounded-lg">
                                <ListWithAvatars
                                    items={items}
                                    spacing="md"
                                />
                            </div>
                        </div>
                        <div>
                            <h4 className="text-sm font-semibold mb-2">Different Shapes</h4>
                            <div className="p-6 border rounded-lg">
                                <ListWithAvatars
                                    items={[
                                        {
                                            id: '1',
                                            name: 'Circle Avatar',
                                            description: 'Shape: circle',
                                            profileLink: '/profile/1',
                                            avatarLetters: 'CA',
                                            avatarShape: 'circle',
                                        },
                                        {
                                            id: '2',
                                            name: 'Square Avatar',
                                            description: 'Shape: square',
                                            profileLink: '/profile/2',
                                            avatarLetters: 'SA',
                                            avatarShape: 'square',
                                        },
                                        {
                                            id: '3',
                                            name: 'Rounded Avatar',
                                            description: 'Shape: rounded',
                                            profileLink: '/profile/3',
                                            avatarLetters: 'RA',
                                            avatarShape: 'rounded',
                                        },
                                    ]}
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
 * Text readability demo
 * 
 * Shows how text (names and descriptions) are clearly readable.
 */
export const TextReadability = () => {
    const items: ListItemWithAvatar[] = [
        {
            id: '1',
            name: 'Dr. John Michael Doe',
            description: 'Senior Software Engineer - Full Stack Development',
            profileLink: '/profile/john-doe',
            avatarSrc: 'https://i.pravatar.cc/150?img=1',
            avatarAlt: 'John Doe',
        },
        {
            id: '2',
            name: 'Jane Elizabeth Smith',
            description: 'Lead Product Designer - User Experience & Interface Design',
            profileLink: '/profile/jane-smith',
            avatarSrc: 'https://i.pravatar.cc/150?img=2',
            avatarAlt: 'Jane Smith',
        },
        {
            id: '3',
            name: 'Robert James Johnson',
            description: 'Principal UX Researcher - Human-Computer Interaction',
            profileLink: '/profile/bob-johnson',
            avatarLetters: 'RJ',
        },
    ];

    const codeString = `
<ListWithAvatars
  items={items}
  spacing="md"
/>
`;

    return (
        <div className="space-y-6 mb-8">
            {/* <h3 className="text-lg font-semibold">Text Readability</h3> */}
            <Tabs>
                <TabItem value="preview" label="Preview" default>
                    <div className="p-6 border rounded-lg">
                        <ListWithAvatars
                            items={items}
                            spacing="md"
                        />
                        <p className="text-sm text-muted-foreground mt-4">
                            Names use a medium font weight for emphasis, while descriptions use smaller, muted text. Long text is automatically truncated.
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

export default ListWithAvatarsDemo;

