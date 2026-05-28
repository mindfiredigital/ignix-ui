/**
 * @fileoverview Detail view page template for docs: data-management record surface with
 * composable slots (`DetailViewPage.Root`, `Header`, `Metadata`, …). Self-contained in the docs
 * UI layer (no Storybook imports). When `loading` is set, shows skeleton placeholders and disables
 * sibling navigation.
 */

"use client";

import {
    memo,
    useCallback,
    type KeyboardEvent,
    type ReactNode,
} from "react";
import { motion } from "framer-motion";
import {
    ArrowLeftIcon,
    CalendarIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    ClockIcon,
    Pencil1Icon,
    PersonIcon,
    ReloadIcon,
    Share2Icon,
    TrashIcon,
} from "@radix-ui/react-icons";
import { cn } from "@site/src/utils/cn";
import { Avatar } from "../avatar";
import { Button } from "../button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "../card";
import { Typography } from "../typography";

/* ─── Types ───────────────────────────────────────────────────────────────── */

/** Visual mapping for a status value (badge + dot classes). */
export interface StatusStyle {
    className: string;
    dotClassName: string;
}

/** Visual theme wrapper applied to the page root (`dark` class vs light). */
export type DetailViewTheme = "light" | "dark";

/** Display name and avatar initials for the record owner row. */
export interface DetailOwner {
    name: string;
    initials: string;
}

/** Lightweight row shown in the related-items list. */
export interface DetailRelatedItem {
    id: string;
    title: string;
    description?: string;
}

/** Optional string overrides for every user-visible label on the detail page. */
export interface DetailViewLabels {
    back?: string;
    previous?: string;
    next?: string;
    relatedHeading?: string;
    edit?: string;
    delete?: string;
    share?: string;
    created?: string;
    updated?: string;
    owner?: string;
    status?: string;
    emptyRelated?: string;
    /** Shown beside the spinner while `loading` is true. */
    loadingHint?: string;
}

/** Public props for the default composed `DetailViewPage` export. */
export interface DetailViewPageProps {
    /** Page heading shown as primary title. */
    title: string;
    /** Optional eyebrow (e.g. collection name). */
    eyebrow?: string;
    /** Optional secondary line under the title. */
    subtitle?: string;
    /** Primary body — string or rich React content. */
    content: ReactNode;
    /** ISO or human-readable date strings. */
    createdAt?: string;
    updatedAt?: string;
    /** Status label; paired with `statusStyles` for visuals. */
    status?: string;
    owner?: DetailOwner;
    /** Related records shown as a compact list. */
    relatedItems?: DetailRelatedItem[];
    /** Map status label → badge styling (same keys as ListView). */
    statusStyles?: Record<string, StatusStyle>;
    theme?: DetailViewTheme;
    className?: string;
    labels?: DetailViewLabels;
    onBack?: () => void;
    onEdit?: () => void;
    onDelete?: () => void;
    onShare?: () => void;
    onPrevious?: () => void;
    onNext?: () => void;
    /** Disables previous control when false. */
    hasPrevious?: boolean;
    /** Disables next control when false. */
    hasNext?: boolean;
    onRelatedItemClick?: (item: DetailRelatedItem) => void;
    /** When true, shows skeleton placeholders and disables prev/next (and footer nav); back remains usable if `onBack` is set. */
    loading?: boolean;
}

/**
 * Default copy for navigation, actions, metadata labels, and empty-related messaging.
 * Merged with consumer `labels` so partial overrides stay type-safe.
 */
const DEFAULT_LABELS: Required<DetailViewLabels> = {
    back: "Back",
    previous: "Previous",
    next: "Next",
    relatedHeading: "Related items",
    edit: "Edit",
    delete: "Delete",
    share: "Share",
    created: "Created",
    updated: "Updated",
    owner: "Owner",
    status: "Status",
    emptyRelated: "No related items yet.",
    loadingHint: "Loading item…",
};

/* ─── Root layout ─────────────────────────────────────────────────────────── */

/** Props for `DetailViewPage.Root` compound slot. */
export interface DetailViewPageRootProps {
    theme?: DetailViewTheme;
    className?: string;
    children: ReactNode;
}

