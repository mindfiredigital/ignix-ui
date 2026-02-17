import React, { createContext, useContext, useMemo, memo } from "react";
import { cva } from "class-variance-authority";
import { FaQuoteLeft } from "react-icons/fa";
import { Typography } from "@site/src/components/UI/typography";
import { Rating } from "@site/src/components/UI/rating";
import { Avatar } from "@site/src/components/UI/avatar";
import { Card, CardContent } from "@site/src/components/UI/card";
import { cn } from "@site/src/utils/cn";

/* -------------------------------------------------------------------------- */
/*                              CONTEXT                                       */
/* -------------------------------------------------------------------------- */
interface TestimonialCardContextValue {
  split?: boolean;
  size?: "sm" | "md" | "lg";
  avatarPosition?: "top" | "bottom";
  variant?: "default" | "minimal" | "outline" | "premium";
  animation?: "none" | "fadeIn" | "slideUp" | "scaleIn" | "flipIn" | "bounceIn" | "floatIn";
}

const TestimonialCardContext = createContext<TestimonialCardContextValue | null>(null);

const useTestimonialCardContext = () => {
  const context = useContext(TestimonialCardContext);
  if (!context) {
    throw new Error("TestimonialCard sub-components must be used within TestimonialCard component");
  }
  return context;
};

/* -------------------------------------------------------------------------- */
/*                              INTERFACE                                     */
/* -------------------------------------------------------------------------- */
export interface ClassProps {
  className?: string;
}

export interface TestimonialCardProps extends ClassProps, TestimonialCardContextValue  {
  children: React.ReactNode;
  fullImage?: string;
  fullImageAlt?: string;
  split?: boolean;
  backgroundImage?: string;
  backgroundImageAlt?: string;
}

export interface TestimonialCardQuoteProps extends ClassProps {
  children: React.ReactNode;
}

export interface TestimonialCardAuthorProps extends ClassProps {
  name: string;
  title?: string;
  company?: string;
  avatar?: string;
  avatarAlt?: string;
  fullImage?: string;
  fullImageAlt?: string;
}

export interface TestimonialCardRatingProps extends ClassProps {
  value: number;
  max?: number;
}

export interface TestimonialCardSocialLinksProps extends ClassProps {
  children: React.ReactNode;
}

