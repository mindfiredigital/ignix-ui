import React, { useState } from 'react';
import {
    StatsGrid,
    StatsGridTitle,
    StatsGridDescription,
    StatsGridCard,
    StatsGridContainer,
    // StatValue,
    // StatLabel,
    // StatSubtext,
    // StatIcon,
} from '../UI/stats-grid';
import {
    Users, DollarSign, Download, Star, Shield, Globe, Heart, Activity
} from 'lucide-react';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';
import VariantSelector from './VariantSelector';
import { cn } from "@site/src/utils/cn";
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
        suffix: '%',
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
        suffix: '%',
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

/* ============================================
   1. SIMPLE DEMO - BASIC CUSTOMIZATION
============================================ */

export const StatsGridSimpleDemo = () => {
    const { colorMode } = useColorMode();
    const [theme, setTheme] = useState(colorMode === 'dark' ? 'dark' : 'light');
    const [columns, setColumns] = useState(4);
    const [align, setAlign] = useState('center');
    // const [animationType, setAnimationType] = useState('slide');
    const [gap, setGap] = useState('md');
    const [padding, setPadding] = useState('lg');
    const [animated, setAnimated] = useState(true);
    const [showTitle, setShowTitle] = useState(true);
    const [showDescription, setShowDescription] = useState(true);
    const [showIcons, setShowIcons] = useState(true);
    const [showSubtext, setShowSubtext] = useState(true);
    const [statsCount, setStatsCount] = useState(6);

    const displayedStats = sampleStats.slice(0, statsCount);

    // Generate the stats array code based on current selections
    const generateStatsArrayCode = () => {
        return displayedStats.map((stat, index) => {
            const accent = index % 2 === 0 ? 'blue' : 'purple';
            const iconProp = showIcons ? `\n        icon: ${stat.icon.name},` : '';
            const subtextProp = showSubtext && stat.subtext ? `\n        subtext: "${stat.subtext}",` : '';
            const suffixProp = stat.suffix ? `\n        suffix: "${stat.suffix}",` : '';
            const decimalsProp = stat.decimals ? `\n        decimals: ${stat.decimals},` : '';

            return `    {
      id: '${stat.id}',
      value: ${stat.value},
      label: "${stat.label}",${subtextProp}${iconProp}
      format: "${stat.format}",${suffixProp}${decimalsProp}
      accent: "${accent}",
    }`;
        }).join(',\n');
    };

    // Generate the complete component code
    const generateCompleteCode = () => {
        const statsArray = generateStatsArrayCode();

        return `import React from 'react';
import { StatsGrid, StatsGridTitle, StatsGridDescription, StatsGridCard, StatsGridContainer } from 'your-path/to/stats-grid';
import { ${displayedStats.map(s => s.icon.name).filter((v, i, a) => a.indexOf(v) === i).join(', ')} } from 'lucide-react';

const StatsGridExample = () => {
  const stats = [
${statsArray}
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
      ${showTitle ? `<StatsGridTitle>Simple Stats Grid Demo</StatsGridTitle>` : ''}
      ${showDescription ? `<StatsGridDescription>
        Basic customization with light/dark themes and layout options
      </StatsGridDescription>` : ''}
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
};

export default StatsGridExample;`;
    };

    // Generate the props-only code (shorter version)
    const generatePropsCode = () => {
        return `<StatsGrid
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
</StatsGrid>`;
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap gap-4 justify-end">
                <VariantSelector
                    variants={themeOptions.map(o => o.value)}
                    selectedVariant={theme}
                    onSelectVariant={setTheme}
                    type="Theme"
                    getLabel={(v) => themeOptions.find(o => o.value === v)?.label || v}
                />
                <VariantSelector
                    variants={columnOptions.map(o => o.value.toString())}
                    selectedVariant={columns.toString()}
                    onSelectVariant={(v) => setColumns(Number(v))}
                    type="Columns"
                    getLabel={(v) => columnOptions.find(o => o.value.toString() === v)?.label || v}
                />
                <VariantSelector
                    variants={alignOptions.map(o => o.value)}
                    selectedVariant={align}
                    onSelectVariant={setAlign}
                    type="Align"
                    getLabel={(v) => alignOptions.find(o => o.value === v)?.label || v}
                />
                <VariantSelector
                    variants={gapOptions.map(o => o.value)}
                    selectedVariant={gap}
                    onSelectVariant={setGap}
                    type="Gap"
                    getLabel={(v) => gapOptions.find(o => o.value === v)?.label || v}
                />
                <VariantSelector
                    variants={paddingOptions.map(o => o.value)}
                    selectedVariant={padding}
                    onSelectVariant={setPadding}
                    type="Padding"
                    getLabel={(v) => paddingOptions.find(o => o.value === v)?.label || v}
                />
            </div>

            <div className="flex flex-wrap gap-4 items-center p-4 border rounded-lg">
                <label className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={animated}
                        onChange={(e) => setAnimated(e.target.checked)}
                    />
                    <span className="text-sm font-medium">Animated</span>
                </label>
                <label className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={showTitle}
                        onChange={(e) => setShowTitle(e.target.checked)}
                    />
                    <span className="text-sm font-medium">Title</span>
                </label>
                <label className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={showDescription}
                        onChange={(e) => setShowDescription(e.target.checked)}
                    />
                    <span className="text-sm font-medium">Description</span>
                </label>
                <label className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={showIcons}
                        onChange={(e) => setShowIcons(e.target.checked)}
                    />
                    <span className="text-sm font-medium">Icons</span>
                </label>
                <label className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={showSubtext}
                        onChange={(e) => setShowSubtext(e.target.checked)}
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
                        onChange={(e) => setStatsCount(parseInt(e.target.value))}
                        className="w-24"
                    />
                </div>
            </div>

            <Tabs>
                <TabItem value="preview" label="Preview">
                    <div className="border rounded-lg overflow-hidden">
                        <StatsGrid
                            variant={theme as any}
                            columns={columns as any}
                            contentAlign={align as any}
                            animated={animated}
                            gap={gap as any}
                            padding={padding as any}
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
                <TabItem value="code" label="Complete Code">
                    <div className="space-y-4">
                        <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">📋 Complete component code with all customizations:</p>
                            <CodeBlock language="tsx" className="text-sm">
                                {generateCompleteCode()}
                            </CodeBlock>
                        </div>
                    </div>
                </TabItem>
                <TabItem value="props" label="Props Only">
                    <div className="space-y-4">
                        <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">⚙️ StatsGrid props based on current selections:</p>
                            <CodeBlock language="tsx" className="text-sm">
                                {generatePropsCode()}
                            </CodeBlock>
                        </div>
                    </div>
                </TabItem>
            </Tabs>
        </div>
    );
};

