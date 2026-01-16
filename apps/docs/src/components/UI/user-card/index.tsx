
import React, { useMemo, memo } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Card, CardContent, CardHeader, type CardProps } from "@site/src/components/UI/card";
import { Avatar, type AvatarProps } from "@site/src/components/UI/avatar";
import { Typography } from "@site/src/components/UI/typography";
import { Button } from "@site/src/components/UI/button";
import { CheckCircle2, Star } from "lucide-react";
import { cn } from "@site/src/utils/cn";

/* -------------------------------------------------------------------------- */
/*                              INTERFACE                                     */
/* -------------------------------------------------------------------------- */
interface SocialLinksProps extends SizeAlignProps{
  socialLinks: SocialLink[];
  name: string;
  isHorizontal?: boolean;
}

interface SizeAlignProps {
    size: NonNullable<UserCardProps["size"]>;
    align?: "left" | "center";
}

interface TypographyRoleProps extends SizeAlignProps{
  role: string;
}

export interface SocialLink {
  /** URL for the social media profile */
  url: string;
  /** Icon component to display (e.g., from react-icons, lucide-react, etc.) */
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  /** Accessible label for the social link */
  label: string;
  /** Optional platform name for identification */
  platform?: string;
}

interface TypographyNameProps extends SizeAlignProps{
  name?: string;
  username?: string;
  uppercase?: boolean;
}

interface TypographyBioProps extends SizeAlignProps{
  bio: string;
  lineClamp?: boolean;
}

export interface StatItem {
  /** Label for the stat (e.g., "Posts", "Followers") */
  label: string;
  /** Value for the stat */
  value: number | string;
  /** Optional icon component */
  icon?: React.ComponentType<{ className?: string }>;
}

export interface ActionButton {
  /** Button label */
  label: string;
  /** Button variant */
  variant?: "default" | "outline" | "ghost";
  /** Click handler */
  onClick?: () => void;
  /** Icon component */
  icon?: React.ComponentType<{ className?: string }>;
}

export interface UserCardProps  extends CardProps{
  /** User's avatar image URL */
  avatar?: string;
  /** User's full name */
  name: string;
  /** User's username/handle (e.g., "@username") */
  username?: string;
  /** User's role or job title */
  role?: string;
  /** User's bio or description */
  bio?: string;
  /** Social media links */
  socialLinks?: SocialLink[];
  /** Avatar size */
  avatarSize?: AvatarProps["size"];
  /** Avatar shape */
  avatarShape?: AvatarProps["shape"];
  /** Card variant */
  variant?: VariantProps<typeof userCardVariants>["variant"];
  /** Card size */
  size?: VariantProps<typeof userCardVariants>["size"];
  /** Layout orientation */
  orientation?: "vertical" | "horizontal";
  /** Show avatar border */
  avatarBordered?: boolean;
  /** Avatar status indicator */
  avatarStatus?: AvatarProps["status"];
  /** Fallback text for avatar (initials) */
  avatarFallback?: string;
  /** Header/banner image URL (for horizontal layout with banner) */
  headerImage?: string;
  /** Enable advanced design features */
  advanced?: boolean;
  /** Stats/metrics to display */
  stats?: StatItem[];
  /** Show verification badge */
  verified?: boolean;
  /** Show premium badge */
  premium?: boolean;
  /** Custom badge text */
  badge?: string;
  /** Action buttons (e.g., Follow, Message) */
  actions?: ActionButton[];
  /** Background pattern/gradient */
  backgroundPattern?: "gradient" | "dots" | "grid" | "waves" | "none";
}

