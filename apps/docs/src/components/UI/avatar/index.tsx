'use client';

import { motion } from 'framer-motion';
import React, { useState, useRef, forwardRef, useEffect } from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../../../utils/cn';
import { User } from 'lucide-react';

// Define all available shapes
export type AvatarShape =
    | 'circle' | 'square' | 'rounded' | 'decagon'
    | 'hexagon' | 'pentagon' | 'star' | 'diamond'
    | 'triangle' | 'triangle-down' | 'parallelogram' | 'rhombus'
    | 'cross' | 'octagon' | 'ellipse' | 'egg' |
    'trapezoid';

// Shape styles using clip-path
const shapeStyles: Record<AvatarShape, React.CSSProperties> = {
    // Basic shapes
    circle: {},
    square: {},
    rounded: {},

    // Polygon shapes
    hexagon: {
        clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)'
    },
    pentagon: {
        clipPath: 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)'
    },
    octagon: {
        clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)'
    },
    decagon: {
        clipPath: 'polygon(50% 0%, 80% 10%, 100% 35%, 100% 70%, 80% 90%, 50% 100%, 20% 90%, 0% 70%, 0% 35%, 20% 10%)'
    },

    // Star shapes
    star: {
        clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)'
    },

    // Diamond/Rhombus variations
    diamond: {
        clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)'
    },
    rhombus: {
        clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)'
    },

    // Triangle variations
    triangle: {
        clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
    },
    'triangle-down': {
        clipPath: 'polygon(0% 0%, 100% 0%, 50% 100%)'
    },

    // Other geometric shapes
    parallelogram: {
        clipPath: 'polygon(25% 0%, 100% 0%, 75% 100%, 0% 100%)'
    },
    trapezoid: {
        clipPath: 'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)'
    },
    ellipse: {
        clipPath: 'ellipse(50% 50% at 50% 50%)'
    },
    egg: {
        clipPath: 'ellipse(40% 50% at 50% 50%)'
    },
    // Symbol shapes
    cross: {
        clipPath: 'polygon(20% 0%, 80% 0%, 80% 20%, 100% 20%, 100% 80%, 80% 80%, 80% 100%, 20% 100%, 20% 80%, 0% 80%, 0% 20%, 20% 20%)'
    },
};

// Updated avatar variants with new shapes
const avatarVariants = cva(
    'relative inline-flex items-center justify-center overflow-hidden font-semibold text-foreground select-none',
    {
        variants: {
            size: {
                xs: 'h-6 w-6 text-xs',
                sm: 'h-8 w-8 text-sm',
                md: 'h-10 w-10 text-base',
                lg: 'h-12 w-12 text-lg',
                xl: 'h-14 w-14 text-xl',
                '2xl': 'h-16 w-16 text-2xl',
                '3xl': 'h-20 w-20 text-2xl',
                '4xl': 'h-24 w-24 text-3xl',
                '5xl': 'h-28 w-28 text-4xl',
                '6xl': 'h-32 w-32 text-5xl',
                '7xl': 'h-36 w-36 text-6xl',
                '8xl': 'h-40 w-40 text-7xl',
                '9xl': 'h-44 w-44 text-8xl',
            },
            shape: {
                // Basic shapes (use border-radius)
                circle: 'rounded-full',
                square: 'rounded-none',
                rounded: 'rounded-md',

                // Custom shapes (will use clip-path)
                hexagon: '',
                pentagon: '',
                star: '',
                diamond: '',
                triangle: '',
                'triangle-down': '',
                parallelogram: '',
                rhombus: '',
                cross: '',
                octagon: '',
                decagon: '',
                ellipse: '',
                egg: '',
                trapezoid: '',
            },
            bordered: {
                true: 'border-2 border-background',
                false: 'border-0',
            },
            clickable: {
                true: 'cursor-pointer transition-transform hover:scale-105 active:scale-95',
                false: 'cursor-default',
            },
            hasBackground: {
                true: 'bg-slate-100 dark:bg-slate-300',
                false: 'bg-transparent',
            },
        },
        defaultVariants: {
            size: 'md',
            shape: 'circle',
            bordered: false,
            clickable: false,
            hasBackground: false, // Default to having background
        },
    }
);