/* -------------------------------------------------------------------------- */
/*                              CVA VARIANTS                                  */
/* -------------------------------------------------------------------------- */
const testimonialCardVariants = cva("w-full relative",
  {
    variants: {
      size: {
        sm: "max-w-lg",
        md: "max-w-xl",
        lg: "max-w-2xl",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

const testimonialCardQuoteVariants = cva("text-foreground leading-relaxed",
  {
    variants: {
      size: {
        sm: "text-sm",
        md: "text-base",
        lg: "text-lg",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

const testimonialCardAuthorNameVariants = cva("text-gray-900 dark:text-gray-100 transition-colors duration-200 group-hover:text-gray-950 dark:group-hover:text-gray-50",
  {
    variants: {
      size: {
        sm: "text-sm",
        md: "text-base",
        lg: "text-lg",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

const testimonialCardAuthorTitleVariants = cva("text-gray-600 dark:text-gray-400 transition-colors duration-200 group-hover:text-gray-700 dark:group-hover:text-gray-300",
  {
    variants: {
      size: {
        sm: "text-xs",
        md: "text-sm",
        lg: "text-base",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

const testimonialCardContentVariants = cva("relative z-10",
  {
    variants: {
      size: {
        sm: "p-5 space-y-3",
        md: "p-7 space-y-5",
        lg: "p-9 space-y-6",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

const testimonialCardAuthorContainerVariants = cva("transition-all duration-300",
  {
    variants: {
      avatarPosition: {
        top: "flex-col gap-4 items-center",
        bottom: "flex-row gap-4 items-center",
      },
    },
    defaultVariants: {
      avatarPosition: "bottom",
    },
  }
);

const testimonialCardAuthorInfoVariants = cva("flex flex-col",
  {
    variants: {
      avatarPosition: {
        top: "text-center items-center",
        bottom: "text-left",
      },
    },
    defaultVariants: {
      avatarPosition: "bottom",
    },
  }
);

const testimonialCardSocialLinksVariants = cva(
  "flex items-center gap-3 text-gray-400 dark:text-gray-500",
  {
    variants: {
      size: {
        sm: "text-xs",
        md: "text-sm",
        lg: "text-base",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

/* -------------------------------------------------------------------------- */
/*                              HELPER FUNCTIONS                              */
/* -------------------------------------------------------------------------- */
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
export const TestimonialCardQuote: React.FC<TestimonialCardQuoteProps> = memo(({
  children,
  className,
}) => {
  const { size, avatarPosition, split } = useTestimonialCardContext();

  return (
    <>
    {split && (
      <div className="hidden sm:block">                  
        <FaQuoteLeft className="text-gray-300 dark:text-gray-600 text-5xl transition-colors duration-300 group-hover:text-gray-400 dark:group-hover:text-gray-500"/>
      </div>
    )}
    <Typography 
      // variant="body" 
      className={cn(
        testimonialCardQuoteVariants({ size: size || "md" }),
        avatarPosition==="top" ? "text-center": "",
        split && "text-left",
        className
      )}
    >
      {children}
    </Typography>
    </>
  );
});

TestimonialCardQuote.displayName = "TestimonialCardQuote";

export const TestimonialCardAuthor: React.FC<TestimonialCardAuthorProps> = memo(({
  name,
  title,
  company,
  avatar,
  avatarAlt,
  className,
}) => {
  const { size, avatarPosition = "bottom", split } = useTestimonialCardContext();
  
  const avatarSizeMap = useMemo(() => ({
    sm: "md" as const,
    md: "lg" as const,
    lg: "xl" as const,
  }), []);

  // Adjust avatar size based on position
  const getAvatarSize = () => {
    const baseSize = avatarSizeMap[size || "md"];
    if (avatarPosition === "top" || avatarPosition === "bottom") {
      // Larger avatar for top/bottom positions
      if (baseSize === "md") return "lg";
      if (baseSize === "lg") return "lg";
      return baseSize;
    }
    return baseSize;
  };

  return (
    <div className={cn(
      "flex",
      avatar && avatarPosition ? "items-center" : "items-start", 
      testimonialCardAuthorContainerVariants({ avatarPosition }), 
      className
    )}>
      {avatar && (
          <Avatar
            src={avatar}
            alt={avatarAlt || name}
            size={ split ? "6xl" : getAvatarSize()}
            shape="circle"
          />
      )}
      <div className={testimonialCardAuthorInfoVariants({ avatarPosition })}>
        <Typography 
          variant="h4" 
          weight="bold"
          className={cn("text-primary",
            testimonialCardAuthorNameVariants({ size: size || "md" }),
            avatarPosition === "top" ? "text-center" : ""
          )}
        >
          {name}
        </Typography>
        {!split && (title || company) ? (
          <Typography 
            variant="caption" 
            className={cn(
              testimonialCardAuthorTitleVariants({ size: size || "md" }),
              avatarPosition === "top" ? "text-center" : "",
              "flex items-center gap-1.5 mt-0.5"
            )}
          >
            {title && company ? (
              <>
                <span>{title}</span>
                <span className="text-gray-400 dark:text-gray-500">•</span>
                <span className="text-gray-500 dark:text-gray-500">{company}</span>
              </>
            ) : (
              title || company
            )}
          </Typography>
        ) : 
        ( <div className="flex flex-col">
          <Typography 
            variant="caption" 
            className={cn(
              testimonialCardAuthorTitleVariants({ size: size || "md" }),
              avatarPosition === "top" ? "text-center" : "",
              "flex items-center gap-1.5 mt-0.5"
            )}
          >
            {title}
          </Typography>
          <Typography 
            variant="caption" 
            className={cn(
              testimonialCardAuthorTitleVariants({ size: size || "md" }),
              avatarPosition === "top" ? "text-center" : "",
              "flex items-center gap-1.5 mt-0.5"
            )}
          >
            {company}
          </Typography>
          </div>)}
      </div>
    </div>
  );
});

TestimonialCardAuthor.displayName = "TestimonialCardAuthor";

export const TestimonialCardRating: React.FC<TestimonialCardRatingProps> = memo(({
  value,
  max = 5,
}) => {
  const { size } = useTestimonialCardContext();

  const ratingSizeMap = useMemo(() => ({
    sm: "xs" as const,
    md: "sm" as const,
    lg: "md" as const,
  }), []);

  return (
    <Rating 
      value={value} 
      max={max} 
      size={ratingSizeMap[size || "sm"]}
      readOnly 
      allowHalf
      colorScheme="yellow"
      className="gap-2"
    />
  );
});

TestimonialCardRating.displayName = "TestimonialCardRating";

export const TestimonialCardContent: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = memo(({ children, className }) => {
  const { size } = useTestimonialCardContext();

  return (
    <CardContent
      className={cn(
        testimonialCardContentVariants({ size: size || "md" }),
        className
      )}
    >
      {children}
    </CardContent>
  );
});

TestimonialCardContent.displayName = "TestimonialCardContent";

export const TestimonialCardSocialLinks: React.FC<TestimonialCardSocialLinksProps> = memo(
  ({ children, className }) => {
    const { size, avatarPosition, split } = useTestimonialCardContext();
    
    return (
      <div
        className={cn( avatarPosition === "top" ? "flex flex-row items-center justify-center": "",
          split && "items-left",
          testimonialCardSocialLinksVariants({ size: size || "md" }),
          className
        )}
      >
        {children}
      </div>
    );
  }
);

TestimonialCardSocialLinks.displayName = "TestimonialCardSocialLinks";

/* -------------------------------------------------------------------------- */
/*                              MAIN COMPONENT                                */
/* -------------------------------------------------------------------------- */
export const TestimonialCard: React.FC<TestimonialCardProps> = ({
  children,
  size = "md",
  variant = "default",
  avatarPosition = "bottom",
  animation = "none",
  fullImage,
  fullImageAlt,
  backgroundImage,
  backgroundImageAlt,
  className,
  split = false,
}) => {
  const contextValue = useMemo<TestimonialCardContextValue>(
    () => ({
      size,
      variant,
      avatarPosition,
      animation,
      split
    }),
    [size, variant, avatarPosition, animation, split]
  );

  // Memoize children processing
  const processedChildren = useMemo(() => {
    const contentChildren: React.ReactNode[] = [];
    const ratingChildren: React.ReactNode[] = [];
    const authorChildren: React.ReactNode[] = [];
    const quoteChildren: React.ReactNode[] = [];
    const socialLinksChildren: React.ReactNode[] = [];
    let authorFullImage: string | undefined;
    let authorFullImageAlt: string | undefined;

    React.Children.forEach(children, (child) => {
      if (React.isValidElement(child)) {
        const componentName = getComponentDisplayName(child);
        if (componentName === "TestimonialCardRating") {
          ratingChildren.push(child);
        } else if (componentName === "TestimonialCardAuthor") {
          authorChildren.push(child);
          const authorProps = child.props as TestimonialCardAuthorProps;
          if (authorProps.fullImage) {
            authorFullImage = authorProps.fullImage;
            authorFullImageAlt = authorProps.fullImageAlt;
          }
        } else if (componentName === "TestimonialCardQuote") {
          quoteChildren.push(child);
        } else if (componentName === "TestimonialCardSocialLinks") {
          socialLinksChildren.push(child);
        } else {
          contentChildren.push(child);
        }
      } else {
        contentChildren.push(child);
      }
    });

    return {
      contentChildren,
      ratingChildren,
      authorChildren,
      quoteChildren,
      socialLinksChildren,
      authorFullImage,
      authorFullImageAlt,
    };
  }, [children]);

  const {
    contentChildren,
    ratingChildren,
    authorChildren,
    quoteChildren,
    socialLinksChildren,
    authorFullImage,
    authorFullImageAlt,
  } = processedChildren;

  // Use author's fullImage if provided, otherwise fall back to card's fullImage (for backward compatibility)
  const displayFullImage = authorFullImage || fullImage;
  const displayFullImageAlt = authorFullImageAlt || fullImageAlt;

  return (
    <TestimonialCardContext.Provider value={contextValue}>
        <Card 
          variant={variant} 
          animation={animation}
          className={cn(
            "relative overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-200/60 dark:border-gray-700/60 rounded-2xl group",
            (backgroundImage) && "p-0",
            testimonialCardVariants({ size }), className
          )}
        >
          {/* Split layout – inner white card on coloured background */}
          { split ? (
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center p-8">
              {/* LEFT — Avatar + Name */}
              <div className="flex flex-col items-center text-center">
                {authorChildren}
              </div>

              {/* RIGHT — Quote + Rating */}
              <div className="space-y-4">
                {quoteChildren}
                {ratingChildren.length > 0 && ratingChildren}
                {contentChildren}
                {socialLinksChildren && (
                  <div className="mt-4">{socialLinksChildren}</div>
                )}
              </div>
            </CardContent>
          )
          : backgroundImage ? (
            <div className="relative w-full h-80 md:h-96 lg:h-[28rem] overflow-hidden">
              {/* Background Image */}
              <img 
                src={backgroundImage} 
                alt={backgroundImageAlt || "Testimonial background"} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              
              {/* Dark Overlay at bottom */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/60 to-black/20" />
              
              {/* Content Overlay */}
              <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8 lg:p-10">
                <div className="space-y-4 md:space-y-5">
                  {/* Quote */}
                  {quoteChildren.length > 0 && (
                    <div className="relative z-10 [&>*]:text-white">
                      {quoteChildren}
                    </div>
                  )}
                  
                  {/* Rating */}
                  {ratingChildren.length > 0 && (
                    <div className="relative z-10">
                      {ratingChildren}
                    </div>
                  )}
                  
                  {/* Author */}
                  {authorChildren.length > 0 && (
                    <>
                    <div className="relative z-10 [&_*]:text-white [&_*]:hover:text-white [&_*]:group-hover:text-white">
                      {authorChildren}
                    </div>
                    {socialLinksChildren && (
                    <div className="relative z-10 [&_*]:text-white [&_*]:hover:text-white [&_*]:hover:bg-transparent [&_*]:focus:bg-transparent">
                    {socialLinksChildren}
                    </div>)}
                    </>
                  )}
                  
                  {/* Other content */}
                  {contentChildren.length > 0 && (
                    <div className="relative z-10">
                      {contentChildren}
                    </div>
                  )}

                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Full Image at top */}
              {displayFullImage && (
                <div className="w-full h-48 md:h-64 overflow-hidden relative">
                  <img 
                    src={displayFullImage} 
                    alt={displayFullImageAlt || "Testimonial image"} 
                    className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Gradient overlay for better text readability if needed */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
                </div>
              )}
              
              {/* Decorative background gradient */}
              {!displayFullImage && (
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/5 via-purple-400/5 to-pink-400/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              )}
              
              <TestimonialCardContent>
              {/* Author at top */}
              {avatarPosition === "top" && authorChildren.length > 0 && (
                <div className="mb-6 pb-6 border-b border-gray-200/60 dark:border-gray-700/60">
                  {authorChildren}
                  {socialLinksChildren}
                </div>
              )}

              {/* Rating or Quote Icon - displayed at the top if provided */}
              {ratingChildren.length > 0 ? (
                <div className="flex justify-center mb-5">
                  {ratingChildren}
                </div>
              ) : (
                <div className="flex justify-center mb-4">
                  <FaQuoteLeft className="text-gray-300 dark:text-gray-600 text-5xl transition-colors duration-300 group-hover:text-gray-400 dark:group-hover:text-gray-500"/>
                </div>
              )}

              {/* Quote - main content */}
              {quoteChildren.length > 0 && (
                <div className={cn("mb-6 flex flex-row items-baseline",
                  avatarPosition === "top" && "text-center"
                )}>
                  {quoteChildren}
                </div>
              )}

              {/* Other content */}
              {contentChildren.length > 0 && (
                <div className="mb-6">
                  {contentChildren}
                </div>
              )}

              {/* Author at bottom */}
              {avatarPosition === "bottom" && authorChildren.length > 0 && (
                <div className={cn(
                  "mt-6 pt-6 border-t border-gray-200/60 dark:border-gray-700/60 relative before:absolute before:top-0 before:left-1/2 before:-translate-x-1/2 before:w-12 before:h-px before:bg-gradient-to-r before:from-transparent before:via-gray-300 dark:before:via-gray-600 before:to-transparent before:opacity-0 group-hover:before:opacity-100 before:transition-opacity before:duration-300"
                )}>
                  {authorChildren}
                  {socialLinksChildren}
                </div>
              )}
            </TestimonialCardContent>
            </>
          )}
        </Card>
    </TestimonialCardContext.Provider>
  );
};

TestimonialCard.displayName = "TestimonialCard";