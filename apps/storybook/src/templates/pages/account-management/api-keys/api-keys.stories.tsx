
import type { Meta, StoryObj } from "@storybook/react-vite";
import { ApiKeysPage } from ".";
import { Key, Zap, Lock, Users, Server, Database, Globe } from "lucide-react";
import type { ApiKey, ApiKeyScope } from "./";

const meta: Meta<typeof ApiKeysPage> = {
    title: "Templates/Pages/Account Management/API Keys",
    component: ApiKeysPage,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
        docs: {
            description: {
                component:
                    "Comprehensive API Key Management page with key generation, permission scoping, usage analytics, and advanced security features using the design system components.",
            },
        },
    },
    argTypes: {
        variant: {
            control: "select",
            options: ["default", "gradient", "card", "glass", "dark"],
            description: "Visual theme for API Keys page",
            table: {
                defaultValue: { summary: "default" },
            },
        },
        animationVariant: {
            control: "select",
            options: ["fadeUp", "scaleIn", "slideUp", "slideLeft", "slideRight"],
            description: "Animation variant for content entrance",
            table: {
                defaultValue: { summary: "fadeUp" },
            },
        },
        cardVariant: {
            control: "select",
            options: ["default", "glass", "border", "elevated"],
            description: "Variant for cards and containers",
            table: {
                defaultValue: { summary: "default" },
            },
        },
        inputVariant: {
            control: "select",
            options: [
                "clean", "underline", "floating", "borderGlow", "shimmer", "particles",
                "slide", "scale", "rotate", "bounce", "elastic", "glow", "shake", "wave",
                "typewriter", "magnetic", "pulse", "borderBeam", "ripple", "particleField",
                "tilt3D", "materialFloat", "neonPulse", "glassmorphism"
            ],
            description: "Input animation variant",
            table: {
                defaultValue: { summary: "default" },
            },
        },
        buttonVariant: {
            control: "select",
            options: [
                "default", "primary", "secondary", "success", "warning", "danger",
                "outline", "ghost", "link", "subtle", "elevated", "glass", "neon", "pill"
            ],
            description: "Button variant",
            table: {
                defaultValue: { summary: "default" },
            },
        },
        isLoading: {
            control: "boolean",
            description: "Show loading state",
            table: {
                defaultValue: { summary: "false" },
            },
        },
        isGenerating: {
            control: "boolean",
            description: "Show generating state for new keys",
            table: {
                defaultValue: { summary: "false" },
            },
        },
        headerTitle: {
            control: "text",
            description: "Custom header title",
            table: {
                defaultValue: { summary: "API Keys Management" },
            },
        },
        headerDescription: {
            control: "text",
            description: "Custom header description",
            table: {
                defaultValue: { summary: "Manage your API access keys and permissions" },
            },
        },
        generateButtonLabel: {
            control: "text",
            description: "Label for generate button",
            table: {
                defaultValue: { summary: "Generate Key" },
            },
        },
        searchPlaceholder: {
            control: "text",
            description: "Placeholder for search input",
            table: {
                defaultValue: { summary: "Search API keys..." },
            },
        },
        showFilters: {
            control: "boolean",
            description: "Show filter controls",
            table: {
                defaultValue: { summary: "true" },
            },
        },
        showSearch: {
            control: "boolean",
            description: "Show search input",
            table: {
                defaultValue: { summary: "true" },
            },
        },
        showExport: {
            control: "boolean",
            description: "Show export button",
            table: {
                defaultValue: { summary: "true" },
            },
        },
        showStats: {
            control: "boolean",
            description: "Show statistics overview",
            table: {
                defaultValue: { summary: "true" },
            },
        },
        requireConfirmation: {
            control: "boolean",
            description: "Require confirmation for destructive actions",
            table: {
                defaultValue: { summary: "true" },
            },
        },
        showNotifications: {
            control: "boolean",
            description: "Show toast notifications",
            table: {
                defaultValue: { summary: "true" },
            },
        },
        requirePasswordToReveal: {
            control: "boolean",
            description: "Require password to reveal full keys",
            table: {
                defaultValue: { summary: "false" },
            },
        },
        autoHideRevealedKey: {
            control: "boolean",
            description: "Auto-hide revealed keys",
            table: {
                defaultValue: { summary: "true" },
            },
        },
        autoHideDelay: {
            control: "number",
            description: "Auto-hide delay in seconds",
            table: {
                defaultValue: { summary: "30" },
            },
        },
        darkMode: {
            control: "boolean",
            description: "Enable dark mode",
            table: {
                defaultValue: { summary: "false" },
            },
        },
    },
    decorators: [
        (Story) => (
            <div className="min-h-screen">
                <Story />
            </div>
        ),
    ],
};