/**
 * Wraps the page in theme-aware layout: optional `dark` class, full-height background, and centered max-width column.
 * @param props - Root layout props.
 * @returns The outer shell for all detail view content.
 */
function DetailViewPageRoot({
    theme = "light",
    className,
    children,
}: DetailViewPageRootProps) {
    return (
        <div className={cn(theme === "dark" && "dark", className)}>
            <div className="min-h-full bg-background text-foreground">
                <div className="mx-auto max-w-5xl px-6 py-10">{children}</div>
            </div>
        </div>
    );
}

/* ─── Back + sibling navigation ───────────────────────────────────────────── */

/** Props for the top navigation row (back + previous/next). */
export interface DetailViewPageTopNavProps {
    labels: Required<DetailViewLabels>;
    onBack?: () => void;
    onPrevious?: () => void;
    onNext?: () => void;
    hasPrevious?: boolean;
    hasNext?: boolean;
    /** When true, sibling navigation controls are disabled (data still resolving). */
    loading?: boolean;
}

/**
 * Top bar: optional back control and optional previous/next sibling navigation with disabled states.
 * @param props - Navigation labels and callbacks.
 * @returns Toolbar row for back and sequential navigation.
 */
function DetailViewPageTopNav({
    labels,
    onBack,
    onPrevious,
    onNext,
    hasPrevious = true,
    hasNext = true,
    loading = false,
}: DetailViewPageTopNavProps) {
    /** Invokes `onPrevious` when the control is enabled (`hasPrevious`) and not loading. */
    const handlePrev = useCallback(() => {
        if (loading || !hasPrevious) return;
        onPrevious?.();
    }, [loading, hasPrevious, onPrevious]);

    /** Invokes `onNext` when the control is enabled (`hasNext`) and not loading. */
    const handleNext = useCallback(() => {
        if (loading || !hasNext) return;
        onNext?.();
    }, [loading, hasNext, onNext]);

    return (
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-2">
                {onBack && (
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-9 gap-1.5 rounded-lg text-muted-foreground hover:text-foreground"
                        onClick={onBack}
                    >
                        <ArrowLeftIcon className="h-4 w-4" aria-hidden />
                        {labels.back}
                    </Button>
                )}
            </div>
            {(onPrevious || onNext) && (
                <div className="flex items-center gap-1 sm:ml-auto">
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-9 gap-1 rounded-lg"
                        disabled={loading || !onPrevious || !hasPrevious}
                        onClick={handlePrev}
                        aria-label={labels.previous}
                    >
                        <ChevronLeftIcon className="h-4 w-4" aria-hidden />
                        <span className="hidden sm:inline">{labels.previous}</span>
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-9 gap-1 rounded-lg"
                        disabled={loading || !onNext || !hasNext}
                        onClick={handleNext}
                        aria-label={labels.next}
                    >
                        <span className="hidden sm:inline">{labels.next}</span>
                        <ChevronRightIcon className="h-4 w-4" aria-hidden />
                    </Button>
                </div>
            )}
        </div>
    );
}

/* ─── Title + actions ─────────────────────────────────────────────────────── */

/** Props for the title stack and optional action delegation to `DetailViewPageActions`. */
export interface DetailViewPageHeaderProps {
    title: string;
    eyebrow?: string;
    subtitle?: string;
    labels: Required<DetailViewLabels>;
    onEdit?: () => void;
    onDelete?: () => void;
    onShare?: () => void;
}

/**
 * Primary title block: eyebrow, heading, subtitle, and optional action cluster when any handler is provided.
 * @param props - Title copy and action callbacks.
 * @returns Header region above metadata and body.
 */
function DetailViewPageHeader({
    title,
    eyebrow,
    subtitle,
    labels,
    onEdit,
    onDelete,
    onShare,
}: DetailViewPageHeaderProps) {
    return (
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0 flex-1">
                {eyebrow && (
                    <Typography
                        variant="caption"
                        color="muted"
                        className="mb-1 font-medium uppercase tracking-wider"
                    >
                        {eyebrow}
                    </Typography>
                )}
                <Typography variant="h3" as="h1" className="text-foreground">
                    {title}
                </Typography>
                {subtitle && (
                    <Typography variant="muted" className="mt-1.5 max-w-2xl">
                        {subtitle}
                    </Typography>
                )}
            </div>
            {(onEdit || onDelete || onShare) && (
                <DetailViewPageActions
                    labels={labels}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onShare={onShare}
                    className="shrink-0"
                />
            )}
        </div>
    );
}

