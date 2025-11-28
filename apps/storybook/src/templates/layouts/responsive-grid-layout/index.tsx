import * as React from "react";
import { cn } from "../../../../utils/cn";
import { cva, type VariantProps } from "class-variance-authority";

export interface ResponsiveGridItem {
  id?: string | number;
  title: string;
  description?: string;
  badge?: React.ReactNode;
  meta?: string;
  statValue?: string;
  statChange?: string;
  statTrend?: "up" | "down" | "neutral";
  media?: React.ReactNode;
  footer?: React.ReactNode;
  actionLabel?: string;
  actionHref?: string;
}

const responsiveGridVariants = cva("", {
  variants: {
    variant: {
      default: "bg-background text-foreground",
      dark: "bg-card text-card-foreground",
      light: "bg-white text-gray-900 border-r",
      glass: "bg-white/10 backdrop-blur-lg text-foreground",
      gradient: "bg-gradient-to-br from-purple-500 to-purple-400 text-white",
    }
},
  defaultVariants: {variant: "default"},
});

export interface ResponsiveGridLayoutProps {
  header?: React.ReactNode;
  footer?: React.ReactNode;
  items?: ResponsiveGridItem[];
  renderItem?: (item: ResponsiveGridItem, index: number) => React.ReactNode;
  className?: string;
  contentClassName?: string;
  gridClassName?: string;
  cardClassName?: string;
  padding?: "sm" | "md" | "lg";
  gap?: "sm" | "md" | "lg";
  maxWidth?:
    | "3xl"
    | "4xl"
    | "5xl"
    | "6xl"
    | "7xl"
    | "full"
    | "prose";
  minCardHeight?: number;
  stickyHeader?: boolean;
  stickyFooter?: boolean;
  enableHover?: boolean;
  variant?:VariantProps<typeof responsiveGridVariants>["variant"];
}

const paddingMap: Record<
  NonNullable<ResponsiveGridLayoutProps["padding"]>,
  string
> = {
  sm: "px-4 py-6 sm:px-6",
  md: "px-4 py-8 sm:px-8 lg:px-10",
  lg: "px-6 py-10 sm:px-10 lg:px-12",
};

const gapMap: Record<NonNullable<ResponsiveGridLayoutProps["gap"]>, string> = {
  sm: "gap-4",
  md: "gap-6",
  lg: "gap-8",
};

const maxWidthMap: Record<
  NonNullable<ResponsiveGridLayoutProps["maxWidth"]>,
  string
> = {
  "3xl": "max-w-3xl",
  "4xl": "max-w-4xl",
  "5xl": "max-w-5xl",
  "6xl": "max-w-6xl",
  "7xl": "max-w-7xl",
  full: "max-w-full",
  prose: "max-w-prose",
};

const trendColorMap: Record<
  NonNullable<ResponsiveGridItem["statTrend"]>,
  string
> = {
  up: "text-emerald-500",
  down: "text-rose-500",
  neutral: "text-muted-foreground",
};

const DefaultGridItem = ({
  item,
  cardClassName,
  minCardHeight,
  enableHover,
}: {
  item: ResponsiveGridItem;
  cardClassName?: string;
  minCardHeight: number;
  enableHover: boolean;
}) => {
  const actionElement = item.footer
    ? item.footer
    : item.actionLabel
    ? item.actionHref
      ? (
          <a
            className="inline-flex items-center justify-center rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            href={item.actionHref}
          >
            {item.actionLabel}
          </a>
        )
      : (
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            {item.actionLabel}
          </button>
        )
    : null;

  return (
    <article
      className={cn(
        "flex h-full flex-col rounded-2xl border border-border/60 bg-background/90 p-5 shadow-sm transition duration-200",
        "focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2",
        enableHover && "hover:-translate-y-1 hover:shadow-lg",
        "touch-manipulation",
        cardClassName
      )}
      style={{ minHeight: minCardHeight }}
      tabIndex={0}
      aria-label={item.title}
    >
      <div className="flex flex-col gap-4">
        {(item.badge || item.meta) && (
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {typeof item.badge === "string" ? (
              <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-primary">
                {item.badge}
              </span>
            ) : (
              item.badge
            )}
            {item.meta && (
              <span className="text-[0.7rem] font-medium text-muted-foreground">
                {item.meta}
              </span>
            )}
          </div>
        )}

        <div className="space-y-2">
          <h3 className="text-lg font-semibold leading-tight">{item.title}</h3>
          {item.description && (
            <p className="text-sm leading-relaxed text-muted-foreground">
              {item.description}
            </p>
          )}
        </div>

        {item.media && (
          <div className="rounded-xl border border-dashed border-border/70 bg-muted/30 p-4">
            {item.media}
          </div>
        )}

        {item.statValue && (
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold tracking-tight">
              {item.statValue}
            </span>
            {item.statChange && item.statTrend && (
              <span
                className={cn(
                  "text-sm font-semibold",
                  trendColorMap[item.statTrend]
                )}
              >
                {item.statTrend === "up" && "▲ "}
                {item.statTrend === "down" && "▼ "}
                {item.statChange}
              </span>
            )}
          </div>
        )}
      </div>

      {actionElement && (
        <div className="mt-auto flex items-center justify-between pt-4">
          {actionElement}
        </div>
      )}
    </article>
  );
};

export const ResponsiveGridLayout: React.FC<ResponsiveGridLayoutProps> = ({
  header,
  footer,
  items = [],
  renderItem,
  className,
  contentClassName,
  gridClassName,
  cardClassName,
  padding = "md",
  gap = "md",
  maxWidth = "7xl",
  minCardHeight = 220,
  stickyHeader = false,
  stickyFooter = false,
  enableHover = true,
  variant = "default",
}) => {
  const resolvedItems = React.useMemo(() => items ?? [], [items]);

  return (
    <div
      className={cn(
        cn(responsiveGridVariants({variant})),//"min-h-screen w-full bg-muted/20 text-foreground",
        className
      )}
    >
      <div
        className={cn(
          "mx-auto flex w-full flex-col gap-6",
          paddingMap[padding],
          maxWidthMap[maxWidth],
          contentClassName
        )}
      >
        {header && (
          <header
            className={cn(
              "flex flex-col gap-3 rounded-2xl bg-background/80 p-4 shadow-sm",
              stickyHeader &&
                "sticky top-0 z-20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80"
            )}
          >
            {header}
          </header>
        )}

        <section
          className={cn(
            "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
            "auto-rows-[1fr] touch-pan-y",
            gapMap[gap],
            gridClassName
          )}
          aria-live="polite"
        >
          {resolvedItems.map((item, index) => {
            const key = item.id ?? index;

            if (!renderItem) {
              return (
                <DefaultGridItem
                  key={key}
                  item={item}
                  cardClassName={cardClassName}
                  minCardHeight={minCardHeight}
                  enableHover={enableHover}
                />
              );
            }

            const customNode = renderItem(item, index);

            if (React.isValidElement(customNode)) {
              return React.cloneElement(customNode, {
                key: customNode.key ?? key,
              });
            }

            return (
              <React.Fragment key={key}>{customNode}</React.Fragment>
            );
          })}
        </section>

        {footer && (
          <footer
            className={cn(
              "rounded-2xl bg-background/80 p-4 text-sm text-muted-foreground",
              stickyFooter &&
                "sticky bottom-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80"
            )}
          >
            {footer}
          </footer>
        )}
      </div>
    </div>
  );
};

ResponsiveGridLayout.displayName = "ResponsiveGridLayout";


