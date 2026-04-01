import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    SearchProvider,
    SearchHeader,
    SearchTabs,
    SearchFilters,
    // SearchFacets,
    SearchResults,
    SearchPagination,
    SaveSearchModal,
    ThemeToggle,
    SearchDebugger,
} from "./index";
import type { FilterState } from './';
import {
    PersonIcon,
    BookmarkIcon,
    DownloadIcon,
    GlobeIcon,
    UpdateIcon,
    MagicWandIcon,
    SunIcon,
    StarIcon,
    HeartIcon,
    LayersIcon,
    ClockIcon,
    CubeIcon,
} from "@radix-ui/react-icons";
import { cn } from '../../../../../utils/cn';
import { Button } from '../../../../components/button';
import { Typography } from '../../../../components/typography';

/* ============================================
   TYPE DEFINITIONS
============================================ */

type SearchVariant = "default" | "vibrant" | "ocean" | "forest" | "sunset";
type CardVariant = "default" | "glass" | "elevated" | "border";

interface PresetConfig {
    id: string;
    name: string;
    description: string;
    icon: React.ElementType;
    color: string;
    initialFilters: Partial<FilterState>;
}

interface ThemeOption {
    id: string;
    name: string;
    variant: SearchVariant;
    cardVariant: CardVariant;
    icon: React.ElementType;
    colors: string[];
}

/* ============================================
   PRESET CONFIGURATIONS
============================================ */

const presets: PresetConfig[] = [
    {
        id: 'active-admins',
        name: 'Active Admins',
        description: 'Find all active administrator accounts',
        icon: PersonIcon,
        color: 'blue',
        initialFilters: { role: 'Admin', status: 'Active' }
    },
    {
        id: 'premium-students',
        name: 'Premium Students',
        description: 'Students with premium subscriptions',
        icon: StarIcon,
        color: 'purple',
        initialFilters: { role: 'Student', premiumOnly: true }
    },
    {
        id: 'recent-users',
        name: 'Recent Users',
        description: 'Users who joined in the last 30 days',
        icon: ClockIcon,
        color: 'green',
        initialFilters: { dateFrom: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] }
    },
    {
        id: 'verified-inactive',
        name: 'Verified Inactive',
        description: 'Verified users who are inactive',
        icon: UpdateIcon,
        color: 'orange',
        initialFilters: { verifiedOnly: true, status: 'Inactive' }
    },
    {
        id: 'vip-tag',
        name: 'VIP Users',
        description: 'Users with VIP tag',
        icon: HeartIcon,
        color: 'red',
        initialFilters: { tags: ['VIP'] }
    },
    {
        id: 'enterprise',
        name: 'Enterprise Accounts',
        description: 'Enterprise customers',
        icon: CubeIcon,
        color: 'indigo',
        initialFilters: { tags: ['Enterprise'], premiumOnly: true }
    }
];

const themes: ThemeOption[] = [
    { id: 'default', name: 'Default', variant: 'default', cardVariant: 'default', icon: SunIcon, colors: ['gray', 'slate'] },
    { id: 'vibrant', name: 'Vibrant', variant: 'vibrant', cardVariant: 'glass', icon: MagicWandIcon, colors: ['purple', 'pink', 'orange'] },
    { id: 'ocean', name: 'Ocean', variant: 'ocean', cardVariant: 'glass', icon: GlobeIcon, colors: ['cyan', 'blue', 'indigo'] },
    { id: 'forest', name: 'Forest', variant: 'forest', cardVariant: 'elevated', icon: LayersIcon, colors: ['green', 'teal', 'lime'] },
    { id: 'sunset', name: 'Sunset', variant: 'sunset', cardVariant: 'border', icon: SunIcon, colors: ['orange', 'rose', 'purple'] },
];

/* ============================================
   COMPONENTS
============================================ */

interface PresetSelectorProps {
    onSelect: (preset: PresetConfig) => void;
    selectedId?: string;
}

