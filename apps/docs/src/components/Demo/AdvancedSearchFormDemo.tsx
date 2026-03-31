import React, { useState, useEffect } from 'react';
import type { JSX } from 'react';
import {
    SearchProvider,
    SearchHeader,
    SearchTabs,
    SearchFilters,
    SearchResults,
    SearchPagination,
    SaveSearchModal,
} from '../UI/advanced-search-form';
import type { FilterState } from '../UI/advanced-search-form';
import {
    BookmarkIcon,
} from '@radix-ui/react-icons';
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
    { value: 'dark', label: 'Dark Theme' },
];

const cardVariantOptions = [
    { value: 'default', label: 'Default Card' },
    { value: 'glass', label: 'Glass Card' },
    { value: 'elevated', label: 'Elevated Card' },
    { value: 'border', label: 'Border Card' },
];

const pageSizeOptions = [
    { value: '5', label: '5 per page' },
    { value: '10', label: '10 per page' },
    { value: '15', label: '15 per page' },
    { value: '20', label: '20 per page' },
    { value: '25', label: '25 per page' },
];

const debounceOptions = [
    { value: '0', label: 'No Debounce' },
    { value: '300', label: '300ms' },
    { value: '500', label: '500ms' },
    { value: '1000', label: '1000ms' },
];

const presetOptions = [
    { value: 'none', label: 'No Preset' },
    { value: 'active-admins', label: 'Active Admins' },
    { value: 'premium-students', label: 'Premium Students' },
    { value: 'recent-users', label: 'Recent Users' },
    { value: 'verified-inactive', label: 'Verified Inactive' },
    { value: 'vip-tag', label: 'VIP Users' },
    { value: 'enterprise', label: 'Enterprise Accounts' },
];

const presetFilters: Record<string, Partial<FilterState>> = {
    none: {},
    'active-admins': { role: 'Admin', status: 'Active' },
    'premium-students': { role: 'Student', premiumOnly: true },
    'recent-users': { dateFrom: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] },
    'verified-inactive': { verifiedOnly: true, status: 'Inactive' },
    'vip-tag': { tags: ['VIP'] },
    'enterprise': { tags: ['Enterprise'], premiumOnly: true },
};

const displayOptions = [
    { value: 'showAvatar', label: 'Show Avatar' },
    { value: 'showEmail', label: 'Show Email' },
    { value: 'showTags', label: 'Show Tags' },
    { value: 'showStatus', label: 'Show Status' },
    { value: 'showRole', label: 'Show Role' },
    { value: 'showDate', label: 'Show Created Date' },
];

type Theme = 'light' | 'dark';
type CardVariant = 'default' | 'glass' | 'elevated' | 'border';
type Preset = keyof typeof presetFilters;

/* ============================================
   ADVANCED SEARCH FORM DEMO
============================================ */

