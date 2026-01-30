
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
    Key,
    Plus,
    Eye,
    Trash2,
    Copy,
    Shield,
    Loader2,
    Download,
    Ban,
    Check,
    AlertTriangle,
    CheckCircle,
    AlertCircle,
    X,
    Search,
    Filter,
    Activity,
    Users,
    Database,
    BarChart3,
    Settings,
    Clock,
    MoreVertical,
    CheckCircle as CheckCircleIcon,
    Ban as BanIcon
} from 'lucide-react';
import { cva } from "class-variance-authority";
import { cn } from '../../../../../utils/cn';
import { Button } from '../../../../components/button';
import { Typography } from '../../../../components/typography';
import { Checkbox } from '../../../../components/checkbox';
import { AnimatedInput } from '../../../../components/input';

// ==================== TYPES ====================
type ApiKeyScope =
    | "read:users"
    | "write:users"
    | "read:data"
    | "write:data"
    | "read:analytics"
    | "admin";

export type ButtonVariant =
    | "default"
    | "glass"
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "danger"
    | "outline"
    | "ghost"
    | "link"
    | "subtle"
    | "elevated"
    | "neon"
    | "pill"
    | "none";

interface NewBadgeProps {
    text: string;
    type?:
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "error"
    | "info"
    | "default";
    variant?: "pulse" | "bounce" | "tinypop";
    className?: string;
    showIcon?: boolean;
    icon?: React.ElementType;
}

interface Notification {
    id: string;
    type: "success" | "error" | "info" | "warning";
    message: string;
    duration?: number;
}

interface ApiKey {
    id: string;
    name: string;
    keyPrefix: string;
    keySuffix: string;
    fullKey?: string;
    scopes: ApiKeyScope[];
    createdAt: Date;
    lastUsed: Date | null;
    usageCount: number;
    usageHistory: { date: string; count: number }[];
    status: "active" | "inactive" | "expired" | "revoked";
    expiresAt?: Date;
    description?: string;
}

interface ScopeInfo {
    id: ApiKeyScope;
    name: string;
    description: string;
    risk: "low" | "medium" | "high";
    icon: React.ElementType;
}

interface FilterOptions {
    status: ("active" | "inactive" | "expired" | "revoked")[];
    scopes: ApiKeyScope[];
    dateRange: {
        start: Date | null;
        end: Date | null;
    };
}

interface StatsData {
    totalKeys: number;
    activeKeys: number;
    totalCalls: number;
    callsToday: number;
    revokedKeys: number;
}

interface StatsOverviewProps {
    stats: StatsData;
    isLoading?: boolean;
    badgeVariant?: "pulse" | "bounce" | "tinypop";
}

interface StatusBadgeProps {
    status: ApiKey["status"];
    badgeVariant?: "pulse" | "bounce" | "tinypop";
    className?: string;
}

interface ScopeBadgeProps {
    scope: ApiKeyScope;
    badgeVariant?: "pulse" | "bounce" | "tinypop";
    showIcon?: boolean;
    className?: string;
}

interface DeleteKeyModalProps {
    isOpen: boolean;
    onClose: () => void;
    onDelete: (apiKey: ApiKey) => Promise<void>;
    apiKey: ApiKey | null;
    isLoading?: boolean;
    inputVariant?: string;
    buttonVariant?: ButtonVariant;
    buttonAnimationVariant?: string;
}

interface RevokeKeyModalProps {
    isOpen: boolean;
    onClose: () => void;
    onRevoke: (apiKey: ApiKey) => Promise<void>;
    apiKey: ApiKey | null;
    isLoading?: boolean;
    inputVariant?: string;
    buttonVariant?: ButtonVariant;
    buttonAnimationVariant?: string;
}

interface ViewKeyModalProps {
    isOpen: boolean;
    onClose: () => void;
    onReveal: (apiKey: ApiKey) => Promise<void>;
    apiKey: ApiKey | null;
    isLoading?: boolean;
    inputVariant?: string;
    buttonVariant?: ButtonVariant;
    buttonAnimationVariant?: string;
    autoHideDelay?: number;
}

interface ApiKeyCardProps {
    apiKey: ApiKey;
    isSelected?: boolean;
    onSelect?: (id: string) => void;
    onReveal?: (key: ApiKey) => void;
    onDelete?: (key: ApiKey) => void;
    onCopy?: (key: ApiKey) => void;
    onRevoke?: (key: ApiKey) => void;
    showActions?: boolean;
    variant?: string;
    badgeVariant?: "pulse" | "bounce" | "tinypop";
    buttonVariant?: ButtonVariant;
    buttonAnimationVariant?: string;
}

interface GenerateKeyModalProps {
    isOpen: boolean;
    onClose: () => void;
    onGenerate: (data: {
        name: string;
        scopes: ApiKeyScope[];
        expiresAt?: Date;
        description?: string;
    }) => Promise<ApiKey>;
    isLoading?: boolean;
    badgeVariant?: "pulse" | "bounce" | "tinypop";
    inputVariant?: string;
    buttonVariant?: ButtonVariant;
    buttonAnimationVariant?: string;
}

interface SearchFilterProps {
    searchQuery: string;
    onSearchChange: (value: string) => void;
    filters: FilterOptions;
    onFiltersChange: (filters: FilterOptions) => void;
    availableScopes: ApiKeyScope[];
    inputVariant?: string;
    buttonVariant?: ButtonVariant;
    buttonAnimationVariant?: string;
    showFilters?: boolean;
    showSearch?: boolean;
    searchPlaceholder?: string;
}

interface ApiKeysPageProps {
    headerTitle?: string;
    headerIcon?: React.ReactNode;
    headerDescription?: string;
    initialApiKeys?: ApiKey[];
    statsData?: Partial<StatsData>;
    onGenerateKey?: (
        name: string,
        scopes: ApiKeyScope[],
        expiresAt?: Date,
        description?: string
    ) => Promise<ApiKey>;
    onDeleteKey?: (id: string) => Promise<void>;
    onRevealKey?: (id: string) => Promise<string>;
    onRevokeKey?: (id: string) => Promise<void>;
    onCopyKey?: (key: string) => void;
    onKeys?: (format: "json" | "csv") => void;
    onExportKeys?: (format: "json" | "csv") => void;
    variant?: "default" | "gradient" | "card" | "glass" | "dark";
    animationVariant?:
    | "fadeUp"
    | "scaleIn"
    | "slideUp"
    | "slideLeft"
    | "slideRight";
    cardVariant?: string;
    inputVariant?: string;
    buttonVariant?: ButtonVariant;
    buttonAnimationVariant?: string;
    badgeVariant?: "pulse" | "bounce" | "tinypop";
    customHeader?: React.ReactNode;
    customStatsSection?: React.ReactNode;
    customEmptyState?: React.ReactNode;
    generateButtonLabel?: string;
    searchPlaceholder?: string;
    isLoading?: boolean;
    isGenerating?: boolean;
    showFilters?: boolean;
    showSearch?: boolean;
    showExport?: boolean;
    showStats?: boolean;
    requireConfirmation?: boolean;
    showNotifications?: boolean;
    notificationDuration?: number;
    requirePasswordToReveal?: boolean;
    autoHideRevealedKey?: boolean;
    autoHideDelay?: number;
    darkMode?: boolean;
}

type NotificationType = {
    type: "success" | "error" | "warning" | "info";
    message: string;
    duration?: number;
    id: string;
};

// ==================== UTILS ====================
export const PageVariants = cva("", {
    variants: {
        variant: {
            default: "bg-background text-foreground",
            gradient: "bg-gradient-to-br from-primary/5 via-accent/10 to-secondary/5",
            card: "bg-card",
            glass: "bg-background/80 backdrop-blur-md",
            dark: "bg-gray-950 text-gray-50",
        },
    },
    defaultVariants: {
        variant: "default",
    },
});

