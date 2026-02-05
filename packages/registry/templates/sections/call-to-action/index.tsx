import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cva, type VariantProps } from 'class-variance-authority';
import {
    ArrowRight,
    Sparkles,
    CheckCircle,
} from 'lucide-react';
import { cn } from '../../../utils/cn';
import { Button } from '@ignix-ui//button';
import { Typography } from '@ignix-ui//typography';

/* ============================================
   TYPES & INTERFACES
============================================ */

interface CTAButton {
    id: string;
    label: string;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'link';
    icon?: React.ElementType;
    onClick?: () => void;
    href?: string;
    external?: boolean;
}

interface CTABannerProps {
    // Layout & Variants
    variant?: VariantProps<typeof bannerVariants>['variant'];
    layout?: 'centered' | 'split' | 'compact';
    contentAlign?: 'left' | 'center' | 'right';

    // Background & Styling
    backgroundType?: 'solid' | 'gradient' | 'image';
    backgroundColor?: string;
    gradientFrom?: string;
    gradientTo?: string;
    backgroundImage?: string;

    // Image Options (for split layout)
    imagePosition?: 'left' | 'right';
    imageVariant?: 'light' | 'dark' | 'default';

    // Theme
    theme?: 'light' | 'dark';
    forceTheme?: boolean;

    // Animation
    animate?: boolean;
    animationDelay?: number;
    animationType?: 'fade' | 'slide' | 'scale';

    // Spacing
    padding?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';

    // Children
    children: React.ReactNode;

    // Accessibility
    ariaLabel?: string;
    role?: string;
}

interface CTAContextType {
    theme: 'light' | 'dark';
    layout: 'centered' | 'split' | 'compact';
    contentAlign: 'left' | 'center' | 'right';
    variant: string;
    imagePosition: 'left' | 'right';
    isVisible: boolean;
    animationDelay: number;
    animationType: 'fade' | 'slide' | 'scale';
    handleButtonClick: (button: CTAButton) => void;
}

const CTAContext = React.createContext<CTAContextType | undefined>(undefined);

const useCTA = () => {
    const context = React.useContext(CTAContext);
    if (!context) {
        throw new Error('CTA components must be used within CTABanner');
    }
    return context;
};

/* ============================================
   CHILD COMPONENTS
============================================ */

export const CTABannerHeading: React.FC<{
    children: React.ReactNode;
    className?: string;
}> = ({ children, className }) => {
    const { theme, layout, isVisible, animationDelay, animationType } = useCTA();

    return (
        <motion.div
            initial={animationType === 'fade' ? { opacity: 0 } :
                animationType === 'slide' ? { opacity: 0, y: 20 } :
                    { opacity: 0, scale: 0.95 }}
            animate={isVisible ? {
                opacity: 1,
                y: 0,
                scale: 1
            } : animationType === 'fade' ? { opacity: 0 } :
                animationType === 'slide' ? { opacity: 0, y: 20 } :
                    { opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.6, delay: animationDelay }}
        >
            <Typography
                variant={layout === 'compact' ? "h3" : "h2"}
                weight="bold"
                className={cn(
                    "mb-4 md:mb-6",
                    theme === 'dark' ? 'text-white' : 'text-gray-900',
                    layout === 'compact' && 'text-2xl md:text-3xl',
                    className
                )}
            >
                {children}
            </Typography>
        </motion.div>
    );
};

