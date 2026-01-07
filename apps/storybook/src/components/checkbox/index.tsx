'use client';

import { motion } from 'framer-motion';
import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../../utils/cn';

const checkboxVariants = cva(
    'peer inline-flex items-center justify-center rounded border-2 border-border bg-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
    {
        variants: {
            variant: {
                default: 'border-primary data-[state=checked]:bg-primary data-[state=checked]:border-primary',
                primary: 'border-secondary data-[state=checked]:bg-secondary data-[state=checked]:border-secondary',
                success: 'border-success data-[state=checked]:bg-success data-[state=checked]:border-success',
                warning: 'border-warning data-[state=checked]:bg-warning data-[state=checked]:border-warning',
                danger: 'border-destructive data-[state=checked]:bg-destructive data-[state=checked]:border-destructive',
                outline: 'border-input data-[state=checked]:bg-transparent data-[state=checked]:border-primary',
                subtle: 'border-muted data-[state=checked]:bg-accent data-[state=checked]:border-accent',
                glass: 'border-white/30 data-[state=checked]:bg-white/20 data-[state=checked]:border-white/50',
                neon: 'border-pink-500 data-[state=checked]:bg-pink-500 data-[state=checked]:border-pink-500 shadow-lg shadow-pink-500/30',
            },
            size: {
                xs: 'h-3 w-3 rounded-sm',
                sm: 'h-4 w-4 rounded',
                md: 'h-5 w-5 rounded-md',
                lg: 'h-6 w-6 rounded-md',
                xl: 'h-7 w-7 rounded-lg',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'md',
        },
    }
);

export interface CheckboxProps
    extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'onChange'>,
    VariantProps<typeof checkboxVariants> {
    label?: string;
    labelPosition?: 'left' | 'right';
    error?: string;
    asChild?: boolean;
    animationVariant?: string;
    onChange?: (checked: boolean) => void;
}

const labelVariants = cva('transition-colors duration-200', {
    variants: {
        size: {
            xs: 'text-xs',
            sm: 'text-sm',
            md: 'text-base',
            lg: 'text-lg',
            xl: 'text-xl',
        },
        disabled: {
            true: 'text-muted-foreground cursor-not-allowed',
            false: 'text-foreground cursor-pointer',
        },
    },
    defaultVariants: {
        size: 'md',
        disabled: false,
    },
});

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
    (
        {
            className,
            variant,
            size,
            label,
            labelPosition = 'right',
            error,
            disabled = false,
            asChild = false,
            animationVariant,
            onChange,
            checked,
            defaultChecked,
            ...props
        },
        ref
    ) => {
        const [isChecked, setIsChecked] = React.useState(defaultChecked || false);
        const internalChecked = checked !== undefined ? checked : isChecked;

        const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
            if (checked === undefined) {
                setIsChecked(event.target.checked);
            }
            onChange?.(event.target.checked);
        };

        const getAnimationProps = () => {
            if (!animationVariant) return {};

            const animations = {
                bounce: {
                    whileTap: { scale: 0.8 },
                    transition: { duration: 0.1 },
                },
                scale: {
                    whileTap: { scale: 0.9 },
                    transition: { duration: 0.1 },
                },
                pulse: {
                    whileHover: { scale: 1.1 },
                    transition: { duration: 0.2 },
                },
                glow: {
                    whileHover: {
                        boxShadow: '0 0 20px rgba(37, 99, 255, 0.5)',
                    },
                    transition: { duration: 0.3 },
                },
                shake: {
                    whileHover: {
                        x: [0, -4, 4, -4, 4, 0],
                    },
                    transition: { duration: 0.5 },
                },
                flip: {
                    whileHover: { rotateY: 180 },
                    transition: { duration: 0.4 },
                },
            };

            return animations[animationVariant as keyof typeof animations] || {};
        };

        const animationProps = getAnimationProps();

        const CheckboxInput = (
            <motion.div
                className={cn(
                    checkboxVariants({ variant, size }),
                    'relative flex-shrink-0',
                    error && 'border-destructive',
                    className
                )}
                data-state={internalChecked ? 'checked' : 'unchecked'}
                {...animationProps}
            >
                <input
                    type="checkbox"
                    ref={ref}
                    checked={internalChecked}
                    onChange={handleChange}
                    disabled={disabled}
                    className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                    {...props}
                />

                <motion.svg
                    className="h-full w-full text-white"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                >
                    <motion.polyline
                        points="20 6 9 17 4 12"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={internalChecked ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
                        transition={internalChecked ?
                            { duration: 0.2, type: 'spring', stiffness: 400, damping: 25 } :
                            { duration: 0.1 }
                        }
                    />
                </motion.svg>
            </motion.div>
        );

        const CheckboxLabel = label && (
            <motion.label
                className={cn(
                    labelVariants({ size, disabled }),
                    'select-none'
                )}
                onClick={(e: React.MouseEvent<HTMLLabelElement>) => {
                    e.preventDefault();
                    if (!disabled) {
                        const newChecked = !internalChecked;
                        if (checked === undefined) {
                            setIsChecked(newChecked);
                        }
                        onChange?.(newChecked);
                    }
                }}
            >
                {label}
            </motion.label>
        );

        const renderNinaVariant = () => {
            return (
                <motion.div
                    className={cn(
                        'inline-flex items-center gap-2',
                        labelPosition === 'left' ? 'flex-row-reverse' : 'flex-row'
                    )}
                    whileHover="hover"
                    initial="initial"
                >
                    <motion.div
                        className={cn(
                            checkboxVariants({ variant, size }),
                            'relative overflow-hidden flex-shrink-0',
                            error && 'border-destructive',
                            className
                        )}
                        data-state={internalChecked ? 'checked' : 'unchecked'}
                    >
                        <input
                            type="checkbox"
                            ref={ref}
                            checked={internalChecked}
                            onChange={handleChange}
                            disabled={disabled}
                            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                            {...props}
                        />

                        {/* Nina animation layers */}
                        <motion.div
                            className="absolute inset-0 bg-primary"
                            initial={{ scale: 0 }}
                            animate={{ scale: internalChecked ? 1 : 0 }}
                            transition={{ duration: 0.3, ease: [0.75, 0, 0.125, 1] }}
                        />

                        <motion.svg
                            className="relative h-full w-full text-white z-10"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                        >
                            <motion.polyline
                                points="20 6 9 17 4 12"
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: internalChecked ? 1 : 0 }}
                                transition={{ duration: 0.3, delay: 0.1 }}
                            />
                        </motion.svg>
                    </motion.div>

                    {CheckboxLabel}
                </motion.div>
            );
        };

        if (asChild) {
            return (
                <Slot
                    className={cn('inline-flex items-center gap-2', className)}
                    ref={ref as React.Ref<HTMLInputElement>}
                >
                    <div className={cn(
                        'inline-flex items-center gap-2',
                        labelPosition === 'left' ? 'flex-row-reverse' : 'flex-row'
                    )}>
                        {CheckboxInput}
                        {CheckboxLabel}
                    </div>
                </Slot>
            );
        }

        if (animationVariant === 'nina') {
            return (
                <div className="inline-flex flex-col">
                    {renderNinaVariant()}
                    {error && (
                        <motion.span
                            className="mt-1 text-xs text-destructive"
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            {error}
                        </motion.span>
                    )}
                </div>
            );
        }

        return (
            <div className="inline-flex flex-col">
                <div className={cn(
                    'inline-flex items-center gap-2',
                    labelPosition === 'left' ? 'flex-row-reverse' : 'flex-row'
                )}>
                    {CheckboxInput}
                    {CheckboxLabel}
                </div>
                {error && (
                    <motion.span
                        className="mt-1 text-xs text-destructive"
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        {error}
                    </motion.span>
                )}
            </div>
        );
    }
);

Checkbox.displayName = 'Checkbox';

export { Checkbox };