import { useState, useRef } from 'react';

import {
    Eye,
    Trash2,
    Copy,
    Check,
    MoreVertical,
    Ban,

} from 'lucide-react';
import { cn } from '@site/src/utils/cn';
import { Button } from '@site/src/components/UI/button';
import { Typography } from '@site/src/components/UI/typography';
import type {
    ApiKeyCardProps,
} from '../types';
import { ScopeBadge } from './ScopeBadge';
import { StatusBadge } from './StatusBadge';
import { NewBadge } from './NewBadge';

export const ApiKeyCard = ({
    apiKey,
    isSelected = false,
    onSelect,
    onReveal,
    onDelete,
    onCopy,
    onRevoke,
    // onRegenerate,
    // showActions = true,
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
                {/* Header */}
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
                                        <>
                                            <button
                                                onClick={handleRevoke}
                                                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-warning hover:bg-warning/10 transition-colors cursor-pointer"
                                            >
                                                <Ban className="w-4 h-4" />
                                                Revoke Key
                                            </button>
                                        </>
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

                {/* Key Info */}
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

                {/* Scopes */}
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

                {/* Footer */}
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