const PresetSelector: React.FC<PresetSelectorProps> = ({ onSelect, selectedId }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {presets.map((preset) => (
                <motion.button
                    key={preset.id}
                    onClick={() => onSelect(preset)}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className={cn(
                        "p-6 rounded-xl border-2 transition-all duration-300 text-left",
                        selectedId === preset.id
                            ? `border-${preset.color}-500 bg-${preset.color}-50 dark:bg-${preset.color}-950/20 shadow-lg`
                            : "border-border hover:border-primary/50 bg-card hover:shadow-md"
                    )}
                >
                    <div className="flex items-start gap-4">
                        <div className={cn(
                            "p-3 rounded-lg",
                            `bg-${preset.color}-100 dark:bg-${preset.color}-900/30 text-${preset.color}-600 dark:text-${preset.color}-400`
                        )}>
                            <preset.icon className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                            <Typography variant="h6" weight="semibold" className="mb-1 text-foreground">
                                {preset.name}
                            </Typography>
                            <Typography variant="caption" color="muted" className="block mb-3">
                                {preset.description}
                            </Typography>
                            <div className="flex flex-wrap gap-1">
                                <span className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded">
                                    {Object.keys(preset.initialFilters).length} filters
                                </span>
                            </div>
                        </div>
                    </div>
                </motion.button>
            ))}
        </div>
    );
};

interface ThemeSelectorProps {
    onSelect: (theme: ThemeOption) => void;
    currentId?: string;
}

const ThemeSelector: React.FC<ThemeSelectorProps> = ({ onSelect, currentId }) => {
    return (
        <div className="mb-8">
            <Typography variant="h6" weight="semibold" className="mb-4 text-foreground">
                Theme Customization
            </Typography>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
                {themes.map((theme) => (
                    <motion.button
                        key={theme.id}
                        onClick={() => onSelect(theme)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={cn(
                            "p-3 rounded-lg border-2 transition-all duration-300 flex flex-col items-center gap-2",
                            currentId === theme.id
                                ? `border-${theme.colors[0]}-500 bg-${theme.colors[0]}-50 dark:bg-${theme.colors[0]}-950/20`
                                : "border-border hover:border-primary/50 bg-card"
                        )}
                    >
                        <div className={cn(
                            "p-2 rounded-full",
                            `bg-gradient-to-br from-${theme.colors[0]}-500 to-${theme.colors[1] || theme.colors[0]}-500`
                        )}>
                            <theme.icon className="w-4 h-4 text-white" />
                        </div>
                        <Typography variant="caption" weight="medium" className="text-foreground">
                            {theme.name}
                        </Typography>
                    </motion.button>
                ))}
            </div>
        </div>
    );
};

/* ============================================
   META CONFIGURATION
============================================ */

const meta: Meta<typeof SearchProvider> = {
    title: "Pages/AdvancedSearch/SearchProvider",
    component: SearchProvider,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
        docs: {
            description: {
                component: `
# Advanced Search Provider

A comprehensive search interface with:

- 🔍 **Multiple filter fields**: Text search, dropdowns, date range, tags, checkboxes
- 💾 **Saved searches**: Quick access to predefined filters
- 📊 **Faceted search**: Sidebar with counts for quick filtering
- 📈 **Results table**: Sortable columns with pagination
- 📥 **Export**: CSV, Excel, and JSON export options
- 🌓 **Theme toggle**: Light/dark mode support
- 🎨 **Multiple themes**: Vibrant, Ocean, Forest, Sunset variants

## Features

- Real-time filtering with debouncing
- Faceted search with counts
- Saved searches with pinning
- Export functionality
- Responsive design
- Loading states
- Error handling
- Debug mode
            `
            }
        }
    },
    argTypes: {
        variant: {
            control: "select",
            options: ["default", "vibrant", "ocean", "forest", "sunset"],
        },
        cardVariant: {
            control: "select",
            options: ["default", "glass", "elevated", "border"],
        },
        pageSize: {
            control: "number",
            min: 5,
            max: 50,
        },
        debounceMs: {
            control: "number",
            min: 0,
            max: 1000,
        },
    },
};

