import { cn } from "../../../../../utils/cn";
import { useMemo, useState } from "react";
import { Badge } from "../../../../components/badge";
import { Card } from "../../../../components/card";
import { Drawer } from "../../../../components/drawer";

//Types
export type TimelineStatus = "completed" | "in_progress" | "pending";

export interface TimelineItem {
    id: string;
    title: string;
    description?: string;
    date: string;
    status: TimelineStatus;
    meta?: string;
}

export type TimelineFilter = TimelineStatus | "all";

export type TimelineVariant = "default" | "minimal" | "compact" | "glow";

//Constants
export const STATUS_LABELS: Record<TimelineStatus, string> = {
    completed: "Completed",
    in_progress: "In progress",
    pending: "Pending",
};

// Constants

export function StatusBadge({
    status,
    className,
}: {
    status: TimelineStatus;
    className?: string;
}) {
    const typeMap = {
        completed: "success",
        in_progress: "warning",
        pending: "secondary",
    } as const;

    return (
        <Badge
            text={STATUS_LABELS[status]}
            type={typeMap[status]}
            variant="none"
            className={className}
        />
    );
}

//Timeline Item Component

const NODE_RING: Record<TimelineStatus, string> = {
    completed:
        "bg-success border-success ring-4 ring-success/25",
    in_progress:
        "bg-warning border-warning animate-pulse ring-4 ring-warning/25",
    pending: "bg-card border-muted-foreground",
};

function formatDate(iso: string) {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

export function TimelineItemCard({
    item,
    variant = "default",
    onClick,
}: {
    item: TimelineItem;
    variant?: TimelineVariant;
    onClick?: (item: TimelineItem) => void;
}) {
    const interactive = !!onClick;
    const interactiveProps = interactive
        ? {
            role: "button" as const,
            tabIndex: 0,
            onClick: () => onClick?.(item),
            onKeyDown: (e: React.KeyboardEvent) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onClick?.(item);
                }
            },
            "aria-label": `Open details for ${item.title}`,
        }
        : {};
    const interactiveCls = interactive
        ? "cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        : "";

    if (variant === "minimal") {
        return (
            <Card
                variant="minimal"
                className={cn(
                    "group relative py-1 border-0 shadow-none hover:bg-transparent",
                    interactiveCls,
                )}
                {...interactiveProps}
            >
                <div className="flex items-baseline justify-between gap-3">
                    <div className="min-w-0">
                        {item.meta && (
                            <p className="font-display text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                                {item.meta}
                            </p>
                        )}
                        <h3 className="font-display text-base font-semibold leading-tight text-foreground">
                            {item.title}
                        </h3>
                    </div>
                    <span className="shrink-0 text-[11px] tabular-nums text-muted-foreground">
                        {formatDate(item.date)}
                    </span>
                </div>
                {item.description && (
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                        {item.description}
                    </p>
                )}
                <div className="mt-2">
                    <StatusBadge status={item.status} />
                </div>
            </Card>
        );
    }

    if (variant === "compact") {
        return (
            <Card
                variant="outline"
                className={cn(
                    "group relative px-4 py-3 hover:border-primary/40",
                    interactiveCls,
                )}
                {...interactiveProps}
            >
                <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0 flex items-baseline gap-3">
                        <h3 className="font-display text-sm font-semibold leading-none text-foreground truncate">
                            {item.title}
                        </h3>
                        <span className="text-[11px] leading-none tabular-nums text-muted-foreground shrink-0">
                            {formatDate(item.date)}
                        </span>
                    </div>
                    <StatusBadge status={item.status} />
                </div>
            </Card>
        );
    }

    if (variant === "glow") {
        const glowStyles = {
            completed: {
                blob: "bg-success",
                border: "border-success/30 hover:border-success/60",
                text: "text-success",
                bg: "from-success/10 via-success/5 to-transparent",
            },
            in_progress: {
                blob: "bg-warning",
                border: "border-warning/30 hover:border-warning/60",
                text: "text-warning",
                bg: "from-warning/10 via-warning/5 to-transparent",
            },
            pending: {
                blob: "bg-info",
                border: "border-info/30 hover:border-info/60",
                text: "text-info",
                bg: "from-info/10 via-info/5 to-transparent",
            },
        };
        const s = glowStyles[item.status];

        return (
            <Card
                variant="default"
                className={cn(
                    "group relative overflow-hidden p-5 transition-all duration-500 bg-gradient-to-br backdrop-blur-xl shadow-lg hover:shadow-xl",
                    s.border,
                    s.bg,
                    interactiveCls,
                )}
                {...interactiveProps}
            >
                {/* Top Right Blob */}
                <span
                    aria-hidden
                    className={cn(
                        "pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full opacity-20 blur-[3rem] transition-opacity duration-500 group-hover:opacity-40",
                        s.blob
                    )}
                />
                {/* Bottom Left Blob */}
                <span
                    aria-hidden
                    className={cn(
                        "pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full opacity-10 blur-[3rem] transition-opacity duration-500 group-hover:opacity-30 dark:opacity-20",
                        s.blob
                    )}
                />

                <div className="relative z-10 flex items-start justify-between gap-3">
                    <div className="min-w-0">
                        {item.meta && (
                            <p className={cn("mb-1 font-display text-[11px] uppercase tracking-[0.18em] dark:brightness-125", s.text)}>
                                {item.meta}
                            </p>
                        )}
                        <h3 className="font-display text-lg font-semibold leading-tight text-foreground">
                            {item.title}
                        </h3>
                        <p className="mt-1 text-xs text-muted-foreground tabular-nums">
                            {formatDate(item.date)}
                        </p>
                    </div>
                    <StatusBadge status={item.status} />
                </div>
                {item.description && (
                    <p className="relative z-10 mt-3 text-sm leading-relaxed text-muted-foreground dark:text-muted-foreground/90">
                        {item.description}
                    </p>
                )}
            </Card>
        );
    }

    // default
    const cardStyles = {
        completed: "bg-success/5 border-success/20 border-l-success hover:border-success/40 dark:bg-success/10 dark:border-success/30",
        in_progress: "bg-warning/5 border-warning/20 border-l-warning hover:border-warning/40 dark:bg-warning/10 dark:border-warning/30",
        pending: "bg-card/80 border-border border-l-muted-foreground hover:border-primary/50 dark:bg-card/40 dark:border-border/60",
    };

    return (
        <Card
            variant="default"
            className={cn(
                "group relative border-l-4 p-5 backdrop-blur-sm transition-all rounded-2xl shadow-none hover:shadow-md",
                cardStyles[item.status],
                interactiveCls,
            )}
            {...interactiveProps}
        >
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    {item.meta && (
                        <p className="mb-1 font-display text-[11px] uppercase tracking-[0.18em] text-primary">
                            {item.meta}
                        </p>
                    )}
                    <h3 className="font-display text-lg font-semibold leading-tight text-foreground">
                        {item.title}
                    </h3>
                    <p className="mt-1 text-xs text-muted-foreground tabular-nums">
                        {formatDate(item.date)}
                    </p>
                </div>
                <StatusBadge status={item.status} />
            </div>
            {item.description && (
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                </p>
            )}
        </Card>
    );
}