/** Props for the edit / share / delete button cluster. */
export interface DetailViewPageActionsProps {
    labels: Required<DetailViewLabels>;
    onEdit?: () => void;
    onDelete?: () => void;
    onShare?: () => void;
    className?: string;
}

/**
 * Renders edit, share, and delete buttons for whichever callbacks exist; omits the group when none are passed.
 * @param props - Label bundle and per-action handlers.
 * @returns Horizontal button group.
 */
function DetailViewPageActions({
    labels,
    onEdit,
    onDelete,
    onShare,
    className,
}: DetailViewPageActionsProps) {
    return (
        <div
            className={cn(
                "flex flex-wrap items-center gap-2",
                className
            )}
        >
            {onEdit && (
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-9 gap-1.5 rounded-lg"
                    onClick={onEdit}
                >
                    <Pencil1Icon className="h-4 w-4" aria-hidden />
                    {labels.edit}
                </Button>
            )}
            {onShare && (
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-9 gap-1.5 rounded-lg"
                    onClick={onShare}
                >
                    <Share2Icon className="h-4 w-4" aria-hidden />
                    {labels.share}
                </Button>
            )}
            {onDelete && (
                <Button
                    type="button"
                    variant="danger"
                    size="sm"
                    className="h-9 gap-1.5 rounded-lg"
                    onClick={onDelete}
                >
                    <TrashIcon className="h-4 w-4" aria-hidden />
                    {labels.delete}
                </Button>
            )}
        </div>
    );
}

/* ─── Metadata ────────────────────────────────────────────────────────────── */

/**
 * Fallback status pill styling when `statusStyles` has no entry for the current status label.
 */
const DEFAULT_STATUS_STYLE: StatusStyle = {
    className:
        "bg-muted text-muted-foreground ring-1 ring-inset ring-border",
    dotClassName: "bg-muted-foreground/60",
};

/** Props for the metadata definition list card. */
export interface DetailViewPageMetadataProps {
    createdAt?: string;
    updatedAt?: string;
    status?: string;
    owner?: DetailOwner;
    statusStyles?: Record<string, StatusStyle>;
    labels: Required<DetailViewLabels>;
}

/**
 * Responsive metadata card: created/updated dates, status chip, and owner row using a definition list for readability.
 * Renders nothing when no metadata fields are present.
 * @param props - Dates, status, owner, style map, and labels.
 * @returns Card with `dl` grid or `null`.
 */
function DetailViewPageMetadata({
    createdAt,
    updatedAt,
    status,
    owner,
    statusStyles,
    labels,
}: DetailViewPageMetadataProps) {
    /** Resolved badge classes for the current `status`, or `undefined` when status is absent. */
    const statusVisual = status ? statusStyles?.[status] ?? DEFAULT_STATUS_STYLE : undefined;

    /** Whether any metadata row should be shown. */
    const showMeta =
        createdAt || updatedAt || status || owner;

    if (!showMeta) return null;

    return (
        <Card
            variant="outline"
            interactive="none"
            animation="none"
            className="mb-6 rounded-2xl border-border/70 bg-card shadow-sm"
        >
            <CardHeader variant="compact" className="pb-2">
                <CardTitle size="sm" className="text-sm font-medium text-muted-foreground">
                    Details
                </CardTitle>
            </CardHeader>
            <CardContent variant="compact" className="pt-0">
                <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {createdAt && (
                        <div className="flex gap-2">
                            <CalendarIcon
                                className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground"
                                aria-hidden
                            />
                            <div>
                                <dt className="text-xs font-medium text-muted-foreground">
                                    {labels.created}
                                </dt>
                                <dd className="text-sm text-foreground">{createdAt}</dd>
                            </div>
                        </div>
                    )}
                    {updatedAt && (
                        <div className="flex gap-2">
                            <ClockIcon
                                className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground"
                                aria-hidden
                            />
                            <div>
                                <dt className="text-xs font-medium text-muted-foreground">
                                    {labels.updated}
                                </dt>
                                <dd className="text-sm text-foreground">{updatedAt}</dd>
                            </div>
                        </div>
                    )}
                    {status && (
                        <div>
                            <dt className="text-xs font-medium text-muted-foreground">
                                {labels.status}
                            </dt>
                            <dd className="mt-1">
                                <span
                                    className={cn(
                                        "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium",
                                        statusVisual?.className
                                    )}
                                >
                                    <span
                                        className={cn(
                                            "h-1.5 w-1.5 rounded-full",
                                            statusVisual?.dotClassName
                                        )}
                                    />
                                    {status}
                                </span>
                            </dd>
                        </div>
                    )}
                    {owner && (
                        <div className="flex gap-2 sm:col-span-2 lg:col-span-1">
                            <PersonIcon
                                className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground"
                                aria-hidden
                            />
                            <div className="min-w-0 flex-1">
                                <dt className="text-xs font-medium text-muted-foreground">
                                    {labels.owner}
                                </dt>
                                <dd className="mt-1 flex items-center gap-2">
                                    <Avatar
                                        size="sm"
                                        letters={owner.initials}
                                        shape="circle"
                                        backgroundColor="bg-primary/5"
                                    />
                                    <span className="truncate text-sm text-foreground">
                                        {owner.name}
                                    </span>
                                </dd>
                            </div>
                        </div>
                    )}
                </dl>
            </CardContent>
        </Card>
    );
}

