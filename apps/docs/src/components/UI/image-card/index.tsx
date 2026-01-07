import React, { useState, useEffect, useCallback, type ComponentType } from "react"
import { ImageIcon, Tag, type LucideProps } from "lucide-react"
import { cva, type VariantProps } from "class-variance-authority"
import { Typography } from "../typography"
import { LazyLoad } from "../lazyload"
import { AspectRatio } from "../aspect-ratio"
import { cn } from "@site/src/utils/cn"


/* -------------------------------------------------------------------------- */
/*                              INTERFACE                                     */
/* -------------------------------------------------------------------------- */
export interface CardLink {
  label?: string
  href?: string
  icon?: ComponentType<LucideProps>
  ariaLabel?: string
  onClick?: () => void
}

interface ImageCardProps {
  image?: string
  title: string
  description?: string
  layout?: "overlay" | "below"
  button?: string | CardLink | CardLink[]
  variant?: VariantProps<typeof ImageCardVariant>["variant"]
  size?: "sm" | "md" | "lg" | "xl"
  category?: string
  error?: boolean
  categoryIcon?: React.ReactNode
  className?: string
  onAction?: () => void
  mode?: "card" | "image" | "media"
  mediaPosition?: "left" | "right" | "top"
}

/* -------------------------------------------------------------------------- */
/*                              VARIANTS                                      */
/* -------------------------------------------------------------------------- */
const ImageCardVariant = cva("", {
  variants: {
    variant: {
      dark: "bg-gradient-to-r from-zinc-700 via-zinc-900 to-black text-white",
      default: "bg-gradient-to-r from-blue-500 to-cyan-500 text-white",
      light: "bg-white text-black",
      green: "bg-gradient-to-r from-emerald-500 to-teal-600 text-white",
      purple: "bg-gradient-to-r from-purple-500 to-pink-500 text-white",
      red: "bg-gradient-to-r from-rose-500 to-red-600 text-white",
      orange: "bg-gradient-to-r from-orange-500 to-amber-500 text-white",
      pink: "bg-gradient-to-r from-pink-500 to-fuchsia-500 text-white",
      elegant: "bg-gradient-to-r from-slate-600 to-slate-800 text-white",
      vibrant: "bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 text-white",
      ocean: "bg-gradient-to-r from-cyan-500 to-blue-600 text-white",
      sunset: "bg-gradient-to-r from-orange-400 via-pink-500 to-red-500 text-white",
      forest: "bg-gradient-to-r from-green-600 to-emerald-700 text-white",
      minimal: "bg-slate-100 text-slate-900 border border-slate-200",
      royal: "bg-gradient-to-r from-indigo-600 to-purple-700 text-white",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

const ImageCardSizeVariant = cva("", {
  variants: {
    size: {
      sm: "max-w-md",
      md: "max-w-lg",
      lg: "max-w-xl",
      xl: "max-w-2xl",
    },
  },
  defaultVariants: {
    size: "md",
  },
})

const ImageCardBelowLayoutSizeVariant = cva("", {
  variants: {
    size: {
      sm: "max-w-xl",
      md: "max-w-2xl",
      lg: "max-w-3xl",
      xl: "max-w-3xl",
    },
  },
  defaultVariants: {
    size: "md",
  },
})

const ImageCardMediaSizeVariant = cva("", {
  variants: {
    size: {
      sm: "w-40",
      md: "w-48",
      lg: "w-64",
      xl: "w-100",
    },
  },
  defaultVariants: {
    size: "md",
  },
})

const ImageCardContentSizeVariant = cva("", {
  variants: {
    size: {
      sm: "p-5",
      md: "p-6",
      lg: "p-10",
      xl: "p-12",
    },
  },
  defaultVariants: {
    size: "md",
  },
})

const ImageCardTitleSizeVariant = cva("", {
  variants: {
    size: {
      sm: "text-lg",
      md: "text-2xl",
      lg: "text-3xl",
      xl: "text-4xl",
    },
  },
  defaultVariants: {
    size: "md",
  },
})

const ImageCardDescriptionSizeVariant = cva("", {
  variants: {
    size: {
      sm: "text-sm",
      md: "text-md",
      lg: "text-lg",
      xl: "text-xl",
    },
  },
  defaultVariants: {
    size: "md",
  },
})

const ImageCardCategorySizeVariant = cva("", {
  variants: {
    size: {
      sm: "px-3 py-1 text-xs",
      md: "px-4 py-1 text-sm",
      lg: "px-5 py-1.5 text-base",
      xl: "px-6 py-2 text-lg",
    },
  },
  defaultVariants: {
    size: "md",
  },
})

const ImageCardIconSizeVariant = cva("", {
  variants: {
    size: {
      sm: "w-3 h-3",
      md: "w-4 h-4",
      lg: "w-5 h-5",
      xl: "w-6 h-6",
    },
  },
  defaultVariants: {
    size: "md",
  },
})

const ImageCardMediaIconSizeVariant = cva("", {
  variants: {
    size: {
      sm: "w-5 h-5",
      md: "w-6 h-6",
      lg: "w-7 h-7",
      xl: "w-8 h-8",
    },
  },
  defaultVariants: {
    size: "md",
  },
})

// Mapping variant to title hover color
const getTitleHoverColor = cva("", {
  variants: {
    variant: {
      dark: "group-hover:text-zinc-300",
      default: "group-hover:text-blue-500",
      light: "group-hover:text-black",
      green: "group-hover:text-emerald-500",
      purple: "group-hover:text-purple-500",
      pink: "group-hover:text-pink-500",
      red: "group-hover:text-rose-500",
      orange: "group-hover:text-orange-500",
      elegant: "group-hover:text-slate-400",
      vibrant: "group-hover:text-purple-500",
      ocean: "group-hover:text-cyan-500",
      sunset: "group-hover:text-pink-500",
      forest: "group-hover:text-green-500",
      minimal: "group-hover:text-slate-700",
      royal: "group-hover:text-indigo-500",
    }
  },
  defaultVariants: {
    variant: "default",
  }
})

// Mapping variant to link hover color (individual hover, not group hover)
const getLinkHoverColor = cva("", {
  variants: {
    variant: {
      dark: "hover:text-zinc-300",
      default: "hover:text-blue-500",
      light: "hover:text-black",
      green: "hover:text-emerald-500",
      purple: "hover:text-purple-500",
      pink: "hover:text-pink-500",
      red: "hover:text-rose-500",
      orange: "hover:text-orange-500",
      elegant: "hover:text-slate-400",
      vibrant: "hover:text-purple-500",
      ocean: "hover:text-cyan-500",
      sunset: "hover:text-pink-500",
      forest: "hover:text-green-500",
      minimal: "hover:text-slate-700",
      royal: "hover:text-indigo-500",
    }
  },
  defaultVariants: {
    variant: "default",
  }
})

// Mapping variant to icon fill and stroke color on hover
const getIconHoverColor = cva("", {
  variants: {
    variant: {
      dark: "group-hover/link:stroke-zinc-300 group-hover/link:fill-zinc-300",
      default: "group-hover/link:stroke-blue-500 group-hover/link:fill-blue-500",
      light: "group-hover/link:stroke-black group-hover/link:fill-black",
      green: "group-hover/link:stroke-emerald-500 group-hover/link:fill-emerald-500",
      purple: "group-hover/link:stroke-purple-500 group-hover/link:fill-purple-500",
      pink: "group-hover/link:stroke-pink-500 group-hover/link:fill-pink-500",
      red: "group-hover/link:stroke-rose-500 group-hover/link:fill-rose-500",
      orange: "group-hover/link:stroke-orange-500 group-hover/link:fill-orange-500",
      elegant: "group-hover/link:stroke-slate-400 group-hover/link:fill-slate-400",
      vibrant: "group-hover/link:stroke-purple-500 group-hover/link:fill-purple-500",
      ocean: "group-hover/link:stroke-cyan-500 group-hover/link:fill-cyan-500",
      sunset: "group-hover/link:stroke-pink-500 group-hover/link:fill-pink-500",
      forest: "group-hover/link:stroke-green-500 group-hover/link:fill-green-500",
      minimal: "group-hover/link:stroke-slate-700 group-hover/link:fill-slate-700",
      royal: "group-hover/link:stroke-indigo-500 group-hover/link:fill-indigo-500",
    }
  },
  defaultVariants: {
    variant: "default",
  }
})

const getMediaIconHoverColor = cva("", {
  variants: {
    variant: {
      dark: "group-hover:stroke-zinc-300 group-hover:fill-zinc-300",
      default: "group-hover:stroke-blue-500 group-hover:fill-blue-500",
      light: "group-hover:stroke-black group-hover:fill-black",
      green: "group-hover:stroke-emerald-500 group-hover:fill-emerald-500",
      purple: "group-hover:stroke-purple-500 group-hover:fill-purple-500",
      pink: "group-hover:stroke-pink-500 group-hover:fill-pink-500",
      red: "group-hover:stroke-rose-500 group-hover:fill-rose-500",
      orange: "group-hover:stroke-orange-500 group-hover:fill-orange-500",
      elegant: "group-hover:stroke-slate-400 group-hover:fill-slate-400",
      vibrant: "group-hover:stroke-purple-500 group-hover:fill-purple-500",
      ocean: "group-hover:stroke-cyan-500 group-hover:fill-cyan-500",
      sunset: "group-hover:stroke-pink-500 group-hover:fill-pink-500",
      forest: "group-hover:stroke-green-500 group-hover:fill-green-500",
      minimal: "group-hover:stroke-slate-700 group-hover:fill-slate-700",
      royal: "group-hover:stroke-indigo-500 group-hover:fill-indigo-500",
    }
  },
  defaultVariants: {
    variant: "default",
  }
})

/* -------------------------------------------------------------------------- */
/*                              Card Content Action                           */
/* -------------------------------------------------------------------------- */
export const CardContentAction: React.FC<ImageCardProps> = React.memo(({
  category,
  variant,
  size,
  categoryIcon,
  title,
  description,
  layout = "overlay",
  onAction,
  error,
  button,
  mediaPosition
  }) => {
  const isOverlay = layout === "overlay";
  
  const handleClick = useCallback(() => {
    onAction?.();
  }, [onAction])

  const links = React.useMemo<CardLink[]>(() => {
    if (!button) return []

    if (typeof button === "string") {
      return [{ label: button, onClick: handleClick }]
    }

    if (Array.isArray(button)) {
      return button
    }

    return [button]
  }, [button, handleClick])


  return (
    <>
    {category && (
      <span className={cn(
        "inline-flex items-center gap-2 mb-3 font-semibold tracking-wider uppercase rounded-full",
        ImageCardVariant({ variant }),
        ImageCardCategorySizeVariant({ size }),
        isOverlay 
          ? error
          ? "opacity-100 transition-opacity duration-500 delay-100"
          : "opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100"
          : ""
      )}>
        {categoryIcon ? (
          <span className={ImageCardIconSizeVariant({ size })}>{categoryIcon}</span>
        ) : (
          <Tag className={ImageCardIconSizeVariant({ size })} />
        )}
        {category}
      </span>
    )}
    <Typography 
      variant={isOverlay ? "h3" : "h2"} 
      className={cn(
        "mb-2 transition-colors duration-300",
        ImageCardTitleSizeVariant({ size }),
        isOverlay
          ? error
            ? "font-bold drop-shadow-lg text-slate-900"
            : "font-bold drop-shadow-lg text-white"
          : cn("font-semibold text-slate-900", getTitleHoverColor({ variant }))
      )}
    >
      {title}
    </Typography>
    <Typography variant="body-small" className={cn(
      "leading-relaxed",
      ImageCardDescriptionSizeVariant({ size }),
      isOverlay 
        ? error
          ? "opacity-100 transition-opacity duration-500 delay-150 line-clamp-2 mb-3 text-slate-900"
        :"text-white/90 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-150 line-clamp-2 mb-3"
        : "text-slate-600 line-clamp-3 mb-4"
    )}>
      {description}
    </Typography>
    {links.length > 0 && (
      <div className={cn("flex items-center gap-4", mediaPosition !== "top" ? "min-h-[80px] mt-auto": "min-h-[60px] mt-auto")}>
        {links.map((link, idx) => {
          const isIconOnly = !link.label && link.icon
          return (
            <a
              key={idx}
              href={link.href}
              onClick={link.onClick}
              aria-label={link.ariaLabel || link.label}
              role="button"
              className={cn(
                "change-color inline-flex items-center gap-2 font-semibold cursor-pointer group/link",
                "transition-all duration-300",
                isOverlay
                  ? error
                    ? "opacity-100"
                    : "opacity-0 group-hover:opacity-100"
                  : "",
                getLinkHoverColor({ variant }),
                isIconOnly && "p-2 rounded-full hover:bg-white/10"
              )}
            >
              {/* TEXT LINK */}
              {link.label && <span>{link.label}</span>}

              {/* ICON LINK */}
              {link.icon && (
                <link.icon
                  className={cn(
                    "w-5 h-5 fill-none",
                    getIconHoverColor({ variant }),
                  )}
                />
              )}

            </a>
          )
        })}
      </div>
    )}
    </>
  )
}
)

/* -------------------------------------------------------------------------- */
/*                              Image Content Content                         */
/* -------------------------------------------------------------------------- */
const ImageCardContent: React.FC<ImageCardProps> = ({
  image,
  title,
  description,
  variant = "default",
  size = "md",
  layout = "overlay",
  category,
  categoryIcon,
  className = "",
  onAction,
  button,
  mode,
  mediaPosition = "top"
}) => {
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);
  const [imageError, setImageError] = useState<boolean>(false);

  // Reset image state when image prop changes
  useEffect(() => {
    setImageLoaded(false);
    setImageError(false);
  }, [image]);

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
  }, []);

  const handleImageError = useCallback(() => {
    setImageError(true);
  }, []);

  // When layout is "below" we also allow positioning the media left/right similar to media mode
  const isSideBySideBelowLayout =
    mode !== "media" &&
    layout === "below" &&
    (mediaPosition === "left" || mediaPosition === "right");

  if (isSideBySideBelowLayout) {
    const isLeft = mediaPosition === "left";

    return (
      <div
        className={cn(
          "group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-500",
          ImageCardBelowLayoutSizeVariant({size}),
          "flex flex-col sm:flex-row",
          isLeft ? "" : "sm:flex-row-reverse",
          className
        )}
      >
        {/* IMAGE */}
        <div className="relative overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 sm:w-1/2">
          {image && !imageError ? (
            <LazyLoad
              threshold="0px"
              animation="fade"
              once={false}
              placeholder={
                <AspectRatio ratio="4:3">
                  <div className="flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
                    <ImageIcon className="w-16 h-16 text-slate-400 animate-pulse" />
                  </div>
                </AspectRatio>
              }
            >
              <AspectRatio ratio="1:1">
                <img
                  src={image}
                  alt={title}
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                  className={cn(
                    "transition-all duration-700",
                    imageLoaded
                      ? "opacity-100 scale-100 group-hover:scale-110"
                      : "opacity-0 scale-95"
                  )}
                />
              </AspectRatio>
            </LazyLoad>
          ) : (
            <AspectRatio ratio="4:3">
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
                <div className="text-center">
                  <ImageIcon className="w-16 h-16 mx-auto text-slate-400 animate-pulse" />
                  <p className="mt-2 text-sm text-slate-500">No image</p>
                </div>
              </div>
            </AspectRatio>
          )}
        </div>

        {/* CONTENT */}
        <div className={cn("sm:w-1/2 mt-5 flex flex-col h-full", ImageCardContentSizeVariant({ size }))}>
          <CardContentAction
            title={title}
            description={description}
            variant={variant}
            size={size}
            layout="below"
            categoryIcon={categoryIcon}
            category={category}
            onAction={onAction}
            button={button}
            mediaPosition={mediaPosition}
          />
        </div>
      </div>
    );
  }

  if (mode === "media") {
    const isLeft = mediaPosition === "left"
    const isTop = mediaPosition === "top"

    const mediaImage = (
      <div
        className={cn(
          "rounded-xl overflow-hidden shrink-0",
          isTop ? "w-full" : ImageCardMediaSizeVariant({size})
        )}
      >
        <AspectRatio ratio={isTop ? "16:9" : "1"}>
          {image ? (
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover hover:scale-110"
            />
          ) : (
            <div className="flex items-center justify-center bg-slate-100">
              <ImageIcon className="w-8 h-8 text-slate-400" />
            </div>
          )}
        </AspectRatio>
      </div>
    )

    const mediaContent = (
      <div className="flex-1 gap-6">
        <Typography variant="h3" className="mb-1">
          {title}
        </Typography>

        {description && (
          <Typography variant="body-small" className="text-slate-600 mb-4">
            {description}
          </Typography>
        )}

        {/* CONTROLS */}
        {Array.isArray(button) && (
          <div className={cn("flex items-center gap-3", mediaPosition !== "top" ? "min-h-[40px] mt-auto": "min-h-[60px] mt-auto")}>
            {button.map((link, idx) => {
              const Icon = link.icon
              const Element = link.href ? "a" : "button"

              return (
                <Element
                  key={idx}
                  href={link.href}
                  onClick={link.onClick}
                  aria-label={link.ariaLabel}
                  role="button"
                  className={cn(
                    "group p-2 rounded-full transition",
                    "hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  )}
                >
                  {Icon && (
                  <Icon
                    className={cn(
                      ImageCardMediaIconSizeVariant({ size }),
                      // default (not hovered)
                      "stroke-current fill-none",
                      // hover = selected variant
                      "group-hover:fill-current group-hover:stroke-none",
                      // smooth animation
                      "transition-all duration-200",
                      // variant color on hover
                      getMediaIconHoverColor({ variant })
                    )}
                  />
                  )}
                </Element>
              )
            })}
          </div>
        )}
      </div>
    )

    return (
      <div
        className={cn(
          "rounded-2xl bg-white shadow-md p-4",
          ImageCardSizeVariant({ size }),
          isTop ? "flex flex-col gap-4" : "flex items-center gap-6",
          className
        )}
      >
        {isTop ? (
          <>
            {mediaImage}
            {mediaContent}
          </>
        ) : (
          <>
            {isLeft && mediaImage}
            {mediaContent}
            {!isLeft && mediaImage}
          </>
        )}
      </div>
    )
  }

  return (
    <>
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-500",
        ImageCardSizeVariant({ size }),
        className
      )}
    >
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200">
        {image && !imageError ? (
          <LazyLoad
            threshold="0px"
            animation="fade"
            once={false}
            placeholder={
              <AspectRatio ratio="4:3">
                <div className="flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
                  <ImageIcon className="w-16 h-16 text-slate-400 animate-pulse" />
                </div>
              </AspectRatio>
            }
          >
            <AspectRatio ratio="4:3">
              <img
                src={image}
                alt={title}
                onLoad={handleImageLoad}
                onError={handleImageError}
                className={cn(
                  "transition-all duration-700",
                  imageLoaded
                    ? "opacity-100 scale-100 group-hover:scale-110"
                    : "opacity-0 scale-95"
                )}
              />
            </AspectRatio>
          </LazyLoad>
        ) : (
          <>
          <AspectRatio ratio="4:3">
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
              <div className="text-center">
                <ImageIcon className="w-16 h-16 mx-auto text-slate-400 animate-pulse" />
                <p className="mt-2 text-sm text-slate-500">No image</p>
              </div>
            </div>
          </AspectRatio>
          {layout === "overlay" && (
            <div className={ImageCardContentSizeVariant({ size })}>
              <CardContentAction 
                title={title} 
                description={description} 
                variant={variant} 
                size={size} 
                layout="overlay"
                categoryIcon={categoryIcon} 
                category={category}
                onAction={onAction}
                error={imageError}
                button={button}
                mediaPosition={mediaPosition}
              />
            </div>
          )}
          </>
        )}

        {layout === "overlay" && !imageError && (
          <>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className={cn(
              "absolute bottom-0 left-0 right-0 text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500",
              ImageCardContentSizeVariant({ size })
            )}>
              <CardContentAction 
                title={title} 
                description={description} 
                variant={variant} 
                size={size} 
                layout="overlay"
                categoryIcon={categoryIcon} 
                category={category}
                onAction={onAction}
                button={button}
                mediaPosition={mediaPosition}
              />
            </div>
          </>
        )}
      </div>

      {layout === "below" && (
        <div className={ImageCardContentSizeVariant({ size })}>
          <CardContentAction 
            title={title} 
            description={description} 
            variant={variant} 
            size={size} 
            layout="below"
            categoryIcon={categoryIcon} 
            category={category}
            onAction={onAction}
            button={button}
            mediaPosition={mediaPosition}
          />
        </div>
      )}
    </div>
    </>
  );
}

export const ImageCard:React.FC<ImageCardProps> = (props) => { 
  return( <ImageCardContent {...props} /> ) 
}