export const CardVariants = cva(
    "rounded-2xl overflow-hidden transition-smooth",
    {
        variants: {
            variant: {
                default: "bg-card shadow-lg",
                glass: "bg-card/80 backdrop-blur-md shadow-lg",
                border: "bg-card border-2 border-primary/10 shadow-lg",
                elevated: "bg-card shadow-xl",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
);

export const TableVariants = cva("w-full", {
    variants: {
        variant: {
            default: "bg-card",
            glass: "bg-card/50 backdrop-blur-md",
            border: "border border-border rounded-lg",
        },
    },
    defaultVariants: {
        variant: "default",
    },
});

export const NotificationVariants = cva(
    "fixed z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg z-200 border transition-all duration-300",
    {
        variants: {
            type: {
                success: "bg-green-50 text-green-800 border-green-200",
                error: "bg-red-50 text-red-800 border-red-200",
                info: "bg-blue-50 text-blue-800 border-blue-200",
                warning: "bg-yellow-50 text-yellow-800 border-yellow-200",
            },
        },
    }
);

export const animationVariants = {
    fadeUp: {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
    },
    scaleIn: {
        initial: { opacity: 0, scale: 0.95 },
        animate: { opacity: 1, scale: 1 },
    },
    slideUp: {
        initial: { opacity: 0, y: 40 },
        animate: { opacity: 1, y: 0 },
    },
    slideLeft: {
        initial: { opacity: 0, x: -40 },
        animate: { opacity: 1, x: 0 },
    },
    slideRight: {
        initial: { opacity: 0, x: 40 },
        animate: { opacity: 1, x: 0 },
    },
};

// ==================== CONSTANTS ====================
const SCOPES: ScopeInfo[] = [
    { id: 'read:users', name: 'Read Users', description: 'Access to read user data', risk: 'low', icon: Users },
    { id: 'write:users', name: 'Write Users', description: 'Create and update user data', risk: 'medium', icon: Users },
    { id: 'read:data', name: 'Read Data', description: 'Access to read application data', risk: 'low', icon: Database },
    { id: 'write:data', name: 'Write Data', description: 'Create and update application data', risk: 'medium', icon: Database },
    { id: 'read:analytics', name: 'Read Analytics', description: 'Access to analytics and metrics', risk: 'low', icon: BarChart3 },
    { id: 'admin', name: 'Admin Access', description: 'Full administrative privileges', risk: 'high', icon: Settings },
];

const STATUS_BADGE_TYPES = {
    active: 'success' as const,
    inactive: 'warning' as const,
    expired: 'error' as const,
    revoked: 'error' as const
} as const;

const STATUS_LABELS = {
    active: 'Active',
    inactive: 'Inactive',
    expired: 'Expired',
    revoked: 'Revoked'
} as const;

const SCOPE_RISK_BADGE_TYPES = {
    low: 'success' as const,
    medium: 'warning' as const,
    high: 'error' as const
} as const;

// ==================== MOCK DATA ====================
const generateMockApiKeys = (): ApiKey[] => [
    {
        id: '1',
        name: 'Production API',
        keyPrefix: 'sk_live_',
        keySuffix: 'x7Kp',
        scopes: ['read:users', 'write:users', 'read:data', 'write:data'],
        createdAt: new Date('2024-01-15'),
        lastUsed: new Date(),
        usageCount: 15420,
        usageHistory: Array.from({ length: 7 }, (_, i) => ({
            date: new Date(Date.now() - (6 - i) * 86400000).toLocaleDateString('en-US', { weekday: 'short' }),
            count: Math.floor(Math.random() * 500) + 50
        })),
        status: 'active',
        expiresAt: new Date('2025-01-15'),
        description: 'Used for production environment API calls'
    },
    {
        id: '2',
        name: 'Analytics Dashboard',
        keyPrefix: 'sk_live_',
        keySuffix: 'm2Qr',
        scopes: ['read:analytics', 'read:data'],
        createdAt: new Date('2024-03-22'),
        lastUsed: new Date(Date.now() - 86400000),
        usageCount: 8934,
        usageHistory: Array.from({ length: 7 }, (_, i) => ({
            date: new Date(Date.now() - (6 - i) * 86400000).toLocaleDateString('en-US', { weekday: 'short' }),
            count: Math.floor(Math.random() * 400) + 30
        })),
        status: 'active',
        expiresAt: new Date('2024-12-22'),
        description: 'Dashboard analytics integration'
    },
    {
        id: '3',
        name: 'Mobile App',
        keyPrefix: 'sk_live_',
        keySuffix: 'n9Ts',
        scopes: ['read:users', 'read:data'],
        createdAt: new Date('2024-06-10'),
        lastUsed: new Date(Date.now() - 172800000),
        usageCount: 42156,
        usageHistory: Array.from({ length: 7 }, (_, i) => ({
            date: new Date(Date.now() - (6 - i) * 86400000).toLocaleDateString('en-US', { weekday: 'short' }),
            count: Math.floor(Math.random() * 700) + 100
        })),
        status: 'active',
        expiresAt: new Date('2025-06-10'),
        description: 'Mobile application API access'
    },
    {
        id: '4',
        name: 'Webhook Service',
        keyPrefix: 'sk_test_',
        keySuffix: 'p5Lm',
        scopes: ['write:data'],
        createdAt: new Date('2023-11-05'),
        lastUsed: new Date('2024-10-01'),
        usageCount: 3250,
        usageHistory: Array.from({ length: 7 }, (_, i) => ({
            date: new Date(Date.now() - (6 - i) * 86400000).toLocaleDateString('en-US', { weekday: 'short' }),
            count: Math.floor(Math.random() * 100) + 10
        })),
        status: 'expired',
        expiresAt: new Date('2024-11-05'),
        description: 'Webhook service integration'
    },
    {
        id: '5',
        name: 'Legacy System',
        keyPrefix: 'sk_live_',
        keySuffix: 'r1Wv',
        scopes: ['admin', 'read:data', 'write:data'],
        createdAt: new Date('2023-08-20'),
        lastUsed: null,
        usageCount: 0,
        usageHistory: Array.from({ length: 7 }, () => ({ date: '', count: 0 })),
        status: 'revoked',
        description: 'Revoked due to security concerns'
    }
];

// ==================== COMPONENTS ====================

// NewBadge Component
const NewBadge = ({
    text,
    type = 'default',
    variant,
    className,
    icon: Icon
}: NewBadgeProps) => {
    const typeStyles = {
        default: "bg-secondary text-secondary-foreground",
        primary: "bg-primary text-primary-foreground",
        secondary: "bg-secondary text-secondary-foreground",
        success: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
        warning: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100",
        error: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100",
        info: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
    };

    const animationStyles = {
        pulse: "animate-pulse",
        bounce: "animate-bounce",
        tinypop: "",
    };

    return (
        <span
            className={cn(
                "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
                typeStyles[type],
                variant && animationStyles[variant],
                className
            )}
        >
            {Icon && <Icon className="w-3 h-3" />}
            {text}
        </span>
    );
};

// Notification Component
const NotificationComponent = ({
    type = 'success',
    message,
    onClose,
    duration = 3000
}: {
    type: Notification['type'];
    message: string;
    onClose: () => void;
    duration?: number;
}) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const icons = {
        success: <CheckCircle className="w-5 h-5" />,
        error: <AlertCircle className="w-5 h-5" />,
        info: <Activity className="w-5 h-5" />,
        warning: <AlertTriangle className="w-5 h-5" />
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={cn(
                NotificationVariants({ type }),
                "top-4 right-4"
            )}
        >
            {icons[type]}
            <Typography variant="body-small" weight="medium">
                {message}
            </Typography>
            <button
                onClick={onClose}
                className="ml-4 text-current hover:opacity-70 transition-opacity cursor-pointer"
            >
                <X className="w-4 h-4" />
            </button>
        </motion.div>
    );
};

// StatsOverview Component
const StatsOverview = ({ stats, isLoading, badgeVariant = "tinypop" }: StatsOverviewProps) => {
    if (isLoading) {
        return (
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-24 rounded-xl bg-secondary/30 animate-pulse" />
                ))}
            </div>
        );
    }

    const statCards = [
        {
            label: 'Total Keys',
            value: stats.totalKeys,
            icon: Key,
            type: 'primary' as const,
            change: '+2 this month',
            badgeText: '+2'
        },
        {
            label: 'Active Keys',
            value: stats.activeKeys,
            icon: CheckCircleIcon,
            type: 'success' as const,
            change: `${Math.round((stats.activeKeys / stats.totalKeys) * 100)}% active`,
            badgeText: `${Math.round((stats.activeKeys / stats.totalKeys) * 100)}%`
        },
        {
            label: 'Total Calls',
            value: stats.totalCalls.toLocaleString(),
            icon: Activity,
            type: 'warning' as const,
            change: '+12% from last month',
            badgeText: '+12%'
        },
        {
            label: 'Calls Today',
            value: stats.callsToday.toLocaleString(),
            icon: Clock,
            type: 'primary' as const,
            change: 'Live data',
            badgeText: 'Live'
        },
        {
            label: 'Revoked Keys',
            value: stats.revokedKeys,
            icon: BanIcon,
            type: 'error' as const,
            change: 'Security audit',
            badgeText: 'Audit'
        }
    ];

    return (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            {statCards.map((stat, index) => (
                <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={cn(
                        "relative rounded-xl p-4 transition-all duration-300 hover:scale-[1.02] cursor-pointer",
                        "bg-card border border-border shadow-sm hover:shadow-md"
                    )}
                >
                    <div className="flex items-center justify-between mb-2">
                        <div className={cn(
                            "w-10 h-10 rounded-lg flex items-center justify-center",
                            stat.type === 'primary' && "bg-primary/10 text-primary",
                            stat.type === 'success' && "bg-success/10 text-success",
                            stat.type === 'warning' && "bg-warning/10 text-warning",
                            stat.type === 'error' && "bg-destructive/10 text-destructive"
                        )}>
                            <stat.icon className="w-5 h-5" />
                        </div>
                        <div className="relative">
                            <NewBadge
                                text={stat.badgeText}
                                type={stat.type}
                                variant={badgeVariant}
                                className="text-xs"
                            />
                        </div>
                    </div>
                    <Typography variant="h3" weight="bold" className="mb-1">
                        {stat.value}
                    </Typography>
                    <Typography variant="body-small" color="muted">
                        {stat.label}
                    </Typography>
                </motion.div>
            ))}
        </div>
    );
};