export default meta;
type Story = StoryObj<typeof ApiKeysPage>;

// ============================================
// DATA OBJECTS FOR STORIES
// ============================================

// Sample API keys data for stories
const sampleApiKeys = [
    {
        id: '1',
        name: 'Production API',
        keyPrefix: 'sk_live_',
        keySuffix: 'x7Kp',
        scopes: ['read:users', 'write:users', 'read:data', 'write:data'] as ApiKeyScope[],
        createdAt: new Date('2024-01-15'),
        lastUsed: new Date(),
        usageCount: 15420,
        usageHistory: Array.from({ length: 7 }, (_, i) => ({
            date: new Date(Date.now() - (6 - i) * 86400000).toLocaleDateString('en-US', { weekday: 'short' }),
            count: Math.floor(Math.random() * 500) + 50
        })),
        status: 'active' as const,
        expiresAt: new Date('2025-01-15'),
        description: 'Used for production environment API calls'
    },
    {
        id: '2',
        name: 'Analytics Dashboard',
        keyPrefix: 'sk_live_',
        keySuffix: 'm2Qr',
        scopes: ['read:analytics', 'read:data'] as ApiKeyScope[],
        createdAt: new Date('2024-03-22'),
        lastUsed: new Date(Date.now() - 86400000),
        usageCount: 8934,
        usageHistory: Array.from({ length: 7 }, (_, i) => ({
            date: new Date(Date.now() - (6 - i) * 86400000).toLocaleDateString('en-US', { weekday: 'short' }),
            count: Math.floor(Math.random() * 400) + 30
        })),
        status: 'active' as const,
        expiresAt: new Date('2024-12-22'),
        description: 'Dashboard analytics integration'
    },
    {
        id: '3',
        name: 'Mobile App',
        keyPrefix: 'sk_live_',
        keySuffix: 'n9Ts',
        scopes: ['read:users', 'read:data'] as ApiKeyScope[],
        createdAt: new Date('2024-06-10'),
        lastUsed: new Date(Date.now() - 172800000),
        usageCount: 42156,
        usageHistory: Array.from({ length: 7 }, (_, i) => ({
            date: new Date(Date.now() - (6 - i) * 86400000).toLocaleDateString('en-US', { weekday: 'short' }),
            count: Math.floor(Math.random() * 700) + 100
        })),
        status: 'active' as const,
        expiresAt: new Date('2025-06-10'),
        description: 'Mobile application API access'
    },
    {
        id: '4',
        name: 'Webhook Service',
        keyPrefix: 'sk_test_',
        keySuffix: 'p5Lm',
        scopes: ['write:data'] as ApiKeyScope[],
        createdAt: new Date('2023-11-05'),
        lastUsed: new Date('2024-10-01'),
        usageCount: 3250,
        usageHistory: Array.from({ length: 7 }, (_, i) => ({
            date: new Date(Date.now() - (6 - i) * 86400000).toLocaleDateString('en-US', { weekday: 'short' }),
            count: Math.floor(Math.random() * 100) + 10
        })),
        status: 'expired' as const,
        expiresAt: new Date('2024-11-05'),
        description: 'Webhook service integration'
    },
    {
        id: '5',
        name: 'Legacy System',
        keyPrefix: 'sk_live_',
        keySuffix: 'r1Wv',
        scopes: ['admin', 'read:data', 'write:data'] as ApiKeyScope[],
        createdAt: new Date('2023-08-20'),
        lastUsed: null,
        usageCount: 0,
        usageHistory: Array.from({ length: 7 }, () => ({ date: '', count: 0 })),
        status: 'revoked' as const,
        description: 'Revoked due to security concerns'
    }
];

