import React, { useState } from 'react';
import type { JSX } from 'react';
import {
    StatsGrid,
    StatsGridTitle,
    StatsGridDescription,
    StatsGridCard,
    StatsGridContainer,
} from '../UI/stats-grid';
import {
    Users, DollarSign, Download, Star, Shield, Globe, Heart, Activity
} from 'lucide-react';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';
import VariantSelector from './VariantSelector';
import { useColorMode } from '@docusaurus/theme-common';


/* ============================================
   OPTIONS
============================================ */

const themeOptions = [
    { value: 'light', label: 'Light Theme' },
    { value: 'dark', label: 'Dark Theme (Solid)' },
];

const columnOptions = [
    { value: 2, label: '2 Columns' },
    { value: 3, label: '3 Columns' },
    { value: 4, label: '4 Columns' },
    { value: 5, label: '5 Columns' },
    { value: 6, label: '6 Columns' },
];

const alignOptions = [
    { value: 'left', label: 'Left Aligned' },
    { value: 'center', label: 'Center Aligned' },
    { value: 'right', label: 'Right Aligned' },
];

const gapOptions = [
    { value: 'sm', label: 'Small Gap' },
    { value: 'md', label: 'Medium Gap' },
    { value: 'lg', label: 'Large Gap' },
    { value: 'xl', label: 'Extra Large Gap' },
];

const paddingOptions = [
    { value: 'sm', label: 'Small Padding' },
    { value: 'md', label: 'Medium Padding' },
    { value: 'lg', label: 'Large Padding' },
    { value: 'xl', label: 'Extra Large Padding' },
    { value: '2xl', label: '2X Large Padding' },
];



/* ============================================
   SAMPLE STATS DATA
============================================ */

const sampleStats = [
    {
        id: '1',
        value: 10000000,
        label: 'Active Users',
        subtext: 'Growing 20% month over month',
        icon: Users,
        format: 'compact' as const,
    },
    {
        id: '2',
        value: 99.9,
        label: 'Uptime SLA',
        subtext: 'Enterprise-grade reliability',
        icon: Shield,
        format: 'percentage' as const,
    },
    {
        id: '3',
        value: 2500000000,
        label: 'Annual Revenue',
        subtext: 'Record growth this quarter',
        icon: DollarSign,
        format: 'currency' as const,
    },
    {
        id: '4',
        value: 50000000,
        label: 'Total Downloads',
        subtext: 'Across all platforms',
        icon: Download,
        format: 'compact' as const,
        suffix: '+',
    },
    {
        id: '5',
        value: 4.9,
        label: 'App Store Rating',
        subtext: 'Based on 50K+ reviews',
        icon: Star,
        format: 'raw' as const,
        decimals: 1,
    },
    {
        id: '6',
        value: 98.5,
        label: 'Customer Satisfaction',
        subtext: 'NPS Score',
        icon: Heart,
        format: 'percentage' as const,
    },
    {
        id: '7',
        value: 1500000,
        label: 'API Calls/Day',
        subtext: 'Average daily volume',
        icon: Activity,
        format: 'compact' as const,
    },
    {
        id: '8',
        value: 45,
        label: 'Countries Served',
        subtext: 'Global presence',
        icon: Globe,
        format: 'raw' as const,
    },
];

type Theme = 'light' | 'dark';
type Columns = 2 | 3 | 4 | 5 | 6;
type Align = 'left' | 'center' | 'right';
type Gap = 'sm' | 'md' | 'lg' | 'xl';
type Padding = 'sm' | 'md' | 'lg' | 'xl' | '2xl';

/* ============================================
   1. SIMPLE DEMO - BASIC CUSTOMIZATION
============================================ */

