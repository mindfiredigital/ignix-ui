import React, { useState, createContext, useContext, useMemo, useCallback, memo, useEffect } from "react";
import { ChevronLeft, ChevronRight, Heart, ShoppingCartIcon } from "lucide-react";
import { cn } from "../../../utils/cn";
import { Typography } from "@ignix-ui/typography";
import { Rating } from "@ignix-ui/rating";
import { ButtonWithIcon } from "@ignix-ui/buttonwithicon";
import { Card, CardContent } from "@ignix-ui/card";


/* -------------------------------------------------------------------------- */
/*                              CONTEXT                                       */
/* -------------------------------------------------------------------------- */
interface ProductCardContextValue {
  isFavorite: boolean;
  setIsFavorite: (value: boolean) => void;
  selectedSize: string | null;
  setSelectedSize: (value: string | null) => void;
  selectedThumbnail: number | null;
  setSelectedThumbnail: (value: number | null) => void;
  size?: "sm" | "md" | "lg";
  toastMessage: string | null;
  setToastMessage: (message: string | null) => void;
  onFavorite?: () => void;
  onAddToCart?: () => void;
}

const ProductCardContext = createContext<ProductCardContextValue | null>(null);

const useProductCardContext = () => {
  const context = useContext(ProductCardContext);
  if (!context) {
    throw new Error("ProductCard sub-components must be used within ProductCard component");
  }
  return context;
};

/* -------------------------------------------------------------------------- */
/*                              INTERFACE                                     */
/* -------------------------------------------------------------------------- */
export interface ClassProps {
  className?: string;
}

export interface ProductCardProps extends ClassProps{
  children: React.ReactNode;
  layout?: "vertical" | "horizontal";
  size?: "sm" | "md" | "lg";
  onFavorite?: () => void;
  onAddToCart?: () => void;
}

export interface ProductCardImageProps extends ClassProps{
  src: string;
  alt: string;
  images?: string[]; // Optional array of images for thumbnail switching
}

export interface ProductCardDiscountProps extends ClassProps{
  discount?: number;
  originalPrice?: number;
  currentPrice?: number;
  className?: string;
}

export interface ProductCardTagProps extends ClassProps{
  text?: string;
}

export interface ProductCardChildrenProps extends ClassProps{
  children?: React.ReactNode;
}

export interface ProductCardPriceProps extends ClassProps{
  currentPrice: number;
  originalPrice?: number;
}

export interface ProductCardSizesProps extends ClassProps{
  sizes: string[];
}

export interface ProductCardRatingProps extends ClassProps{
  value: number;
  max?: number;
  showValue?: boolean;
  outOf?: number;
}

export interface ProductCardPromoProps extends ClassProps{
  code: string;
  text?: string;
}

export interface ProductCardThumbnailsProps extends ClassProps{
  images: string[];
}

/* -------------------------------------------------------------------------- */
/*                              HELPER FUNCTIONS                              */
/* -------------------------------------------------------------------------- */
/**
 * Safely extracts the displayName from a React element type
 */
const getComponentDisplayName = (element: React.ReactElement): string => {
  if (typeof element.type === 'string') {
    return element.type;
  }
  if (typeof element.type === 'function') {
    return (element.type as React.ComponentType & { displayName?: string })?.displayName || '';
  }
  if (element.type && typeof element.type === 'object' && 'displayName' in element.type) {
    return (element.type as { displayName?: string })?.displayName || '';
  }
  return '';
};