// Minimal API keys for simple use cases
const minimalApiKeys = [
    {
        id: '1',
        name: 'Test API',
        keyPrefix: 'sk_test_',
        keySuffix: 'a1b2',
        scopes: ['read:data'] as ApiKeyScope[],
        createdAt: new Date('2024-01-01'),
        lastUsed: new Date(),
        usageCount: 1234,
        usageHistory: Array.from({ length: 7 }, (_, i) => ({
            date: new Date(Date.now() - (6 - i) * 86400000).toLocaleDateString('en-US', { weekday: 'short' }),
            count: Math.floor(Math.random() * 200) + 20
        })),
        status: 'active' as const,
        description: 'Test environment key'
    }
];

// Enterprise API keys with extensive data
const enterpriseApiKeys = [
    ...sampleApiKeys,
    {
        id: '6',
        name: 'Admin Portal',
        keyPrefix: 'sk_live_',
        keySuffix: 'a9Bc',
        scopes: ['admin', 'read:users', 'write:users', 'read:data', 'write:data', 'read:analytics'] as ApiKeyScope[],
        createdAt: new Date('2023-12-01'),
        lastUsed: new Date(),
        usageCount: 89234,
        usageHistory: Array.from({ length: 7 }, (_, i) => ({
            date: new Date(Date.now() - (6 - i) * 86400000).toLocaleDateString('en-US', { weekday: 'short' }),
            count: Math.floor(Math.random() * 1000) + 500
        })),
        status: 'active' as const,
        expiresAt: new Date('2025-12-01'),
        description: 'Administrative portal access with full permissions'
    },
    {
        id: '7',
        name: 'CI/CD Pipeline',
        keyPrefix: 'sk_live_',
        keySuffix: 'd3Fg',
        scopes: ['read:data', 'write:data'] as ApiKeyScope[],
        createdAt: new Date('2024-02-15'),
        lastUsed: new Date(Date.now() - 86400000),
        usageCount: 56789,
        usageHistory: Array.from({ length: 7 }, (_, i) => ({
            date: new Date(Date.now() - (6 - i) * 86400000).toLocaleDateString('en-US', { weekday: 'short' }),
            count: Math.floor(Math.random() * 800) + 200
        })),
        status: 'active' as const,
        expiresAt: new Date('2025-02-15'),
        description: 'Continuous integration and deployment pipeline'
    },
    {
        id: '8',
        name: 'Data Warehouse',
        keyPrefix: 'sk_live_',
        keySuffix: 'h5Ij',
        scopes: ['read:data', 'read:analytics'] as ApiKeyScope[],
        createdAt: new Date('2024-04-10'),
        lastUsed: new Date(Date.now() - 432000000),
        usageCount: 234567,
        usageHistory: Array.from({ length: 7 }, (_, i) => ({
            date: new Date(Date.now() - (6 - i) * 86400000).toLocaleDateString('en-US', { weekday: 'short' }),
            count: Math.floor(Math.random() * 1500) + 1000
        })),
        status: 'active' as const,
        expiresAt: new Date('2025-04-10'),
        description: 'Data warehouse integration for analytics'
    }
];

// Custom transformed data from external API
const transformedApiKeys = [
    {
        id: 'ext_001',
        name: 'External Integration',
        keyPrefix: 'sk_int_',
        keySuffix: 'z9Yx',
        scopes: ['read:data', 'write:data'] as ApiKeyScope[],
        createdAt: new Date('2024-02-20'),
        lastUsed: new Date('2024-03-22'),
        usageCount: 7890,
        usageHistory: [
            { date: 'Mon', count: 150 },
            { date: 'Tue', count: 230 },
            { date: 'Wed', count: 190 },
            { date: 'Thu', count: 310 },
            { date: 'Fri', count: 270 },
            { date: 'Sat', count: 180 },
            { date: 'Sun', count: 120 }
        ],
        status: 'active' as const,
        expiresAt: new Date('2024-08-20'),
        description: 'Third-party service integration',
        // Custom metadata (will be ignored by component but shows flexibility)
        environment: 'production',
        team: 'Integration Team',
        rateLimit: 1000
    },
    {
        id: 'ext_002',
        name: 'Partner API Access',
        keyPrefix: 'sk_part_',
        keySuffix: 'w8Vz',
        scopes: ['read:users', 'read:analytics'] as ApiKeyScope[],
        createdAt: new Date('2024-01-05'),
        lastUsed: new Date('2024-03-25'),
        usageCount: 45600,
        usageHistory: [
            { date: 'Mon', count: 800 },
            { date: 'Tue', count: 950 },
            { date: 'Wed', count: 1100 },
            { date: 'Thu', count: 1050 },
            { date: 'Fri', count: 900 },
            { date: 'Sat', count: 600 },
            { date: 'Sun', count: 400 }
        ],
        status: 'active' as const,
        expiresAt: new Date('2024-07-05'),
        description: 'Partner company API access'
    }
];