export const CTABannerSubheading: React.FC<{
    children: React.ReactNode;
    className?: string;
}> = ({ children, className }) => {
    const { theme, layout, contentAlign, isVisible, animationDelay, animationType } = useCTA();

    return (
        <motion.div
            initial={animationType === 'fade' ? { opacity: 0 } :
                animationType === 'slide' ? { opacity: 0, y: 20 } :
                    { opacity: 0, scale: 0.95 }}
            animate={isVisible ? {
                opacity: 1,
                y: 0,
                scale: 1
            } : animationType === 'fade' ? { opacity: 0 } :
                animationType === 'slide' ? { opacity: 0, y: 20 } :
                    { opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.6, delay: animationDelay + 0.1 }}
        >
            <Typography
                variant={layout === 'compact' ? "body" : "lead"}
                className={cn(
                    "mb-6 md:mb-8",
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-600',
                    layout === 'compact' ? 'text-base md:text-lg' : 'text-lg md:text-xl',
                    contentAlign === 'center' && 'mx-auto',
                    contentAlign === 'right' && 'ml-auto',
                    contentAlign === 'left' && 'mr-auto',
                    className
                )}
            >
                {children}
            </Typography>
        </motion.div>
    );
};

export const CTABannerActions: React.FC<{
    children: React.ReactNode;
    className?: string;
}> = ({ children, className }) => {
    const { contentAlign, isVisible, animationDelay } = useCTA();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: animationDelay + 0.3 }}
            className={cn(
                "flex flex-wrap gap-3 md:gap-4",
                contentAlign === 'center' && 'justify-center',
                contentAlign === 'right' && 'justify-end',
                contentAlign === 'left' && 'justify-start',
                className
            )}
        >
            {children}
        </motion.div>
    );
};

export const CTABannerButton: React.FC<{
    label: string;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'link';
    icon?: React.ElementType;
    onClick?: () => void;
    href?: string;
    external?: boolean;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}> = ({ label, variant = 'primary', icon: Icon, onClick, href, external, size, className }) => {
    const { theme, layout, handleButtonClick } = useCTA();

    const button: CTAButton = {
        id: `button-${label.toLowerCase().replace(/\s+/g, '-')}`,
        label,
        variant,
        icon: Icon,
        onClick,
        href,
        external,
    };

    return (
        <Button
            variant={variant}
            size={size || (layout === 'compact' ? "md" : "lg")}
            onClick={() => handleButtonClick(button)}
            className={cn(
                "group cursor-pointer",
                theme === 'dark' && variant === 'outline' &&
                'border-gray-300 text-gray-300 hover:bg-gray-300 hover:text-gray-900',
                theme === 'light' && variant === 'outline' &&
                'border-gray-700 text-gray-700 hover:bg-gray-700 hover:text-white',
                className
            )}
            animationVariant="scaleUp"
        >
            {Icon && <Icon className="w-4 h-4 mr-2" />}
            {label}
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>
    );
};

export const CTABannerImage: React.FC<{
    src: string;
    alt?: string;
    className?: string;
    variant?: 'light' | 'dark' | 'default';
}> = ({ src, alt = "CTA Visual", className, variant }) => {
    const { layout, theme, isVisible, animationDelay, imageVariant: contextVariant } = useCTA();

    if (layout !== 'split') return null;

    const resolvedVariant =
        variant || contextVariant || (theme === 'dark' ? 'dark' : 'light');

    return (
        <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: 40 }}
            transition={{ duration: 0.7, delay: animationDelay + 0.2 }}
            className={imageVariants({ variant: resolvedVariant })}
        >
            <div className={cn(
                "w-full h-[360px] sm:h-[420px] lg:h-[480px] rounded-2xl overflow-hidden",
                className
            )}>
                <img
                    src={src}
                    alt={alt}
                    className="w-full h-full object-cover"
                />
            </div>
        </motion.div>
    );
};

export const CTABannerContent: React.FC<{
    children: React.ReactNode;
    className?: string;
}> = ({ children, className }) => {
    const { layout, contentAlign, isVisible, animationType, animationDelay } = useCTA();

    const contentAnimation = {
        fade: {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            transition: { duration: 0.6, delay: animationDelay }
        },
        slide: {
            initial: { opacity: 0, y: 40 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.8, delay: animationDelay, ease: "easeOut" }
        },
        scale: {
            initial: { opacity: 0, scale: 0.95 },
            animate: { opacity: 1, scale: 1 },
            transition: { duration: 0.7, delay: animationDelay, ease: "backOut" }
        }
    }[animationType];

    return (
        <motion.div
            {...contentAnimation}
            animate={isVisible ? contentAnimation.animate : contentAnimation.initial}
            className={cn(
                layout === 'split' && 'lg:w-1/2',
                contentVariants({ align: contentAlign, layout }),
                className
            )}
        >
            {children}
        </motion.div>
    );
};