// StatusBadge Component
const StatusBadge = ({ status, badgeVariant = "tinypop", className }: StatusBadgeProps) => {
    const type = STATUS_BADGE_TYPES[status];
    const label = STATUS_LABELS[status];
    const variant = status === 'active' ? badgeVariant : undefined;

    return (
        <NewBadge
            text={label}
            type={type}
            variant={variant}
            className={cn("text-xs font-medium", className)}
        />
    );
};

// ScopeBadge Component
const ScopeBadge = ({ scope, badgeVariant = "tinypop", showIcon = true, className }: ScopeBadgeProps) => {
    const scopeInfo = SCOPES.find(s => s.id === scope);
    if (!scopeInfo) return null;

    const Icon = scopeInfo.icon;
    const type = SCOPE_RISK_BADGE_TYPES[scopeInfo.risk];
    const variant = scopeInfo.risk === 'high' ? badgeVariant : undefined;

    return (
        <NewBadge
            text={scopeInfo.name}
            type={type}
            variant={variant}
            className={cn("text-xs font-normal", className)}
            icon={showIcon ? Icon : undefined}
        />
    );
};

// SearchFilter Component
const SearchFilter = ({
    searchQuery,
    onSearchChange,
    filters,
    onFiltersChange,
    availableScopes,
    inputVariant = "clean",
    buttonVariant = "outline",
    buttonAnimationVariant,
    showFilters = true,
    showSearch = true,
    searchPlaceholder = "Search API keys..."
}: SearchFilterProps) => {
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const filterRef = useRef<HTMLDivElement>(null);

    const statusOptions = [
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' },
        { value: 'expired', label: 'Expired' },
        { value: 'revoked', label: 'Revoked' }
    ];

    const toggleStatus = (status: ApiKey['status']) => {
        const newStatus = filters.status.includes(status)
            ? filters.status.filter(s => s !== status)
            : [...filters.status, status];
        onFiltersChange({ ...filters, status: newStatus });
    };

    const toggleScope = (scope: ApiKeyScope) => {
        const newScopes = filters.scopes.includes(scope)
            ? filters.scopes.filter(s => s !== scope)
            : [...filters.scopes, scope];
        onFiltersChange({ ...filters, scopes: newScopes });
    };

    const clearFilters = () => {
        onFiltersChange({
            status: [],
            scopes: [],
            dateRange: { start: null, end: null }
        });
        setIsFilterOpen(false);
    };

    const hasActiveFilters = () => {
        return filters.status.length > 0 || filters.scopes.length > 0 ||
            filters.dateRange.start || filters.dateRange.end;
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
                setIsFilterOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6">
            {showSearch && (
                <div className="flex-1 max-w-md">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <AnimatedInput
                            placeholder={searchPlaceholder}
                            value={searchQuery}
                            onChange={onSearchChange}
                            variant={inputVariant}
                            className="pl-10 pr-10 w-full"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => onSearchChange('')}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </div>
            )}

            {showFilters && (
                <div className="relative" ref={filterRef}>
                    <Button
                        variant={hasActiveFilters() ? "default" : buttonVariant}
                        size="sm"
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                        className={cn(
                            "flex items-center gap-2 cursor-pointer mb-5",
                            hasActiveFilters() && "bg-primary text-primary-foreground"
                        )}
                        animationVariant={buttonAnimationVariant}
                    >
                        <Filter className="w-4 h-4" />
                        Filter
                        {hasActiveFilters() && (
                            <span className="flex items-center justify-center w-5 h-5 text-xs bg-primary-foreground text-primary rounded-full">
                                {filters.status.length + filters.scopes.length}
                            </span>
                        )}
                    </Button>

                    {isFilterOpen && (
                        <div className="absolute right-0 top-full mt-2 w-72 md:w-80 bg-card rounded-xl shadow-2xl border border-border z-50">
                            <div className="p-4 border-b border-border">
                                <div className="flex items-center justify-between">
                                    <Typography variant="body" weight="semibold" color="default">
                                        Filters
                                    </Typography>
                                    {hasActiveFilters() && (
                                        <button
                                            onClick={clearFilters}
                                            className="text-xs text-primary hover:underline cursor-pointer"
                                        >
                                            Clear all
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
                                <div>
                                    <Typography variant="label" color="default" className="mb-2 block">
                                        Status
                                    </Typography>
                                    <div className="flex flex-wrap gap-2">
                                        {statusOptions.map((option) => {
                                            const isSelected = filters.status.includes(option.value as ApiKey['status']);
                                            return (
                                                <button
                                                    key={option.value}
                                                    onClick={() => toggleStatus(option.value as ApiKey['status'])}
                                                    className={cn(
                                                        "px-3 py-1.5 rounded-lg text-sm transition-colors cursor-pointer",
                                                        isSelected
                                                            ? "bg-primary text-primary-foreground"
                                                            : "bg-secondary/50 hover:bg-secondary text-foreground"
                                                    )}
                                                >
                                                    {option.label}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div>
                                    <Typography variant="label" color="default" className="mb-2 block">
                                        Permissions
                                    </Typography>
                                    <div className="space-y-2">
                                        {availableScopes.map((scope) => {
                                            const scopeInfo = SCOPES.find(s => s.id === scope);
                                            const isSelected = filters.scopes.includes(scope);
                                            return (
                                                <div
                                                    key={scope}
                                                    onClick={() => toggleScope(scope)}
                                                    className={cn(
                                                        "flex items-center justify-between p-2 rounded-lg border cursor-pointer transition-colors",
                                                        isSelected
                                                            ? "bg-primary/10 border-primary/30"
                                                            : "bg-secondary/30 border-border hover:border-primary/20"
                                                    )}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        {scopeInfo && (
                                                            <>
                                                                <scopeInfo.icon className="w-4 h-4 text-foreground" />
                                                                <Typography variant="body-small" color="default">
                                                                    {scopeInfo.name}
                                                                </Typography>
                                                            </>
                                                        )}
                                                    </div>
                                                    <div className={cn(
                                                        "w-4 h-4 rounded border flex items-center justify-center",
                                                        isSelected
                                                            ? "bg-primary border-primary"
                                                            : "bg-background border-border"
                                                    )}>
                                                        {isSelected && <Check className="w-3 h-3 text-white" />}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div>
                                    <Typography variant="label" color="default" className="mb-2 block">
                                        Date Range
                                    </Typography>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <Typography variant="caption" color="muted" className="mb-1 block">
                                                From
                                            </Typography>
                                            <AnimatedInput
                                                type="date"
                                                placeholder="Start date"
                                                value={filters.dateRange.start ? filters.dateRange.start.toISOString().split('T')[0] : ''}
                                                onChange={(value) => onFiltersChange({
                                                    ...filters,
                                                    dateRange: {
                                                        ...filters.dateRange,
                                                        start: value ? new Date(value) : null
                                                    }
                                                })}
                                                variant={inputVariant}
                                            />
                                        </div>
                                        <div>
                                            <Typography variant="caption" color="muted" className="mb-1 block">
                                                To
                                            </Typography>
                                            <AnimatedInput
                                                type="date"
                                                placeholder="End date"
                                                value={filters.dateRange.end ? filters.dateRange.end.toISOString().split('T')[0] : ''}
                                                onChange={(value) => onFiltersChange({
                                                    ...filters,
                                                    dateRange: {
                                                        ...filters.dateRange,
                                                        end: value ? new Date(value) : null
                                                    }
                                                })}
                                                variant={inputVariant}
                                            />
                                        </div>
                                    </div>
                                    {(filters.dateRange.start || filters.dateRange.end) && (
                                        <button
                                            onClick={() => onFiltersChange({
                                                ...filters,
                                                dateRange: { start: null, end: null }
                                            })}
                                            className="mt-2 text-xs text-primary hover:underline cursor-pointer"
                                        >
                                            Clear date range
                                        </button>
                                    )}
                                </div>
                            </div>

                            {hasActiveFilters() && (
                                <div className="p-4 border-t border-border bg-secondary/30">
                                    <Typography variant="caption" color="muted" className="mb-2 block">
                                        Active filters:
                                    </Typography>
                                    <div className="flex flex-wrap gap-1">
                                        {filters.status.map(status => (
                                            <NewBadge
                                                key={status}
                                                text={STATUS_LABELS[status]}
                                                type={STATUS_BADGE_TYPES[status]}
                                                variant="tinypop"
                                                className="text-xs"
                                            />
                                        ))}
                                        {filters.scopes.map(scope => {
                                            const scopeInfo = SCOPES.find(s => s.id === scope);
                                            return (
                                                <NewBadge
                                                    key={scope}
                                                    text={scopeInfo?.name || scope}
                                                    type="info"
                                                    variant="tinypop"
                                                    className="text-xs"
                                                />
                                            );
                                        })}
                                        {(filters.dateRange.start || filters.dateRange.end) && (
                                            <NewBadge
                                                text="Date range"
                                                type="secondary"
                                                variant="tinypop"
                                                className="text-xs"
                                            />
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

// ApiKeyCard Component
const ApiKeyCard = ({
    apiKey,
    isSelected = false,
    onSelect,
    onReveal,
    onDelete,
    onCopy,
    onRevoke,
    variant = 'default',
    badgeVariant = "tinypop",
    buttonVariant = "ghost",
    buttonAnimationVariant
}: ApiKeyCardProps) => {
    const [copied, setCopied] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const handleCopy = () => {
        const maskedKey = `${apiKey.keyPrefix}••••••••${apiKey.keySuffix}`;
        navigator.clipboard.writeText(maskedKey);
        setCopied(true);
        onCopy?.(apiKey);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleReveal = () => {
        setIsMenuOpen(false);
        onReveal?.(apiKey);
    };

    const handleDelete = () => {
        setIsMenuOpen(false);
        onDelete?.(apiKey);
    };

    const handleRevoke = () => {
        setIsMenuOpen(false);
        onRevoke?.(apiKey);
    };

    const formatDate = (date: Date | null) => {
        if (!date) return 'Never';
        return new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        }).format(date);
    };

    const formatLastUsed = (date: Date | null) => {
        if (!date) return 'Never used';
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const days = Math.floor(hours / 24);

        if (hours < 1) return 'Just now';
        if (hours < 24) return `${hours}h ago`;
        if (days < 7) return `${days}d ago`;
        return formatDate(date);
    };

    const getScopeBadges = () => {
        return apiKey.scopes.slice(0, 3).map(scope => (
            <ScopeBadge
                key={scope}
                scope={scope}
                badgeVariant={badgeVariant}
                showIcon={true}
            />
        ));
    };

    return (
        <div
            className={cn(
                "rounded-xl border transition-all duration-300 hover:shadow-lg cursor-pointer",
                isSelected ? "border-primary bg-primary/5" : "border-border bg-card",
                variant === 'glass' && "bg-card/50 backdrop-blur-md"
            )}
            onClick={() => onSelect?.(apiKey.id)}
        >
            <div className="p-4">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                            <Typography variant="body" weight="semibold" className="truncate text-foreground">
                                {apiKey.name}
                            </Typography>
                            <div className="flex-shrink-0">
                                <StatusBadge
                                    status={apiKey.status}
                                    badgeVariant={badgeVariant}
                                />
                            </div>
                        </div>
                        <Typography variant="body-small" color="muted" className="line-clamp-2">
                            {apiKey.description || 'No description provided'}
                        </Typography>
                    </div>

                    <div className="relative" onClick={(e) => e.stopPropagation()}>
                        <Button
                            variant={buttonVariant}
                            size="icon"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="cursor-pointer"
                            animationVariant={buttonAnimationVariant}
                        >
                            <MoreVertical className="w-4 h-4" />
                        </Button>

                        {isMenuOpen && (
                            <div
                                ref={menuRef}
                                className="absolute right-0 top-full mt-1 w-48 rounded-lg shadow-lg border border-border bg-card z-10"
                            >
                                <div className="py-1">
                                    <button
                                        onClick={handleReveal}
                                        className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-secondary transition-colors cursor-pointer"
                                    >
                                        <Eye className="w-4 h-4" />
                                        Reveal Key
                                    </button>
                                    <button
                                        onClick={handleCopy}
                                        className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-secondary transition-colors cursor-pointer"
                                    >
                                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                        {copied ? 'Copied!' : 'Copy Reference'}
                                    </button>
                                    {apiKey.status === 'active' && (
                                        <button
                                            onClick={handleRevoke}
                                            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-warning hover:bg-warning/10 transition-colors cursor-pointer"
                                        >
                                            <Ban className="w-4 h-4" />
                                            Revoke Key
                                        </button>
                                    )}
                                    <button
                                        onClick={handleDelete}
                                        className="flex items-center gap-2 w-full px-3 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        Delete
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="mb-4 p-3 rounded-lg bg-secondary/30 border border-border">
                    <Typography variant="caption" color="muted" className="mb-1">
                        API Key
                    </Typography>
                    <div className="flex items-center justify-between">
                        <code className="font-mono text-sm tracking-wider text-foreground">
                            {apiKey.keyPrefix}••••••••{apiKey.keySuffix}
                        </code>
                        <Button
                            variant={buttonVariant}
                            size="sm"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleCopy();
                            }}
                            className="cursor-pointer"
                            animationVariant={buttonAnimationVariant}
                        >
                            {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        </Button>
                    </div>
                </div>

                <div className="mb-4">
                    <Typography variant="caption" color="muted" className="mb-2 block">
                        Permissions
                    </Typography>
                    <div className="flex flex-wrap gap-1">
                        {getScopeBadges()}
                        {apiKey.scopes.length > 3 && (
                            <div className="relative inline-flex items-center">
                                <NewBadge
                                    text={`+${apiKey.scopes.length - 3}`}
                                    type="secondary"
                                    variant="tinypop"
                                    className="text-xs"
                                />
                            </div>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <Typography variant="caption" color="muted">
                            Created
                        </Typography>
                        <Typography variant="body-small" color="default">
                            {formatDate(apiKey.createdAt)}
                        </Typography>
                    </div>
                    <div>
                        <Typography variant="caption" color="muted">
                            Last Used
                        </Typography>
                        <Typography variant="body-small" color="default">
                            {formatLastUsed(apiKey.lastUsed)}
                        </Typography>
                    </div>
                    <div>
                        <Typography variant="caption" color="muted">
                            Usage
                        </Typography>
                        <Typography variant="body-small" color="default">
                            {apiKey.usageCount.toLocaleString()} calls
                        </Typography>
                    </div>
                    {apiKey.expiresAt && (
                        <div>
                            <Typography variant="caption" color="muted">
                                Expires
                            </Typography>
                            <Typography variant="body-small" color="default">
                                {formatDate(apiKey.expiresAt)}
                            </Typography>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// DeleteKeyModal Component
const DeleteKeyModal = ({
    isOpen,
    onClose,
    onDelete,
    apiKey,
    isLoading = false,
    inputVariant = "clean",
    buttonVariant = "danger",
    buttonAnimationVariant
}: DeleteKeyModalProps) => {
    const [confirmationText, setConfirmationText] = useState('');
    const [error, setError] = useState('');

    if (!isOpen || !apiKey) return null;

    const handleDelete = async () => {
        if (confirmationText !== apiKey.name) {
            setError(`Please type "${apiKey.name}" to confirm deletion.`);
            return;
        }

        try {
            await onDelete(apiKey);
            onClose();
            setConfirmationText('');
            setError('');
        } catch (error) {
            setError('Failed to delete API key');
        }
    };

    const handleClose = () => {
        onClose();
        setConfirmationText('');
        setError('');
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-lg"
            >
                <div className="bg-card rounded-2xl shadow-2xl border border-border">
                    <div className="p-6 border-b border-border">
                        <Typography variant="h5" weight="semibold" className="flex items-center gap-2 text-destructive">
                            <Trash2 className="w-5 h-5" />
                            Delete API Key
                        </Typography>
                        <Typography variant="body-small" color="muted">
                            Permanently delete "{apiKey.name}"
                        </Typography>
                    </div>

                    <div className="p-6 space-y-6">
                        <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/30">
                            <div className="flex items-start gap-3">
                                <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0" />
                                <div>
                                    <Typography variant="body-small" weight="medium" className="text-destructive mb-1">
                                        Warning: Irreversible Action
                                    </Typography>
                                    <Typography variant="caption" color="muted">
                                        Deleting this key is permanent and cannot be undone. Any applications using this key will stop working immediately.
                                    </Typography>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Typography variant="label" color="default">
                                Type the key name to confirm deletion *
                            </Typography>
                            <Typography variant="caption" color="muted" className="mb-3">
                                Type "<span className="font-mono font-semibold">{apiKey.name}</span>" to confirm
                            </Typography>
                            <AnimatedInput
                                placeholder={`Type "${apiKey.name}"`}
                                value={confirmationText}
                                onChange={(value) => {
                                    setConfirmationText(value);
                                    if (error) setError('');
                                }}
                                variant={inputVariant}
                            />
                            {error && (
                                <Typography variant="caption" color="error">
                                    {error}
                                </Typography>
                            )}
                        </div>

                        <div>
                            <Typography variant="label" color="default" className="mb-2 block">
                                Key Details
                            </Typography>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Key ID:</span>
                                    <code className="font-mono">{apiKey.id}</code>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Status:</span>
                                    <StatusBadge status={apiKey.status} />
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Created:</span>
                                    <span>{new Date(apiKey.createdAt).toLocaleDateString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Permissions:</span>
                                    <span>{apiKey.scopes.length} scope(s)</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 border-t border-border flex justify-end gap-3">
                        <Button
                            variant="outline"
                            onClick={handleClose}
                            disabled={isLoading}
                            animationVariant={buttonAnimationVariant}
                            className="cursor-pointer"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleDelete}
                            disabled={isLoading || confirmationText !== apiKey.name}
                            variant={buttonVariant}
                            animationVariant={buttonAnimationVariant}
                            className="cursor-pointer"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                    Deleting...
                                </>
                            ) : (
                                <>
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Delete Key
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

// GenerateKeyModal Component
const GenerateKeyModal = ({
    isOpen,
    onClose,
    onGenerate,
    isLoading = false,
    badgeVariant = "tinypop",
    inputVariant = "clean",
    buttonVariant = "default",
    buttonAnimationVariant
}: GenerateKeyModalProps) => {
    const [step, setStep] = useState<'form' | 'result'>('form');
    const [formData, setFormData] = useState({
        name: '',
        scopes: [] as ApiKeyScope[],
        expiresAt: undefined as Date | undefined,
        description: ''
    });
    const [generatedKey, setGeneratedKey] = useState<ApiKey | null>(null);
    const [copied, setCopied] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleClose = () => {
        setStep('form');
        setFormData({ name: '', scopes: [], expiresAt: undefined, description: '' });
        setGeneratedKey(null);
        setCopied(false);
        setErrors({});
        onClose();
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Key name is required';
        }

        if (formData.scopes.length === 0) {
            newErrors.scopes = 'Select at least one permission';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleGenerate = async () => {
        if (!validateForm()) return;

        try {
            const key = await onGenerate(formData);
            setGeneratedKey(key);
            setStep('result');
        } catch (error) {
            setErrors({ submit: 'Failed to generate key' });
        }
    };

    const handleCopy = () => {
        if (generatedKey?.fullKey) {
            navigator.clipboard.writeText(generatedKey.fullKey);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const toggleScope = (scope: ApiKeyScope) => {
        setFormData(prev => ({
            ...prev,
            scopes: prev.scopes.includes(scope)
                ? prev.scopes.filter(s => s !== scope)
                : [...prev.scopes, scope]
        }));
        if (errors.scopes) setErrors(prev => ({ ...prev, scopes: '' }));
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
            <div className="flex min-h-full items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative w-full max-w-lg"
                >
                    <div className="bg-card rounded-2xl shadow-2xl border border-border">
                        {step === 'form' ? (
                            <>
                                <div className="p-6 border-b border-border sticky top-0 bg-card z-10">
                                    <Typography variant="h5" weight="semibold" className="flex items-center gap-2 text-foreground">
                                        <Key className="w-5 h-5" />
                                        Generate New API Key
                                    </Typography>
                                    <Typography variant="body-small" color="muted">
                                        Create a secure API key with specific permissions
                                    </Typography>
                                </div>

                                <div className="max-h-[60vh] overflow-y-auto p-6 space-y-6">
                                    <div>
                                        <Typography variant="label" color="default" className="mb-2 block">
                                            Key Name *
                                        </Typography>
                                        <AnimatedInput
                                            placeholder="e.g., Production API"
                                            value={formData.name}
                                            onChange={(value) => {
                                                setFormData(prev => ({ ...prev, name: value }));
                                                if (errors.name) setErrors(prev => ({ ...prev, name: '' }));
                                            }}
                                            variant={inputVariant}
                                        />
                                        {errors.name && (
                                            <Typography variant="caption" color="error" className="mt-1">
                                                {errors.name}
                                            </Typography>
                                        )}
                                    </div>

                                    <div>
                                        <Typography variant="label" color="default" className="mb-2 block">
                                            Description
                                        </Typography>
                                        <AnimatedInput
                                            placeholder="Optional description for this key"
                                            value={formData.description}
                                            onChange={(value) => setFormData(prev => ({ ...prev, description: value }))}
                                            variant={inputVariant}
                                        />
                                    </div>

                                    <div>
                                        <Typography variant="label" color="default" className="mb-2 block">
                                            Permissions *
                                        </Typography>
                                        <div className="space-y-2">
                                            {SCOPES.map(scope => {
                                                const Icon = scope.icon;
                                                const isSelected = formData.scopes.includes(scope.id);
                                                return (
                                                    <div
                                                        key={scope.id}
                                                        onClick={() => toggleScope(scope.id)}
                                                        className={cn(
                                                            "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all",
                                                            isSelected
                                                                ? "bg-primary/10 border-primary/30"
                                                                : "bg-secondary/30 border-border hover:border-primary/20"
                                                        )}
                                                    >
                                                        <div className={cn(
                                                            "w-4 h-4 rounded border flex items-center justify-center",
                                                            isSelected
                                                                ? "bg-primary border-primary"
                                                                : "bg-background border-border"
                                                        )}>
                                                            {isSelected && <Check className="w-3 h-3 text-white" />}
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2">
                                                                <Icon className="w-4 h-4 text-foreground" />
                                                                <Typography variant="body-small" weight="medium" color="default">
                                                                    {scope.name}
                                                                </Typography>
                                                                <ScopeBadge
                                                                    scope={scope.id}
                                                                    badgeVariant={badgeVariant}
                                                                    showIcon={false}
                                                                    className="text-xs"
                                                                />
                                                            </div>
                                                            <Typography variant="caption" color="muted">
                                                                {scope.description}
                                                            </Typography>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                        {errors.scopes && (
                                            <Typography variant="caption" color="error" className="mt-1">
                                                {errors.scopes}
                                            </Typography>
                                        )}
                                    </div>

                                    <div>
                                        <Typography variant="label" color="default" className="mb-2 block">
                                            Expiration (Optional)
                                        </Typography>
                                        <AnimatedInput
                                            placeholder="Select expiration date"
                                            value={formData.expiresAt ? formData.expiresAt.toISOString().split('T')[0] : ''}
                                            onChange={(value) => setFormData(prev => ({
                                                ...prev,
                                                expiresAt: value ? new Date(value) : undefined
                                            }))}
                                            variant={inputVariant}
                                            type="date"
                                        />
                                    </div>
                                </div>

                                <div className="p-6 border-t border-border bg-card">
                                    <div className="flex justify-end gap-3">
                                        <Button
                                            variant="outline"
                                            onClick={handleClose}
                                            disabled={isLoading}
                                            animationVariant={buttonAnimationVariant}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            onClick={handleGenerate}
                                            disabled={isLoading || !formData.name.trim()}
                                            variant={buttonVariant}
                                            animationVariant={buttonAnimationVariant}
                                            className="cursor-pointer"
                                        >
                                            {isLoading ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                                    Generating...
                                                </>
                                            ) : (
                                                <>
                                                    <Key className="w-4 h-4 mr-2 " />
                                                    Generate Key
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="p-6 border-b border-border sticky top-0 bg-card z-10">
                                    <Typography variant="h5" weight="semibold" className="flex items-center gap-2 text-success">
                                        <CheckCircle className="w-5 h-5" />
                                        API Key Generated
                                    </Typography>
                                </div>

                                <div className="max-h-[60vh] overflow-y-auto p-6 space-y-6">
                                    <div className="p-4 rounded-lg bg-warning/10 border border-warning/30">
                                        <div className="flex items-start gap-3">
                                            <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0" />
                                            <div>
                                                <Typography variant="body-small" weight="medium" className="text-warning mb-1">
                                                    Important Security Notice
                                                </Typography>
                                                <Typography variant="caption" color="muted">
                                                    This key will only be shown once. Copy it now and store it securely. You won't be able to see it again.
                                                </Typography>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <Typography variant="label" color="default" className="mb-2 block">
                                            Your API Key
                                        </Typography>
                                        <div className="flex gap-2">
                                            <div className="flex-1 p-3 rounded-lg bg-secondary/30 border border-border font-mono text-sm break-all text-foreground">
                                                {generatedKey?.fullKey}
                                            </div>
                                            <Button
                                                variant={copied ? "success" : "outline"}
                                                size="icon"
                                                onClick={handleCopy}
                                                className="flex-shrink-0 cursor-pointer"
                                                animationVariant={buttonAnimationVariant}
                                            >
                                                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="text-sm">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <Typography variant="caption" color="muted">
                                                    Name
                                                </Typography>
                                                <Typography variant="body-small" color="default">
                                                    {generatedKey?.name}
                                                </Typography>
                                            </div>
                                            <div>
                                                <Typography variant="caption" color="muted">
                                                    Status
                                                </Typography>
                                                <div className="inline-block">
                                                    <StatusBadge
                                                        status="active"
                                                        badgeVariant={badgeVariant}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6 border-t border-border bg-card">
                                    <div className="flex justify-end">
                                        <Button
                                            onClick={handleClose}
                                            animationVariant={buttonAnimationVariant}
                                            className='cursor-pointer'
                                        >
                                            Done
                                        </Button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

// RevokeKeyModal Component
const RevokeKeyModal = ({
    isOpen,
    onClose,
    onRevoke,
    apiKey,
    isLoading = false,
    inputVariant = "clean",
    buttonVariant = "warning",
    buttonAnimationVariant
}: RevokeKeyModalProps) => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    if (!isOpen || !apiKey) return null;

    const handleRevoke = async () => {
        if (!password) {
            setError('Password is required to revoke the key');
            return;
        }

        if (password !== 'password') {
            setError('Incorrect password');
            return;
        }

        try {
            await onRevoke(apiKey);
            onClose();
            setPassword('');
            setError('');
        } catch (error) {
            setError('Failed to revoke API key');
        }
    };

    const handleClose = () => {
        onClose();
        setPassword('');
        setError('');
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-lg"
            >
                <div className="bg-card rounded-2xl shadow-2xl border border-border">
                    <div className="p-6 border-b border-border">
                        <Typography variant="h5" weight="semibold" className="flex items-center gap-2 text-warning">
                            <Ban className="w-5 h-5" />
                            Revoke API Key
                        </Typography>
                        <Typography variant="body-small" color="muted">
                            Disable access for "{apiKey.name}"
                        </Typography>
                    </div>

                    <div className="p-6 space-y-6">
                        <div className="p-4 rounded-lg bg-warning/10 border border-warning/30">
                            <div className="flex items-start gap-3">
                                <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0" />
                                <div>
                                    <Typography variant="body-small" weight="medium" className="text-warning mb-1">
                                        Warning: Revoking this key will immediately invalidate all API requests using it.
                                    </Typography>
                                    <Typography variant="caption" color="muted">
                                        Any applications using this key will stop working. This action can be reversed by re-activating the key.
                                    </Typography>
                                </div>
                            </div>
                        </div>

                        <div>
                            <Typography variant="label" color="default" className="mb-2 block">
                                Enter your password to confirm *
                            </Typography>
                            <AnimatedInput
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(value) => {
                                    setPassword(value);
                                    if (error) setError('');
                                }}
                                variant={inputVariant}
                            />
                            {error && (
                                <Typography variant="caption" color="error">
                                    {error}
                                </Typography>
                            )}
                            <Typography variant="caption" color="muted" className="mt-2 block">
                                You must authenticate to perform this action.
                            </Typography>
                        </div>

                        <div className="space-y-3">
                            <Typography variant="label" color="default" className="block">
                                This will affect:
                            </Typography>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-destructive" />
                                    <Typography variant="body-small" color="muted">
                                        All active API calls using this key
                                    </Typography>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-destructive" />
                                    <Typography variant="body-small" color="muted">
                                        Applications and services using this key
                                    </Typography>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-destructive" />
                                    <Typography variant="body-small" color="muted">
                                        Webhooks and integrations
                                    </Typography>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 border-t border-border flex justify-end gap-3">
                        <Button
                            variant="outline"
                            onClick={handleClose}
                            disabled={isLoading}
                            animationVariant={buttonAnimationVariant}
                            className="cursor-pointer"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleRevoke}
                            disabled={isLoading || !password}
                            variant={buttonVariant}
                            animationVariant={buttonAnimationVariant}
                            className="cursor-pointer"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                    Revoking...
                                </>
                            ) : (
                                <>
                                    <Ban className="w-4 h-4 mr-2" />
                                    Revoke Key
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

// ViewKeyModal Component
const ViewKeyModal = ({
    isOpen,
    onClose,
    onReveal,
    apiKey,
    isLoading = false,
    inputVariant = "clean",
    buttonVariant = "default",
    buttonAnimationVariant,
    autoHideDelay = 30
}: ViewKeyModalProps) => {
    const [password, setPassword] = useState('');
    const [revealedKey, setRevealedKey] = useState<string | null>(null);
    const [error, setError] = useState('');
    const [countdown, setCountdown] = useState(autoHideDelay);

    useEffect(() => {
        if (revealedKey && autoHideDelay > 0) {
            const timer = setInterval(() => {
                setCountdown((prev) => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        setRevealedKey(null);
                        setPassword('');
                        onClose();
                        return autoHideDelay;
                    }
                    return prev - 1;
                });
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [revealedKey, autoHideDelay, onClose]);

    if (!isOpen || !apiKey) return null;

    const handleReveal = async () => {
        if (!password) {
            setError('Password is required to view the key');
            return;
        }

        if (password !== 'password') {
            setError('Incorrect password');
            return;
        }

        try {
            const fullKey = `sk_live_${Math.random().toString(36).substring(2, 42)}`;
            setRevealedKey(fullKey);
            await onReveal(apiKey);
            setError('');
        } catch (error) {
            setError('Failed to reveal API key');
        }
    };

    const handleClose = () => {
        onClose();
        setPassword('');
        setRevealedKey(null);
        setError('');
        setCountdown(autoHideDelay);
    };

    const handleCopy = () => {
        if (revealedKey) {
            navigator.clipboard.writeText(revealedKey);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-lg"
            >
                <div className="bg-card rounded-2xl shadow-2xl border border-border">
                    <div className="p-6 border-b border-border">
                        <Typography variant="h5" weight="semibold" className="flex items-center gap-2 text-foreground">
                            <Eye className="w-5 h-5" />
                            {revealedKey ? 'API Key Revealed' : 'View API Key'}
                        </Typography>
                        <Typography variant="body-small" color="muted">
                            {revealedKey ? `This key will auto-hide in ${countdown}s` : `View full key for "${apiKey.name}"`}
                        </Typography>
                    </div>

                    <div className="p-6 space-y-6">
                        {!revealedKey ? (
                            <>
                                <div className="p-4 rounded-lg bg-warning/10 border border-warning/30">
                                    <div className="flex items-start gap-3">
                                        <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0" />
                                        <div>
                                            <Typography variant="body-small" weight="medium" className="text-warning mb-1">
                                                Security Notice
                                            </Typography>
                                            <Typography variant="caption" color="muted">
                                                This key will only be shown once. Copy it immediately and store it securely. You won't be able to see it again.
                                            </Typography>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <Typography variant="label" color="default" className="mb-2 block">
                                        Enter your password to view the key *
                                    </Typography>
                                    <AnimatedInput
                                        type="password"
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={(value) => {
                                            setPassword(value);
                                            if (error) setError('');
                                        }}
                                        variant={inputVariant}
                                    />
                                    {error && (
                                        <Typography variant="caption" color="error">
                                            {error}
                                        </Typography>
                                    )}
                                    <Typography variant="caption" color="muted" className="mt-2 block">
                                        Authentication required for security purposes.
                                    </Typography>
                                </div>

                                <div className="space-y-2">
                                    <Typography variant="label" color="default">
                                        Key Information
                                    </Typography>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Name:</span>
                                            <span>{apiKey.name}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Status:</span>
                                            <StatusBadge status={apiKey.status} />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <span className="text-muted-foreground">Permissions:</span>
                                            <div className="flex flex-wrap gap-2 justify-end">
                                                {apiKey.scopes.map(scope => (
                                                    <ScopeBadge
                                                        key={scope}
                                                        scope={scope}
                                                        showIcon={false}
                                                        className="text-xs"
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="p-4 rounded-lg bg-success/10 border border-success/30">
                                    <div className="flex items-start gap-3">
                                        <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
                                        <div>
                                            <Typography variant="body-small" weight="medium" className="text-success mb-1">
                                                Copy this key now
                                            </Typography>
                                            <Typography variant="caption" color="muted">
                                                This key will auto-hide in {countdown} seconds. Make sure to store it securely.
                                            </Typography>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <Typography variant="label" color="default" className="mb-2 block">
                                        Your API Key
                                    </Typography>
                                    <div className="flex gap-2">
                                        <div className="flex-1 p-3 rounded-lg bg-secondary/30 border border-border font-mono text-sm break-all text-foreground">
                                            {revealedKey}
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={handleCopy}
                                            className="flex-shrink-0 cursor-pointer"
                                            animationVariant={buttonAnimationVariant}
                                        >
                                            <Copy className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>

                                <div className="text-center">
                                    <Typography variant="caption" color="muted">
                                        Auto-hiding in {countdown} seconds...
                                    </Typography>
                                </div>
                            </>
                        )}
                    </div>

                    <div className="p-6 border-t border-border flex justify-end gap-3">
                        {!revealedKey ? (
                            <>
                                <Button
                                    variant="outline"
                                    onClick={handleClose}
                                    disabled={isLoading}
                                    animationVariant={buttonAnimationVariant}
                                    className="cursor-pointer"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleReveal}
                                    disabled={isLoading || !password}
                                    variant={buttonVariant}
                                    animationVariant={buttonAnimationVariant}
                                    className="cursor-pointer"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                            Loading...
                                        </>
                                    ) : (
                                        <>
                                            <Eye className="w-4 h-4 mr-2" />
                                            View Key
                                        </>
                                    )}
                                </Button>
                            </>
                        ) : (
                            <Button
                                onClick={handleClose}
                                animationVariant={buttonAnimationVariant}
                                className="cursor-pointer"
                            >
                                Close
                            </Button>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

// ==================== MAIN COMPONENT ====================
export const ApiKeysPage: React.FC<ApiKeysPageProps> = ({
    headerTitle = "API Keys Management",
    headerIcon = <Key className="w-4 h-4" />,
    headerDescription = "Manage your API access keys and permissions",
    initialApiKeys = [],
    statsData,
    onGenerateKey,
    onDeleteKey,
    onRevealKey,
    onRevokeKey,
    onCopyKey,
    onExportKeys,
    variant = "default",
    animationVariant = "fadeUp",
    cardVariant = "default",
    inputVariant = "clean",
    buttonVariant = "default",
    buttonAnimationVariant,
    badgeVariant = "tinypop",
    customHeader,
    customStatsSection,
    customEmptyState,
    generateButtonLabel = "Generate Key",
    searchPlaceholder = "Search API keys...",
    isLoading = false,
    isGenerating = false,
    showFilters = true,
    showSearch = true,
    showExport = true,
    showStats = true,
    showNotifications = true,
    notificationDuration = 3000,
    autoHideDelay = 30,
    darkMode = false
}) => {
    const [apiKeys, setApiKeys] = useState<ApiKey[]>(initialApiKeys.length > 0 ? initialApiKeys : generateMockApiKeys());
    const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isRevokeModalOpen, setIsRevokeModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [selectedApiKey, setSelectedApiKey] = useState<ApiKey | null>(null);
    const [notification, setNotification] = useState<NotificationType | null>(null);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
    const [filters, setFilters] = useState<FilterOptions>({
        status: [],
        scopes: [],
        dateRange: { start: null, end: null }
    });

    const stats: StatsData = {
        totalKeys: apiKeys.length,
        activeKeys: apiKeys.filter(k => k.status === 'active').length,
        totalCalls: apiKeys.reduce((sum, key) => sum + key.usageCount, 0),
        callsToday: apiKeys.reduce((sum, key) => sum + (key.usageHistory?.[key.usageHistory.length - 1]?.count || 0), 0),
        revokedKeys: apiKeys.filter(k => k.status === 'revoked').length,
        ...statsData
    };

    const availableScopes = Array.from(
        new Set(apiKeys.flatMap(key => key.scopes))
    ).sort();

    const filteredKeys = apiKeys.filter(key => {
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            if (!key.name.toLowerCase().includes(query) &&
                !key.description?.toLowerCase().includes(query) &&
                !key.keySuffix.toLowerCase().includes(query)) {
                return false;
            }
        }

        if (filters.status.length > 0 && !filters.status.includes(key.status)) {
            return false;
        }

        if (filters.scopes.length > 0 && !filters.scopes.some(scope => key.scopes.includes(scope))) {
            return false;
        }

        if (filters.dateRange.start && key.createdAt < filters.dateRange.start) {
            return false;
        }
        if (filters.dateRange.end && key.createdAt > filters.dateRange.end) {
            return false;
        }

        return true;
    });

    const hasActiveFilters = () => {
        return filters.status.length > 0 ||
            filters.scopes.length > 0 ||
            filters.dateRange.start ||
            filters.dateRange.end;
    };

    const anim = animationVariants[animationVariant];

    const showNotification = (type: NotificationType['type'], message: string) => {
        if (!showNotifications) return;

        setNotification({
            id: Date.now().toString(),
            type,
            message,
            duration: notificationDuration
        });
    };

    const handleGenerateKey = async (data: { name: string; scopes: ApiKeyScope[]; expiresAt?: Date; description?: string }) => {
        try {
            let newKey: ApiKey;

            if (onGenerateKey) {
                newKey = await onGenerateKey(data.name, data.scopes, data.expiresAt, data.description);
            } else {
                await new Promise(resolve => setTimeout(resolve, 1000));

                newKey = {
                    id: Date.now().toString(),
                    name: data.name,
                    keyPrefix: 'sk_live_',
                    keySuffix: Math.random().toString(36).substring(2, 6),
                    fullKey: `sk_live_${Math.random().toString(36).substring(2, 42)}`,
                    scopes: data.scopes,
                    createdAt: new Date(),
                    lastUsed: null,
                    usageCount: 0,
                    usageHistory: Array.from({ length: 7 }, () => ({ date: '', count: 0 })),
                    status: 'active',
                    expiresAt: data.expiresAt,
                    description: data.description
                };
            }

            setApiKeys(prev => [newKey, ...prev]);
            showNotification('success', 'API key generated successfully');
            return newKey;
        } catch (error) {
            showNotification('error', 'Failed to generate API key');
            throw error;
        }
    };

    const handleDeleteKey = async (apiKey: ApiKey) => {
        try {
            if (onDeleteKey) {
                await onDeleteKey(apiKey.id);
            }

            setApiKeys(prev => prev.filter(k => k.id !== apiKey.id));
            showNotification('success', 'API key deleted successfully');
        } catch (error) {
            showNotification('error', 'Failed to delete API key');
        }
    };

    const handleRevealKey = async (apiKey: ApiKey) => {
        try {
            let fullKey: string;

            if (onRevealKey) {
                fullKey = await onRevealKey(apiKey.id);
            } else {
                await new Promise(resolve => setTimeout(resolve, 500));
                fullKey = `sk_live_${Math.random().toString(36).substring(2, 42)}`;
            }

            showNotification('info', 'API key revealed successfully');
            return fullKey;
        } catch (error) {
            showNotification('error', 'Failed to reveal API key');
            throw error;
        }
    };

    const handleRevokeKey = async (apiKey: ApiKey) => {
        try {
            if (onRevokeKey) {
                await onRevokeKey(apiKey.id);
            }

            setApiKeys(prev => prev.map(k =>
                k.id === apiKey.id ? { ...k, status: 'revoked' } : k
            ));
            showNotification('warning', 'API key revoked successfully');
        } catch (error) {
            showNotification('error', 'Failed to revoke API key');
            throw error;
        }
    };

    const handleCopyKey = (key: ApiKey) => {
        const maskedKey = `${key.keyPrefix}••••••••${key.keySuffix}`;
        navigator.clipboard.writeText(maskedKey);

        if (onCopyKey) {
            onCopyKey(maskedKey);
        }

        showNotification('info', 'Key reference copied to clipboard');
    };

    const handleExportKeys = (format: 'json' | 'csv') => {
        const data = apiKeys.map(key => ({
            name: key.name,
            id: key.id,
            status: key.status,
            scopes: key.scopes.join(', '),
            created: key.createdAt.toISOString(),
            lastUsed: key.lastUsed?.toISOString() || '',
            usageCount: key.usageCount
        }));

        if (onExportKeys) {
            onExportKeys(format);
        } else {
            if (format === 'json') {
                const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'api-keys.json';
                a.click();
            } else {
                const csv = [
                    ['Name', 'ID', 'Status', 'Scopes', 'Created', 'Last Used', 'Usage Count'],
                    ...data.map(d => [d.name, d.id, d.status, d.scopes, d.created, d.lastUsed, d.usageCount.toString()])
                ].map(row => row.join(',')).join('\n');

                const blob = new Blob([csv], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'api-keys.csv';
                a.click();
            }
        }

        showNotification('success', `API keys exported as ${format.toUpperCase()}`);
    };

    const openDeleteModal = (apiKey: ApiKey) => {
        setSelectedApiKey(apiKey);
        setIsDeleteModalOpen(true);
    };

    const openRevokeModal = (apiKey: ApiKey) => {
        setSelectedApiKey(apiKey);
        setIsRevokeModalOpen(true);
    };

    const openViewModal = (apiKey: ApiKey) => {
        setSelectedApiKey(apiKey);
        setIsViewModalOpen(true);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className={cn("min-h-screen transition-all duration-300", PageVariants({ variant }), darkMode && "dark")}>
            {notification && (
                <NotificationComponent
                    type={notification.type}
                    message={notification.message}
                    onClose={() => setNotification(null)}
                    duration={notification.duration}
                />
            )}

            <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border">
                <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {customHeader || (
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                                    {headerIcon}
                                </div>
                                <div>
                                    <Typography variant="h6" weight="semibold" color="default">
                                        {headerTitle}
                                    </Typography>
                                    <Typography variant="caption" color="muted">
                                        {headerDescription}
                                    </Typography>
                                </div>
                            </div>
                        )}

                        <div className="flex items-center gap-3">
                            {showExport && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleExportKeys('json')}
                                    className="cursor-pointer"
                                    animationVariant={buttonAnimationVariant}
                                >
                                    <Download className="w-4 h-4 mr-2" />
                                    Export
                                </Button>
                            )}
                            <Button
                                onClick={() => setIsGenerateModalOpen(true)}
                                variant={buttonVariant}
                                className="cursor-pointer"
                                animationVariant={buttonAnimationVariant}
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                {generateButtonLabel}
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <motion.div
                    initial={anim.initial}
                    animate={anim.animate}
                    transition={{ duration: 0.5 }}
                    className="space-y-8"
                >
                    <div className="flex items-start gap-3 p-4 rounded-xl bg-primary/5 border border-primary/20 mb-8 animate-fade-in">
                        <Shield className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <div>
                            <Typography variant="body-small" weight="medium" color="default">
                                Security First
                            </Typography>
                            <Typography variant="caption" color="muted" className="mt-0.5">
                                API keys are masked by default. Revealing or deleting keys requires authentication.
                                All actions are logged for security auditing.
                            </Typography>
                        </div>
                    </div>

                    {showStats && (
                        <div>
                            {customStatsSection || (
                                <div className="mb-6">
                                    <Typography variant="h5" weight="semibold" color="default" className="mb-4">
                                        Overview
                                    </Typography>
                                    <StatsOverview stats={stats} badgeVariant={badgeVariant} />
                                </div>
                            )}
                        </div>
                    )}

                    <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <SearchFilter
                                searchQuery={searchQuery}
                                onSearchChange={setSearchQuery}
                                filters={filters}
                                onFiltersChange={setFilters}
                                availableScopes={availableScopes}
                                inputVariant={inputVariant}
                                buttonVariant={buttonVariant}
                                buttonAnimationVariant={buttonAnimationVariant}
                                showFilters={showFilters}
                                showSearch={showSearch}
                                searchPlaceholder={searchPlaceholder}
                            />

                            <div className="flex items-center gap-3 mb-10">
                                <div className="flex items-center border border-border rounded-lg p-1">
                                    <Button
                                        variant={viewMode === 'grid' ? 'default' : 'ghost'}
                                        size="sm"
                                        onClick={() => setViewMode('grid')}
                                        className="cursor-pointer"
                                        animationVariant={buttonAnimationVariant}
                                    >
                                        Grid
                                    </Button>
                                    <Button
                                        variant={viewMode === 'list' ? 'default' : 'ghost'}
                                        size="sm"
                                        onClick={() => setViewMode('list')}
                                        className="cursor-pointer"
                                        animationVariant={buttonAnimationVariant}
                                    >
                                        List
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {filteredKeys.length === 0 ? (
                        customEmptyState || (
                            <div className={cn(CardVariants({ variant: cardVariant }), "p-12 text-center")}>
                                <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
                                    <Key className="w-8 h-8 text-muted-foreground" />
                                </div>
                                <Typography variant="h5" weight="semibold" color="default" className="mb-2">
                                    {searchQuery || hasActiveFilters() ? 'No API Keys Found' : 'No API Keys'}
                                </Typography>
                                <Typography variant="body" color="muted" className="mb-6 max-w-md mx-auto">
                                    {searchQuery
                                        ? 'No API keys match your search. Try adjusting your filters or search terms.'
                                        : hasActiveFilters()
                                            ? 'No API keys match your filter criteria. Try adjusting your filters.'
                                            : 'You haven\'t created any API keys yet. Generate your first key to get started.'
                                    }
                                </Typography>
                                {(searchQuery || hasActiveFilters()) ? (
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            setSearchQuery('');
                                            setFilters({
                                                status: [],
                                                scopes: [],
                                                dateRange: { start: null, end: null }
                                            });
                                        }}
                                        className="cursor-pointer mr-2"
                                        animationVariant={buttonAnimationVariant}
                                    >
                                        Clear Search & Filters
                                    </Button>
                                ) : null}
                                <Button
                                    onClick={() => setIsGenerateModalOpen(true)}
                                    className="cursor-pointer"
                                    animationVariant={buttonAnimationVariant}
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Generate Your First Key
                                </Button>
                            </div>
                        )
                    ) : viewMode === 'grid' ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredKeys.map((key, index) => (
                                <motion.div
                                    key={key.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <ApiKeyCard
                                        apiKey={key}
                                        isSelected={selectedKeys.includes(key.id)}
                                        onSelect={(id) => setSelectedKeys(prev =>
                                            prev.includes(id)
                                                ? prev.filter(k => k !== id)
                                                : [...prev, id]
                                        )}
                                        onReveal={openViewModal}
                                        onDelete={openDeleteModal}
                                        onCopy={handleCopyKey}
                                        onRevoke={openRevokeModal}
                                        showActions={true}
                                        variant={cardVariant}
                                        badgeVariant={badgeVariant}
                                        buttonVariant={buttonVariant}
                                        buttonAnimationVariant={buttonAnimationVariant}
                                    />
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className={cn(CardVariants({ variant: cardVariant }), "overflow-hidden")}>
                            <table className={cn("w-full", TableVariants({ variant: cardVariant }))}>
                                <thead>
                                    <tr className="border-b border-border">
                                        <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">
                                            <Checkbox
                                                checked={selectedKeys.length === filteredKeys.length && filteredKeys.length > 0}
                                                onChange={(checked) => {
                                                    if (checked) {
                                                        setSelectedKeys(filteredKeys.map(k => k.id));
                                                    } else {
                                                        setSelectedKeys([]);
                                                    }
                                                }}
                                                size="md"
                                                variant="default"
                                                animationVariant="bounce"
                                                disabled={filteredKeys.length === 0}
                                            />
                                        </th>
                                        <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">
                                            <Typography variant="label" color="muted">
                                                Name
                                            </Typography>
                                        </th>
                                        <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">
                                            <Typography variant="label" color="muted">
                                                Key
                                            </Typography>
                                        </th>
                                        <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">
                                            <Typography variant="label" color="muted">
                                                Status
                                            </Typography>
                                        </th>
                                        <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">
                                            <Typography variant="label" color="muted">
                                                Permissions
                                            </Typography>
                                        </th>
                                        <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">
                                            <Typography variant="label" color="muted">
                                                Created
                                            </Typography>
                                        </th>
                                        <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">
                                            <Typography variant="label" color="muted">
                                                Actions
                                            </Typography>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {filteredKeys.map((key) => (
                                        <tr key={key.id} className="group hover:bg-secondary/30 transition-colors">
                                            <td className="px-6 py-4">
                                                <Checkbox
                                                    checked={selectedKeys.includes(key.id)}
                                                    onChange={(checked) => {
                                                        if (checked) {
                                                            setSelectedKeys([...selectedKeys, key.id]);
                                                        } else {
                                                            setSelectedKeys(selectedKeys.filter(id => id !== key.id));
                                                        }
                                                    }}
                                                    size="md"
                                                    variant="default"
                                                    animationVariant="bounce"
                                                />
                                            </td>
                                            <td className="px-6 py-4">
                                                <Typography truncate={true} variant="body" weight="medium" color="default">
                                                    {key.name}
                                                </Typography>
                                                {key.description && (
                                                    <Typography truncate={true} variant="caption" color="muted">
                                                        {key.description}
                                                    </Typography>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <code className="font-mono text-sm bg-secondary/30 px-2 py-1 rounded text-foreground">
                                                    {key.keyPrefix}••••••••{key.keySuffix}
                                                </code>
                                            </td>
                                            <td className="px-6 py-4">
                                                <StatusBadge
                                                    status={key.status}
                                                    badgeVariant={badgeVariant}
                                                />
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex  max-w-[200px]">
                                                    {key.scopes.length > 0 && (
                                                        <ScopeBadge
                                                            key={key.scopes[0]}
                                                            scope={key.scopes[0]}
                                                            badgeVariant={badgeVariant}
                                                            showIcon={false}
                                                        />
                                                    )}
                                                    {key.scopes.length > 1 && (
                                                        <div className="relative inline-flex items-center">
                                                            <NewBadge
                                                                text={`+${key.scopes.length - 1}`}
                                                                type="secondary"
                                                                variant="tinypop"
                                                                className="text-sm"
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <Typography variant="body-small" color="default">
                                                    {new Date(key.createdAt).toLocaleDateString()}
                                                </Typography>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => openViewModal(key)}
                                                        className="cursor-pointer"
                                                        animationVariant={buttonAnimationVariant}
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleCopyKey(key)}
                                                        className="cursor-pointer"
                                                        animationVariant={buttonAnimationVariant}
                                                    >
                                                        <Copy className="w-4 h-4" />
                                                    </Button>
                                                    {key.status === 'active' && (
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => openRevokeModal(key)}
                                                            className="text-warning hover:text-warning/90 cursor-pointer"
                                                            animationVariant={buttonAnimationVariant}
                                                        >
                                                            <Ban className="w-4 h-4" />
                                                        </Button>
                                                    )}
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => openDeleteModal(key)}
                                                        className="text-destructive hover:text-destructive/90 cursor-pointer"
                                                        animationVariant={buttonAnimationVariant}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </motion.div>
            </main>

            <GenerateKeyModal
                isOpen={isGenerateModalOpen}
                onClose={() => setIsGenerateModalOpen(false)}
                onGenerate={handleGenerateKey}
                isLoading={isGenerating}
                badgeVariant={badgeVariant}
                inputVariant={inputVariant}
                buttonVariant={buttonVariant}
                buttonAnimationVariant={buttonAnimationVariant}
            />

            <DeleteKeyModal
                isOpen={isDeleteModalOpen}
                onClose={() => {
                    setIsDeleteModalOpen(false);
                    setSelectedApiKey(null);
                }}
                onDelete={handleDeleteKey}
                apiKey={selectedApiKey}
                inputVariant={inputVariant}
                buttonVariant={buttonVariant}
                buttonAnimationVariant={buttonAnimationVariant}
            />

            <RevokeKeyModal
                isOpen={isRevokeModalOpen}
                onClose={() => {
                    setIsRevokeModalOpen(false);
                    setSelectedApiKey(null);
                }}
                onRevoke={handleRevokeKey}
                apiKey={selectedApiKey}
                inputVariant={inputVariant}
                buttonVariant={buttonVariant}
                buttonAnimationVariant={buttonAnimationVariant}
            />

            <ViewKeyModal
                isOpen={isViewModalOpen}
                onClose={() => {
                    setIsViewModalOpen(false);
                    setSelectedApiKey(null);
                }}
                onReveal={handleRevealKey}
                apiKey={selectedApiKey}
                inputVariant={inputVariant}
                buttonVariant={buttonVariant}
                buttonAnimationVariant={buttonAnimationVariant}
                autoHideDelay={autoHideDelay}
            />
        </div>
    );
};