// ============================================
// STORY GROUPS
// ============================================

// Basic Usage Stories
export const Default: Story = {
    args: {
        initialApiKeys: sampleApiKeys,
        variant: "default",
        animationVariant: "fadeUp",
        cardVariant: "default",
        inputVariant: "clean",
        buttonVariant: "primary",
        showFilters: true,
        showSearch: true,
        showExport: true,
        showStats: true,
        requireConfirmation: true,
        showNotifications: true,
        requirePasswordToReveal: false,
        autoHideRevealedKey: true,
        autoHideDelay: 30,
    },
    name: "Default - Basic Data Objects",
    parameters: {
        docs: {
            description: {
                story: "Basic usage with sample data objects. Demonstrates passing API key data as an array of objects through the `initialApiKeys` prop."
            }
        }
    }
};

// Data Object Variations
export const WithMinimalData: Story = {
    args: {
        initialApiKeys: minimalApiKeys,
        variant: "default",
        showFilters: false,
        showSearch: true,
        showStats: false,
        headerTitle: "Minimal Data Example",
        headerDescription: "Using minimal data objects with only required fields"
    },
    name: "Minimal Data Objects",
    parameters: {
        docs: {
            description: {
                story: "Demonstrates passing minimal data objects. Shows that only required fields need to be provided."
            }
        }
    }
};

export const WithExternalAPIData: Story = {
    args: {
        initialApiKeys: transformedApiKeys,
        variant: "card",
        cardVariant: "border",
        headerTitle: "Transformed External Data",
        headerDescription: "Data objects transformed from external API response",
        showStats: true,
        showFilters: true,
        statsData: {
            totalKeys: 2,
            activeKeys: 2,
            totalCalls: 53490,
            callsToday: 150,
            revokedKeys: 0
        }
    },
    name: "External API Data Objects",
    parameters: {
        docs: {
            description: {
                story: "Shows data objects transformed from an external API. Demonstrates how to structure data when integrating with real backend services."
            }
        }
    }
};