/* ─── Body content ─────────────────────────────────────────────────────────── */

/** Props for the primary body card. */
export interface DetailViewPageContentProps {
    children: ReactNode;
}

/**
 * Main prose region inside a card; wraps string children in `Typography` and passes through React nodes unchanged.
 * @param props - Body content node.
 * @returns Bordered content card.
 */
function DetailViewPageContent({ children }: DetailViewPageContentProps) {
    return (
        <Card
            variant="outline"
            interactive="none"
            animation="none"
            className="mb-8 rounded-2xl border-border/70 bg-card shadow-sm"
        >
            <CardContent variant="default" className="text-sm leading-relaxed text-foreground pt-3">
                {typeof children === "string" ? (
                    <Typography variant="body" className="whitespace-pre-wrap">
                        {children}
                    </Typography>
                ) : (
                    children
                )}
            </CardContent>
        </Card>
    );
}

/* ─── Related list ───────────────────────────────────────────────────────── */

/** Props for the related-items section. */
export interface DetailViewRelatedListProps {
    items: DetailRelatedItem[];
    labels: Required<DetailViewLabels>;
    onItemClick?: (item: DetailRelatedItem) => void;
}

/** Internal props for a single related list row. */
interface RelatedRowProps {
    item: DetailRelatedItem;
    onClick?: (item: DetailRelatedItem) => void;
}

/**
 * Single related-item row with optional click/keyboard activation; memoized to limit re-renders when the parent list updates.
 * @param props - Related item data and optional selection handler.
 * @returns Animated list item.
 */
const DetailViewRelatedRow = memo(function DetailViewRelatedRow({
    item,
    onClick,
}: RelatedRowProps) {
    /** Forwards the row item to `onClick` when interactive. */
    const handleClick = useCallback(() => {
        onClick?.(item);
    }, [item, onClick]);

    /** Activates the same path as click for Enter and Space when the row is interactive. */
    const handleKeyDown = useCallback(
        (e: KeyboardEvent<HTMLLIElement>) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick?.(item);
            }
        },
        [item, onClick]
    );

    return (
        <motion.li
            layout
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.18 }}
            role={onClick ? "button" : undefined}
            tabIndex={onClick ? 0 : undefined}
            onClick={onClick ? handleClick : undefined}
            onKeyDown={onClick ? handleKeyDown : undefined}
            className={cn(
                "rounded-xl border border-border/70 bg-card/80 p-4 shadow-sm transition-colors",
                onClick &&
                    "cursor-pointer hover:border-primary/30 hover:bg-primary/[0.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            )}
        >
            <p className="font-medium text-foreground">{item.title}</p>
            {item.description && (
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                    {item.description}
                </p>
            )}
        </motion.li>
    );
});

/**
 * Section heading plus a list of related records, or a dashed empty state when `items` is empty.
 * @param props - Items, copy, and optional row click handler.
 * @returns Related items region.
 */
