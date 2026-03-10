"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { cn } from "@site/src/utils/cn";

/* -------------------------------------------------------------------------- */
/*                                  INTERFACE                                 */
/* -------------------------------------------------------------------------- */

export type CarouselAnimation = "none" | "fade" | "slide" | "scale" | "slideUp" | "slideDown" | "slideLeft" | "slideRight";

export interface CarouselContentItemProps extends ClassProps{
  children: React.ReactNode;
}

export interface CarouselContentProps extends CarouselContentItemProps {
  split?: boolean;
}

export interface SizeProps {
  size?: "sm" | "md" | "lg";
}

export interface ClassProps {
  className?: string;
}

export interface CarouselDotsProps extends ClassProps, SizeProps{
  variant?: "dots" | "lines";
  position?: "top" | "bottom" | "left" | "right";
}

export interface CarouselNavigationProps extends ClassProps, SizeProps{
  variant?: "default" | "outline" | "ghost";
}

export interface CarouselCommonProps {
  autoPlay?: boolean;
  loop?: boolean;
  animation?: CarouselAnimation;
  transitionDuration?: number;
}

export interface CarouselProps extends CarouselContentItemProps, CarouselCommonProps{
  interval?: number;
  pauseOnHover?: boolean;
  showDots?: boolean;
}

export interface CarouselThumbnailsProps extends ClassProps, SizeProps, CarouselCommonProps{
  thumbnails: string[];
  position?: "top" | "bottom" | "left" | "right";
  variant?: "default" | "outline" | "minimal";
}

interface CarouselContextValue extends CarouselCommonProps{
  containerRef: React.RefObject<HTMLDivElement | null>;
  index: number;
  setIndex: React.Dispatch<React.SetStateAction<number>>;
  slideCount: number; 
  setSlideCount: React.Dispatch<React.SetStateAction<number>>;
  pageCount: number;
  dotsPosition?: "top" | "bottom" | "left" | "right";
  setDotsPosition: React.Dispatch<React.SetStateAction<"top" | "bottom" | "left" | "right" | undefined>>;  
  interval?: number;
  isPaused?: boolean;
  goToSlide: (slideIndex: number) => void;
  goToNext: () => void;
  goToPrevious: () => void;
  animation?: CarouselAnimation;
  split?: boolean;
  setSplit: React.Dispatch<React.SetStateAction<boolean>>;
  isMobile?: boolean;
  carouselId: string;
}

/* -------------------------------------------------------------------------- */
/*                                  CONSTANTS                                 */
/* -------------------------------------------------------------------------- */

// Width percentage for split mode carousel items (non-mobile)
// 48% or 50% = 2 items per page, 33.3333% = 3 items per page
const SPLIT_MODE_WIDTH_PERCENTAGE = 48;

/* -------------------------------------------------------------------------- */
/*                                  CONTEXT                                   */
/* -------------------------------------------------------------------------- */

const CarouselContext = React.createContext<CarouselContextValue | null>(null);

function useCarousel() {
  const ctx = React.useContext(CarouselContext);
  if (!ctx) {
    throw new Error("Carousel components must be used inside <Carousel />");
  }
  return ctx;
}

/* -------------------------------------------------------------------------- */
/*                                   ROOT                                     */
/* -------------------------------------------------------------------------- */