// Customization Stories
export const CustomHeaderAndStats: Story = {
    args: {
        initialApiKeys: enterpriseApiKeys,
        headerTitle: "Enterprise Dashboard",
        headerDescription: "Advanced API management with custom components",
        customHeader: (
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center">
                    <Server className="w-4 h-4 text-white" />
                </div>
                <div>
                    <h1 className="font-semibold text-lg">Enterprise Dashboard</h1>
                    <p className="text-xs text-muted-foreground">Custom header with integration status</p>
                </div>
                <div className="ml-auto flex items-center gap-2">
                    <span className="text-xs px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full">
                        All Systems Operational
                    </span>
                </div>
            </div>
        ),
        customStatsSection: (
            <div className="mb-6">
                <h2 className="text-lg font-semibold mb-4">Custom Statistics Overview</h2>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-4 rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-200/30">
                        <div className="flex items-center gap-2 mb-2">
                            <Database className="w-4 h-4 text-blue-600" />
                            <span className="text-sm font-medium">Data Points</span>
                        </div>
                        <p className="text-2xl font-bold">1.2M</p>
                        <p className="text-xs text-muted-foreground">Processed today</p>
                    </div>
                    <div className="p-4 rounded-xl bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-200/30">
                        <div className="flex items-center gap-2 mb-2">
                            <Globe className="w-4 h-4 text-green-600" />
                            <span className="text-sm font-medium">Active Regions</span>
                        </div>
                        <p className="text-2xl font-bold">14</p>
                        <p className="text-xs text-muted-foreground">Global coverage</p>
                    </div>
                    <div className="p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-200/30">
                        <div className="flex items-center gap-2 mb-2">
                            <Zap className="w-4 h-4 text-purple-600" />
                            <span className="text-sm font-medium">API Latency</span>
                        </div>
                        <p className="text-2xl font-bold">42ms</p>
                        <p className="text-xs text-muted-foreground">Average response</p>
                    </div>
                    <div className="p-4 rounded-xl bg-gradient-to-br from-orange-500/10 to-orange-600/10 border border-orange-200/30">
                        <div className="flex items-center gap-2 mb-2">
                            <Users className="w-4 h-4 text-orange-600" />
                            <span className="text-sm font-medium">Active Users</span>
                        </div>
                        <p className="text-2xl font-bold">8.5K</p>
                        <p className="text-xs text-muted-foreground">Last 24 hours</p>
                    </div>
                </div>
            </div>
        ),
        variant: "gradient",
        cardVariant: "elevated",
        showStats: false, // Using custom stats instead
        showFilters: true,
        showExport: true
    },
    name: "Custom Header & Stats Objects",
    parameters: {
        docs: {
            description: {
                story: "Demonstrates replacing default components with custom JSX. Shows how to use `customHeader` and `customStatsSection` props to override default layouts."
            }
        }
    }
};

// Interactive Data Stories
export const WithAsyncDataLoading: Story = {
    args: {
        initialApiKeys: [],
        isLoading: true,
        headerTitle: "Loading API Keys",
        headerDescription: "Fetching data from server...",
        showStats: true,
        showFilters: false,
        showSearch: false
    },
    name: "Async Data Loading",
    parameters: {
        docs: {
            description: {
                story: "Shows loading state while fetching data objects from an API. Use `isLoading` prop to indicate data fetching."
            }
        }
    }
};

export const WithRealCallbacks: Story = {
    args: {
        initialApiKeys: sampleApiKeys,
        headerTitle: "Interactive Data Management",
        headerDescription: "Real callbacks with data manipulation",
        onGenerateKey: async (name, scopes, expiresAt, description) => {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Return new data object
            return {
                id: `gen_${Date.now()}`,
                name,
                keyPrefix: 'sk_live_',
                keySuffix: Math.random().toString(36).substring(2, 6),
                scopes,
                createdAt: new Date(),
                lastUsed: null,
                usageCount: 0,
                usageHistory: Array.from({ length: 7 }, () => ({ date: '', count: 0 })),
                status: 'active' as const,
                expiresAt,
                description
            };
        },
        // Keep keyId parameter for API consistency - in production, this would be used
        // The callback signature must match what the component expects to pass
        onDeleteKey: async (_keyId) => {
            await new Promise(resolve => setTimeout(resolve, 500));
        },
        onExportKeys: (format) => {
            alert(`Data would be exported as ${format} in a real application`);
        },
        showNotifications: true,
        showExport: true
    },
    name: "Real Callbacks with Data Objects",
    parameters: {
        docs: {
            description: {
                story: "Demonstrates handling data objects through callbacks. Shows how `onGenerateKey` returns a new data object, and how other callbacks can manipulate data."
            }
        }
    }
};

// Theme and Style Variations
export const DarkModeWithData: Story = {
    args: {
        initialApiKeys: enterpriseApiKeys,
        variant: "dark",
        cardVariant: "border",
        inputVariant: "neonPulse",
        buttonVariant: "neon",
        darkMode: true,
        headerTitle: "Dark Mode Dashboard",
        headerDescription: "Data objects in dark theme",
        showStats: true,
        showFilters: true
    },
    decorators: [
        (Story) => (
            <div className="dark min-h-screen bg-gray-950">
                <div className="dark">
                    <Story />
                </div>
            </div>
        ),
    ],
    name: "Dark Mode Data Objects",
    parameters: {
        docs: {
            description: {
                story: "Shows data objects displayed in dark mode theme. Data structure remains the same regardless of theme."
            }
        }
    }
};