function DetailViewPageRelatedList({
    items,
    labels,
    onItemClick,
}: DetailViewRelatedListProps) {
    if (items.length === 0) {
        return (
            <div className="rounded-2xl border border-dashed border-border bg-card/40 px-6 py-10 text-center">
                <Typography variant="muted">{labels.emptyRelated}</Typography>
            </div>
        );
    }

    return (
        <section aria-labelledby="detail-related-heading">
            <Typography
                id="detail-related-heading"
                variant="h5"
                as="h2"
                className="mb-3 text-foreground"
            >
                {labels.relatedHeading}
            </Typography>
            <ul className="flex flex-col gap-3 p-0">
                {items.map((item) => (
                    <DetailViewRelatedRow
                        key={item.id}
                        item={item}
                        onClick={onItemClick}
                    />
                ))}
            </ul>
        </section>
    );
}

/* ─── Bottom sibling nav (duplicate for long pages / mobile) ─────────────── */

/** Props for the footer previous/next strip. */
export interface DetailViewPageBottomNavProps {
    labels: Required<DetailViewLabels>;
    onPrevious?: () => void;
    onNext?: () => void;
    hasPrevious?: boolean;
    hasNext?: boolean;
    /** When true, footer sibling buttons stay visible but are non-interactive. */
    loading?: boolean;
}

/**
 * Secondary previous/next strip at the bottom of the page for long content or small viewports; hidden when both callbacks are omitted.
 * @param props - Labels, handlers, and boundary flags.
 * @returns Footer navigation or `null`.
 */
function DetailViewPageBottomNav({
    labels,
    onPrevious,
    onNext,
    hasPrevious = true,
    hasNext = true,
    loading = false,
}: DetailViewPageBottomNavProps) {
    if (!onPrevious && !onNext) return null;

    return (
        <div className="mt-10 flex justify-center border-t border-border pt-6">
            <div className="flex items-center gap-1">
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-9 gap-1 rounded-lg"
                    disabled={loading || !onPrevious || !hasPrevious}
                    onClick={() => !loading && hasPrevious && onPrevious?.()}
                    aria-label={labels.previous}
                >
                    <ChevronLeftIcon className="h-4 w-4" aria-hidden />
                    {labels.previous}
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-9 gap-1 rounded-lg"
                    disabled={loading || !onNext || !hasNext}
                    onClick={() => !loading && hasNext && onNext?.()}
                    aria-label={labels.next}
                >
                    {labels.next}
                    <ChevronRightIcon className="h-4 w-4" aria-hidden />
                </Button>
            </div>
        </div>
    );
}

/* ─── Loading skeleton ────────────────────────────────────────────────────── */

/**
 * Pulsing placeholders that mirror the detail layout (title, metadata grid, body, related list)
 * while record data is fetched.
 * @returns Accessible busy region for use when `loading` is true.
 */
function DetailViewPageSkeleton() {
    return (
        <div
            className="animate-pulse space-y-6"
            aria-busy="true"
            aria-live="polite"
        >
            <div className="space-y-3">
                <div className="h-3 w-28 rounded bg-muted" />
                <div className="h-9 max-w-xl rounded-lg bg-muted" />
                <div className="h-4 max-w-2xl rounded bg-muted" />
                <div className="h-4 max-w-xl rounded bg-muted" />
            </div>

            <div className="rounded-2xl border border-border/70 bg-card p-5 shadow-sm">
                <div className="mb-3 h-4 w-20 rounded bg-muted" />
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="space-y-2">
                            <div className="h-3 w-16 rounded bg-muted" />
                            <div className="h-4 w-24 rounded bg-muted" />
                        </div>
                    ))}
                </div>
            </div>

            <div className="rounded-2xl border border-border/70 bg-card p-6 shadow-sm">
                <div className="space-y-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div
                            key={i}
                            className={cn(
                                "h-4 rounded bg-muted",
                                i % 3 === 0 ? "w-11/12" : "w-full"
                            )}
                        />
                    ))}
                </div>
            </div>

            <div>
                <div className="mb-3 h-6 w-40 rounded-md bg-muted" />
                <ul className="flex flex-col gap-3 p-0">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <li
                            key={i}
                            className="rounded-xl border border-border/70 bg-card/80 p-4 shadow-sm"
                        >
                            <div className="h-4 max-w-[12rem] rounded bg-muted" />
                            <div className="mt-2 h-3 w-4/5 rounded bg-muted" />
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

