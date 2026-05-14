import React, { useState } from 'react';
import type { JSX } from 'react';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';
import VariantSelector from './VariantSelector';
import { useColorMode } from '@docusaurus/theme-common';
import { cn } from '@site/src/utils/cn';
import { Button } from '@site/src/components/UI/button';
import {
    Timeline,
    type TimelineItem,
    type TimelineVariant,
    type TimelineFilter,
} from '@site/src/components/UI/timeline-view-page';

const SAMPLE_ITEMS: TimelineItem[] = [
    {
        id: '1',
        title: 'Project kickoff',
        description: 'Aligned on goals, scope, and milestones with stakeholders.',
        date: '2025-09-04',
        status: 'completed',
        meta: 'Milestone 01',
    },
    {
        id: '2',
        title: 'Design system v1',
        description: 'Tokens, primitives, and core components shipped to the library.',
        date: '2025-10-12',
        status: 'completed',
        meta: 'Milestone 02',
    },
    {
        id: '3',
        title: 'Beta release',
        description: 'Rolled out to 200 early-access users; collecting telemetry.',
        date: '2025-12-01',
        status: 'completed',
        meta: 'Milestone 03',
    },
    {
        id: '4',
        title: 'Public launch',
        description: 'Marketing site live, payments enabled, support runbooks ready.',
        date: '2026-04-22',
        status: 'in_progress',
        meta: 'Milestone 04',
    },
    {
        id: '5',
        title: 'Mobile companion app',
        description: 'iOS and Android shells with offline sync.',
        date: '2026-07-15',
        status: 'pending',
        meta: 'Milestone 05',
    },
    {
        id: '6',
        title: 'Enterprise tier',
        description: 'SSO, audit logs, and dedicated support SLAs.',
        date: '2026-10-30',
        status: 'pending',
        meta: 'Milestone 06',
    },
];

type OrientationVariant = 'auto' | 'vertical' | 'horizontal';
type StateVariant = 'normal' | 'loading';
type ThemeVariant = 'light' | 'dark';

const variantOptions = [
    { value: 'default', label: 'Default' },
    { value: 'minimal', label: 'Minimal' },
    { value: 'compact', label: 'Compact' },
    { value: 'glow', label: 'Glow' },
];

const orientationOptions = [
    { value: 'auto', label: 'Auto (responsive)' },
    { value: 'vertical', label: 'Vertical' },
    { value: 'horizontal', label: 'Horizontal' },
];

const stateOptions = [
    { value: 'normal', label: 'Normal' },
    { value: 'loading', label: 'Loading' },
];

const filterOptions = [
    { value: 'all', label: 'All' },
    { value: 'completed', label: 'Completed' },
    { value: 'in_progress', label: 'In progress' },
    { value: 'pending', label: 'Pending' },
];