export const StatsGridSimpleDemo = (): JSX.Element => {
    const { colorMode } = useColorMode();
    const [theme, setTheme] = useState<Theme>(
        colorMode === 'dark' ? 'dark' : 'light'
    );
    const [columns, setColumns] = useState<Columns>(4);
    const [align, setAlign] = useState<Align>('center');
    const [gap, setGap] = useState<Gap>('md');
    const [padding, setPadding] = useState<Padding>('lg');
    const [animated, setAnimated] = useState(true);
    const [showTitle, setShowTitle] = useState(true);
    const [showDescription, setShowDescription] = useState(true);
    const [showIcons, setShowIcons] = useState(true);
    const [showSubtext, setShowSubtext] = useState(true);
    const [statsCount, setStatsCount] = useState(6);

    const displayedStats = sampleStats.slice(0, statsCount);


    // Generate the props-only code (shorter version)
    const generatePropsCode = (): string => {
        return `
import { StatsGrid, StatsGridTitle, StatsGridDescription, StatsGridContainer, StatsGridCard } from '@ignix-ui/stats-grid';
import { Users, DollarSign, Download, Star, Shield, Globe, Heart, Activity } from 'lucide-react';

function StatsGridDemo() {

  const stats = [
        {
            id: '1',
            value: 10000000,
            label: 'Active Users',
            subtext: 'Growing 20% month over month',
            icon: Users,
            format: 'compact' as const,
        },
        {
            id: '2',
            value: 99.9,
            label: 'Uptime SLA',
            subtext: 'Enterprise-grade reliability',
            icon: Shield,
            format: 'percentage' as const,
        },
        {
            id: '3',
            value: 2500000000,
            label: 'Annual Revenue',
            subtext: 'Record growth this quarter',
            icon: DollarSign,
            format: 'currency' as const,
        },
        {
            id: '4',
            value: 50000000,
            label: 'Total Downloads',
            subtext: 'Across all platforms',
            icon: Download,
            format: 'compact' as const,
            suffix: '+',
        },
        {
            id: '5',
            value: 4.9,
            label: 'App Store Rating',
            subtext: 'Based on 50K+ reviews',
            icon: Star,
            format: 'raw' as const,
            decimals: 1,
        },
        {
            id: '6',
            value: 98.5,
            label: 'Customer Satisfaction',
            subtext: 'NPS Score',
            icon: Heart,
            format: 'percentage' as const,
        },
        {
            id: '7',
            value: 1500000,
            label: 'API Calls/Day',
            subtext: 'Average daily volume',
            icon: Activity,
            format: 'compact' as const,
        },
        {
            id: '8',
            value: 45,
            label: 'Countries Served',
            subtext: 'Global presence',
            icon: Globe,
            format: 'raw' as const,
        },
    ];

  return (
    <StatsGrid
        variant="${theme}"
        columns={${columns}}
        contentAlign="${align}"
        animated={${animated}}
        gap="${gap}"
        padding="${padding}"
    >
        ${showTitle ? '<StatsGridTitle>Simple Stats Grid Demo</StatsGridTitle>' : ''}
        ${showDescription ? '<StatsGridDescription>Basic customization with light/dark themes and layout options</StatsGridDescription>' : ''}
        <StatsGridContainer>
            {stats.map((stat, index) => (
                <StatsGridCard
                    key={stat.id}
                    stat={stat}
                    index={index}
                />
            ))}
        </StatsGridContainer>
    </StatsGrid>
  );
}
        `;
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap gap-4 justify-end">
                <VariantSelector
                    variants={themeOptions.map(o => o.value)}
                    selectedVariant={theme}
                    onSelectVariant={(v): void => setTheme(v as Theme)}
                    type="Theme"
                    getLabel={(v): string => themeOptions.find(o => o.value === v)?.label || v}
                />
                <VariantSelector
                    variants={columnOptions.map(o => o.value.toString())}
                    selectedVariant={columns.toString()}
                    onSelectVariant={(v): void => setColumns(Number(v) as Columns)}
                    type="Columns"
                    getLabel={(v): string => columnOptions.find(o => o.value.toString() === v)?.label || v}
                />
                <VariantSelector
                    variants={alignOptions.map(o => o.value)}
                    selectedVariant={align}
                    onSelectVariant={(v): void => setAlign(v as Align)}
                    type="Align"
                    getLabel={(v): string => alignOptions.find(o => o.value === v)?.label || v}
                />
                <VariantSelector
                    variants={gapOptions.map(o => o.value)}
                    selectedVariant={gap}
                    onSelectVariant={(v): void => setGap(v as Gap)}
                    type="Gap"
                    getLabel={(v): string => gapOptions.find(o => o.value === v)?.label || v}
                />
                <VariantSelector
                    variants={paddingOptions.map(o => o.value)}
                    selectedVariant={padding}
                    onSelectVariant={(v): void => setPadding(v as Padding)}
                    type="Padding"
                    getLabel={(v): string => paddingOptions.find(o => o.value === v)?.label || v}
                />
            </div>

            <div className="flex flex-wrap gap-4 items-center p-4 border rounded-lg">
                <label className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={animated}
                        onChange={(e): void => setAnimated(e.target.checked)}
                    />
                    <span className="text-sm font-medium">Animated</span>
                </label>
                <label className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={showTitle}
                        onChange={(e): void => setShowTitle(e.target.checked)}
                    />
                    <span className="text-sm font-medium">Title</span>
                </label>
                <label className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={showDescription}
                        onChange={(e): void => setShowDescription(e.target.checked)}
                    />
                    <span className="text-sm font-medium">Description</span>
                </label>
                <label className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={showIcons}
                        onChange={(e): void => setShowIcons(e.target.checked)}
                    />
                    <span className="text-sm font-medium">Icons</span>
                </label>
                <label className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={showSubtext}
                        onChange={(e): void => setShowSubtext(e.target.checked)}
                    />
                    <span className="text-sm font-medium">Subtext</span>
                </label>
                <div className="flex items-center gap-2 ml-auto">
                    <span className="text-sm font-medium">Stats: {statsCount}</span>
                    <input
                        type="range"
                        min="1"
                        max="8"
                        value={statsCount}
                        onChange={(e): void => setStatsCount(parseInt(e.target.value))}
                        className="w-24"
                    />
                </div>
            </div>

            <Tabs>
                <TabItem value="preview" label="Preview">
                    <div className="border rounded-lg overflow-hidden">
                        <StatsGrid
                            variant={theme}
                            columns={columns}
                            contentAlign={align}
                            animated={animated}
                            gap={gap}
                            padding={padding}
                        >
                            {showTitle && <StatsGridTitle>Simple Stats Grid Demo</StatsGridTitle>}
                            {showDescription && (
                                <StatsGridDescription>
                                    Basic customization with light/dark themes and layout options
                                </StatsGridDescription>
                            )}
                            <StatsGridContainer>
                                {displayedStats.map((stat, index) => (
                                    <StatsGridCard
                                        key={stat.id}
                                        stat={{
                                            ...stat,
                                            icon: showIcons ? stat.icon : undefined,
                                            subtext: showSubtext ? stat.subtext : undefined,
                                            accent: index % 2 === 0 ? 'blue' : 'purple',
                                        }}
                                        index={index}
                                    />
                                ))}
                            </StatsGridContainer>
                        </StatsGrid>
                    </div>
                </TabItem>
                <TabItem value="props" label="Code">
                    <div className="space-y-4">
                        <CodeBlock language="tsx" className="text-sm">
                            {generatePropsCode()}
                        </CodeBlock>
                    </div>
                </TabItem>
            </Tabs>
        </div>
    );
};