const statusVariants = cva('absolute rounded-full border-2 border-background z-10', {
    variants: {
        size: {
            xs: 'h-2 w-2 bottom-0 right-0',
            sm: 'h-2.5 w-2.5 bottom-0 right-0',
            md: 'h-3 w-3 bottom-0 right-0',
            lg: 'h-3.5 w-3.5 bottom-0 right-0',
            xl: 'h-4 w-4 bottom-0 right-0',
            '2xl': 'h-5 w-5 bottom-1 right-1',
            '3xl': 'h-6 w-6 bottom-1 right-1',
            '4xl': 'h-7 w-7 bottom-1 right-1',
            '5xl': 'h-8 w-8 bottom-2 right-2',
            '6xl': 'h-9 w-9 bottom-2 right-2',
            '7xl': 'h-10 w-10 bottom-2 right-2',
            '8xl': 'h-11 w-11 bottom-3 right-3',
            '9xl': 'h-12 w-12 bottom-3 right-3',
        },
        status: {
            online: 'bg-green-500',
            offline: 'bg-gray-400',
            away: 'bg-yellow-500',
            busy: 'bg-red-500',
        },
    },
    defaultVariants: {
        size: 'md',
        status: 'online',
    },
});

export interface AvatarProps
    extends Omit<React.HTMLAttributes<HTMLDivElement>, 'size'> {
    src?: string;
    alt?: string;
    fallback?: React.ReactNode;
    fallbackDelay?: number;
    shape?: AvatarShape;
    icon?: React.ReactNode;
    letters?: string;
    showUploadButton?: boolean;
    onUpload?: (file: File) => void;
    onRemove?: () => void;
    status?: 'online' | 'offline' | 'away' | 'busy';
    bordered?: boolean;
    clickable?: boolean;
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | '8xl' | '9xl';
    backgroundColor?: string; // Optional custom background color
}