/* ============================================
   VARIANTS
============================================ */

const bannerVariants = cva(
    "w-full overflow-hidden transition-all duration-300",
    {
        variants: {
            variant: {
                default: "bg-background text-foreground",
                primary: "bg-primary text-primary-foreground",
                secondary: "bg-secondary text-secondary-foreground",
                accent: "bg-accent text-accent-foreground",
                muted: "bg-muted text-muted-foreground",
                gradient: "bg-gradient-to-r from-primary/90 to-accent/90 text-primary-foreground",
                glass: "bg-background/80 backdrop-blur-md border border-border",
                dark: "bg-gray-950 text-gray-50",
                light: "bg-gray-50 text-gray-900",
            },
            padding: {
                sm: "py-8 md:py-12",
                md: "py-12 md:py-16",
                lg: "py-16 md:py-20",
                xl: "py-20 md:py-24",
                '2xl': "py-24 md:py-32",
            },
            layout: {
                centered: "text-center",
                split: "",
                compact: "py-8 md:py-12",
            }
        },
        defaultVariants: {
            variant: "default",
            padding: "lg",
            layout: "centered",
        },
    }
);

const containerVariants = cva(
    "container mx-auto px-4 sm:px-6 lg:px-8",
    {
        variants: {
            layout: {
                centered: "max-w-3xl",
                split: "max-w-7xl",
                compact: "max-w-2xl",
            },
        },
        defaultVariants: {
            layout: "centered",
        },
    }
);

const contentVariants = cva(
    "transition-all duration-300",
    {
        variants: {
            align: {
                left: "text-left",
                center: "text-center mx-auto",
                right: "text-right ml-auto",
            },
            layout: {
                centered: "w-full",
                split: "lg:w-1/2",
                compact: "w-full",
            },
        },
        defaultVariants: {
            align: "center",
            layout: "centered",
        },
    }
);

const imageVariants = cva(
    "transition-all duration-500 rounded-2xl overflow-hidden shadow-2xl blur-9xl",
    {
        variants: {
            variant: {
                light: "brightness-110 contrast-90 saturate-90",
                dark: "brightness-90 contrast-110 saturate-110",
                default: "",
            },
            layout: {
                split: "",
                centered: "hidden",
                compact: "hidden",
            },
        },
        defaultVariants: {
            variant: "default",
            layout: "split",
        },
    }
);

/* ============================================
   MAIN COMPONENT
============================================ */

