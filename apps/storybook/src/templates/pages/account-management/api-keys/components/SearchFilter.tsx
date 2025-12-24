import type { ApiKey, ApiKeyScope, SearchFilterProps } from "../types";
import {
    Check,
    X,
    Search,
    Filter,
} from 'lucide-react';
import { cn } from '../../../../../../utils/cn';
import { useEffect, useRef, useState } from "react";
import { SCOPES, STATUS_BADGE_TYPES, STATUS_LABELS } from "../constants";
import { NewBadge } from "./NewBadge";
import { Button } from '../../../../../components/button';
import { AnimatedInput } from '../../../../../components/input';
import { Typography } from '../../../../../components/typography';

export const SearchFilter = ({
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


    console.log(searchQuery);
    console.log(searchPlaceholder);
    console.log(inputVariant);

    return (
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6">
            {/* Search Input */}
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

            {/* Filter Button and Panel */}
            {showFilters && (
                <div className="relative" ref={filterRef}>
                    <Button
                        variant={hasActiveFilters() ? "default" : buttonVariant as any}
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

                    {/* Filter Panel */}
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
                                {/* Status Filter */}
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

                                {/* Scopes Filter */}
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

                                {/* Date Range Filter */}
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
                                            // className="text-sm"
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
                                            // className="text-sm"
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

                            {/* Active Filters Summary */}
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