const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
    (
        {
            className,
            size,
            shape = 'circle',
            src,
            alt = 'Avatar',
            fallback,
            // fallbackDelay = 600,
            icon,
            letters,
            status,
            bordered = false,
            clickable = false,
            backgroundColor,
            ...props
        },
        ref
    ) => {
        const [imageError, setImageError] = useState(false);
        const [imageLoading, setImageLoading] = useState(!!src);
        const fallbackTimerRef = useRef<NodeJS.Timeout>();

        useEffect(() => {
            if (!src) {
                setImageError(false);
                setImageLoading(false);
                return;
            }

            setImageError(false);
            setImageLoading(true);
        }, [src]);

        const handleImageError = () => {
            if (fallbackTimerRef.current) {
                clearTimeout(fallbackTimerRef.current);
            }
            setImageError(true);
            setImageLoading(false);
        };

        const handleImageLoad = () => {
            if (fallbackTimerRef.current) {
                clearTimeout(fallbackTimerRef.current);
            }
            setImageLoading(false);
        };

        const getLetters = () => {
            if (!letters) return '';
            const words = letters.trim().split(/\s+/);
            if (words.length >= 2) {
                return `${words[0][0]}${words[1][0]}`.toUpperCase();
            }
            return letters.slice(0, 2).toUpperCase();
        };

        const getShapeStyle = () => {
            // Only apply clip-path for custom shapes (not circle, square, rounded)
            if (shape && ['circle', 'square', 'rounded'].includes(shape)) {
                return undefined;
            }
            return shapeStyles[shape as AvatarShape];
        };

        const getContainerStyle = () => {
            const style: React.CSSProperties = {};

            // Apply custom background color if provided
            if (backgroundColor) {
                style.backgroundColor = backgroundColor;
            }

            // Apply clip-path to container for custom shapes
            if (shape && !['circle', 'square', 'rounded'].includes(shape)) {
                const shapeStyle = shapeStyles[shape as AvatarShape];
                if (shapeStyle.clipPath) {
                    style.clipPath = shapeStyle.clipPath;
                }
            }

            return style;
        };

        const renderContent = () => {
            const customShapeStyle = getShapeStyle();

            if (src && !imageError) {
                return (
                    <img
                        src={src}
                        alt={alt}
                        className="h-full w-full object-cover"
                        style={customShapeStyle}
                        onError={handleImageError}
                        onLoad={handleImageLoad}
                        loading="lazy"
                        decoding="async"
                        aria-label={alt}
                    />
                );
            }

            // Show loading state if image is still loading
            if (imageLoading) {
                return (
                    <div
                        className="h-full w-full flex items-center justify-center"
                        style={customShapeStyle}
                    >
                        <div className="animate-pulse bg-muted-foreground/20 rounded-full h-1/2 w-1/2" />
                    </div>
                );
            }

            // Fallback content when image fails or no src
            const content = fallback ? (
                <div className="h-full w-full flex items-center justify-center">{fallback}</div>
            ) : icon ? (
                <div className="h-full w-full flex items-center justify-center">{icon}</div>
            ) : letters ? (
                <span className="font-bold">{getLetters()}</span>
            ) : (
                <User className="h-1/2 w-1/2 text-gray-500 dark:text-gray-400" aria-hidden="true" />
            );

            return (
                <div
                    className="h-full w-full flex items-center justify-center"
                    style={customShapeStyle}
                >
                    {content}
                </div>
            );
        };

        return (
            <div className="relative inline-block">
                <motion.div
                    ref={ref}
                    className={cn(
                        avatarVariants({
                            size,
                            shape,
                            bordered,
                            clickable,
                            hasBackground: !backgroundColor // Only use default background if no custom color
                        }),
                        className,
                        'group'
                    )}
                    style={getContainerStyle()}
                    whileHover={clickable ? { scale: 1.05 } : undefined}
                    whileTap={clickable ? { scale: 0.95 } : undefined}
                    {...props}
                >
                    {renderContent()}
                </motion.div>

                {/* Status indicator positioned outside */}
                {status && (
                    <div
                        className={cn(statusVariants({ size, status }))}
                        aria-label={`Status: ${status}`}
                        role="status"
                    />
                )}
            </div>
        );
    }
);

Avatar.displayName = 'Avatar';

export interface AvatarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    max?: number;
    spacing?: number;
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | '8xl' | '9xl';
}

const AvatarGroup = forwardRef<HTMLDivElement, AvatarGroupProps>(
    ({ children, max, spacing = -4, size = 'md', className, ...props }, ref) => {
        const childrenArray = React.Children.toArray(children);
        const totalChildren = childrenArray.length;
        const displayChildren = max ? childrenArray.slice(0, max) : childrenArray;
        const extraCount = max && totalChildren > max ? totalChildren - max : 0;

        return (
            <div
                ref={ref}
                className={cn('flex items-center', className)}
                style={{ marginLeft: `${Math.abs(spacing)}px` }}
                role="group"
                aria-label="Avatar group"
                {...props}
            >
                {displayChildren.map((child, index) => (
                    <div
                        key={index}
                        className="relative"
                        style={{ marginLeft: `${spacing}px` }}
                    >
                        {React.isValidElement<AvatarProps>(child)
                            ? React.cloneElement(child, {
                                bordered: true,
                                size: child.props.size || size,
                            })
                            : child}
                    </div>
                ))}
                {extraCount > 0 && (
                    <div className="relative" style={{ marginLeft: `${spacing}px` }}>
                        {/* Create a motion.div that matches the Avatar structure exactly */}
                        <motion.div
                            className={cn(
                                avatarVariants({
                                    size,
                                    shape: 'circle',
                                    bordered: true,
                                    clickable: false,
                                    hasBackground: true,
                                }),
                                'bg-gray-200 dark:bg-gray-700 flex items-center justify-center'
                            )}
                            aria-label={`${extraCount} more avatars`}
                            role="status"
                        >
                            <span className="font-bold">+{extraCount}</span>
                        </motion.div>
                    </div>
                )}
            </div>
        );
    }
);


AvatarGroup.displayName = 'AvatarGroup';

export { Avatar, AvatarGroup };