export const CTABanner: React.FC<CTABannerProps> = ({
    // Layout & Variants
    variant = "default",
    layout = "centered",
    contentAlign = "center",

    // Background & Styling
    backgroundType = "solid",
    backgroundColor,
    gradientFrom,
    gradientTo,
    backgroundImage,

    // Image Options
    imagePosition = "right",
    // imageVariant = "default",

    // Theme
    theme,
    forceTheme = false,

    // Animation
    animate = true,
    animationDelay = 0,
    animationType = "fade",

    // Spacing
    padding = "lg",

    // Children
    children,

    // Accessibility
    ariaLabel = "Call to action banner",
    role = "banner",
}) => {
    // State for animation
    const [isVisible, setIsVisible] = useState(false);

    // Determine theme based on props or variant
    const resolvedTheme = theme ||
        (variant === 'dark' ? 'dark' :
            variant === 'light' ? 'light' :
                variant === 'gradient' ? 'dark' : 'light');

    // Handle background styling
    const backgroundStyle: React.CSSProperties = {};
    if (backgroundType === 'gradient' && gradientFrom && gradientTo) {
        backgroundStyle.background = `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})`;
    } else if (backgroundType === 'solid' && backgroundColor) {
        backgroundStyle.backgroundColor = backgroundColor;
    } else if (backgroundType === 'image' && backgroundImage) {
        backgroundStyle.backgroundImage = `url(${backgroundImage})`;
        backgroundStyle.backgroundSize = 'cover';
        backgroundStyle.backgroundPosition = 'center';
    }

    // Handle button click
    const handleButtonClick = (button: CTAButton) => {
        if (button.onClick) {
            button.onClick();
        } else if (button.href) {
            if (button.external) {
                window.open(button.href, '_blank', 'noopener,noreferrer');
            } else {
                window.location.href = button.href;
            }
        }
    };

    // Trigger animation on mount
    useEffect(() => {
        if (animate) {
            const timer = setTimeout(() => {
                setIsVisible(true);
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [animate]);

    // Context value
    const contextValue: CTAContextType = {
        theme: resolvedTheme,
        layout,
        contentAlign,
        variant,
        imagePosition,
        isVisible,
        animationDelay,
        animationType,
        handleButtonClick,
    };

    if (layout === 'split') {
        const childrenArray = React.Children.toArray(children);

        const content = childrenArray.find(
            (child): child is React.ReactElement =>
                React.isValidElement(child) &&
                child.type === CTABannerContent
        );

        const image = childrenArray.find(
            (child): child is React.ReactElement =>
                React.isValidElement(child) &&
                child.type === CTABannerImage
        );

        return (
            <CTAContext.Provider value={contextValue}>
                <section
                    className={cn(
                        bannerVariants({ variant, padding, layout }),
                        forceTheme && resolvedTheme === 'dark' && 'dark',
                        "relative"
                    )}
                    style={backgroundStyle}
                    aria-label={ariaLabel}
                    role={role}
                >
                    <div className={containerVariants({ layout })}>
                        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">

                            {imagePosition === 'left' && image}
                            {content}
                            {imagePosition === 'right' && image}

                        </div>
                    </div>
                </section>
            </CTAContext.Provider>
        );
    }


    // Render centered/compact layout
    return (
        <CTAContext.Provider value={contextValue}>
            <section
                className={cn(
                    bannerVariants({ variant, padding, layout }),
                    forceTheme && resolvedTheme === 'dark' && 'dark',
                    "relative"
                )}
                style={backgroundStyle}
                aria-label={ariaLabel}
                role={role}
            >
                {/* Background effects for gradient variant */}
                {variant === 'gradient' && (
                    <>
                        <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-r from-primary/30 to-transparent rounded-full blur-3xl" />
                        <div className="absolute bottom-0 right-0 w-64 h-64 bg-gradient-to-l from-accent/30 to-transparent rounded-full blur-3xl" />
                    </>
                )}

                <div className={containerVariants({ layout })}>
                    <CTABannerContent>
                        {/* Decorative icon for certain variants */}
                        {(variant === 'primary' || variant === 'gradient') && layout === 'centered' && (
                            <motion.div
                                initial={{ scale: 0, rotate: -180 }}
                                animate={isVisible ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -180 }}
                                transition={{ duration: 0.8, delay: animationDelay + 0.1, type: "spring" }}
                                className="w-16 h-16 mx-auto mb-6 rounded-full bg-white/10 flex items-center justify-center"
                            >
                                <Sparkles className="w-8 h-8 text-white" />
                            </motion.div>
                        )}

                        {children}

                        {/* Additional info for compact layout */}
                        {layout === 'compact' && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
                                transition={{ duration: 0.5, delay: animationDelay + 0.5 }}
                                className="mt-6 flex items-center justify-center gap-4 text-sm"
                            >
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                    <span className={resolvedTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                                        No commitment required
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                    <span className={resolvedTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                                        Free consultation
                                    </span>
                                </div>
                            </motion.div>
                        )}
                    </CTABannerContent>
                </div>
            </section>
        </CTAContext.Provider>
    );
};

// Export types
export type { CTABannerProps };