/* -------------------------------------------------------------------------- */
/*                              VARIANTS                                      */
/* -------------------------------------------------------------------------- */
const userCardVariants = cva("", {
  variants: {
    variant: {
      default: "",
      elevated: "",
      glass: "",
      outline: "",
      minimal: "",
    },
    size: {
      sm: "",
      md: "",
      lg: "",
      xl: "",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "md",
  },
});

// Avatar size mapping (for Avatar component prop, not CSS classes)
const avatarSizeMap: Record<
  NonNullable<UserCardProps["size"]>,
  AvatarProps["size"]
> = {
  sm: "3xl",
  md: "4xl",
  lg: "4xl",
  xl: "5xl",
};

// Name size variants
const nameSizeVariants = cva("font-semibold text-foreground mb-1 break-words w-full", {
  variants: {
    size: {
      sm: "text-lg",
      md: "text-xl",
      lg: "text-2xl",
      xl: "text-3xl"
    },
  },
  defaultVariants: {
    size: "md",
  },
});

// Role size variants
const roleSizeVariants = cva("mb-2 break-words w-full", {
  variants: {
    size: {
      sm: "text-sm",
      md: "text-base",
      lg: "text-lg",
      xl: "text-xl"
    },
  },
  defaultVariants: {
    size: "md",
  },
});

// Bio size variants
const bioSizeVariants = cva("leading-relaxed mb-4 break-words w-full", {
  variants: {
    size: {
      sm: "text-xs",
      md: "text-sm",
      lg: "text-base",
      xl: "text-lg"
    },
  },
  defaultVariants: {
    size: "md",
  },
});

// Social icon size variants
const socialIconSizeVariants = cva("fill-current", {
  variants: {
    size: {
      sm: "w-4 h-4",
      md: "w-5 h-5",
      lg: "w-6 h-6",
      xl: "w-7 h-7"
    },
  },
  defaultVariants: {
    size: "md",
  },
});

// Social link spacing variants
const socialLinkSpacingVariants = cva("flex items-center justify-center", {
  variants: {
    size: {
      sm: "gap-2",
      md: "gap-3",
      lg: "gap-4",
      xl: "gap-5"
    },
  },
  defaultVariants: {
    size: "md",
  },
});

// Vertical social link spacing variants (for horizontal layout)
const verticalSocialLinkSpacingVariants = cva("flex flex-col items-center", {
  variants: {
    size: {
      sm: "gap-2",
      md: "gap-3",
      lg: "gap-4",
      xl: "gap-5"
    },
  },
  defaultVariants: {
    size: "md",
  },
});

// Card max width variants
const cardMaxWidthVariants = cva("w-full", {
  variants: {
    size: {
      sm: "max-w-xs",
      md: "max-w-sm",
      lg: "max-w-md",
      xl: "max-w-lg"
    },
  },
  defaultVariants: {
    size: "md",
  },
});

// Avatar margin bottom variants
const avatarMarginBottomVariants = cva("", {
  variants: {
    size: {
      sm: "mb-2",
      md: "mb-3",
      lg: "mb-4",
      xl: "mb-5"
    },
  },
});

/* -------------------------------------------------------------------------- */
/*                          STATS DISPLAY COMPONENT                          */
/* -------------------------------------------------------------------------- */
interface StatsDisplayProps {
  stats: StatItem[];
  size: NonNullable<UserCardProps["size"]>;
  orientation?: "vertical" | "horizontal";
}

const StatsDisplay: React.FC<StatsDisplayProps> = memo(({ stats, size, orientation = "vertical" }) => {
  if (!stats || stats.length === 0) return null;

  const containerClass = useMemo(
    () => cn(
      "flex",
      orientation === "horizontal" 
        ? "flex-row gap-2 sm:gap-3 md:gap-4 flex-wrap" 
        : "flex-col gap-2",
      "w-full"
    ),
    [orientation]
  );

  const statItemClass = useMemo(
    () => cn(
      "flex items-center gap-2",
      orientation === "horizontal" ? "flex-1" : "justify-between"
    ),
    [orientation]
  );

  const valueSizeClass = useMemo(() => {
    switch (size) {
      case "sm": return "text-base font-bold";
      case "md": return "text-lg font-bold";
      case "lg": return "text-xl font-bold";
      case "xl": return "text-2xl font-bold";
      default: return "text-lg font-bold";
    }
  }, [size]);

  const labelSizeClass = useMemo(() => {
    switch (size) {
      case "sm": return "text-xs";
      case "md": return "text-sm";
      case "lg": return "text-base";
      case "xl": return "text-lg";
      default: return "text-sm";
    }
  }, [size]);

  return (
    <div className={containerClass}>
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div key={index} className={statItemClass}>
            {Icon && <Icon className="w-4 h-4 text-muted-foreground" />}
            <div className="flex flex-col">
              <span className={cn(valueSizeClass, "text-foreground")}>
                {typeof stat.value === "number" ? stat.value.toLocaleString() : stat.value}
              </span>
              <span className={cn(labelSizeClass, "text-muted-foreground")}>
                {stat.label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
});

StatsDisplay.displayName = "StatsDisplay";

/* -------------------------------------------------------------------------- */
/*                          VERIFICATION BADGE                                */
/* -------------------------------------------------------------------------- */
interface VerificationBadgeProps {
  verified?: boolean;
  premium?: boolean;
  badge?: string;
  size?: NonNullable<UserCardProps["size"]>;
}

const VerificationBadge: React.FC<VerificationBadgeProps> = memo(({ verified, premium, badge, size = "md" }) => {
  const iconSize = useMemo(() => {
    switch (size) {
      case "sm": return "w-3 h-3";
      case "md": return "w-4 h-4";
      case "lg": return "w-5 h-5";
      case "xl": return "w-6 h-6";
      default: return "w-4 h-4";
    }
  }, [size]);

  if (verified) {
    return (
      <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
        <CheckCircle2 className={iconSize} />
        <span className="text-xs font-medium">Verified</span>
      </div>
    );
  }

  if (premium) {
    return (
      <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gradient-to-r from-yellow-400/20 to-orange-400/20 text-yellow-600 dark:text-yellow-400 border border-yellow-500/20">
        <Star className={iconSize} />
        <span className="text-xs font-medium">Premium</span>
      </div>
    );
  }

  if (badge) {
    return (
      <div className="inline-flex items-center px-2 py-1 rounded-full bg-muted text-muted-foreground border border-border">
        <span className="text-xs font-medium">{badge}</span>
      </div>
    );
  }

  return null;
});

VerificationBadge.displayName = "VerificationBadge";

/* -------------------------------------------------------------------------- */
/*                             COMMON COMPONENT                               */
/* -------------------------------------------------------------------------- */
const SocialLinks:React.FC<SocialLinksProps> = memo(({ socialLinks, name, size, isHorizontal = false }) => {
  const spacingVariants = useMemo(
    () => isHorizontal ? verticalSocialLinkSpacingVariants : socialLinkSpacingVariants,
    [isHorizontal]
  );

  const containerClassName = useMemo(
    () => cn(
      spacingVariants({ size }),
      isHorizontal ? "shrink-0" : "justify-center w-full"
    ),
    [spacingVariants, size, isHorizontal]
  );

  const linkClassName = useMemo(
    () => isHorizontal
      ? cn(
          "inline-flex justify-start items-end",
          "text-foreground hover:opacity-70",
          "transition-all duration-200",
          "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded",
          "dark:focus:ring-offset-background",
          "group-hover:scale-105 hover:scale-110"
        )
      : cn(
          "inline-flex items-center justify-center",
          "rounded-full p-2",
          "text-muted-foreground hover:text-foreground",
          "bg-muted/50 hover:bg-muted cursor-pointer",
          "transition-all duration-200",
          "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
          "dark:focus:ring-offset-background",
          "group-hover:scale-105 hover:scale-110"
        ),
    [isHorizontal]
  );

  if (socialLinks.length === 0) return null;

  return (
    <div
      className={containerClassName}
      role="list"
      aria-label="Social media links"
    >
      {socialLinks.map((link, index) => {
        const Icon = link.icon;
        const ariaLabel = link.label || `Visit ${link.platform || "social media"} profile for ${name}`;
        const key = link.platform ? `${link.platform}-${index}` : `social-link-${index}`;

        return (
          <a
            key={key}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={ariaLabel}
            className={linkClassName}
            role="listitem"
          >
            <Icon
              className={socialIconSizeVariants({ size })}
              aria-hidden={true}
            />
          </a>
        );
      })}
    </div>
  );
});

/* -------------------------------------------------------------------------- */
/*                          TYPOGRAPHY COMPONENTS                            */
/* -------------------------------------------------------------------------- */
const TypographyName = memo<TypographyNameProps>(({ name, size, align = "center", uppercase = false }) => {
  const className = useMemo(
    () => cn(
      nameSizeVariants({ size }),
      align === "left" ? "text-left" : "text-center",
      uppercase && "uppercase font-bold tracking-tight mb-1"
    ),
    [size, align, uppercase]
  );

  return (
    <h2 className={className}>
      {name}
    </h2>
  );
});

const TypographyUsername = memo<TypographyNameProps>(({ username, size, align = "center" }) => {
  const displayUsername = useMemo(
    () => username?.startsWith("@") ? username : `@${username}`,
    [username]
  );

  const className = useMemo(
    () => cn(
      "text-left mb-2",
      roleSizeVariants({ size }),
      align === "center" && "text-center"
    ),
    [size, align]
  );

  return (
    <Typography variant="body-small" color="muted" className={className}>
      {displayUsername}
    </Typography>
  );
});


const TypographyBio = memo<TypographyBioProps>(({ bio, size, align = "center", lineClamp = false }) => {
  const className = useMemo(
    () => cn(
      bioSizeVariants({ size }),
      align === "left" ? "text-left leading-relaxed" : "text-center leading-relaxed mb-4",
      lineClamp && "line-clamp-3"
    ),
    [size, align, lineClamp]
  );

  return (
    <Typography variant="body-small" color="muted" className={className}>
      {bio}
    </Typography>
  );
});

const TypographyRole = memo<TypographyRoleProps>(({ role, size, align = "center" }) => {
  const className = useMemo(
    () => cn(
      "text-left mt-1",
      roleSizeVariants({ size }),
      align === "center" && "text-center mb-2"
    ),
    [size, align]
  );

  return (
    <Typography variant="body-small" color="muted" className={className}>
      {role}
    </Typography>
  );
});

/* -------------------------------------------------------------------------- */
/*                              USER CARD COMPONENT                          */
/* -------------------------------------------------------------------------- */
const UserCardContent = React.forwardRef<HTMLDivElement, UserCardProps>(
  (
    {
      avatar,
      name,
      username,
      role,
      bio,
      socialLinks = [],
      avatarSize,
      avatarShape = "circle",
      variant = "default",
      size = "md",
      orientation = "vertical",
      avatarBordered = false,
      avatarStatus,
      avatarFallback,
      headerImage,
      advanced = false,
      stats,
      verified,
      premium,
      badge,
      actions,
      backgroundPattern = "none",
      className,
      ...props
    },
    ref
  ) => {
    const resolvedSize = size ?? "md"
    const resolvedAvatarSize = useMemo(
      () => avatarSize || avatarSizeMap[resolvedSize],
      [avatarSize, resolvedSize]
    );
    // Advanced design is restricted to vertical orientation only
    const isAdvanced = advanced || stats !== undefined || verified || premium || badge || actions !== undefined;
    const isHorizontal = orientation === "horizontal" && !isAdvanced;

    // Background pattern classes
    const backgroundPatternClass = useMemo(() => {
      if (!isAdvanced || backgroundPattern === "none") return "";
      switch (backgroundPattern) {
        case "gradient":
          return "bg-gradient-to-br from-primary/5 via-secondary/5 to-primary/5";
        case "dots":
          return "relative before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_1px_1px,rgb(148,163,184)_1px,transparent_0)] before:bg-[length:20px_20px] before:opacity-10";
        case "grid":
          return "relative before:absolute before:inset-0 before:bg-[linear-gradient(rgba(148,163,184,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.1)_1px,transparent_1px)] before:bg-[length:20px_20px]";
        default:
          return "";
      }
    }, [isAdvanced, backgroundPattern]);

    const initials = useMemo(() => {
      if (avatarFallback) return avatarFallback;
      const words = name.trim().split(/\s+/);
      if (words.length >= 2) {
        return `${words[0][0]}${words[1][0]}`.toUpperCase();
      }
      return name.slice(0, 2).toUpperCase();
    }, [avatarFallback, name]);

    // Horizontal layout - enhanced with advanced features
    if (isHorizontal) {
      return (
        <Card
          ref={ref}
          variant={variant}
          className={cn(
            cardMaxWidthVariants({ size: resolvedSize }),
            "w-full h-full group max-w-2xl",
            headerImage ? "flex flex-col overflow-hidden" : "flex flex-row items-center p-6 gap-6",
            className
          )}
          {...props}
        >
          {/* Header Image Banner (optional) - Lazy loaded */}
          {headerImage && (
            <div className="relative w-full h-32 overflow-hidden">
              <img
                src={headerImage}
                alt={`${name}'s header banner`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          )}

          {/* Main Content Row */}
          <div className={cn(
            "flex flex-row items-center gap-6",
            headerImage ? "p-6 pt-0" : ""
          )}>
            {/* Avatar on left */}
            <div className={cn(
              "shrink-0 relative",
              "rounded-2xl p-2",
              headerImage && "-mt-8 relative z-10",
              resolvedSize === "sm" && "w-24 h-24",
              resolvedSize === "md" && "w-32 h-32",
              resolvedSize === "lg" && "w-40 h-40",
              resolvedSize === "xl" && "w-48 h-48"
            )}>
              <div className="w-full h-full flex items-center justify-center">
                <Avatar
                  src={avatar}
                  alt={`${name}'s avatar`}
                  size={resolvedAvatarSize}
                  shape={avatarShape}
                  status={avatarStatus}
                  letters={!avatar ? initials : undefined}
                  className="transition-transform duration-300 ease-in-out group-hover:scale-110"
                />
              </div>
            </div>

            {/* Details in middle */}
            <div className="flex-1 min-w-0 flex flex-col justify-center">
              {/* Name */}
              <TypographyName name={name} size={resolvedSize} align="left" />

              {/* Username */}
              {username && (
                <TypographyUsername username={username} size={resolvedSize} align="left" />
              )}

              {/* Role */}
              {role && (
                <TypographyRole role={role} size={resolvedSize} align="left" />
              )}

              {/* Bio */}
              {bio && (
                <TypographyBio bio={bio} size={resolvedSize} align="left" />
              )}
            </div>

            {/* Social Links on right */}
            <div className="shrink-0">
              <SocialLinks
                socialLinks={socialLinks}
                name={name}
                size={resolvedSize}
                isHorizontal={true}
              />
            </div>
          </div>
        </Card>
      );
    }

    // Vertical layout - enhanced with advanced features
    return (
      <Card
        ref={ref}
        variant={variant}
        className={cn(
          cardMaxWidthVariants({ size: resolvedSize }),
          "w-full h-full flex flex-col group relative overflow-hidden",
          isAdvanced && backgroundPatternClass,
          className
        )}
        {...props}
      >
        {/* Header Image (for advanced mode) */}
        {isAdvanced && headerImage && (
          <div className="relative w-full h-64 overflow-hidden">
            <img
              src={headerImage}
              alt={`${name}'s header banner`}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
          </div>
        )}

        <CardHeader
          variant="default"
          className={cn(
            "flex flex-col items-center text-center relative",
            isAdvanced && headerImage && "pt-0 -mt-16"
          )}
        >
          {/* Avatar with advanced styling */}
          <div className={cn(
            "relative",
            avatarMarginBottomVariants({ size: resolvedSize })
          )}>
            {/* Gradient border wrapper */}
            {isAdvanced && (
              <div className={cn(
                "absolute inset-0 rounded-full p-0.5",
              )}>
                <div className="w-full h-full rounded-full bg-background" />
              </div>
            )}
            <Avatar
              src={avatar}
              alt={`${name}'s avatar`}
              size={resolvedAvatarSize}
              shape={avatarShape}
              bordered={avatarBordered || (!!isAdvanced)}
              status={avatarStatus}
              letters={!avatar ? initials : undefined}
              className={cn(
                "mx-auto transition-transform duration-300 ease-in-out group-hover:scale-110 relative z-10")}/>
            {/* Glow effect */}
            {isAdvanced && (
              <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl -z-10 animate-pulse" />
            )}
          </div>

          {/* Verification Badge */}
          {(verified || premium || badge) && (
            <div className="mb-2">
              <VerificationBadge verified={verified} premium={premium} badge={badge} size={resolvedSize} />
            </div>
          )}
        </CardHeader>

        <CardContent
          variant="default"
          className="flex flex-col items-center text-center w-full flex-1"
        >
          {/* Name */}
          <TypographyName name={name} size={resolvedSize} align="center" />

          {/* Username */}
          {username && (
            <TypographyUsername username={username} size={resolvedSize} align="center" />
          )}

          {/* Role */}
          {role && !username && (
            <TypographyRole role={role} size={resolvedSize} align="center" />
          )}

          {/* Bio */}
          {bio && (
            <TypographyBio bio={bio} size={resolvedSize} align="center" lineClamp />
          )}

          {/* Stats */}
          {isAdvanced && stats && stats.length > 0 && (
            <div className="w-full my-4 px-4 py-3 rounded-lg bg-muted/50 border border-border">
              <StatsDisplay stats={stats} size={resolvedSize} orientation="horizontal" />
            </div>
          )}

          {/* Action Buttons */}
          {isAdvanced && actions && actions.length > 0 && (
            <div className="flex flex-wrap gap-2 w-full justify-center mb-4">
              {actions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <Button
                    key={index}
                    variant={action.variant || "default"}
                    size="sm"
                    onClick={action.onClick}
                  >
                    {Icon && <Icon className="w-4 h-4" />}
                    {action.label}
                  </Button>
                );
              })}
            </div>
          )}

          {/* Social Links */}
          <SocialLinks
            socialLinks={socialLinks}
            name={name}
            size={resolvedSize}
            isHorizontal={false}
          />
        </CardContent>
      </Card>
    );
  }
);

export const UserCard: React.FC<UserCardProps> = (props) => {
  return (
    <UserCardContent {...props} />
  )
}

UserCard.displayName = "UserCard";