/* ─── Composed page ───────────────────────────────────────────────────────── */

/**
 * Default composed detail page: wires root layout, top/bottom nav, header, metadata, body, and related list from `DetailViewPageProps`.
 * @param props - Full detail view configuration.
 * @returns Complete detail view tree.
 */
function DetailViewPageImpl(props: DetailViewPageProps) {
    const {
        title,
        eyebrow,
        subtitle,
        content,
        createdAt,
        updatedAt,
        status,
        owner,
        relatedItems = [],
        statusStyles,
        theme = "light",
        className,
        labels: labelsProp,
        onBack,
        onEdit,
        onDelete,
        onShare,
        onPrevious,
        onNext,
        hasPrevious = true,
        hasNext = true,
        onRelatedItemClick,
        loading = false,
    } = props;

    /** Effective labels after merging defaults with partial consumer overrides. */
    const labels = { ...DEFAULT_LABELS, ...labelsProp };

    /** Stable bridge to `onRelatedItemClick` for memoized related rows. */
    const handleRelatedItem = useCallback(
        (item: DetailRelatedItem) => {
            onRelatedItemClick?.(item);
        },
        [onRelatedItemClick]
    );

    return (
        <DetailViewPageRoot theme={theme} className={className}>
            <DetailViewPageTopNav
                labels={labels}
                onBack={onBack}
                onPrevious={onPrevious}
                onNext={onNext}
                hasPrevious={hasPrevious}
                hasNext={hasNext}
                loading={loading}
            />

            {loading ? (
                <>
                    <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
                        <ReloadIcon
                            className="h-4 w-4 shrink-0 animate-spin"
                            aria-hidden
                        />
                        <span>{labels.loadingHint}</span>
                    </div>
                    <DetailViewPageSkeleton />
                </>
            ) : (
                <>
                    <DetailViewPageHeader
                        title={title}
                        eyebrow={eyebrow}
                        subtitle={subtitle}
                        labels={labels}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        onShare={onShare}
                    />

                    <DetailViewPageMetadata
                        createdAt={createdAt}
                        updatedAt={updatedAt}
                        status={status}
                        owner={owner}
                        statusStyles={statusStyles}
                        labels={labels}
                    />

                    <DetailViewPageContent>{content}</DetailViewPageContent>

                    <DetailViewPageRelatedList
                        items={relatedItems}
                        labels={labels}
                        onItemClick={handleRelatedItem}
                    />
                </>
            )}

            <DetailViewPageBottomNav
                labels={labels}
                onPrevious={onPrevious}
                onNext={onNext}
                hasPrevious={hasPrevious}
                hasNext={hasNext}
                loading={loading}
            />
        </DetailViewPageRoot>
    );
}

/**
 * Typing for the compound export: default render function plus static subcomponents.
 */
type DetailViewPageCompound = typeof DetailViewPageImpl & {
    Root: typeof DetailViewPageRoot;
    TopNav: typeof DetailViewPageTopNav;
    Header: typeof DetailViewPageHeader;
    Actions: typeof DetailViewPageActions;
    Metadata: typeof DetailViewPageMetadata;
    Content: typeof DetailViewPageContent;
    RelatedList: typeof DetailViewPageRelatedList;
    BottomNav: typeof DetailViewPageBottomNav;
};

/**
 * Full-page detail layout with compound subcomponents on the same namespace
 * (`DetailViewPage.Root`, `DetailViewPage.Header`, …) for custom compositions.
 * @remarks Static properties (`Root`, `TopNav`, …) mirror the default layout pieces for bespoke ordering.
 */
export const DetailViewPage: DetailViewPageCompound = Object.assign(
    DetailViewPageImpl,
    {
        Root: DetailViewPageRoot,
        TopNav: DetailViewPageTopNav,
        Header: DetailViewPageHeader,
        Actions: DetailViewPageActions,
        Metadata: DetailViewPageMetadata,
        Content: DetailViewPageContent,
        RelatedList: DetailViewPageRelatedList,
        BottomNav: DetailViewPageBottomNav,
    }
);