export default meta;
type Story = StoryObj<typeof SearchProvider>;

/* ============================================
   STORIES
============================================ */

export const Default: Story = {
    render: () => (
        <SearchProvider>
            <SearchHeader />
            <SearchTabs />
            <div className="flex flex-col lg:flex-row gap-6 mt-6">
                {/* <SearchFacets /> */}
                <div className="flex-1 space-y-4">
                    <SearchFilters />
                    <SearchResults />
                    <SearchPagination />
                </div>
            </div>
        </SearchProvider>
    ),
    parameters: {
        docs: {
            description: {
                story: 'Default search interface with all components.'
            }
        }
    }
};

export const LightTheme: Story = {
    render: () => (
        <SearchProvider theme="light">
            <SearchHeader />
            <SearchTabs />
            <div className="flex flex-col lg:flex-row gap-6 mt-6">
                {/* <SearchFacets /> */}
                <div className="flex-1 space-y-4">
                    <SearchFilters />
                    <SearchResults />
                    <SearchPagination />
                </div>
            </div>
        </SearchProvider>
    ),
    parameters: {
        docs: {
            description: {
                story: 'Light theme version with dark text on light background.'
            }
        }
    }
};

export const DarkMode: Story = {
    render: () => (
        <SearchProvider theme="dark">
            <SearchHeader />
            <SearchTabs />
            <div className="flex flex-col lg:flex-row gap-6 mt-6">
                {/* <SearchFacets /> */}
                <div className="flex-1 space-y-4">
                    <SearchFilters />
                    <SearchResults />
                    <SearchPagination />
                </div>
            </div>
        </SearchProvider>
    ),
    parameters: {
        themes: {
            default: 'dark'
        },
        docs: {
            description: {
                story: 'Dark mode version with light text on dark background.'
            }
        }
    }
};

export const WithPresets: Story = {
    render: function Render() {
        const [selectedPreset, setSelectedPreset] = useState<PresetConfig>(presets[0]);

        return (
            <div className="min-h-screen bg-background">
                <div className="container max-w-7xl mx-auto px-4 py-8">
                    <div className="mb-8">
                        <Typography variant="h2" weight="bold" className="mb-2 text-foreground">
                            🔍 Advanced Search
                        </Typography>
                        <Typography variant="lead" color="muted" className="mb-6">
                            Select a preset to get started
                        </Typography>
                    </div>

                    <PresetSelector
                        onSelect={setSelectedPreset}
                        selectedId={selectedPreset.id}
                    />

                    <SearchProvider
                        initialFilters={selectedPreset.initialFilters}
                    >
                        <SearchHeader />
                        <SearchTabs />
                        <div className="flex flex-col lg:flex-row gap-6 mt-6">
                            {/* <SearchFacets /> */}
                            <div className="flex-1 space-y-4">
                                <SearchFilters />
                                <SearchResults />
                                <SearchPagination />
                            </div>
                        </div>
                    </SearchProvider>
                </div>
            </div>
        );
    },
    parameters: {
        docs: {
            description: {
                story: 'Search interface with preset configurations.'
            }
        }
    }
};