const NODE_SIZE: Record<TimelineVariant, string> = {
    default: "h-3.5 w-3.5",
    minimal: "h-2.5 w-2.5",
    compact: "h-3 w-3",
    glow: "h-4 w-4",
};

export function TimelineNode({
    status,
    variant = "default",
}: {
    status: TimelineStatus;
    variant?: TimelineVariant;
}) {
    return (
        <span
            aria-hidden
            className={cn(
                "block shrink-0 rounded-full border-2",
                NODE_SIZE[variant],
                NODE_RING[status],
            )}
        />
    );
}

const NODE_OFFSET: Record<TimelineVariant, { v: string; h: string }> = {
    default: { v: "-left-[31px]", h: "-top-[29px]" },
    minimal: { v: "-left-[29px]", h: "-top-[27px]" },
    compact: { v: "-left-[30px]", h: "-top-[28px]" },
    glow: { v: "-left-[32px]", h: "-top-[30px]" },
};

//Skeleton Components

export function TimelineItemSkeleton({ variant = "default" }: { variant?: TimelineVariant }) {
    return (
        <Card
            variant={variant === "minimal" ? "minimal" : variant === "compact" ? "outline" : "default"}
            className={cn(
                "relative overflow-hidden border-border/50",
                variant === "default" && "p-5 border-l-4 border-l-muted",
                variant === "compact" && "px-4 py-3",
                variant === "glow" && "p-5",
                variant === "minimal" && "py-1 border-0 shadow-none"
            )}
        >
            <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-foreground/5 to-transparent" />
            <div className="flex items-start justify-between gap-3">
                <div className="space-y-2 flex-1">
                    <div className="h-4 w-3/4 rounded-md bg-muted/60 animate-pulse" />
                    <div className="h-3 w-1/4 rounded-md bg-muted/60 animate-pulse" />
                </div>
                <div className="h-6 w-16 rounded-full bg-muted/60 animate-pulse" />
            </div>
            {variant !== "compact" && (
                <div className="mt-3 space-y-2">
                    <div className="h-3 w-full rounded-md bg-muted/60 animate-pulse" />
                    <div className="h-3 w-5/6 rounded-md bg-muted/60 animate-pulse" />
                </div>
            )}
        </Card>
    );
}

