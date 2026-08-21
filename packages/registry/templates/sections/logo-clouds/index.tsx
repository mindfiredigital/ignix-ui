import React, { useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cva, type VariantProps } from "class-variance-authority";
import { Typography } from "@ignix-ui/typography";
import { cn } from "../../../utils/cn";

/* -------------------------------------------------------------------------- */
/*                              TYPES & INTERFACES                            */
/* -------------------------------------------------------------------------- */

/**
 * Single brand/logo entry rendered by {@link LogoClouds}.
 *
 * @property id - Unique identifier (used as the React key).
 * @property name - Accessible name of the brand (used for `alt`/`aria-label`).
 * @property src - Image URL for the logo. Omit when using `icon` instead.
 * @property icon - Custom node (e.g. an inline SVG) rendered instead of `src`.
 * @property href - Optional link target; when set, the logo renders as an anchor.
 * @property width - Optional explicit width (px) passed to the `<img>`.
 * @property height - Optional explicit height (px) passed to the `<img>`.
 */
export interface LogoCloudItem {
  id: string;
  name: string;
  src?: string;
  icon?: React.ReactNode;
  href?: string;
  width?: number;
  height?: number;
}

const logoSizeVariants = cva("w-auto object-contain", {
  variants: {
    size: {
      sm: "h-6",
      md: "h-8",
      lg: "h-10",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

/**
 * Props for the {@link LogoClouds} template.
 *
 * @property logos - Brands to display.
 * @property title - Optional eyebrow/heading above the logos (e.g. "Trusted by teams at").
 * @property subtitle - Optional supporting text under the title.
 * @property variant - `"grid"` for a static wrapped row/grid, `"marquee"` for a continuous scroll.
 * @property columns - Column counts per breakpoint, used only when `variant="grid"`.
 * @property size - Controls the rendered logo height.
 * @property grayscale - Render logos in grayscale, restoring color on hover/focus (default `true`).
 * @property bordered - Add a top/bottom divider, matching common "trusted by" strip layouts.
 * @property speed - Seconds for one full marquee loop (`variant="marquee"` only). Default `30`.
 * @property pauseOnHover - Pause the marquee while hovered (`variant="marquee"` only, default `true`).
 * @property className - Class name for the root `<section>`.
 * @property logoClassName - Class name applied to each logo's wrapper.
 */
export interface LogoCloudsProps extends VariantProps<typeof logoSizeVariants> {
  logos: LogoCloudItem[];
  title?: string;
  subtitle?: string;
  variant?: "grid" | "marquee";
  columns?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
  };
  grayscale?: boolean;
  bordered?: boolean;
  speed?: number;
  pauseOnHover?: boolean;
  className?: string;
  logoClassName?: string;
}

/* -------------------------------------------------------------------------- */
/*                              LOGO RENDERER                                 */
/* -------------------------------------------------------------------------- */

const LogoMark: React.FC<{
  logo: LogoCloudItem;
  size: LogoCloudsProps["size"];
  grayscale: boolean;
  logoClassName?: string;
  ariaHidden?: boolean;
}> = React.memo(({ logo, size, grayscale, logoClassName, ariaHidden }) => {
  const content = logo.icon ?? (
    <img
      src={logo.src}
      alt={logo.name}
      width={logo.width}
      height={logo.height}
      loading="lazy"
      className={logoSizeVariants({ size })}
    />
  );

  const classes = cn(
    "flex shrink-0 items-center justify-center transition-all duration-300",
    grayscale &&
      "grayscale opacity-60 hover:grayscale-0 hover:opacity-100 focus-visible:grayscale-0 focus-visible:opacity-100",
    logoClassName
  );

  if (logo.href) {
    return (
      <a
        href={logo.href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={logo.name}
        tabIndex={ariaHidden ? -1 : 0}
        aria-hidden={ariaHidden}
        className={cn(classes, "rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2")}
      >
        {content}
      </a>
    );
  }

  return (
    <div role="listitem" aria-hidden={ariaHidden} className={classes}>
      {content}
    </div>
  );
});

LogoMark.displayName = "LogoMark";

/* -------------------------------------------------------------------------- */
/*                              LOGO CLOUDS COMPONENT                         */
/* -------------------------------------------------------------------------- */

/**
 * LogoClouds displays a "trusted by" style strip of partner/customer logos.
 *
 * Supports two layouts:
 * - `"grid"` (default): logos wrap onto a responsive, centered grid.
 * - `"marquee"`: logos scroll continuously in an infinite loop, pausing on
 *   hover/focus by default and disabling motion for users who prefer
 *   reduced motion.
 */
export const LogoClouds: React.FC<LogoCloudsProps> = ({
  logos,
  title,
  subtitle,
  variant = "grid",
  columns = { mobile: 2, tablet: 3, desktop: 6 },
  size = "md",
  grayscale = true,
  bordered = false,
  speed = 30,
  pauseOnHover = true,
  className,
  logoClassName,
}) => {
  const prefersReducedMotion = useReducedMotion();
  const [isPaused, setIsPaused] = useState(false);

  const columnsClassName = cn(
    "grid items-center justify-items-center gap-x-8 gap-y-6",
    `grid-cols-${columns.mobile ?? 2}`,
    columns.tablet && `sm:grid-cols-${columns.tablet}`,
    columns.desktop && `lg:grid-cols-${columns.desktop}`
  );

  // Duplicate the track once so the marquee can loop seamlessly from -50%.
  const marqueeLogos = useMemo(() => [...logos, ...logos], [logos]);

  const shouldAnimate = variant === "marquee" && !prefersReducedMotion;

  if (logos.length === 0) return null;

  return (
    <section
      aria-label={title ?? "Trusted by"}
      className={cn(
        "w-full py-16 px-6",
        bordered && "border-y border-border",
        className
      )}
    >
      <div className="mx-auto max-w-7xl">
        {(title || subtitle) && (
          <div className="mb-10 text-center">
            {title && (
              <Typography
                variant="small"
                weight="semibold"
                className="uppercase tracking-wide text-muted-foreground"
              >
                {title}
              </Typography>
            )}
            {subtitle && (
              <Typography variant="body" className="mt-2 text-muted-foreground">
                {subtitle}
              </Typography>
            )}
          </div>
        )}

        {variant === "grid" ? (
          <div role="list" className={cn(columnsClassName)}>
            {logos.map((logo) => (
              <LogoMark
                key={logo.id}
                logo={logo}
                size={size}
                grayscale={grayscale}
                logoClassName={logoClassName}
              />
            ))}
          </div>
        ) : (
          <div
            className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]"
            onMouseEnter={() => pauseOnHover && setIsPaused(true)}
            onMouseLeave={() => pauseOnHover && setIsPaused(false)}
            onFocus={() => pauseOnHover && setIsPaused(true)}
            onBlur={() => pauseOnHover && setIsPaused(false)}
          >
            <motion.div
              role="list"
              className="flex w-max items-center gap-16"
              animate={shouldAnimate && !isPaused ? { x: ["0%", "-50%"] } : undefined}
              transition={{ duration: speed, ease: "linear", repeat: Infinity }}
            >
              {marqueeLogos.map((logo, index) => (
                <LogoMark
                  key={`${logo.id}-${index}`}
                  logo={logo}
                  size={size}
                  grayscale={grayscale}
                  logoClassName={logoClassName}
                  // The duplicated (second) set is presentation-only, so it's
                  // hidden from assistive tech to avoid announcing every logo twice.
                  ariaHidden={index >= logos.length}
                />
              ))}
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
};

LogoClouds.displayName = "LogoClouds";

export default LogoClouds;
