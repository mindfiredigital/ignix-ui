import { cn } from "../../../../../utils/cn";
import { useMemo, useState } from "react";
import { Badge } from "../../../../components/badge";

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
}: {
    item: TimelineItem;
    variant?: TimelineVariant;
}) {
    if (variant === "minimal") {
        return (
            <article className="group relative py-1">
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
            </article>
        );
    }

    if (variant === "compact") {
        return (
            <article className="group relative rounded-xl border border-border/60 bg-card/60 px-4 py-3 transition-colors hover:border-primary/40">
                <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0 flex items-center gap-3">
                        <h3 className="font-display text-sm font-semibold text-foreground truncate">
                            {item.title}
                        </h3>
                        <span className="text-[11px] tabular-nums text-muted-foreground shrink-0">
                            {formatDate(item.date)}
                        </span>
                    </div>
                    <StatusBadge status={item.status} />
                </div>
            </article>
        );
    }

    if (variant === "glow") {
        return (
            <article
                className="group relative overflow-hidden rounded-2xl border border-primary/20 p-5 transition-all hover:border-primary/60"
                style={{
                    background:
                        "linear-gradient(135deg, color-mix(in oklab, var(--card) 92%, transparent), color-mix(in oklab, var(--primary) 8%, var(--card)))",
                }}
            >
                <span
                    aria-hidden
                    className="pointer-events-none absolute -top-16 -right-16 h-40 w-40 rounded-full bg-primary opacity-20 blur-3xl"
                />
                <div className="relative flex items-start justify-between gap-3">
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
                    <p className="relative mt-3 text-sm leading-relaxed text-muted-foreground">
                        {item.description}
                    </p>
                )}
            </article>
        );
    }

    // default
    return (
        <article className="group relative rounded-2xl border border-border bg-card/80 p-5 backdrop-blur-sm transition-colors hover:border-primary/50">
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
        </article>
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
}

export function Timeline({
    items,
    orientation = "auto",
    variant = "default",
    defaultFilter = "all",
    showFilters = true,
}: TimelineProps) {
    const [filter, setFilter] = useState<TimelineFilter>(defaultFilter);

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
                            <VerticalTimeline items={visible} variant={variant} />
                        </div>
                    )}
                    {showHorizontal && (
                        <div
                            className={cn(
                                orientation === "auto" ? "hidden md:block" : "block",
                            )}
                        >
                            <HorizontalTimeline items={visible} variant={variant} />
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

function VerticalTimeline({
    items,
    variant,
}: {
    items: TimelineItem[];
    variant: TimelineVariant;
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
                    <span className={cn("absolute -left-[31px]", nodeTop)}>
                        <TimelineNode status={item.status} variant={variant} />
                    </span>
                    <TimelineItemCard item={item} variant={variant} />
                </li>
            ))}
        </ol>
    );
}

function HorizontalTimeline({
    items,
    variant,
}: {
    items: TimelineItem[];
    variant: TimelineVariant;
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
                            <span className="absolute -top-[26px] left-5">
                                <TimelineNode status={item.status} variant={variant} />
                            </span>
                            <TimelineItemCard item={item} variant={variant} />
                        </li>
                    ))}
                    <li aria-hidden className="w-2 shrink-0" />
                </ol>
            </div>
        </div>
    );
}