export const AdvancedSearchFormDemo = (): JSX.Element => {
    const { colorMode } = useColorMode();
    const [theme, setTheme] = useState<Theme>(colorMode === 'dark' ? 'dark' : 'light');
    const [cardVariant, setCardVariant] = useState<CardVariant>('default');
    const [pageSize, setPageSize] = useState<number>(10);
    const [debounceMs, setDebounceMs] = useState<number>(300);
    const [preset, setPreset] = useState<Preset>('none');
    const [showSaveModal, setShowSaveModal] = useState<boolean>(false);

    // Update theme when parent theme changes
    useEffect(() => {
        setTheme(colorMode === 'dark' ? 'dark' : 'light');
    }, [colorMode]);

    // Display options
    const [displaySettings, setDisplaySettings] = useState({
        showAvatar: true,
        showEmail: true,
        showTags: true,
        showStatus: true,
        showRole: true,
        showDate: true,
    });

    const [showTitle, setShowTitle] = useState(true);
    // const [showDescription, setShowDescription] = useState(true);
    const [showTabs, setShowTabs] = useState(true);
    const [filtersExpanded, setFiltersExpanded] = useState(true);
    const [showPagination, setShowPagination] = useState(true);

    const initialFilters = presetFilters[preset];

    const handleSaveSearch = (name: string, description?: string) => {
        console.log('Saving search:', { name, description });
    };

    const toggleDisplayOption = (option: string) => {
        setDisplaySettings(prev => ({
            ...prev,
            [option]: !prev[option as keyof typeof prev]
        }));
    };

    // Generate the props-only code
    //     const generatePropsCode = (): string => {
    //         return `
    // import {
    //     SearchProvider,
    //     SearchHeader,
    //     SearchTabs,
    //     SearchFilters,
    //     SearchResults,
    //     SearchPagination,
    //     ThemeToggle,
    // } from '@ignix-ui/advanced-search';

    // function SearchDemo() {
    //     return (
    //         <SearchProvider
    //             variant="${theme}"
    //             cardVariant="${cardVariant}"
    //             pageSize={${pageSize}}
    //             debounceMs={${debounceMs}}
    //             theme="${theme}"
    //             ${preset !== 'none' ? `initialFilters={${JSON.stringify(initialFilters, null, 4).replace(/\n/g, '\n            ')}}` : ''}
    //         >
    //             ${showTitle ? '<SearchHeader />' : ''}
    //             ${showTabs ? '<SearchTabs />' : ''}
    //             <div className="flex flex-col lg:flex-row gap-6 mt-6">
    //                 <div className="flex-1 space-y-4">
    //                     <SearchFilters expanded={${filtersExpanded}} />
    //                     <SearchResults 
    //                         showAvatar={${displaySettings.showAvatar}}
    //                         showEmail={${displaySettings.showEmail}}
    //                         showTags={${displaySettings.showTags}}
    //                         showStatus={${displaySettings.showStatus}}
    //                         showRole={${displaySettings.showRole}}
    //                         showDate={${displaySettings.showDate}}
    //                     />
    //                     ${showPagination ? '<SearchPagination />' : ''}
    //                 </div>
    //             </div>
    //             <ThemeToggle />
    //         </SearchProvider>
    //     );
    // }
    //         `;
    //     };

    const generateFullCode = (): string => {
        return `
import React from 'react';
import {
    SearchProvider,
    SearchHeader,
    SearchTabs,
    SearchFilters,
    SearchResults,
    SearchPagination,
    ThemeToggle,
} from '@ignix-ui/advanced-search';

export default function AdvancedSearchDemo() {
    return (
        <div className="min-h-screen bg-background">
            <div className="container max-w-7xl mx-auto px-4 py-8">
                <SearchProvider
                    variant="${theme}"
                    cardVariant="${cardVariant}"
                    pageSize={${pageSize}}
                    debounceMs={${debounceMs}}
                    theme="${theme}"
                    ${preset !== 'none' ? `initialFilters={${JSON.stringify(initialFilters, null, 4)}}` : ''}
                >
                    ${showTitle ? '<SearchHeader />' : ''}
                    ${showTabs ? '<SearchTabs />' : ''}
                    <div className="flex flex-col lg:flex-row gap-6 mt-6">
                        <div className="flex-1 space-y-4">
                            <SearchFilters expanded={${filtersExpanded}} />
                            <SearchResults 
                                showAvatar={${displaySettings.showAvatar}}
                                showEmail={${displaySettings.showEmail}}
                                showTags={${displaySettings.showTags}}
                                showStatus={${displaySettings.showStatus}}
                                showRole={${displaySettings.showRole}}
                                showDate={${displaySettings.showDate}}
                            />
                            ${showPagination ? '<SearchPagination />' : ''}
                        </div>
                    </div>
                    <ThemeToggle />
                </SearchProvider>
            </div>
        </div>
    );
}
        `;
    };

    return (
        <div className="space-y-6">
            {/* Theme Controls */}
            <div className="flex flex-wrap gap-4 justify-end">
                <VariantSelector
                    variants={themeOptions.map(o => o.value)}
                    selectedVariant={theme}
                    onSelectVariant={(v): void => setTheme(v as Theme)}
                    type="Theme"
                    getLabel={(v): string => themeOptions.find(o => o.value === v)?.label || v}
                />
                <VariantSelector
                    variants={cardVariantOptions.map(o => o.value)}
                    selectedVariant={cardVariant}
                    onSelectVariant={(v): void => setCardVariant(v as CardVariant)}
                    type="Card Style"
                    getLabel={(v): string => cardVariantOptions.find(o => o.value === v)?.label || v}
                />
                <VariantSelector
                    variants={pageSizeOptions.map(o => o.value)}
                    selectedVariant={pageSize.toString()}
                    onSelectVariant={(v): void => setPageSize(parseInt(v))}
                    type="Page Size"
                    getLabel={(v): string => pageSizeOptions.find(o => o.value === v)?.label || v}
                />
                <VariantSelector
                    variants={debounceOptions.map(o => o.value)}
                    selectedVariant={debounceMs.toString()}
                    onSelectVariant={(v): void => setDebounceMs(parseInt(v))}
                    type="Debounce"
                    getLabel={(v): string => debounceOptions.find(o => o.value === v)?.label || v}
                />
                <VariantSelector
                    variants={presetOptions.map(o => o.value)}
                    selectedVariant={preset}
                    onSelectVariant={(v): void => setPreset(v as Preset)}
                    type="Preset"
                    getLabel={(v): string => presetOptions.find(o => o.value === v)?.label || v}
                />
            </div>

            {/* Display Options Panel */}
            <div className="p-4 border rounded-lg bg-card">
                <div className="flex flex-wrap items-center gap-6">
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-foreground">Components:</span>
                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={showTitle}
                                onChange={(e): void => setShowTitle(e.target.checked)}
                                className="rounded border-border"
                            />
                            <span className="text-sm">Header</span>
                        </label>
                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={showTabs}
                                onChange={(e): void => setShowTabs(e.target.checked)}
                                className="rounded border-border"
                            />
                            <span className="text-sm">Tabs</span>
                        </label>
                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={showPagination}
                                onChange={(e): void => setShowPagination(e.target.checked)}
                                className="rounded border-border"
                            />
                            <span className="text-sm">Pagination</span>
                        </label>

                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={filtersExpanded}
                                onChange={(e): void => setFiltersExpanded(e.target.checked)}
                                className="rounded border-border"
                            />
                            <span className="text-sm">Filters Expanded</span>
                        </label>
                    </div>

                    <div className="h-6 w-px bg-border" />

                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-foreground">Display:</span>
                        {displayOptions.map((opt) => (
                            <label key={opt.value} className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={displaySettings[opt.value as keyof typeof displaySettings]}
                                    onChange={() => toggleDisplayOption(opt.value)}
                                    className="rounded border-border"
                                />
                                <span className="text-sm">{opt.label}</span>
                            </label>
                        ))}
                    </div>

                    <div className="ml-auto">
                        <button
                            onClick={() => setShowSaveModal(true)}
                            className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-2"
                        >
                            <BookmarkIcon className="h-4 w-4" />
                            Save Current Search
                        </button>
                    </div>
                </div>
            </div>

            {/* Preview and Code Tabs */}
            <Tabs>
                <TabItem value="preview" label="Preview">
                    <div className="border rounded-lg overflow-hidden">
                        <SearchProvider
                            variant={theme}
                            cardVariant={cardVariant}
                            pageSize={pageSize}
                            debounceMs={debounceMs}
                            initialFilters={initialFilters}
                            theme={theme}
                        >
                            {showTitle && <SearchHeader />}
                            {showTabs && <SearchTabs />}
                            <div className="flex flex-col lg:flex-row gap-6 mt-6">
                                <div className="flex-1 space-y-4">
                                    <SearchFilters expanded={filtersExpanded} />
                                    <SearchResults
                                        showAvatar={displaySettings.showAvatar}
                                        showEmail={displaySettings.showEmail}
                                        showTags={displaySettings.showTags}
                                        showStatus={displaySettings.showStatus}
                                        showRole={displaySettings.showRole}
                                        showDate={displaySettings.showDate}
                                        onRowClick={(user) => console.log('Clicked user:', user)}
                                    />
                                    {showPagination && <SearchPagination />}
                                </div>
                            </div>

                            {/* Save Search Modal */}
                            <SaveSearchModal
                                isOpen={showSaveModal}
                                onClose={() => setShowSaveModal(false)}
                                onSave={handleSaveSearch}
                            />
                        </SearchProvider>
                    </div>
                </TabItem>
                <TabItem value="code" label="Code">
                    <div className="space-y-4">
                        <CodeBlock language="tsx" className="text-sm">
                            {generateFullCode()}
                        </CodeBlock>
                    </div>
                </TabItem>
            </Tabs>
        </div>
    );
};