export const WithThemes: Story = {
    render: function Render() {
        const [selectedTheme, setSelectedTheme] = useState<ThemeOption>(themes[0]);

        return (
            <div className="min-h-screen bg-background">
                <div className="container max-w-7xl mx-auto px-4 py-8">
                    <div className="mb-8">
                        <Typography variant="h2" weight="bold" className="mb-2 text-foreground">
                            🎨 Theme Customization
                        </Typography>
                        <Typography variant="lead" color="muted" className="mb-6">
                            Choose from multiple beautiful themes
                        </Typography>
                    </div>

                    <ThemeSelector
                        onSelect={setSelectedTheme}
                        currentId={selectedTheme.id}
                    />

                    <SearchProvider
                        variant={selectedTheme.variant}
                        cardVariant={selectedTheme.cardVariant}
                    >
                        <SearchHeader />
                        <SearchTabs />
                        <div className="flex flex-col lg:flex-row gap-6 mt-6">
                            {/* <SearchFacets /> */}
                            <div className="flex-1 space-y-4">
                                <SearchFilters />
                                <SearchResults />
                                <SearchPagination />
                            </div>
                        </div>
                    </SearchProvider>
                </div>
            </div>
        );
    },
    parameters: {
        docs: {
            description: {
                story: 'Search interface with different theme variations.'
            }
        }
    }
};

export const WithDebugger: Story = {
    render: () => (
        <SearchProvider debug>
            <SearchHeader />
            <SearchTabs />
            <div className="flex flex-col lg:flex-row gap-6 mt-6">
                {/* <SearchFacets /> */}
                <div className="flex-1 space-y-4">
                    <SearchFilters />
                    <SearchResults />
                    <SearchPagination />
                </div>
            </div>
            <SearchDebugger />
            <ThemeToggle />
        </SearchProvider>
    ),
    parameters: {
        docs: {
            description: {
                story: 'Search interface with debugger enabled for development.'
            }
        }
    }
};

export const MobileView: Story = {
    render: () => (
        <SearchProvider>
            <SearchHeader />
            <SearchTabs />
            <div className="flex flex-col gap-6 mt-6">
                <SearchFilters expanded={false} />
                {/* <SearchFacets /> */}
                <SearchResults />
                <SearchPagination />
            </div>
        </SearchProvider>
    ),
    parameters: {
        viewport: {
            defaultViewport: 'mobile1',
        },
        docs: {
            description: {
                story: 'Mobile responsive layout with stacked components.'
            }
        }
    }
};

export const InteractiveDemo: Story = {
    render: function Render() {
        const [showSaveModal, setShowSaveModal] = useState(false);

        const handleSaveSearch = (name: string, description?: string) => {
            console.log('Saving search:', { name, description });
        };

        return (
            <div className="min-h-screen bg-background">
                <div className="container max-w-7xl mx-auto px-4 py-8">
                    <div className="mb-8">
                        <Typography variant="h2" weight="bold" className="mb-2 text-foreground">
                            🎮 Interactive Demo
                        </Typography>
                        <Typography variant="lead" color="muted" className="mb-6">
                            Try out all the features interactively
                        </Typography>

                        <div className="flex gap-2 mb-6">
                            <Button
                                variant="default"
                                onClick={() => setShowSaveModal(true)}
                                className="gap-2"
                            >
                                <BookmarkIcon className="h-4 w-4" />
                                Save Current Search
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => console.log('Export clicked')}
                                className="gap-2"
                            >
                                <DownloadIcon className="h-4 w-4" />
                                Export Results
                            </Button>
                        </div>
                    </div>

                    <SearchProvider>
                        <SearchHeader onSaveClick={() => setShowSaveModal(true)} />
                        <SearchTabs />
                        <div className="flex flex-col lg:flex-row gap-6 mt-6">
                            {/* <SearchFacets /> */}
                            <div className="flex-1 space-y-4">
                                <SearchFilters />
                                <SearchResults />
                                <SearchPagination />
                            </div>
                        </div>
                    </SearchProvider>

                    <SaveSearchModal
                        isOpen={showSaveModal}
                        onClose={() => setShowSaveModal(false)}
                        onSave={handleSaveSearch}
                    />
                </div>
            </div>
        );
    },
    parameters: {
        docs: {
            description: {
                story: 'Interactive demo with save search modal and export functionality.'
            }
        }
    }
};