/* -------------------------------------------------------------------------- */
/*                              SUB-COMPONENTS                                */
/* -------------------------------------------------------------------------- */
export const ProductCardImage: React.FC<ProductCardImageProps> = memo(({
  src,
  alt,
  images,
  className,
}) => {
  const { selectedThumbnail } = useProductCardContext();
  
  // Use selected thumbnail image if available, otherwise use the main src
  const displayImage = useMemo(() => {
    return images && selectedThumbnail !== null && images[selectedThumbnail]
      ? images[selectedThumbnail]
      : src;
  }, [images, selectedThumbnail, src]);

  return (
    <div className="relative w-full h-full overflow-hidden">
      <img
        src={displayImage}
        alt={alt}
        key={displayImage} // Force re-render on image change
        className={cn(
          "w-full h-full object-cover transition-all duration-500 ease-out group-hover:scale-110 group-hover:brightness-110 will-change-transform",
          className
        )}
      />
      {/* Subtle overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/0 via-transparent to-transparent opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none" />
    </div>
  );
});

ProductCardImage.displayName = "ProductCardImage";

export const ProductCardDiscount: React.FC<ProductCardDiscountProps> = memo(({
  discount,
  originalPrice,
  currentPrice,
}) => {
  const discountPercentage = useMemo(
    () =>
      discount ||
      (originalPrice && currentPrice
        ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
        : 0),
    [discount, originalPrice, currentPrice]
  );

  if (discountPercentage <= 0) return null;
  return (
    <div className="relative bg-gradient-to-br from-red-500 via-red-600 to-red-700 text-white text-xs font-extrabold px-3 py-1.5 rounded-lg shadow-xl shadow-red-500/40 border border-white/30 backdrop-blur-sm whitespace-nowrap w-15">
        <span className="relative z-30">-{discountPercentage}%</span>
    </div>
  );
});

ProductCardDiscount.displayName = "ProductCardDiscount";

export const ProductCardWishlist: React.FC <ClassProps> = memo(({
  className,
}) => {
  const { isFavorite, setIsFavorite, onFavorite, setToastMessage } = useProductCardContext();

  const handleClick = useCallback(() => {
    const newFavoriteState = !isFavorite;
    setIsFavorite(newFavoriteState);
    onFavorite?.();
    
    // Show toast notification
    setToastMessage(newFavoriteState ? "Item added to Wishlist" : "Item removed from Wishlist");
  }, [isFavorite, setIsFavorite, onFavorite, setToastMessage]);

  return (
    <button
      onClick={handleClick}
      className={cn(
        "absolute top-3 right-3 z-10 p-3 rounded-full transition-all duration-300 bg-white/98 hover: shadow-xl hover:shadow-2xl backdrop-blur-sm border-2 border-gray-200/60 hover:scale-110 active:scale-95 group/btn cursor-pointer",
        isFavorite && "bg-gradient-to-br from-red-500 via-red-600 to-red-700 hover:from-red-600 hover:via-red-700 hover:to-red-800 shadow-red-500/40 border-red-400/30",
        className
      )}
      aria-label="Add to favorites"
    >
      <Heart
        className={cn(
          "w-5 h-5 transition-all duration-300",
          isFavorite 
            ? "text-white fill-white scale-110 drop-shadow-lg" 
            : "text-gray-700 group-hover/btn:text-red-500 group-hover/btn:scale-110"
        )}
      />
    </button>
  );
});

ProductCardWishlist.displayName = "ProductCardWishlist";

export const ProductCardTag: React.FC<ProductCardTagProps> = memo(({
  text = "Best Seller",
  className,
}) => {
  return (
    <Typography
      variant="caption" 
      className={cn(
        "px-3 py-1.5  bg-white/95 backdrop-blur-sm rounded-full text-xs font-bold text-gray-800 uppercase tracking-wide shadow-lg border border-gray-200/60 transition-all duration-300 hover:shadow-xl hover:scale-105 whitespace-nowrap",
        className
      )}
    >
      {text}
    </Typography>
  );
});

ProductCardTag.displayName = "ProductCardTag";

export const ProductCardTitle: React.FC<ProductCardChildrenProps> = memo(({
  children,
  className,
}) => {
  const { size } = useProductCardContext();
  
  const titleSizeClasses = useMemo(() => ({
    sm: "text-base",
    md: "text-xl",
    lg: "text-2xl",
  }), []);

  return (
    <Typography className={cn(
      "font-bold line-clamp-2 min-h-[1.5rem] leading-tight tracking-tight transition-colors duration-200 hover:text-gray-700",
      titleSizeClasses[size || "sm"],
      className
    )}>
      {children}
    </Typography>
  );
});

ProductCardTitle.displayName = "ProductCardTitle";

export const ProductCardPrice: React.FC<ProductCardPriceProps> = memo(({
  currentPrice,
  originalPrice,
  className,
}) => {
  const { size } = useProductCardContext();

  const formatPrice = useCallback((price: number, currency = "$") => {
    return `${currency}${price.toFixed(2)}`;
  }, []);

  const priceSizeClasses = useMemo(() => ({
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
  }), []);

  return (
    <div className={cn("flex items-baseline gap-2.5", className)}>
      <span className={cn(
        "font-bold",
        priceSizeClasses[size || "sm"]
      )}>
        {formatPrice(currentPrice)}
      </span>
      {originalPrice && originalPrice > currentPrice && (
        <span className="text-sm text-gray-400 line-through font-medium">
          {formatPrice(originalPrice)}
        </span>
      )}
    </div>
  );
});

ProductCardPrice.displayName = "ProductCardPrice";

export const ProductCardSizes: React.FC<ProductCardSizesProps> = memo(({
  sizes,
  className,
}) => {
  const { selectedSize, setSelectedSize } = useProductCardContext();

  const handleSizeClick = useCallback((size: string) => {
    setSelectedSize(size);
  }, [setSelectedSize]);

  if (sizes.length === 0) return null;

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <span className="text-sm font-semibold">Size:</span>
      <div className="flex gap-2">
        {sizes.map((size) => (
          <button
            key={size}
            onClick={() => handleSizeClick(size)}
            className={cn(
              "w-9 h-9 rounded-lg border-2 text-sm font-bold transition-all duration-200",
              "shadow-sm hover:shadow-lg cursor-pointer",
              selectedSize === size
                ? "border-gray-900 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white shadow-lg scale-110 ring-2 ring-gray-900/20"
                : "border-gray-300 hover:border-gray-500 hover:scale-105  hover:bg-gray-50"
            )}
            aria-label={`Select size ${size}`}
          >
            {size}
          </button>
        ))}
      </div>
    </div>
  );
});

ProductCardSizes.displayName = "ProductCardSizes";

export const ProductCardRating: React.FC<ProductCardRatingProps> = memo(({
  value,
  max = 5,
  showValue = true,
  outOf,
  className,
}) => {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <Rating allowHalf value={value} max={max} size="xs" readOnly />
      {showValue && outOf !== undefined && (
        <span className="text-xs text-gray-500 font-semibold">
          ({outOf})
        </span>
      )}
    </div>
  );
});

ProductCardRating.displayName = "ProductCardRating";

export const ProductCardButton: React.FC<ProductCardChildrenProps> = memo(({
  children = "Add To Cart",
  className,
}) => {
  const { onAddToCart, setToastMessage } = useProductCardContext();

  const handleClick = useCallback(() => {
    onAddToCart?.();
    
    // Show toast notification
    setToastMessage("Item added to Cart");
  }, [onAddToCart, setToastMessage]);

  return (
    <ButtonWithIcon
      onClick={handleClick}
      icon={<ShoppingCartIcon className="w-4 h-4"/>}
      size={"md"}
      className={cn(
        "relative overflow-hidden bg-gradient-to-r from-[#E78A30] via-[#E78A30] to-[#D67A20] hover:from-[#D67A20] hover:via-[#D67A20] hover:to-[#C66A10] text-white font-bold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 border border-orange-400/30 before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/0 before:via-white/20 before:to-white/0 before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700 rounded-lg cursor-pointer",
        className
      )}
    >
      <span className="relative z-10">{children}</span>
    </ButtonWithIcon>
  );
});

ProductCardButton.displayName = "ProductCardButton";

export const ProductCardPromo: React.FC<ProductCardPromoProps> = memo(({
  code,
  text,
  className,
}) => {
  const promoText = useMemo(() => {
    return text ? `${text} ` : "";
  }, [text]);

  return (
    <div className={cn(
      "mt-3 relative overflow-hidden",
      "bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800 text-white",
      "px-5 py-3 rounded-xl text-sm font-bold text-center",
      "shadow-xl shadow-purple-500/30 border-2 border-purple-400/30",
      "transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/40 hover:scale-[1.02]",
      "before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/0 before:via-white/10 before:to-white/0 before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700",
      className
    )}>
      <span className="relative z-10">{promoText}#{code} 20% Off</span>
    </div>
  );
});

ProductCardPromo.displayName = "ProductCardPromo";

export const ProductCardThumbnails: React.FC<ProductCardThumbnailsProps> = memo(({
  images,
  className,
}) => {
  const { selectedThumbnail, setSelectedThumbnail } = useProductCardContext();

  const VISIBLE_COUNT = 3;
  const [visibleStart, setVisibleStart] = useState(0);

  const canScrollLeft = visibleStart > 0;
  const canScrollRight = visibleStart + VISIBLE_COUNT < images.length;

  const handlePrev = useCallback(() => {
    setVisibleStart((prev) => Math.max(prev - 1, 0));
  }, []);

  const handleNext = useCallback(() => {
    setVisibleStart((prev) =>
      Math.min(prev + 1, images.length - VISIBLE_COUNT)
    );
  }, [images.length]);

  const visibleImages = images.slice(
    visibleStart,
    visibleStart + VISIBLE_COUNT
  );

  if (!images || images.length === 0) return null;

  return (
    <div className={cn(
      "flex items-center justify-center gap-2 px-3 py-2 bg-gray-50/50",
      className
    )}>
      {/* Left Arrow */}
      {images.length > VISIBLE_COUNT && (
        <button
          onClick={handlePrev}
          disabled={!canScrollLeft}
          className={cn(
            "p-3 rounded-full text-sm font-bold transition",
            canScrollLeft
              ? "hover:bg-gray-100 cursor-pointer"
              : "opacity-40 cursor-not-allowed"
          )}
          aria-label="Previous thumbnails"
        >
          <ChevronLeft className="w-4 h-4"/>
        </button>
      )}

      {/* Thumbnails */}
      <div className="flex gap-2">
        {visibleImages.map((image, index) => {
          const actualIndex = visibleStart + index;

          return (
            <button
              key={actualIndex}
              onClick={() => setSelectedThumbnail(actualIndex)}
              className={cn(
                "w-14 h-14 rounded-lg overflow-hidden border-2 transition-all duration-200",
                selectedThumbnail === actualIndex
                  ? "border-gray-900 ring-2 ring-gray-900/20 shadow-lg scale-105"
                  : "border-gray-300 hover:border-gray-500 hover:scale-105"
              )}
              aria-label={`View thumbnail ${actualIndex + 1}`}
            >
              <img
                src={image}
                alt={`Thumbnail ${actualIndex + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          );
        })}
      </div>

      {/* Right Arrow */}
      {images.length > VISIBLE_COUNT && (
        <button
          onClick={handleNext}
          disabled={!canScrollRight}
          className={cn(
            "p-2 rounded-full text-sm font-bold transition",
            canScrollRight
              ? "hover:bg-gray-100 cursor-pointer"
              : "opacity-40 cursor-not-allowed"
          )}
          aria-label="Next thumbnails"
        >
          <ChevronRight className="w-4 h-4"/>
        </button>
      )}
    </div>
  );
});


ProductCardThumbnails.displayName = "ProductCardThumbnails";

export const ProductCardSubHeading: React.FC<ProductCardChildrenProps> = memo(({
  children,
  className,
}) => {
  const { size } = useProductCardContext();
  
  const SubProductCardSubHeadingSizeClasses = useMemo(() => ({
    sm: "text-base",
    md: "text-xl",
    lg: "text-2xl",
  }), []);

  return (
    <Typography className={cn("font-semibold text-gray-500 line-clamp-2 leading-tight tracking-tight transition-colors duration-200 hover:text-gray-700",
      SubProductCardSubHeadingSizeClasses[size || "sm"],
      className
    )}>
      {children}
    </Typography>
  );
});

ProductCardSubHeading.displayName = "ProductCardSubHeading";

export const ProductCardContent: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = memo(({ children, className }) => {
  const { size } = useProductCardContext();

  const contentPaddingClasses = useMemo(() => ({
    sm: "p-2 space-y-2",
    md: "p-2 space-y-3",
    lg: "p-4 space-y-4",
  }), []);

  return (
    <CardContent
      variant="default" 
      className={cn(
        contentPaddingClasses[size || "sm"],
        className
      )}
    >
      {children}
    </CardContent>
  );
});

ProductCardContent.displayName = "ProductCardContent";

export const ProductCardHeader: React.FC<ProductCardChildrenProps> = memo(({
  children,
  className,
}) => {
  // Memoize children processing
  const processedChildren = useMemo(() => {
    // Separate discount, tag, thumbnails, favorite, category, and image from other children
    const discountChildren: React.ReactNode[] = [];
    const tagChildren: React.ReactNode[] = [];
    const thumbnailChildren: React.ReactNode[] = [];
    const favoriteChildren: React.ReactNode[] = [];
    const categoryChildren: React.ReactNode[] = [];
    const imageChildren: React.ReactNode[] = [];
    const otherChildren: React.ReactNode[] = [];

    // First pass: extract thumbnail images
    let thumbnailImages: string[] | null = null;
    React.Children.forEach(children, (child) => {
      if (React.isValidElement(child)) {
        const componentName = getComponentDisplayName(child);
        if (componentName === "ProductCardThumbnails") {
          const props = child.props as ProductCardThumbnailsProps;
          if (props.images && props.images.length > 0) {
            thumbnailImages = props.images;
          }
        }
      }
    });

    // Second pass: separate children
    React.Children.forEach(children, (child) => {
      if (React.isValidElement(child)) {
        const componentName = getComponentDisplayName(child);
        if (componentName === "ProductCardDiscount") {
          discountChildren.push(child);
        } else if (componentName === "ProductCardTag") {
          tagChildren.push(child);
        } else if (componentName === "ProductCardThumbnails") {
          thumbnailChildren.push(child);
        } else if (componentName === "ProductCardWishlist") {
          favoriteChildren.push(child);
        } else if (componentName === "ProductCardSubHeading") {
          categoryChildren.push(child);
        } else if (componentName === "ProductCardImage") {
          // Inject images prop if thumbnails exist
          if (thumbnailImages) {
            imageChildren.push(
              React.cloneElement(child as React.ReactElement<ProductCardImageProps>, {
                images: thumbnailImages,
              })
            );
          } else {
            imageChildren.push(child);
          }
        } else {
          otherChildren.push(child);
        }
      } else {
        otherChildren.push(child);
      }
    });

    return {
      discountChildren,
      tagChildren,
      thumbnailChildren,
      favoriteChildren,
      categoryChildren,
      imageChildren,
      otherChildren,
    };
  }, [children]);

  const {
    discountChildren,
    tagChildren,
    thumbnailChildren,
    favoriteChildren,
    categoryChildren,
    imageChildren,
    otherChildren,
  } = processedChildren;

  return (
    <>
      <div className={cn(
        "relative w-full aspect-square overflow-hidden",
        "bg-gradient-to-br from-gray-50 via-white to-gray-50",
        "group",
        className
      )}>
        {imageChildren.length > 0 ? imageChildren : otherChildren}
        {(discountChildren.length > 0 || tagChildren.length > 0) && (
          <div className="absolute top-3 left-3 z-10 flex flex-col gap-2.5">
            {tagChildren}
            {discountChildren}
          </div>
        )}
        {favoriteChildren}
      </div>
      {thumbnailChildren.length > 0 && thumbnailChildren}
      {categoryChildren.length > 0 && categoryChildren}
    </>
  );
});

ProductCardHeader.displayName = "ProductCardHeader";

export const ProductCardFooter: React.FC<ProductCardChildrenProps> = memo(({
  children,
  className,
}) => {
  const { size } = useProductCardContext();

  const footerPaddingClasses = useMemo(() => ({
    sm: "px-3 py-2 gap-2",
    md: "px-5 py-4 gap-4",
    lg: "px-6 py-5 gap-5",
  }), []);

  return (
    <div className={cn(
      "flex items-center justify-between dark:text-white border-t border-gray-100",
      footerPaddingClasses[size || "sm"],
      className
    )}>
      {children}
    </div>
  );
});

ProductCardFooter.displayName = "ProductCardFooter";

/* -------------------------------------------------------------------------- */
/*                              MAIN COMPONENT                                */
/* -------------------------------------------------------------------------- */
export const ProductCard: React.FC<ProductCardProps> = ({
  children,
  size = "sm",
  onFavorite,
  onAddToCart,
  className,
}) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedThumbnail, setSelectedThumbnail] = useState<number | null>(0); // Initialize to 0 for first thumbnail
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Auto-hide toast after 3 seconds
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const contextValue = useMemo<ProductCardContextValue>(
    () => ({
      isFavorite,
      setIsFavorite,
      selectedSize,
      setSelectedSize,
      selectedThumbnail,
      setSelectedThumbnail,
      size,
      toastMessage,
      setToastMessage,
      onFavorite,
      onAddToCart,
    }),
    [
      isFavorite,
      selectedSize,
      selectedThumbnail,
      size,
      toastMessage,
      onFavorite,
      onAddToCart,
    ]
  );

  // Size-based styling
  const sizeClasses = useMemo(
    () => ({
      sm: "max-w-xs",
      md: "max-w-sm",
      lg: "max-w-md",
    }),
    []
  );

  // Memoize children processing
  const processedChildren = useMemo(() => {
    // Separate components by type
    const headerChildren: React.ReactNode[] = [];
    const footerChildren: React.ReactNode[] = [];
    const imageChildren: React.ReactNode[] = [];
    const discountChildren: React.ReactNode[] = [];
    const favoriteChildren: React.ReactNode[] = [];
    const tagChildren: React.ReactNode[] = [];
    const thumbnailChildren: React.ReactNode[] = [];
    const categoryChildren: React.ReactNode[] = [];
    const contentChildren: React.ReactNode[] = [];
    const promoChildren: React.ReactNode[] = [];

    // First pass: extract thumbnail images
    let thumbnailImages: string[] | null = null;
    React.Children.forEach(children, (child) => {
      if (React.isValidElement(child)) {
        const componentName = getComponentDisplayName(child);
        if (componentName === "ProductCardThumbnails") {
          const props = child.props as ProductCardThumbnailsProps;
          if (props.images && props.images.length > 0) {
            thumbnailImages = props.images;
          }
        }
      }
    });

    // Second pass: process all children
    React.Children.forEach(children, (child) => {
    if (React.isValidElement(child)) {
      const componentName = getComponentDisplayName(child);
      if (componentName === "ProductCardHeader") {
        headerChildren.push(child);
      } else if (componentName === "ProductCardFooter" || componentName === "ProductFooter") {
        footerChildren.push(child);
      } else if (componentName === "ProductCardImage") {
        if (thumbnailImages) {
          imageChildren.push(
            React.cloneElement(child as React.ReactElement<ProductCardImageProps>, {
              images: thumbnailImages,
            })
          );
        } else {
          imageChildren.push(child);
        }
      } else if (componentName === "ProductCardDiscount") {
        discountChildren.push(child);
      } else if (componentName === "ProductCardWishlist") {
        favoriteChildren.push(child);
      } else if (componentName === "ProductCardTag") {
        tagChildren.push(child);
      } else if (componentName === "ProductCardThumbnails") {
        thumbnailChildren.push(child);
      } else if (componentName === "ProductCardPromo") {
        promoChildren.push(child);
      } else {
        contentChildren.push(child);
      }
    } else {
      contentChildren.push(child);
    }
    });

    const hasImage = imageChildren.length > 0;
    const hasHeader = headerChildren.length > 0;
    const hasFooter = footerChildren.length > 0;

    return {
      headerChildren,
      footerChildren,
      imageChildren,
      discountChildren,
      favoriteChildren,
      tagChildren,
      thumbnailChildren,
      categoryChildren,
      contentChildren,
      promoChildren,
      hasImage,
      hasHeader,
      hasFooter,
    };
  }, [children]);

  const {
    headerChildren,
    footerChildren,
    imageChildren,
    discountChildren,
    favoriteChildren,
    tagChildren,
    thumbnailChildren,
    categoryChildren,
    contentChildren,
    promoChildren,
    hasImage,
    hasHeader,
    hasFooter,
  } = processedChildren;

  return (
    <ProductCardContext.Provider value={contextValue}>
      <div className={cn("w-full relative", sizeClasses[size], className)}>
        <Card 
          variant="default" 
          interactive="hover" 
          className={cn("overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200/60 rounded-2xl hover:-translate-y-1")}>
          {/* Header Section */}
          {hasHeader ? (
            headerChildren
          ) : hasImage ? (
            <>
              <div className="relative w-full aspect-square overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-50 group">
                {imageChildren}
                {(discountChildren.length > 0 || tagChildren.length > 0) && (
                  <div className="absolute top-3 left-3 z-10 flex flex-col gap-2.5">
                    {tagChildren}
                    {discountChildren}
                  </div>
                )}
                {favoriteChildren}
              </div>
              {thumbnailChildren.length > 0 && thumbnailChildren}
              {categoryChildren.length > 0 && categoryChildren}
            </>
          ) : null}

          {/* Content */}
          {contentChildren.length > 0 && (
            <ProductCardContent>
              {contentChildren}
            </ProductCardContent>
          )}

          {/* Footer Section */}
          {hasFooter && footerChildren}
        </Card>

        {/* Promo Banner */}
        {promoChildren.length > 0 && promoChildren}

        {/* Toast Notification */}
        {toastMessage && (
        <div className={cn("fixed z-50 bottom-4 right-4 sm:bottom-5 sm:right-5 pointer-events-none")}>
          <div className={cn("px-3 py-2.5 rounded-lg shadow-2xl border border-gray-200 font-semibold text-xs sm:text-sm backdrop-blur-sm min-w-[160px] sm:min-w-[200px] max-w-[calc(100vw-2rem)] transition-all duration-300 ease-out")}>
            {toastMessage}
          </div>
        </div>
      )}
      </div>
    </ProductCardContext.Provider>
  );
};

ProductCard.displayName = "ProductCard";