/* ============================================
   2. VIBRANT EXAMPLES SHOWCASE
============================================ */

export const VibrantExamplesDemo = () => {
    const [selectedExample, setSelectedExample] = useState('neon-nights');

    const examples = [
        {
            id: 'neon-nights',
            name: '🎮 Neon Nights',
            variant: 'dark' as const,
            columns: 4,
            bgColor: 'bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950',
            cardBgColor: 'bg-gradient-to-br from-blue-900/40 to-purple-900/40 backdrop-blur-md',
            cardBorderColor: 'border-blue-800/50',
            textColor: 'text-white',
            iconBgColor: 'bg-gradient-to-br from-fuchsia-500 to-pink-500',
            iconColor: 'text-white',
            cardAccents: ['blue', 'fuchsia'],
            description: 'Cyberpunk-inspired neon on deep dark background'
        },
        {
            id: 'citrus-burst',
            name: '🍊 Citrus Burst',
            variant: 'light' as const,
            columns: 4,
            bgColor: 'bg-gradient-to-br from-yellow-500 via-orange-500 to-red-500',
            cardBgColor: 'bg-white/95 backdrop-blur-sm',
            cardBorderColor: 'border-orange-300',
            textColor: 'text-gray-900',
            iconBgColor: 'bg-gradient-to-br from-lime-400 to-emerald-400',
            iconColor: 'text-white',
            cardAccents: ['orange', 'red'],
            description: 'Zesty citrus explosion with fresh green accents'
        },
        {
            id: 'cherry-blossom',
            name: '🌸 Cherry Blossom',
            variant: 'light' as const,
            columns: 4,
            bgColor: 'bg-gradient-to-br from-pink-400 via-rose-300 to-purple-300',
            cardBgColor: 'bg-white/80 backdrop-blur-sm',
            cardBorderColor: 'border-pink-300',
            textColor: 'text-gray-900',
            iconBgColor: 'bg-gradient-to-br from-purple-500 to-pink-500',
            iconColor: 'text-white',
            cardAccents: ['pink', 'purple'],
            description: 'Soft sakura-inspired pastels with vibrant icon accents'
        },
        {
            id: 'fruit-punch',
            name: '🧃 Fruit Punch',
            variant: 'light' as const,
            columns: 4,
            bgColor: 'bg-gradient-to-br from-red-500 via-pink-500 to-purple-500',
            cardBgColor: 'bg-white/90 backdrop-blur-sm',
            cardBorderColor: 'border-red-300',
            textColor: 'text-gray-900',
            iconBgColor: 'bg-gradient-to-br from-lime-400 to-green-400',
            iconColor: 'text-white',
            cardAccents: ['red', 'pink'],
            description: 'Bold fruit cocktail with fresh lime accents'
        },
        {
            id: 'electric-blue',
            name: '⚡ Electric Blue',
            variant: 'dark' as const,
            columns: 4,
            bgColor: 'bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600',
            cardBgColor: 'bg-white/10 backdrop-blur-md',
            cardBorderColor: 'border-white/30',
            textColor: 'text-white',
            iconBgColor: 'bg-gradient-to-br from-yellow-400 to-amber-400',
            iconColor: 'text-indigo-900',
            cardAccents: ['blue', 'indigo'],
            description: 'High-voltage blues with electric yellow accents'
        },
        {
            id: 'tropical-punch',
            name: '🍹 Tropical Punch',
            variant: 'light' as const,
            columns: 4,
            bgColor: 'bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500',
            cardBgColor: 'bg-white/90 backdrop-blur-sm',
            cardBorderColor: 'border-emerald-300',
            textColor: 'text-gray-900',
            iconBgColor: 'bg-gradient-to-br from-amber-500 to-orange-500',
            iconColor: 'text-white',
            cardAccents: ['emerald', 'teal'],
            description: 'Fresh tropical vibes with warm sunset accents'
        }
    ];

    const currentExample = examples.find(ex => ex.id === selectedExample) || examples[0];

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
            value: 2500000000,
            label: 'Revenue',
            subtext: 'Annual recurring revenue',
            icon: DollarSign,
            format: 'currency' as const,
        },
        {
            id: '3',
            value: 99.9,
            label: 'Uptime',
            subtext: 'Enterprise-grade reliability',
            icon: Shield,
            format: 'percentage' as const,
            suffix: '%',
        },
        {
            id: '4',
            value: 50000000,
            label: 'Downloads',
            subtext: 'Across all platforms',
            icon: Download,
            format: 'compact' as const,
            suffix: '+',
        },
        {
            id: '5',
            value: 4.9,
            label: 'Rating',
            subtext: 'From 50K+ reviews',
            icon: Star,
            format: 'raw' as const,
            decimals: 1,
        },
        {
            id: '6',
            value: 45,
            label: 'Countries',
            subtext: 'Global presence',
            icon: Globe,
            format: 'raw' as const,
        },
    ];

    const getAccentCode = () => {
        if (currentExample.cardAccents.length > 1) {
            return `i % 2 === 0 ? '${currentExample.cardAccents[0]}' : '${currentExample.cardAccents[1]}'`;
        }
        return `'${currentExample.cardAccents[0]}'`;
    };

    const codeString = `<StatsGrid
  variant="${currentExample.variant}"
  columns={${currentExample.columns}}
  contentAlign="center"
  bgColor="${currentExample.bgColor}"
  cardBgColor="${currentExample.cardBgColor}"
  cardBorderColor="${currentExample.cardBorderColor}"
  textColor="${currentExample.textColor}"
  iconBgColor="${currentExample.iconBgColor}"
  iconColor="${currentExample.iconColor}"
>
  <StatsGridTitle>${currentExample.name}</StatsGridTitle>
  <StatsGridDescription>
    ${currentExample.description}
  </StatsGridDescription>
  <StatsGridContainer>
    {stats.map((stat, i) => (
      <StatsGridCard
        key={stat.id}
        stat={{
          ...stat,
          accent: ${getAccentCode()},
        }}
      />
    ))}
  </StatsGridContainer>
</StatsGrid>`;

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap gap-4 justify-end">
                <VariantSelector
                    variants={examples.map(ex => ex.id)}
                    selectedVariant={selectedExample}
                    onSelectVariant={setSelectedExample}
                    type="Theme"
                    getLabel={(id) => examples.find(ex => ex.id === id)?.name || id}
                />
            </div>

            <Tabs>
                <TabItem value="preview" label="Preview">
                    <div className={cn(
                        "rounded-xl transition-all duration-300 p-8",
                        currentExample.bgColor
                    )}>
                        <StatsGrid
                            variant={currentExample.variant}
                            columns={currentExample.columns}
                            contentAlign="center"
                            bgColor={currentExample.bgColor}
                            cardBgColor={currentExample.cardBgColor}
                            cardBorderColor={currentExample.cardBorderColor}
                            textColor={currentExample.textColor}
                            iconBgColor={currentExample.iconBgColor}
                            iconColor={currentExample.iconColor}
                        >
                            <StatsGridTitle>{currentExample.name}</StatsGridTitle>
                            <StatsGridDescription>
                                {currentExample.description}
                            </StatsGridDescription>
                            <StatsGridContainer>
                                {sampleStats.map((stat, index) => {
                                    const accent = currentExample.cardAccents.length > 1
                                        ? (index % 2 === 0 ? currentExample.cardAccents[0] : currentExample.cardAccents[1])
                                        : currentExample.cardAccents[0];

                                    return (
                                        <StatsGridCard
                                            key={stat.id}
                                            stat={{
                                                ...stat,
                                                accent: accent as any,
                                            }}
                                            index={index}
                                        />
                                    );
                                })}
                            </StatsGridContainer>
                        </StatsGrid>
                    </div>
                </TabItem>
                <TabItem value="code" label="Code">
                    <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 flex items-center gap-2">
                            <span className="text-lg">📋</span>
                            Complete code for <span className="font-semibold text-blue-600 dark:text-blue-400">{currentExample.name}</span>:
                        </p>
                        <CodeBlock language="tsx" className="text-sm">
                            {codeString}
                        </CodeBlock>
                    </div>
                </TabItem>
                <TabItem value="palette" label="Color Palette">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4 border rounded-lg">
                        <div className="space-y-2">
                            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Background</p>
                            <div className={cn("h-20 rounded-lg shadow-inner", currentExample.bgColor)} />
                            <p className="text-xs font-mono truncate">{currentExample.bgColor}</p>
                        </div>
                        <div className="space-y-2">
                            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Card Background</p>
                            <div className={cn("h-20 rounded-lg shadow-inner border", currentExample.cardBgColor, currentExample.cardBorderColor)} />
                            <p className="text-xs font-mono truncate">{currentExample.cardBgColor}</p>
                        </div>
                        <div className="space-y-2">
                            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Icon Background</p>
                            <div className={cn("h-20 rounded-lg shadow-inner flex items-center justify-center", currentExample.iconBgColor)}>
                                <Star className={cn("w-6 h-6", currentExample.iconColor)} />
                            </div>
                            <p className="text-xs font-mono truncate">{currentExample.iconBgColor}</p>
                        </div>
                        <div className="space-y-2">
                            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Text Color</p>
                            <div className={cn(
                                "h-20 rounded-lg shadow-inner flex items-center justify-center",
                                currentExample.textColor === 'text-white' ? 'bg-gray-900' : 'bg-gray-100'
                            )}>
                                <span className={cn("text-sm font-bold", currentExample.textColor)}>Aa</span>
                            </div>
                            <p className="text-xs font-mono truncate">{currentExample.textColor}</p>
                        </div>
                        <div className="space-y-2">
                            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Accent 1</p>
                            <div className={cn("h-20 rounded-lg shadow-inner",
                                currentExample.cardAccents[0] === 'fuchsia' && 'bg-fuchsia-500',
                                currentExample.cardAccents[0] === 'violet' && 'bg-violet-500',
                                currentExample.cardAccents[0] === 'emerald' && 'bg-emerald-500',
                                currentExample.cardAccents[0] === 'teal' && 'bg-teal-500',
                                currentExample.cardAccents[0] === 'indigo' && 'bg-indigo-500',
                                currentExample.cardAccents[0] === 'pink' && 'bg-pink-500',
                                currentExample.cardAccents[0] === 'rose' && 'bg-rose-500',
                                currentExample.cardAccents[0] === 'orange' && 'bg-orange-500',
                                currentExample.cardAccents[0] === 'blue' && 'bg-blue-500',
                                currentExample.cardAccents[0] === 'purple' && 'bg-purple-500',
                                currentExample.cardAccents[0] === 'amber' && 'bg-amber-500',
                                currentExample.cardAccents[0] === 'red' && 'bg-red-500',
                                currentExample.cardAccents[0] === 'cyan' && 'bg-cyan-500',
                                currentExample.cardAccents[0] === 'yellow' && 'bg-yellow-400',
                            )} />
                            <p className="text-xs font-mono capitalize">{currentExample.cardAccents[0]}</p>
                        </div>
                        {currentExample.cardAccents.length > 1 && (
                            <div className="space-y-2">
                                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Accent 2</p>
                                <div className={cn("h-20 rounded-lg shadow-inner",
                                    currentExample.cardAccents[1] === 'fuchsia' && 'bg-fuchsia-500',
                                    currentExample.cardAccents[1] === 'violet' && 'bg-violet-500',
                                    currentExample.cardAccents[1] === 'emerald' && 'bg-emerald-500',
                                    currentExample.cardAccents[1] === 'teal' && 'bg-teal-500',
                                    currentExample.cardAccents[1] === 'indigo' && 'bg-indigo-500',
                                    currentExample.cardAccents[1] === 'pink' && 'bg-pink-500',
                                    currentExample.cardAccents[1] === 'rose' && 'bg-rose-500',
                                    currentExample.cardAccents[1] === 'orange' && 'bg-orange-500',
                                    currentExample.cardAccents[1] === 'blue' && 'bg-blue-500',
                                    currentExample.cardAccents[1] === 'purple' && 'bg-purple-500',
                                    currentExample.cardAccents[1] === 'amber' && 'bg-amber-500',
                                    currentExample.cardAccents[1] === 'red' && 'bg-red-500',
                                    currentExample.cardAccents[1] === 'cyan' && 'bg-cyan-500',
                                    currentExample.cardAccents[1] === 'yellow' && 'bg-yellow-400',
                                )} />
                                <p className="text-xs font-mono capitalize">{currentExample.cardAccents[1]}</p>
                            </div>
                        )}
                    </div>
                </TabItem>
            </Tabs>
        </div>
    );
};