export const LoadingState: Story = {
    render: () => (
        <SearchProvider debounceMs={2000}>
            <SearchHeader />
            <SearchTabs />
            <div className="flex flex-col lg:flex-row gap-6 mt-6">
                {/* <SearchFacets /> */}
                <div className="flex-1 space-y-4">
                    <SearchFilters />
                    <SearchResults />
                    <SearchPagination />
                </div>
            </div>
        </SearchProvider>
    ),
    parameters: {
        docs: {
            description: {
                story: 'Shows loading skeleton during filter updates.'
            }
        }
    }
};

export const EmptyResults: Story = {
    render: () => (
        <SearchProvider
            initialFilters={{
                name: 'xxxxxxxxxxxx',
                tags: ['Premium'],
                verifiedOnly: true,
                premiumOnly: true,
            }}
        >
            <SearchHeader />
            <SearchTabs />
            <div className="flex flex-col lg:flex-row gap-6 mt-6">
                {/* <SearchFacets /> */}
                <div className="flex-1 space-y-4">
                    <SearchFilters />
                    <SearchResults />
                    <SearchPagination />
                </div>
            </div>
        </SearchProvider>
    ),
    parameters: {
        docs: {
            description: {
                story: 'Shows empty state when no results match filters.'
            }
        }
    }
};

export const WithAllFilters: Story = {
    render: () => (
        <SearchProvider
            initialFilters={{
                name: 'Alice',
                role: 'Student',
                status: 'Active',
                tags: ['Premium', 'Verified'],
                dateFrom: '2024-01-01',
                dateTo: '2024-03-31',
                verifiedOnly: true,
                premiumOnly: true,
            }}
        >
            <SearchHeader />
            <SearchTabs />
            <div className="flex flex-col lg:flex-row gap-6 mt-6">
                {/* <SearchFacets /> */}
                <div className="flex-1 space-y-4">
                    <SearchFilters />
                    <SearchResults />
                    <SearchPagination />
                </div>
            </div>
        </SearchProvider>
    ),
    parameters: {
        docs: {
            description: {
                story: 'Shows interface with all filters applied.'
            }
        }
    }
};

export const PerformanceTest: Story = {
    render: () => (
        <SearchProvider pageSize={25}>
            <SearchHeader />
            <SearchTabs />
            <div className="flex flex-col lg:flex-row gap-6 mt-6">
                {/* <SearchFacets /> */}
                <div className="flex-1 space-y-4">
                    <SearchFilters />
                    <SearchResults />
                    <SearchPagination />
                </div>
            </div>
        </SearchProvider>
    ),
    parameters: {
        docs: {
            description: {
                story: 'Performance test with 25 results per page.'
            }
        }
    }
};

export const AccessibilityDemo: Story = {
    render: () => (
        <div className="min-h-screen bg-background">
            <div className="container max-w-7xl mx-auto px-4 py-8">
                <div className="mb-8 p-4 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                    <Typography variant="h6" weight="semibold" className="mb-2 text-foreground">
                        ♿ Accessibility Features
                    </Typography>
                    <ul className="text-sm space-y-1 list-disc pl-5 text-foreground">
                        <li>Proper ARIA labels on all interactive elements</li>
                        <li>Keyboard navigation support</li>
                        <li>Focus indicators on all focusable elements</li>
                        <li>Semantic HTML structure</li>
                        <li>Color contrast meets WCAG guidelines</li>
                        <li>Screen reader friendly announcements</li>
                    </ul>
                </div>

                <SearchProvider>
                    <SearchHeader />
                    <SearchTabs />
                    <div className="flex flex-col lg:flex-row gap-6 mt-6">
                        {/* <SearchFacets /> */}
                        <div className="flex-1 space-y-4">
                            <SearchFilters />
                            <SearchResults />
                            <SearchPagination />
                        </div>
                    </div>
                </SearchProvider>
            </div>
        </div>
    ),
    parameters: {
        docs: {
            description: {
                story: 'Demonstrates accessibility features and keyboard navigation.'
            }
        }
    }
};