export const Carousel: React.FC<CarouselProps> = ({
  children,
  className,
  autoPlay = false,
  interval = 4000,
  pauseOnHover = true,
  loop = true,
  transitionDuration = 500,
  animation = "none",
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [index, setIndex] = React.useState(0);
  const [slideCount, setSlideCount] = React.useState(0);
  const [isPaused, setIsPaused] = React.useState(false);
  const [dotsPosition, setDotsPosition] = React.useState<"top" | "bottom" | "left" | "right" | undefined>(undefined);
  const isTransitioningRef = React.useRef(false);

  const [split, setSplit] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(false);
  
  // Generate unique ID for this carousel instance
  const carouselIdRef = React.useRef<string>(`carousel-${Math.random().toString(36).substr(2, 9)}`);
  const carouselId = carouselIdRef.current;

  // Detect mobile device
  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };
    
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Calculate items per page based on width percentage
  // Width is set in CarouselItem: 48% or 50% = 2 items, 33.3333% = 3 items
  const getItemsPerPage = React.useCallback(() => {
    if (!split) return 1;
    if (isMobile) return 1;
    // Calculate based on width percentage used in CarouselItem
    // For 48% or 50% width, we can fit 2 items per page
    // For 33.3333% width, we can fit 3 items per page
    if (SPLIT_MODE_WIDTH_PERCENTAGE >= 48 && SPLIT_MODE_WIDTH_PERCENTAGE <= 50) {
      return 2;
    } else if (SPLIT_MODE_WIDTH_PERCENTAGE >= 33 && SPLIT_MODE_WIDTH_PERCENTAGE < 48) {
      return 3;
    }
    // Default fallback: calculate based on percentage
    return Math.floor(100 / SPLIT_MODE_WIDTH_PERCENTAGE);
  }, [split, isMobile]);

  const pageCount = React.useMemo(() => {
    const itemsPerPage = getItemsPerPage();
    return Math.ceil(slideCount / itemsPerPage);
  }, [slideCount, getItemsPerPage]);

  // Navigation functions
  const goToSlide = React.useCallback(
    (slideIndex: number) => {
      if (!containerRef.current || isTransitioningRef.current) return;

      let targetIndex = slideIndex;

      if (loop) {
        targetIndex = ((slideIndex % pageCount) + pageCount) % pageCount;
      } else {
        targetIndex = Math.max(0, Math.min(slideIndex, pageCount - 1));
      }

      const container = containerRef.current;
      const isVertical = dotsPosition === "left" || dotsPosition === "right";

      if (isVertical) {
        const height = container.offsetHeight;
        container.scrollTo({
          top: targetIndex * height,
          behavior: "smooth",
        });
      } else {
        const width = container.offsetWidth;
        const itemsPerPage = getItemsPerPage();
        
        if (split) {
          // In split mode, find the first item of the target page and scroll to its position
          // Use requestAnimationFrame to ensure DOM is fully laid out
          requestAnimationFrame(() => {
            const firstItemIndex = targetIndex * itemsPerPage;
            const items = container.querySelectorAll('[role="group"][aria-roledescription="slide"]');
            if (items[firstItemIndex]) {
              const targetItem = items[firstItemIndex] as HTMLElement;
              // Calculate scroll position: item's position relative to container + current scroll
              const containerRect = container.getBoundingClientRect();
              const itemRect = targetItem.getBoundingClientRect();
              // Item's left edge relative to container's left edge (in viewport coordinates)
              const itemLeftInViewport = itemRect.left - containerRect.left;
              // Add current scroll to get absolute scroll position
              const targetScrollLeft = container.scrollLeft + itemLeftInViewport;
              
              container.scrollTo({
                left: Math.max(0, targetScrollLeft),
                behavior: "smooth",
              });
            } else {
              // Fallback: calculate based on item width (may not account for gaps perfectly)
              const scrollAmount = width;
              container.scrollTo({
                left: targetIndex * scrollAmount,
                behavior: "smooth",
              });
            }
          });
        } else {
          // Non-split mode: scroll by page width
          const scrollAmount = width / itemsPerPage;
          container.scrollTo({
            left: targetIndex * scrollAmount,
            behavior: "smooth",
          });
        }
      }

      setIndex(targetIndex);
      isTransitioningRef.current = true;

      setTimeout(() => {
        isTransitioningRef.current = false;
      }, transitionDuration);
    },
    [loop, pageCount, transitionDuration, dotsPosition, split, isMobile, getItemsPerPage]
  );

  const goToNext = React.useCallback(() => {
    if (!containerRef.current || isTransitioningRef.current) return;

    if (loop) {
      goToSlide(index + 1);
    } else if (index < pageCount - 1) {
      goToSlide(index + 1);
    }
  }, [index, loop, pageCount, goToSlide]);

  const goToPrevious = React.useCallback(() => {
    if (!containerRef.current || isTransitioningRef.current) return;

    if (loop) {
      goToSlide(index - 1);
    } else if (index > 0) {
      goToSlide(index - 1);
    }
  }, [index, loop, goToSlide]);

  /* -------------------------------- AUTOPLAY ------------------------------- */
  React.useEffect(() => {
    if (!autoPlay || isPaused || pageCount <= 1) return;

    const id = setInterval(() => {
      goToNext();
    }, interval);

    return () => clearInterval(id);
  }, [autoPlay, isPaused, pageCount, interval, goToNext]);

  // Handle seamless looping with scroll position reset
  React.useEffect(() => {
    if (!containerRef.current || !loop || pageCount <= 1) return;

    const container = containerRef.current;
    const isVertical = dotsPosition === "left" || dotsPosition === "right";
    
    const handleScroll = () => {
      if (isTransitioningRef.current) return;

      if (isVertical) {
        const height = container.offsetHeight;
        const scrollTop = container.scrollTop;
        // For vertical carousel, each item is 100% height, so divide by height
        const currentPage = Math.round(scrollTop / height);

        // Reset position for seamless loop
        if (currentPage >= pageCount) {
          container.scrollTo({
            top: 0,
            behavior: "auto",
          });
          setIndex(0);
        } else if (currentPage < 0) {
          container.scrollTo({
            top: (pageCount - 1) * height,
            behavior: "auto",
          });
          setIndex(pageCount - 1);
        } else {
          setIndex(currentPage);
        }
      } else {
        const width = container.offsetWidth;
        const scrollLeft = container.scrollLeft;
        const itemsPerPage = getItemsPerPage();
        
        let currentPage: number;
        if (split) {
          // In split mode, determine page based on which item is at the left edge
          // Find the item whose left edge is closest to the container's left edge
          const items = container.querySelectorAll('[role="group"][aria-roledescription="slide"]');
          const containerRect = container.getBoundingClientRect();
          let leftmostItemIndex = 0;
          let minDistance = Infinity;
          
          items.forEach((item, idx) => {
            const itemElement = item as HTMLElement;
            const itemRect = itemElement.getBoundingClientRect();
            // Calculate item's position relative to container's left edge
            const itemLeftRelative = itemRect.left - containerRect.left;
            // We want the item that is at or closest to the left edge (within a threshold)
            // Prefer items that are at the left edge (0 or slightly positive)
            const distance = Math.abs(itemLeftRelative);
            if (distance < minDistance || (itemLeftRelative >= 0 && itemLeftRelative < 10)) {
              minDistance = distance;
              leftmostItemIndex = idx;
            }
          });
          
          // Calculate which page this item belongs to
          currentPage = Math.floor(leftmostItemIndex / itemsPerPage);
        } else {
          // Non-split mode: calculate based on scroll amount
          const scrollAmount = width / itemsPerPage;
          currentPage = Math.round(scrollLeft / scrollAmount);
        }

        // Reset position for seamless loop
        if (currentPage >= pageCount) {
          container.scrollTo({
            left: 0,
            behavior: "auto",
          });
          setIndex(0);
        } else if (currentPage < 0) {
          if (split) {
            // In split mode, find the last page's first item
            const items = container.querySelectorAll('[role="group"][aria-roledescription="slide"]');
            const lastPageFirstItemIndex = (pageCount - 1) * itemsPerPage;
            if (items[lastPageFirstItemIndex]) {
              const targetItem = items[lastPageFirstItemIndex] as HTMLElement;
              const containerRect = container.getBoundingClientRect();
              const itemRect = targetItem.getBoundingClientRect();
              const itemLeftInViewport = itemRect.left - containerRect.left;
              const targetScrollLeft = container.scrollLeft + itemLeftInViewport;
              container.scrollTo({
                left: Math.max(0, targetScrollLeft),
                behavior: "auto",
              });
            } else {
              container.scrollTo({
                left: (pageCount - 1) * width,
                behavior: "auto",
              });
            }
          } else {
            const scrollAmount = width / itemsPerPage;
            container.scrollTo({
              left: (pageCount - 1) * scrollAmount,
              behavior: "auto",
            });
          }
          setIndex(pageCount - 1);
        } else {
          setIndex(currentPage);
        }
      }
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, [loop, pageCount, dotsPosition, split, isMobile, getItemsPerPage]);

  const hasOverflowVisible = className?.includes("overflow-visible");

  // Add style for mobile button layout to keep buttons in same row
  React.useEffect(() => {
    if (!isMobile) return;
    
    const styleId = "carousel-mobile-buttons-style";
    let styleElement = document.getElementById(styleId);
    
    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = styleId;
      document.head.appendChild(styleElement);
    }
    
    styleElement.textContent = `
      @media (max-width: 767px) {
        [role="region"][aria-label="Carousel"] {
          display: block !important;
          text-align: center;
        }
        [role="region"][aria-label="Carousel"] > button[aria-label*="slide"],
        [role="region"][aria-label="Carousel"] > button[aria-label*="Previous"],
        [role="region"][aria-label="Carousel"] > button[aria-label*="Next"] {
          display: inline-flex !important;
          vertical-align: middle;
        }
      }
    `;

    return () => {
      if (!isMobile) {
        const element = document.getElementById(styleId);
        if (element) {
          element.remove();
        }
      }
    };
  }, [isMobile]);

  return (
    <CarouselContext.Provider
      value={{
        containerRef,
        index,
        setIndex,
        slideCount,
        setSlideCount,
        pageCount,
        dotsPosition,
        setDotsPosition,
        loop,
        autoPlay,
        interval,
        isPaused,
        animation,
        transitionDuration,
        goToSlide,
        goToNext,
        goToPrevious,
        split,
        setSplit,
        isMobile,
        carouselId,
      }}
    >
      <div
        className={cn(
          "relative w-full",
          (hasOverflowVisible && animation === "none") || split
            ? "overflow-visible" 
            : "overflow-hidden",
          split && !isMobile && "px-12 sm:px-14",
          className
        )}
        onMouseEnter={(e) => {
          // Don't pause if hovering over navigation buttons or their children
          const target = e.target as HTMLElement;
          const isNavigationButton = target.closest('button[aria-label*="slide"]') || 
                                     target.closest('button[aria-label*="Previous"]') ||
                                     target.closest('button[aria-label*="Next"]') ||
                                     target.closest('button[aria-label*="Previous slide"]') ||
                                     target.closest('button[aria-label*="Next slide"]');
          if (!isNavigationButton && pauseOnHover) {
            setIsPaused(true);
          }
        }}
        onMouseMove={(e) => {
          // Also check on mouse move to handle cases where mouse enters from button
          const target = e.target as HTMLElement;
          const isNavigationButton = target.closest('button[aria-label*="slide"]') || 
                                     target.closest('button[aria-label*="Previous"]') ||
                                     target.closest('button[aria-label*="Next"]') ||
                                     target.closest('button[aria-label*="Previous slide"]') ||
                                     target.closest('button[aria-label*="Next slide"]');
          if (isNavigationButton && isPaused && pauseOnHover) {
            setIsPaused(false);
          }
        }}
        onMouseLeave={() => pauseOnHover && setIsPaused(false)}
        role="region"
        aria-label="Carousel"
        tabIndex={0}
      >
        {children}
      </div>
    </CarouselContext.Provider>
  );
}

/* -------------------------------------------------------------------------- */
/*                                  CONTENT                                   */
/* -------------------------------------------------------------------------- */

export const CarouselContent: React.FC<CarouselContentProps> = ({
  children,
  className,
  split = false,
}) => {
  const { containerRef, setSlideCount, dotsPosition, animation, index, setSplit, split: contextSplit, isMobile } = useCarousel();

  React.useEffect(() => {
    setSplit(split);
  }, [split, setSplit]);

  React.useEffect(() => {
    setSlideCount(React.Children.count(children));
  }, [children, setSlideCount]);

  const isVertical = React.useMemo(
    () => dotsPosition === "left" || dotsPosition === "right",
    [dotsPosition]
  );

  // Prevent mouse wheel scrolling
  const handleWheel = React.useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const childrenArray = React.Children.toArray(children);
  
  // Calculate visible items for animation with split mode
  const getVisibleItems = React.useMemo(() => {
    if (animation === "none") return null;
    
    const isSplitMode = contextSplit || split;
    if (!isSplitMode) {
      // Non-split mode: show only the active item
      return childrenArray.length > 0 
        ? [childrenArray[Math.min(index, childrenArray.length - 1)]] 
        : [];
    }
    
    // Split mode: show multiple items based on current page
    // Calculate itemsPerPage based on width percentage (48% = 2 items, 33.3333% = 3 items)
    const itemsPerPage = isMobile ? 1 : (SPLIT_MODE_WIDTH_PERCENTAGE >= 48 && SPLIT_MODE_WIDTH_PERCENTAGE <= 50 ? 2 : 3);
    const startIndex = index * itemsPerPage;
    const visibleItems: React.ReactNode[] = [];
    
    for (let i = 0; i < itemsPerPage && startIndex + i < childrenArray.length; i++) {
      visibleItems.push(childrenArray[startIndex + i]);
    }
    
    return visibleItems;
  }, [animation, contextSplit, split, isMobile, index, childrenArray]);

  return (
    <div
      ref={containerRef}
      onWheel={handleWheel}
      className={cn(
        "snap-mandatory scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]",
        animation !== "none" 
          ? "relative w-full overflow-hidden"
          : cn(
              "flex",
              isVertical 
                ? "flex-col h-full snap-y overflow-y-hidden w-full"
                : "flex-row w-full snap-x overflow-x-hidden"
            ),
        className
      )}
      style={
        animation !== "none"
          ? { position: 'relative' } as React.CSSProperties
          : isVertical 
            ? { height: '100%', minHeight: '100%' } 
            : { overflowX: 'hidden' } as React.CSSProperties
      }
      tabIndex={0}
      role="group"
      aria-label="Carousel content"
    >
      {animation !== "none" ? (
        <AnimatePresence mode="wait" initial={true}>
          {getVisibleItems && getVisibleItems.length > 0 && (
            <motion.div 
              key={`${index}-${animation}`}
              className={cn(
                "flex w-full",
                (contextSplit || split) && !isMobile ? "flex-row" : "flex-col"
              )}
              initial="initial"
              animate="animate"
              exit="exit"
              variants={{
                initial: { opacity: 0 },
                animate: { opacity: 1 },
                exit: { opacity: 0 },
              }}
              transition={{ duration: 0.3 }}
            >
              {getVisibleItems.map((child, i) => 
                React.isValidElement(child) 
                  ? React.cloneElement(child, { key: `item-${index}-${i}-${animation}` })
                  : child
              )}
            </motion.div>
          )}
        </AnimatePresence>
      ) : (
        children
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                                   ITEM                                     */
/* -------------------------------------------------------------------------- */

export const CarouselItem: React.FC<CarouselContentItemProps> = ({ 
  children, 
  className,
}) => {
  const { dotsPosition, animation = "none", transitionDuration = 500, split = false, isMobile = false, carouselId } = useCarousel();
  const itemRef = React.useRef<HTMLDivElement>(null);

  const isVertical = dotsPosition === "left" || dotsPosition === "right";

  const itemClass = `carousel-item-${carouselId}-${isVertical ? "vertical" : "horizontal"}`;
  
  React.useEffect(() => {
    const styleId = `carousel-item-style-${carouselId}-${isVertical ? "vertical" : "horizontal"}`;
    let styleElement = document.getElementById(styleId);
    
    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = styleId;
      document.head.appendChild(styleElement);
    }
    
    if (isVertical) {
      styleElement.textContent = `
        .${itemClass} {
          flex: 0 0 100%;
          min-height: 100%;
        }
      `;
    } else {
      const width = split ? (isMobile ? "100%" : `${SPLIT_MODE_WIDTH_PERCENTAGE}%`) : "100%";
      styleElement.textContent = `
        .${itemClass} {
          flex: 0 0 ${width};
          min-width: ${width};
          width: ${width};
        }
      `;
    }

    return () => {
      const elements = document.querySelectorAll(`.${itemClass}`);
      if (elements.length === 0) {
        const element = document.getElementById(styleId);
        if (element) {
          element.remove();
        }
      }
    };
  }, [itemClass, isVertical, split, isMobile, carouselId]);

  // Animation variants
  const getAnimationVariants = (): Variants => {
    switch (animation) {
      case "fade":
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
        };
      case "slide":
        return {
          initial: { x: isVertical ? 0 : 50, opacity: 0 },
          animate: { x: 0, opacity: 1 },
          exit: { x: isVertical ? 0 : -50, opacity: 0 },
        };
      case "scale":
        return {
          initial: { scale: 0.8, opacity: 0 },
          animate: { scale: 1, opacity: 1 },
          exit: { scale: 0.8, opacity: 0 },
        };
      case "slideUp":
        return {
          initial: { y: 30, opacity: 0 },
          animate: { y: 0, opacity: 1 },
          exit: { y: -30, opacity: 0 },
        };
      case "slideDown":
        return {
          initial: { y: -30, opacity: 0 },
          animate: { y: 0, opacity: 1 },
          exit: { y: 30, opacity: 0 },
        };
      case "slideLeft":
        return {
          initial: { x: 50, opacity: 0 },
          animate: { x: 0, opacity: 1 },
          exit: { x: -50, opacity: 0 },
        };
      case "slideRight":
        return {
          initial: { x: -50, opacity: 0 },
          animate: { x: 0, opacity: 1 },
          exit: { x: 50, opacity: 0 },
        };
      default:
        return {
          initial: {},
          animate: {},
          exit: {},
        };
    }
  };

  const variants = getAnimationVariants();
  
  const transition = {
    duration: transitionDuration / 1000,
    ease: [0.4, 0, 0.2, 1] as [number, number, number, number],
  };

  const baseClasses = cn(
    itemClass,
    animation === "none" 
      ? "snap-start flex-grow-0 shrink-0 transition-transform duration-500 ease-in-out"
      : split 
        ? "relative flex-shrink-0" // Width controlled by style element in split mode
        : "relative w-full",
    className
  );

  const baseProps = {
    className: baseClasses,
    role: "group" as const,
    "aria-roledescription": "slide" as const,
  };

  if (animation === "none") {
    return (
      <div ref={itemRef} {...baseProps}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={itemRef}
      {...baseProps}
      initial="initial"
      animate="animate"
      exit="exit"
      variants={variants}
      transition={transition}
      style={{
        willChange: "transform, opacity",
        width: "100%",
      }}
    >
      {children}
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/*                                NAVIGATION                                  */
/* -------------------------------------------------------------------------- */

export const CarouselPrevious: React.FC<CarouselNavigationProps> = ({
  className,
  variant = "default",
  size = "md",
}) => {
  const { index, goToPrevious, dotsPosition, split = false, isMobile = false, loop = true } = useCarousel();

  // Disable Previous button at first slide only when loop is false
  const isDisabled = !loop && index === 0;
  const isVertical = dotsPosition === "left" || dotsPosition === "right";

  const sizeClasses = {
    sm: "p-1.5",
    md: "p-2",
    lg: "p-2.5",
  };

  const variantClasses = {
    default: "bg-black/40 hover:bg-black/60 text-white",
    outline: "bg-white/90 hover:bg-white border border-gray-300 text-gray-700",
    ghost: "bg-transparent hover:bg-black/20 text-gray-700 dark:text-gray-300",
  };

  // Check if custom positioning is provided via className
  const hasCustomPosition = className?.includes("left-") || className?.includes("-left-") || className?.includes("right-") || className?.includes("-right-");
  
  const getLeftPosition = () => {
    if (hasCustomPosition) return "";
    if (isMobile) {
      return "relative mt-4 inline-flex mr-2";
    }
    if (split) {
      return "absolute left-0 top-1/2 -translate-y-1/2 z-10";
    }
    return "absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 z-10";
  };
  
  const positionClasses = isVertical
    ? isMobile
      ? "relative mt-4 inline-flex mr-2"
      : "absolute top-2 sm:top-3 left-1/2 -translate-x-1/2 z-20"
    : hasCustomPosition 
      ? isMobile
        ? "relative mt-4 inline-flex mr-2"
        : "absolute top-1/2 -translate-y-1/2 z-10"
      : getLeftPosition();

  return (
    <button
      type="button"
      aria-label="Previous slide"
      onClick={goToPrevious}
      disabled={isDisabled}
      onMouseEnter={(e) => {
        e.stopPropagation();
      }}
      className={cn(
        positionClasses,
        "cursor-pointer rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed",
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      aria-disabled={isDisabled}
    >
      {isVertical ? (
        <ChevronLeft className={cn(
          size === "sm" ? "w-4 h-4 sm:w-5 sm:h-5" : 
          size === "lg" ? "w-6 h-6 sm:w-7 sm:h-7" : 
          "w-5 h-5 sm:w-6 sm:h-6 rotate-90"
        )} />
      ) : (
        <ChevronLeft className={size === "sm" ? "w-4 h-4 sm:w-5 sm:h-5" : size === "lg" ? "w-6 h-6 sm:w-7 sm:h-7" : "w-5 h-5 sm:w-6 sm:h-6"} />
      )}
    </button>
  );
}

export const CarouselNext: React.FC<CarouselNavigationProps> = ({
  className,
  variant = "default",
  size = "md",
}) => {
  const { index, pageCount, goToNext, dotsPosition, split = false, isMobile = false } = useCarousel();

  // Disable Next button at last slide (regardless of loop setting)
  const isDisabled = pageCount > 0 && index >= pageCount - 1;
  const isVertical = dotsPosition === "left" || dotsPosition === "right";

  const sizeClasses = {
    sm: "p-1.5 sm:p-2",
    md: "p-2 sm:p-2.5",
    lg: "p-2.5 sm:p-3",
  };

  const variantClasses = {
    default: "bg-black/40 hover:bg-black/60 text-white",
    outline: "bg-white/90 hover:bg-white border border-gray-300 text-gray-700",
    ghost: "bg-transparent hover:bg-black/20 text-gray-700 dark:text-gray-300",
  };

  // Check if custom positioning is provided via className
  const hasCustomPosition = className?.includes("left-") || className?.includes("-left-") || className?.includes("right-") || className?.includes("-right-");
  
  const getRightPosition = () => {
    if (hasCustomPosition) return "";
    if (isMobile) {
      return "relative mt-4 inline-flex";
    }
    if (split) {
      return "absolute right-0 top-1/2 -translate-y-1/2 z-10";
    }
    return "absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 z-10";
  };
  
  const positionClasses = isVertical
    ? isMobile
      ? "relative mt-4 inline-flex"
      : "absolute bottom-2 sm:bottom-3 left-1/2 -translate-x-1/2 z-20"
    : hasCustomPosition 
      ? isMobile
        ? "relative mt-4 inline-flex"
        : "absolute top-1/2 -translate-y-1/2 z-10"
      : getRightPosition();

  return (
    <button
      type="button"
      aria-label="Next slide"
      onClick={goToNext}
      disabled={isDisabled}
      onMouseEnter={(e) => {
        e.stopPropagation();
      }}
      className={cn(
        positionClasses,
        "cursor-pointer rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed",
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      aria-disabled={isDisabled}
    >
      {isVertical ? (
        <ChevronRight className={cn(
          size === "sm" ? "w-4 h-4 sm:w-5 sm:h-5" : 
          size === "lg" ? "w-6 h-6 sm:w-7 sm:h-7" : 
          "w-5 h-5 sm:w-6 sm:h-6 rotate-90"
        )} />
      ) : (
        <ChevronRight className={size === "sm" ? "w-4 h-4 sm:w-5 sm:h-5" : size === "lg" ? "w-6 h-6 sm:w-7 sm:h-7" : "w-5 h-5 sm:w-6 sm:h-6"} />
      )}
    </button>
  );
}

/* -------------------------------------------------------------------------- */
/*                                   DOTS                                     */
/* -------------------------------------------------------------------------- */

export const CarouselDots: React.FC<CarouselDotsProps> = ({
  className,
  variant = "default",
  size = "md",
  position = "bottom",
}) => {
  const { index, pageCount, goToSlide, setDotsPosition} = useCarousel();

  // Update dots position in context so navigation buttons can use it
  React.useEffect(() => {
    setDotsPosition(position);
  }, [position, setDotsPosition]);

  // Early return AFTER all hooks
  if (pageCount <= 1) return null;

  const isVertical = position === "left" || position === "right";

  // Size classes - swap width/height for vertical orientation when variant is not "dots"
  const sizeClasses = {
    sm: variant === "dots" 
      ? "h-1.5 w-1.5" 
      : isVertical ? "w-1 h-4" : "h-1 w-4",
    md: variant === "dots" 
      ? "h-2 w-2" 
      : isVertical ? "w-1.5 h-6" : "h-1.5 w-6",
    lg: variant === "dots" 
      ? "h-2.5 w-2.5" 
      : isVertical ? "w-2 h-8" : "h-2 w-8",
  };

  const activeSizeClasses = {
    sm: variant === "dots" 
      ? "h-1.5 w-1.5" 
      : isVertical ? "w-1 h-8" : "h-1 w-8",
    md: variant === "dots" 
      ? "h-2 w-2" 
      : isVertical ? "w-1.5 h-10" : "h-1.5 w-10",
    lg: variant === "dots" 
      ? "h-2.5 w-2.5" 
      : isVertical ? "w-2 h-12" : "h-2 w-12",
  };

  const positionClasses: Record<"top" | "bottom" | "left" | "right", string> = {
    top: "top-4 left-1/2 -translate-x-1/2",
    bottom: "bottom-4 left-1/2 -translate-x-1/2",
    left: "left-4 top-1/2 -translate-y-1/2",
    right: "right-4 top-1/2 -translate-y-1/2",
  };

  const getDotClasses = (i: number) => {
    if (i === index) {
      return cn(
        "bg-white shadow-md",
        activeSizeClasses[size]
      );
    }
    
    return cn(
      "bg-white/50 hover:bg-white/70",
      sizeClasses[size]
    );
  };

  return (
    <div
      className={cn(
        "absolute gap-2 z-10",
        isVertical ? "flex flex-col" : "flex flex-row",
        positionClasses[position],
        className
      )}
      role="tablist"
      aria-label="Carousel navigation dots"
    >
      {Array.from({ length: pageCount }).map((_, i) => {
        const isActive = i === index;
        
        return (
          <button
            key={i}
            type="button"
            role="tab"
            aria-label={`Go to slide ${i + 1}`}
            aria-selected={isActive}
            onClick={() => goToSlide(i)}
            className={cn(
              "rounded-full transition-all duration-300 relative focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary hover:scale-110",
              variant === "dots" ? "rounded-full" : "rounded-sm",
              getDotClasses(i),
            )}
          />
        );
      })}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                                THUMBNAILS                                  */
/* -------------------------------------------------------------------------- */

export const CarouselThumbnails: React.FC<CarouselThumbnailsProps> = ({
  thumbnails,
  className,
  position = "bottom",
  size = "md",
  variant = "default",
}) => {
  const { index, pageCount, goToSlide } = useCarousel();
  const thumbnailContainerRef = React.useRef<HTMLDivElement>(null);
  const [visibleThumbnails, setVisibleThumbnails] = React.useState(3);

  // Calculate visible thumbnails based on screen size
  React.useEffect(() => {
    const updateVisibleThumbnails = () => {
      const width = window.innerWidth;
      if (width >= 1024) {
        setVisibleThumbnails(5);
      } else if (width >= 768) {
        setVisibleThumbnails(4);
      } else if (width >= 640) {
        setVisibleThumbnails(3);
      } else {
        setVisibleThumbnails(2);
      }
    };

    updateVisibleThumbnails();
    window.addEventListener("resize", updateVisibleThumbnails);
    return () => window.removeEventListener("resize", updateVisibleThumbnails);
  }, []);

  // Auto-scroll thumbnails to keep active one visible
  React.useEffect(() => {
    if (!thumbnailContainerRef.current || thumbnails.length <= visibleThumbnails) return;

    const container = thumbnailContainerRef.current;
    const isVertical = position === "left" || position === "right";
    const scrollProperty = isVertical ? "scrollTop" : "scrollLeft";
    const clientSizeProperty = isVertical ? "clientHeight" : "clientWidth";

    const activeButton = container.querySelector(`[data-thumbnail-index="${index}"]`) as HTMLElement;
    if (!activeButton) return;

    const scrollPosition = container[scrollProperty];
    const activePosition = isVertical ? activeButton.offsetTop : activeButton.offsetLeft;
    const activeSize = isVertical ? activeButton.offsetHeight : activeButton.offsetWidth;
    const visibleStart = scrollPosition;
    const visibleEnd = scrollPosition + container[clientSizeProperty];

    // Scroll to show active thumbnail if it's not visible
    if (activePosition < visibleStart) {
      container[scrollProperty] = activePosition - (isVertical ? 8 : 8);
    } else if (activePosition + activeSize > visibleEnd) {
      container[scrollProperty] = activePosition + activeSize - container[clientSizeProperty] + (isVertical ? 8 : 8);
    }
  }, [index, thumbnails.length, visibleThumbnails, position]);

  // Early return check AFTER all hooks
  if (pageCount <= 1 || !thumbnails || thumbnails.length === 0) return null;

  const sizeClasses = {
    sm: "w-12 h-12",
    md: "w-16 h-16",
    lg: "w-20 h-20",
  };

  const variantClasses = {
    default: {
      active: "border-2 border-white ring-2 ring-primary shadow-lg scale-105",
      inactive: "border-2 border-white/30 hover:border-white/60 hover:scale-105",
    },
    outline: {
      active: "border-2 border-primary ring-2 ring-primary/20 shadow-md scale-105",
      inactive: "border-2 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 hover:scale-105",
    },
    minimal: {
      active: "border-2 border-primary opacity-100 scale-105",
      inactive: "border-2 border-transparent opacity-60 hover:opacity-80 hover:scale-105",
    },
  };

  const isVertical = position === "left" || position === "right";
  const needsScrolling = thumbnails.length > visibleThumbnails;

  const positionClasses = {
    top: "top-4 left-1/2 -translate-x-1/2 flex-row",
    bottom: "bottom-4 left-1/2 -translate-x-1/2 flex-row",
    left: "left-4 top-1/2 -translate-y-1/2 flex-col",
    right: "right-4 top-1/2 -translate-y-1/2 flex-col",
  };

  const gapClasses = {
    top: "gap-2",
    bottom: "gap-2",
    left: "gap-2",
    right: "gap-2",
  };

  const scrollClasses = needsScrolling
    ? isVertical
      ? "overflow-y-auto max-h-[400px] snap-y snap-mandatory"
      : "overflow-x-auto max-w-[90vw] snap-x snap-mandatory"
    : "";

  return (
    <div
      ref={thumbnailContainerRef}
      className={cn(
        "absolute z-10 flex",
        positionClasses[position],
        gapClasses[position],
        scrollClasses,
        needsScrolling && "[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]",
        className
      )}
      role="tablist"
      aria-label="Carousel thumbnails"
    >
      {thumbnails.slice(0, pageCount).map((thumbnail, i) => {
        const isActive = i === index;
        
        return (
          <button
            key={i}
            data-thumbnail-index={i}
            type="button"
            role="tab"
            aria-label={`Go to slide ${i + 1}`}
            aria-selected={isActive}
            onClick={() => goToSlide(i)}
            className={cn(
              "rounded-lg overflow-hidden transition-all duration-200 flex-shrink-0",
              "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary",
              sizeClasses[size],
              isActive
                ? variantClasses[variant].active
                : variantClasses[variant].inactive
            )}
          >
            <img
              src={thumbnail}
              alt={`Thumbnail ${i + 1}`}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </button>
        );
      })}
    </div>
  );
}
