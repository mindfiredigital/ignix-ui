import { useState } from 'react';
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
} from 'lucide-react';
import { cn } from '../../../utils/cn';
import { Checkbox } from '@ignix-ui/checkbox';
import { Button } from '@ignix-ui/button';
import { Typography } from '@ignix-ui/typography';
import type {
    ApiKey, ApiKeyScope, ApiKeysPageProps, FilterOptions, NotificationType, StatsData
} from './types';
import { animationVariants, CardVariants, PageVariants, TableVariants } from './utils';
import { generateMockApiKeys } from './mock';
import { Notification as NotificationComponent } from './components/Notification';
import { StatsOverview } from './components/StatsOverview';
import { SearchFilter } from './components/SearchFilter';
import { ApiKeyCard } from './components/ApiKeyCard';
import { StatusBadge } from './components/StatusBadge';
import { ScopeBadge } from './components/ScopeBadge';
import { NewBadge } from './components/NewBadge';
import { GenerateKeyModal } from './modals/GenerateKeyModal';
import { DeleteKeyModal } from './modals/DeleteKeyModal';
import { RevokeKeyModal } from './modals/RevokeKeyModal';
import { ViewKeyModal } from './modals/ViewKeyModal';


// Main ApiKeys Page Component
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
    // onRegenerateKey,
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
    // allowRegeneration = true,
    // requireConfirmation = true,
    showNotifications = true,
    notificationDuration = 3000,
    // requirePasswordToReveal = false,
    // autoHideRevealedKey = true,
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

    // Calculate stats
    const stats: StatsData = {
        totalKeys: apiKeys.length,
        activeKeys: apiKeys.filter(k => k.status === 'active').length,
        totalCalls: apiKeys.reduce((sum, key) => sum + key.usageCount, 0),
        callsToday: apiKeys.reduce((sum, key) => sum + (key.usageHistory?.[key.usageHistory.length - 1]?.count || 0), 0),
        revokedKeys: apiKeys.filter(k => k.status === 'revoked').length,
        ...statsData
    };
    // Get all available scopes from existing API keys
    const availableScopes = Array.from(
        new Set(apiKeys.flatMap(key => key.scopes))
    ).sort();

    // Filter logic
    const filteredKeys = apiKeys.filter(key => {
        // Search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            if (!key.name.toLowerCase().includes(query) &&
                !key.description?.toLowerCase().includes(query) &&
                !key.keySuffix.toLowerCase().includes(query)) {
                return false;
            }
        }

        // Status filter
        if (filters.status.length > 0 && !filters.status.includes(key.status)) {
            return false;
        }

        // Scope filter
        if (filters.scopes.length > 0 && !filters.scopes.some(scope => key.scopes.includes(scope))) {
            return false;
        }

        // Date range filter
        if (filters.dateRange.start && key.createdAt < filters.dateRange.start) {
            return false;
        }
        if (filters.dateRange.end && key.createdAt > filters.dateRange.end) {
            return false;
        }

        return true;
    });

    // Add this after the filteredKeys calculation in the ApiKeysPage component
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
                // Mock generation
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
                // Mock reveal
                await new Promise(resolve => setTimeout(resolve, 500));
                fullKey = `sk_live_${Math.random().toString(36).substring(2, 42)}`;
            }

            // The actual reveal will be handled in the ViewKeyModal
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

    // Modal handlers
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
            {/* Notification */}
            {notification && (
                <NotificationComponent
                    type={notification.type}
                    message={notification.message}
                    onClose={() => setNotification(null)}
                    duration={notification.duration}
                />
            )}

            {/* Header */}
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



            {/* Main Content */}
            <main className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <motion.div
                    initial={anim.initial}
                    animate={anim.animate}
                    transition={{ duration: 0.5 }}
                    className="space-y-8"
                >
                    {/* Security Notice - Using Typography component */}
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

                    {/* Stats Section */}
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

                            {/* Search and Filter Component */}
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
                                {/* View Mode Toggle */}
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

                    {/* API Keys List/Grid - Keep this section exactly as it was */}
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
                                        // onRegenerate={allowRegeneration ? handleRegenerateKey : undefined}
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

            {/* Modals */}
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