export const TimelineViewPageDemo = (): JSX.Element => {
    const { colorMode } = useColorMode();

    const [variant, setVariant] = useState<TimelineVariant>('default');
    const [orientation, setOrientation] = useState<OrientationVariant>('vertical');
    const [stateVariant, setStateVariant] = useState<StateVariant>('normal');
    const [defaultFilter, setDefaultFilter] = useState<TimelineFilter>('all');
    const [showFilters, setShowFilters] = useState<boolean>(true);
    const [enableDetails, setEnableDetails] = useState<boolean>(true);

    const themeVariant: ThemeVariant = colorMode === 'dark' ? 'dark' : 'light';

    const buildCodeString = (): string => {
        const props = [
            `items={SAMPLE_ITEMS}`,
            `variant="${variant}"`,
            `orientation="${orientation}"`,
            `defaultFilter="${defaultFilter}"`,
            `showFilters={${showFilters}}`,
            `enableDetails={${enableDetails}}`,
            stateVariant === 'loading' ? `isLoading` : null,
        ].filter(Boolean);

        return `import {
    Timeline,
    type TimelineItem,
} from '@ignix-ui/timeline-view-page';

const SAMPLE_ITEMS: TimelineItem[] = [
    {
        id: '1',
        title: 'Project kickoff',
        description: 'Aligned on goals, scope, and milestones with stakeholders.',
        date: '2025-09-04',
        status: 'completed',
        meta: 'Milestone 01',
    },
    {
        id: '2',
        title: 'Design system v1',
        description: 'Tokens, primitives, and core components shipped to the library.',
        date: '2025-10-12',
        status: 'completed',
        meta: 'Milestone 02',
    },
    {
        id: '3',
        title: 'Beta release',
        description: 'Rolled out to 200 early-access users; collecting telemetry.',
        date: '2025-12-01',
        status: 'completed',
        meta: 'Milestone 03',
    },
    {
        id: '4',
        title: 'Public launch',
        description: 'Marketing site live, payments enabled, support runbooks ready.',
        date: '2026-04-22',
        status: 'in_progress',
        meta: 'Milestone 04',
    },
    {
        id: '5',
        title: 'Mobile companion app',
        description: 'iOS and Android shells with offline sync.',
        date: '2026-07-15',
        status: 'pending',
        meta: 'Milestone 05',
    },
];

export function MyTimeline() {
    return (
        <Timeline
            ${props.join('\n            ')}
        />
    );
}`;
    };

    return (
        <div className="space-y-6">
            {/* Variant selectors */}
            <div className="flex items-center justify-end flex-wrap gap-2">
                <div className="space-y-2 mx-1">
                    <VariantSelector
                        variants={variantOptions.map((o) => o.value)}
                        selectedVariant={variant}
                        onSelectVariant={(value): void => setVariant(value as TimelineVariant)}
                        type="Variant"
                        variantLabels={Object.fromEntries(
                            variantOptions.map((o) => [o.value, o.label]),
                        )}
                    />
                </div>

                <div className="space-y-2 mx-1">
                    <VariantSelector
                        variants={orientationOptions.map((o) => o.value)}
                        selectedVariant={orientation}
                        onSelectVariant={(value): void =>
                            setOrientation(value as OrientationVariant)
                        }
                        type="Orientation"
                        variantLabels={Object.fromEntries(
                            orientationOptions.map((o) => [o.value, o.label]),
                        )}
                    />
                </div>

                <div className="space-y-2 mx-1">
                    <VariantSelector
                        variants={filterOptions.map((o) => o.value)}
                        selectedVariant={defaultFilter}
                        onSelectVariant={(value): void =>
                            setDefaultFilter(value as TimelineFilter)
                        }
                        type="Default Filter"
                        variantLabels={Object.fromEntries(
                            filterOptions.map((o) => [o.value, o.label]),
                        )}
                    />
                </div>

                <div className="space-y-2 mx-1">
                    <VariantSelector
                        variants={stateOptions.map((o) => o.value)}
                        selectedVariant={stateVariant}
                        onSelectVariant={(value): void => setStateVariant(value as StateVariant)}
                        type="State"
                        variantLabels={Object.fromEntries(
                            stateOptions.map((o) => [o.value, o.label]),
                        )}
                    />
                </div>
            </div>

            {/* Feature toggles */}
            <div className="flex flex-row items-center justify-end flex-wrap gap-3 px-2">
                {[
                    { label: 'Filter Pills', value: showFilters, set: setShowFilters },
                    {
                        label: 'Click-to-Open Drawer',
                        value: enableDetails,
                        set: setEnableDetails,
                    },
                ].map((t) => (
                    <label key={t.label} className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={t.value}
                            onChange={(e): void => t.set(e.target.checked)}
                            className="rounded text-primary"
                        />
                        <span
                            className={cn(
                                'text-sm',
                                themeVariant === 'dark' ? 'text-gray-200' : 'text-gray-700',
                            )}
                        >
                            {t.label}
                        </span>
                    </label>
                ))}
                <Button
                    variant="outline"
                    size="sm"
                    onClick={(): void => {
                        setVariant('default');
                        setOrientation('vertical');
                        setStateVariant('normal');
                        setDefaultFilter('all');
                        setShowFilters(true);
                        setEnableDetails(true);
                    }}
                    className="cursor-pointer mx-2"
                >
                    Reset All
                </Button>
            </div>

            {/* Preview and Code Tabs */}
            <Tabs>
                <TabItem value="preview" label="Preview">
                    <div
                        className={cn(
                            'border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden p-6',
                            themeVariant === 'dark' ? 'bg-gray-950' : 'bg-white',
                        )}
                    >
                        <Timeline
                            items={SAMPLE_ITEMS}
                            variant={variant}
                            orientation={orientation}
                            defaultFilter={defaultFilter}
                            showFilters={showFilters}
                            enableDetails={enableDetails}
                            isLoading={stateVariant === 'loading'}
                            skeletonCount={3}
                        />
                    </div>
                </TabItem>

                <TabItem value="code" label="Code">
                    <div className="mt-4">
                        <CodeBlock language="tsx" className="text-sm">
                            {buildCodeString()}
                        </CodeBlock>
                    </div>
                </TabItem>
            </Tabs>
        </div>
    );
};

export default TimelineViewPageDemo;