export function TimelineSkeleton({
    count = 3,
    variant = "default",
    orientation = "vertical"
}: {
    count?: number;
    variant?: TimelineVariant;
    orientation?: "vertical" | "horizontal";
}) {
    const spacing = variant === "compact" ? "space-y-3" : variant === "minimal" ? "space-y-5" : "space-y-6";
    const nodeTop = variant === "compact" ? "top-3.5" : variant === "minimal" ? "top-1.5" : "top-5";
    const width = variant === "compact" ? "w-[260px]" : variant === "minimal" ? "w-[280px]" : "w-[320px]";

    if (orientation === "horizontal") {
        return (
            <div className="relative overflow-hidden">
                <div className="flex gap-6 pt-10">
                    <span
                        aria-hidden
                        className="pointer-events-none absolute left-0 right-0 top-[18px] h-px bg-border/50"
                    />
                    {Array.from({ length: count }).map((_, i) => (
                        <div key={i} className={cn("relative shrink-0", width)}>
                            <span className={cn("absolute left-5", NODE_OFFSET[variant].h)}>
                                <span className={cn("block shrink-0 rounded-full bg-muted animate-pulse", NODE_SIZE[variant])} />
                            </span>
                            <TimelineItemSkeleton variant={variant} />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className={cn("relative ml-2 border-l border-border/50 pl-6", spacing)}>
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="relative">
                    <span className={cn("absolute", NODE_OFFSET[variant].v, nodeTop)}>
                        <span className={cn("block shrink-0 rounded-full bg-muted animate-pulse", NODE_SIZE[variant])} />
                    </span>
                    <TimelineItemSkeleton variant={variant} />
                </div>
            ))}
        </div>
    );
}

//TimelineFilters Component

export interface TimelineFiltersProps {
    value: TimelineFilter;
    onChange: (v: TimelineFilter) => void;
    items: TimelineItem[];
}

const OPTIONS: { value: TimelineFilter; label: string }[] = [
    { value: "all", label: "All" },
    { value: "completed", label: "Completed" },
    { value: "in_progress", label: "In progress" },
    { value: "pending", label: "Pending" },
];

export function TimelineFilters({ value, onChange, items }: TimelineFiltersProps) {
    const counts: Record<TimelineFilter, number> = {
        all: items.length,
        completed: items.filter((i) => i.status === "completed").length,
        in_progress: items.filter((i) => i.status === "in_progress").length,
        pending: items.filter((i) => i.status === "pending").length,
    };

    return (
        <div role="radiogroup" className="flex flex-wrap items-center justify-start gap-2">
            {OPTIONS.map((opt) => {
                const active = value === opt.value;
                return (
                    <button
                        key={opt.value}
                        type="button"
                        role="radio"
                        aria-checked={active}
                        aria-label={opt.label}
                        data-state={active ? "on" : "off"}
                        onClick={() => onChange(opt.value)}
                        className={
                            "inline-flex h-9 items-center gap-2 rounded-full border px-4 text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring " +
                            (active
                                ? "border-primary/60 bg-primary/15 text-foreground"
                                : "border-border bg-card/50 text-muted-foreground hover:text-foreground")
                        }
                    >
                        <span>{opt.label}</span>
                        <span className="rounded-full bg-background/60 px-1.5 text-xs tabular-nums text-muted-foreground">
                            {counts[opt.value]}
                        </span>
                    </button>
                );
            })}
        </div>
    );
}

//Timeline Component

export interface TimelineProps {
    items: TimelineItem[];
    orientation?: "auto" | "vertical" | "horizontal";
    variant?: TimelineVariant;
    defaultFilter?: TimelineFilter;
    showFilters?: boolean;
    isLoading?: boolean;
    skeletonCount?: number;
    enableDetails?: boolean;
    onItemClick?: (item: TimelineItem) => void;
    renderDetails?: (item: TimelineItem) => React.ReactNode;
    drawerPosition?: "left" | "right" | "top" | "bottom";
}

export function Timeline({
    items,
    orientation = "auto",
    variant = "default",
    defaultFilter = "all",
    showFilters = true,
    isLoading = false,
    skeletonCount = 3,
    enableDetails = true,
    onItemClick,
    renderDetails,
    drawerPosition = "right",
}: TimelineProps) {
    const [filter, setFilter] = useState<TimelineFilter>(defaultFilter);
    const [selectedItem, setSelectedItem] = useState<TimelineItem | null>(null);

    const handleItemClick =
        onItemClick ?? (enableDetails ? (item: TimelineItem) => setSelectedItem(item) : undefined);

    const sorted = useMemo(
        () =>
            [...items].sort(
                (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
            ),
        [items],
    );

    const visible = useMemo(
        () => (filter === "all" ? sorted : sorted.filter((i) => i.status === filter)),
        [sorted, filter],
    );

    const showVertical =
        orientation === "vertical" || orientation === "auto";
    const showHorizontal =
        orientation === "horizontal" || orientation === "auto";

    if (isLoading) {
        return (
            <div className="space-y-8">
                {showFilters && (
                    <div className="flex gap-2">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="h-9 w-24 rounded-full bg-muted/60 animate-pulse" />
                        ))}
                    </div>
                )}
                {showVertical && (
                    <div className={cn("block", orientation === "auto" && "md:hidden")}>
                        <TimelineSkeleton count={skeletonCount} variant={variant} orientation="vertical" />
                    </div>
                )}
                {showHorizontal && (
                    <div className={cn(orientation === "auto" ? "hidden md:block" : "block")}>
                        <TimelineSkeleton count={skeletonCount} variant={variant} orientation="horizontal" />
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {showFilters && (
                <TimelineFilters value={filter} onChange={setFilter} items={items} />
            )}

            {visible.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
                    No items match this filter.
                </div>
            ) : (
                <>
                    {showVertical && (
                        <div
                            className={cn(
                                "block",
                                orientation === "auto" && "md:hidden",
                            )}
                        >
                            <VerticalTimeline
                                items={visible}
                                variant={variant}
                                onItemClick={handleItemClick}
                            />
                        </div>
                    )}
                    {showHorizontal && (
                        <div
                            className={cn(
                                orientation === "auto" ? "hidden md:block" : "block",
                            )}
                        >
                            <HorizontalTimeline
                                items={visible}
                                variant={variant}
                                onItemClick={handleItemClick}
                            />
                        </div>
                    )}
                </>
            )}

            {enableDetails && !onItemClick && (
                <TimelineDetailsDrawer
                    item={selectedItem}
                    onClose={() => setSelectedItem(null)}
                    position={drawerPosition}
                    renderDetails={renderDetails}
                />
            )}
        </div>
    );
}

function TimelineDetailsDrawer({
    item,
    onClose,
    position,
    renderDetails,
}: {
    item: TimelineItem | null;
    onClose: () => void;
    position: "left" | "right" | "top" | "bottom";
    renderDetails?: (item: TimelineItem) => React.ReactNode;
}) {
    return (
        <Drawer
            isOpen={item !== null}
            onClose={onClose}
            position={position}
            size="420px"
            title={item?.title ?? ""}
        >
            {item && (renderDetails ? renderDetails(item) : <DefaultTimelineDetails item={item} />)}
        </Drawer>
    );
}

const STATUS_ACCENT: Record<TimelineStatus, string> = {
    completed: "from-success/60 via-success/20 to-transparent",
    in_progress: "from-warning/60 via-warning/20 to-transparent",
    pending: "from-muted-foreground/40 via-muted-foreground/10 to-transparent",
};

function DetailSection({
    label,
    icon,
    children,
}: {
    label: string;
    icon?: React.ReactNode;
    children: React.ReactNode;
}) {
    return (
        <div className="rounded-xl border border-border/60 bg-card/40 p-4">
            <div className="flex items-center gap-2 mb-2">
                {icon && (
                    <span className="text-muted-foreground" aria-hidden>
                        {icon}
                    </span>
                )}
                <p className="font-display text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    {label}
                </p>
            </div>
            {children}
        </div>
    );
}

function DefaultTimelineDetails({ item }: { item: TimelineItem }) {
    return (
        <div className="-mx-4 -mt-4">
            {/* Status accent strip */}
            <div
                aria-hidden
                className={cn(
                    "h-1 w-full bg-gradient-to-r",
                    STATUS_ACCENT[item.status],
                )}
            />

            <div className="space-y-4 p-4">
                {/* Header row: status badge left, date right — baseline aligned */}
                <div className="flex items-center justify-between gap-3 flex-wrap">
                    <StatusBadge status={item.status} />
                    <time
                        dateTime={item.date}
                        className="inline-flex items-center gap-1.5 text-xs tabular-nums text-muted-foreground"
                    >
                        <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden
                        >
                            <rect x="3" y="4" width="18" height="18" rx="2" />
                            <path d="M16 2v4M8 2v4M3 10h18" />
                        </svg>
                        {formatDate(item.date)}
                    </time>
                </div>

                {item.meta && (
                    <DetailSection
                        label="Stage"
                        icon={
                            <svg
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M4 4h16v6H4zM4 14h16v6H4z" />
                            </svg>
                        }
                    >
                        <p className="text-sm font-medium text-foreground">{item.meta}</p>
                    </DetailSection>
                )}

                {item.description && (
                    <DetailSection
                        label="Description"
                        icon={
                            <svg
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M4 6h16M4 12h16M4 18h10" />
                            </svg>
                        }
                    >
                        <p className="text-sm leading-relaxed text-foreground/90">
                            {item.description}
                        </p>
                    </DetailSection>
                )}

                <DetailSection
                    label="Item ID"
                    icon={
                        <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M9 12h6M12 9v6" />
                            <circle cx="12" cy="12" r="9" />
                        </svg>
                    }
                >
                    <code className="inline-block rounded-md bg-muted/60 px-2 py-1 font-mono text-xs text-foreground">
                        {item.id}
                    </code>
                </DetailSection>
            </div>
        </div>
    );
}

function VerticalTimeline({
    items,
    variant,
    onItemClick,
}: {
    items: TimelineItem[];
    variant: TimelineVariant;
    onItemClick?: (item: TimelineItem) => void;
}) {
    const spacing = variant === "compact" ? "space-y-3" : variant === "minimal" ? "space-y-5" : "space-y-6";
    const nodeTop = variant === "compact" ? "top-3.5" : variant === "minimal" ? "top-1.5" : "top-5";
    return (
        <ol className={cn("relative ml-2 border-l border-border pl-6", spacing)}>
            <span
                aria-hidden
                className="pointer-events-none absolute left-0 top-0 h-full w-px bg-gradient-to-b from-primary via-primary/50 to-transparent opacity-70"
            />
            {items.map((item, i) => (
                <li
                    key={item.id}
                    className="relative animate-in fade-in slide-in-from-left-2"
                    style={{ animationDelay: `${i * 60}ms`, animationFillMode: "both" }}
                >
                    <span className={cn("absolute", NODE_OFFSET[variant].v, nodeTop)}>
                        <TimelineNode status={item.status} variant={variant} />
                    </span>
                    <TimelineItemCard item={item} variant={variant} onClick={onItemClick} />
                </li>
            ))}
        </ol>
    );
}

function HorizontalTimeline({
    items,
    variant,
    onItemClick,
}: {
    items: TimelineItem[];
    variant: TimelineVariant;
    onItemClick?: (item: TimelineItem) => void;
}) {
    const width = variant === "compact" ? "w-[260px]" : variant === "minimal" ? "w-[280px]" : "w-[320px]";
    return (
        <div className="relative">
            <div className="overflow-x-auto pb-4 [scrollbar-color:var(--border)_transparent]">
                <ol
                    className="relative flex w-max snap-x snap-mandatory gap-6 pt-10"
                    style={{ scrollPaddingLeft: "1rem" }}
                >
                    <span
                        aria-hidden
                        className="pointer-events-none absolute left-0 right-0 top-[18px] h-px bg-gradient-to-r from-primary via-primary/50 to-transparent opacity-70"
                    />
                    {items.map((item, i) => (
                        <li
                            key={item.id}
                            className={cn(
                                "relative shrink-0 snap-start animate-in fade-in slide-in-from-bottom-2",
                                width,
                            )}
                            style={{
                                animationDelay: `${i * 60}ms`,
                                animationFillMode: "both",
                            }}
                        >
                            <span className={cn("absolute left-5", NODE_OFFSET[variant].h)}>
                                <TimelineNode status={item.status} variant={variant} />
                            </span>
                            <TimelineItemCard item={item} variant={variant} onClick={onItemClick} />
                        </li>
                    ))}
                    <li aria-hidden className="w-2 shrink-0" />
                </ol>
            </div>
        </div>
    );
}