export const GlassThemeWithData: Story = {
    args: {
        initialApiKeys: sampleApiKeys,
        variant: "glass",
        cardVariant: "glass",
        inputVariant: "glassmorphism",
        buttonVariant: "glass",
        headerTitle: "Glass Theme",
        headerDescription: "Data objects with glassmorphism effects",
        showFilters: true,
        showSearch: true,
        showStats: true
    },
    name: "Glass Theme Data Objects",
    parameters: {
        docs: {
            description: {
                story: "Demonstrates data objects in glass theme. Visual styling doesn't affect data structure."
            }
        }
    }
};

// Special Cases
export const EmptyStateData: Story = {
    args: {
        initialApiKeys: [],
        variant: "default",
        headerTitle: "No Data Available",
        headerDescription: "Start by creating your first API key",
        showStats: false,
        showFilters: false,
        showSearch: false
    },
    name: "Empty Data Objects",
    parameters: {
        docs: {
            description: {
                story: "Shows empty state when no data objects are provided. Demonstrates passing an empty array to `initialApiKeys`."
            }
        }
    }
};

export const CustomEmptyState: Story = {
    args: {
        initialApiKeys: [],
        variant: "gradient",
        customEmptyState: (
            <div className="text-center py-12 px-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center mx-auto mb-4">
                    <Key className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">No API Keys Found</h3>
                <p className="text-muted-foreground mb-6">
                    You haven't created any API keys yet. Create your first key to get started.
                </p>
                <div className="flex gap-3 justify-center">
                    <button className="px-4 py-2 bg-primary text-white rounded-lg font-medium">
                        Create First Key
                    </button>
                    <button className="px-4 py-2 border border-border rounded-lg font-medium">
                        View Documentation
                    </button>
                </div>
            </div>
        ),
        showStats: false,
        showFilters: false
    },
    name: "Custom Empty Data State",
    parameters: {
        docs: {
            description: {
                story: "Demonstrates custom empty state when no data objects are available. Shows using `customEmptyState` prop with JSX."
            }
        }
    }
};

// Data Manipulation Stories
export const WithFilteredData: Story = {
    args: {
        initialApiKeys: [
            ...sampleApiKeys,
            {
                id: 'filter_001',
                name: 'Filtered Key 1',
                keyPrefix: 'sk_test_',
                keySuffix: 'f1Lt',
                scopes: ['read:data'],
                createdAt: new Date('2024-03-01'),
                lastUsed: new Date('2024-03-25'),
                usageCount: 500,
                usageHistory: Array.from({ length: 7 }, (_, i) => ({
                    date: new Date(Date.now() - (6 - i) * 86400000).toLocaleDateString('en-US', { weekday: 'short' }),
                    count: Math.floor(Math.random() * 50) + 10
                })),
                status: 'inactive' as const,
                description: 'Inactive key for filtering demo'
            },
            {
                id: 'filter_002',
                name: 'Filtered Key 2',
                keyPrefix: 'sk_live_',
                keySuffix: 'f2Lt',
                scopes: ['admin'],
                createdAt: new Date('2024-02-15'),
                lastUsed: new Date('2024-03-20'),
                usageCount: 1200,
                usageHistory: Array.from({ length: 7 }, (_, i) => ({
                    date: new Date(Date.now() - (6 - i) * 86400000).toLocaleDateString('en-US', { weekday: 'short' }),
                    count: Math.floor(Math.random() * 100) + 30
                })),
                status: 'expired' as const,
                expiresAt: new Date('2024-03-15'),
                description: 'Expired admin key'
            }
        ],
        headerTitle: "Filterable Data Objects",
        headerDescription: "Demonstrates filtering capabilities with various data",
        showFilters: true,
        showSearch: true,
        variant: "default",
        cardVariant: "default"
    },
    name: "Filterable Data Objects",
    parameters: {
        docs: {
            description: {
                story: "Shows how the component filters data objects based on status, scopes, and search. Demonstrates data organization for filtering."
            }
        }
    }
};

// Security Stories
export const HighSecurityWithData: Story = {
    args: {
        initialApiKeys: sampleApiKeys,
        requirePasswordToReveal: true,
        autoHideRevealedKey: true,
        autoHideDelay: 15,
        requireConfirmation: true,
        headerTitle: "High Security Mode",
        headerDescription: "Data objects with enhanced security features",
        headerIcon: <Lock className="w-4 h-4" />,
        variant: "dark",
        darkMode: true,
        showNotifications: true
    },
    decorators: [
        (Story) => (
            <div className="dark min-h-screen bg-gray-950">
                <div className="dark">
                    <Story />
                </div>
            </div>
        ),
    ],
    name: "Secure Data Objects",
    parameters: {
        docs: {
            description: {
                story: "Shows data objects with enhanced security features. Security settings don't affect data structure."
            }
        }
    }
};

// Responsive Stories
export const MobileDataView: Story = {
    args: {
        initialApiKeys: minimalApiKeys,
        showFilters: false,
        showExport: false,
        showStats: false,
        headerTitle: "Mobile Data View",
        headerDescription: "Data objects on mobile devices"
    },
    parameters: {
        viewport: {
            defaultViewport: "mobile1",
        },
        layout: "fullscreen",
    },
    name: "Mobile Data Objects",
    // parameters: {
    //     docs: {
    //         description: {
    //             story: "Shows data objects on mobile view. Data structure remains consistent across devices."
    //         }
    //     }
    // }
};

// Data Transformation Example
export const DataTransformationExample: Story = {
    args: {
        initialApiKeys: transformedApiKeys,
        headerTitle: "Data Transformation Demo",
        headerDescription: "Showing transformed external API data",
        variant: "card",
        cardVariant: "border",
        showStats: true,
        statsData: {
            totalKeys: transformedApiKeys.length,
            activeKeys: transformedApiKeys.filter(k => k.status === 'active').length,
            totalCalls: transformedApiKeys.reduce((sum, k) => sum + k.usageCount, 0),
            callsToday: transformedApiKeys.reduce((sum, k) => {
                const todayUsage = k.usageHistory[k.usageHistory.length - 1]?.count || 0;
                return sum + todayUsage;
            }, 0),
            revokedKeys: (transformedApiKeys as ApiKey[]).filter(k => k.status === 'revoked').length
        }
    },
    name: "Data Transformation",
    parameters: {
        docs: {
            description: {
                story: "Demonstrates data transformation from external sources. Shows how to calculate derived statistics from data objects."
            }
        }
    }
};

// Data Validation Story
export const WithInvalidData: Story = {
    args: {
        initialApiKeys: [
            {
                id: 'invalid_001',
                name: 'Test Key with Missing Fields',
                keyPrefix: 'sk_test_',
                keySuffix: 't1St',
                scopes: ['read:data'],
                createdAt: new Date(),
                lastUsed: null,
                usageCount: 0,
                usageHistory: [],
                status: 'active' as const,
                // Missing optional fields like description and expiresAt
            }
        ],
        headerTitle: "Partial Data Objects",
        headerDescription: "Shows how the component handles partial data",
        showStats: true,
        showFilters: true
    },
    name: "Partial Data Objects",
    parameters: {
        docs: {
            description: {
                story: "Demonstrates how the component handles data objects with missing optional fields. Only required fields are necessary."
            }
        }
    }
};

// Playground Story for Documentation
export const DataObjectPlayground: Story = {
    args: {
        initialApiKeys: sampleApiKeys,
        variant: "default",
        animationVariant: "fadeUp",
        cardVariant: "default",
        inputVariant: "clean",
        buttonVariant: "primary",
        showFilters: true,
        showSearch: true,
        showExport: true,
        showStats: true,
        requireConfirmation: true,
        showNotifications: true,
        darkMode: false,
        headerTitle: "Data Object Playground",
        headerDescription: "Experiment with different data configurations"
    },
    name: "Data Object Playground",
    parameters: {
        docs: {
            description: {
                story: "Interactive playground to experiment with different data object configurations. Use Storybook controls to modify props."
            }
        },
        controls: {
            expanded: true
        }
    }
};