import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Variants } from "framer-motion";
import { cva, type VariantProps } from 'class-variance-authority';
import {
    CheckIcon,
    Cross2Icon,
    ReloadIcon,
    EyeOpenIcon,
    EyeClosedIcon,
    ExclamationTriangleIcon,
    CheckCircledIcon,
    CrossCircledIcon,
    InfoCircledIcon,
    ChevronDownIcon,
    MagicWandIcon,
    RocketIcon,
} from '@radix-ui/react-icons';
import { cn } from '@site/src/utils/cn';
import { Button } from '@site/src/components/UI/button';
import { Typography } from '@site/src/components/UI/typography';

/* ============================================
   TYPES & INTERFACES
============================================ */

export type FieldValue = string | boolean | number | undefined;
export type FormValues = Record<string, FieldValue>;
export type ValidationErrors = Record<string, string>;

export type ConditionalOperator = 'equals' | 'notEquals' | 'includes' | 'greaterThan' | 'lessThan' | 'contains' | 'startsWith' | 'endsWith' | 'boolean';

export interface Condition {
    field: string;
    operator: ConditionalOperator;
    value: FieldValue | FieldValue[];
}

export interface ConditionalField {
    fieldId: string;
    condition: Condition;
    required?: boolean;
    preserveValue?: boolean;
}

export interface FieldOption {
    value: string;
    label: string;
    description?: string;
    icon?: React.ElementType;
}

export interface DynamicFormField {
    id: string;
    name: string;
    label: string;
    type: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'date' | 'range' | 'color';
    placeholder?: string;
    required?: boolean;
    options?: FieldOption[];
    validation?: (value: FieldValue, allValues?: FormValues) => string | undefined;
    defaultValue?: FieldValue;
    colSpan?: 'full' | 'half' | 'third' | 'quarter';
    icon?: React.ElementType;

    // Conditional logic
    conditions?: Condition[];
    conditionalFields?: ConditionalField[];

    // Field-specific validation
    emailValidation?: {
        pattern?: boolean;
        customPattern?: RegExp;
        domain?: string[];
        message?: string;
    };

    numberValidation?: {
        min?: number;
        max?: number;
        integer?: boolean;
        message?: string;
    };

    textValidation?: {
        minLength?: number;
        maxLength?: number;
        pattern?: RegExp;
        message?: string;
    };

    // Appearance
    color?: string;
    gradient?: string;
    iconColor?: string;
}

export interface Notification {
    id: string;
    type: 'success' | 'error' | 'info' | 'warning' | 'magic';
    message: string;
    duration?: number;
    icon?: React.ElementType;
}

interface DynamicFormContextType {
    formData: FormValues;
    errors: ValidationErrors;
    touchedFields: Set<string>;
    isSubmitting: boolean;
    visibleFields: Set<string>;

    updateField: (name: string, value: FieldValue) => void;
    validateForm: () => boolean;
    submitForm: () => Promise<void>;
    resetForm: () => void;
    getFieldVisibility: (fieldId: string) => boolean;

    fields: DynamicFormField[];
    inputVariant: string;
    buttonVariant: string;
    buttonAnimationVariant?: string;

    theme?: 'light' | 'dark' | 'system';
    colorScheme?: 'default' | 'vibrant' | 'pastel' | 'neon' | 'earthy' | 'ocean' | 'sunset' | 'forest';
    animationIntensity?: 'subtle' | 'moderate' | 'high';

    onCancel?: () => void;
    cancelButtonLabel?: string;
    showCancelButton?: boolean;
}

const DynamicFormContext = React.createContext<DynamicFormContextType | undefined>(undefined);

const useDynamicForm = (): DynamicFormContextType => {
    const context = React.useContext(DynamicFormContext);
    if (!context) {
        throw new Error('DynamicForm components must be used within a DynamicForm provider');
    }
    return context;
};

/* ============================================
   VARIANTS & ANIMATIONS
============================================ */

const DynamicFormVariants = cva("min-h-screen transition-all duration-500", {
    variants: {
        variant: {
            default: "bg-gradient-to-br from-background via-background to-secondary/5 text-foreground",
            vibrant: "bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 dark:from-purple-950 dark:via-pink-950 dark:to-orange-950 text-foreground",
            pastel: "bg-gradient-to-br from-blue-50 via-green-50 to-yellow-50 dark:from-blue-950 dark:via-green-950 dark:to-yellow-950 text-foreground",
            neon: "bg-gradient-to-br from-fuchsia-100 via-cyan-100 to-lime-100 dark:from-fuchsia-950 dark:via-cyan-950 dark:to-lime-950 text-foreground",
            earthy: "bg-gradient-to-br from-amber-50 via-stone-50 to-emerald-50 dark:from-amber-950 dark:via-stone-950 dark:to-emerald-950 text-foreground",
            ocean: "bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50 dark:from-cyan-950 dark:via-blue-950 dark:to-indigo-950 text-foreground",
            sunset: "bg-gradient-to-br from-orange-50 via-rose-50 to-purple-50 dark:from-orange-950 dark:via-rose-950 dark:to-purple-950 text-foreground",
            forest: "bg-gradient-to-br from-green-50 via-teal-50 to-lime-50 dark:from-green-950 dark:via-teal-950 dark:to-lime-950 text-foreground",
            galaxy: "bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white",
            candy: "bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300 dark:from-pink-700 dark:via-purple-700 dark:to-indigo-700",
            dark: "bg-gray-950 text-white",
        },
    },
    defaultVariants: {
        variant: "default",
    },
});

const CardVariants = cva("rounded-2xl overflow-hidden transition-all duration-500", {
    variants: {
        variant: {
            default: "bg-card/90 backdrop-blur-sm shadow-lg hover:shadow-xl border border-border/50",
            glass: "bg-card/70 backdrop-blur-md shadow-xl border border-white/20 dark:border-white/10",
            border: "bg-card border-2 border-primary/20 shadow-xl hover:shadow-2xl",
            elevated: "bg-card shadow-2xl hover:shadow-3xl",
            neon: "bg-card shadow-[0_0_30px_rgba(168,85,247,0.3)] border border-purple-500/30",
            vibrant: "bg-gradient-to-br from-primary/10 to-secondary/10 backdrop-blur-sm shadow-xl",
        },
    },
    defaultVariants: {
        variant: "default",
    },
});

const NotificationVariants = cva(
    "fixed z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border transition-all duration-300",
    {
        variants: {
            type: {
                success: "bg-gradient-to-r from-green-500 to-emerald-500 text-white border-green-600",
                error: "bg-gradient-to-r from-red-500 to-rose-500 text-white border-red-600",
                info: "bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-blue-600",
                warning: "bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-yellow-600",
                magic: "bg-gradient-to-r from-purple-500 to-pink-500 text-white border-purple-600 animate-pulse"
            }
        }
    }
);

// Animation variants
const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.3 }
};

const scaleIn = {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
    transition: { duration: 0.2 }
};

const slideInFromLeft = {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
    transition: { duration: 0.3 }
};

// const slideInFromRight = {
//     initial: { opacity: 0, x: 20 },
//     animate: { opacity: 1, x: 0 },
//     exit: { opacity: 0, x: -20 },
//     transition: { duration: 0.3 }
// };

const rotateIn = {
    initial: { opacity: 0, rotate: -10, scale: 0.95 },
    animate: { opacity: 1, rotate: 0, scale: 1 },
    exit: { opacity: 0, rotate: 10, scale: 0.95 },
    transition: { duration: 0.3 }
};

/* ============================================
   CONDITION EVALUATION UTILITIES
============================================ */

const evaluateCondition = (condition: Condition, allValues: FormValues): boolean => {
    const fieldValue = allValues[condition.field];
    const { operator, value } = condition;

    switch (operator) {
        case 'equals':
            return fieldValue === value;
        case 'notEquals':
            return fieldValue !== value;
        case 'includes':
            if (Array.isArray(value)) {
                return value.includes(fieldValue as string | boolean | number);
            }
            if (typeof fieldValue === 'string' && typeof value === 'string') {
                return fieldValue.includes(value);
            }
            return false;
        case 'contains':
            if (typeof fieldValue === 'string' && typeof value === 'string') {
                return fieldValue.toLowerCase().includes(value.toLowerCase());
            }
            return false;
        case 'startsWith':
            if (typeof fieldValue === 'string' && typeof value === 'string') {
                return fieldValue.toLowerCase().startsWith(value.toLowerCase());
            }
            return false;
        case 'endsWith':
            if (typeof fieldValue === 'string' && typeof value === 'string') {
                return fieldValue.toLowerCase().endsWith(value.toLowerCase());
            }
            return false;
        case 'greaterThan':
            if (typeof fieldValue === 'number' && typeof value === 'number') {
                return fieldValue > value;
            }
            if (typeof fieldValue === 'string' && typeof value === 'string') {
                return fieldValue.length > value.length;
            }
            return false;
        case 'lessThan':
            if (typeof fieldValue === 'number' && typeof value === 'number') {
                return fieldValue < value;
            }
            if (typeof fieldValue === 'string' && typeof value === 'string') {
                return fieldValue.length < value.length;
            }
            return false;
        case 'boolean':
            return Boolean(fieldValue) === Boolean(value);
        default:
            return false;
    }
};

/* ============================================
   MAIN PROVIDER COMPONENT
============================================ */

export interface DynamicFormProps {
    children: React.ReactNode;

    // Fields configuration
    fields: DynamicFormField[];
    initialData?: FormValues;

    // Callbacks
    onSubmit?: (data: FormValues) => Promise<void> | void;
    onCancel?: () => void;
    onChange?: (data: FormValues, visibleFields: string[]) => void;

    // Variants
    variant?: VariantProps<typeof DynamicFormVariants>["variant"];
    cardVariant?: VariantProps<typeof CardVariants>["variant"];

    // Component variants
    inputVariant?: string;
    buttonVariant?: string;
    buttonAnimationVariant?: string;

    // Labels
    submitButtonLabel?: string;
    cancelButtonLabel?: string;

    // States
    isLoading?: boolean;
    isSubmitting?: boolean;

    // Features
    showCancelButton?: boolean;
    animateFieldChanges?: boolean;
    animationIntensity?: 'subtle' | 'moderate' | 'high';

    // Notification options
    showSuccessNotification?: boolean;
    successNotificationDuration?: number;
    successNotificationMessage?: string;

    // Theme
    theme?: 'light' | 'dark' | 'system';
    colorScheme?: 'default' | 'vibrant' | 'pastel' | 'neon' | 'earthy' | 'ocean' | 'sunset' | 'forest';

    // Debug mode
    debug?: boolean;

    // Custom class names
    className?: string;
    containerClassName?: string;
}

/**
 * Main Dynamic Form component that provides context and layout for form functionality.
 * 
 * @component
 * @example
 * ```tsx
 * <DynamicForm
 *   fields={formFields}
 *   onSubmit={handleSubmit}
 *   variant="ocean"
 * >
 *   <DynamicForm.Header title="User Registration" />
 *   <DynamicForm.Content>
 *     <DynamicForm.Field field={fields.name} />
 *     <DynamicForm.Field field={fields.email} />
 *   </DynamicForm.Content>
 *   <DynamicForm.Navigation />
 * </DynamicForm>
 * ```
 */
const DynamicForm: React.FC<DynamicFormProps> & {
    Header: typeof DynamicHeader;
    Content: typeof DynamicContent;
    Navigation: typeof DynamicNavigation;
    Field: typeof DynamicField;
    Section: typeof DynamicSection;
    Notification: typeof DynamicNotification;
    Debugger: typeof DynamicDebugger;
} = ({
    children,
    fields,
    initialData = {},
    onSubmit,
    onCancel,
    onChange,
    variant = "default",
    // cardVariant = "default",
    inputVariant = 'default',
    buttonVariant = 'default',
    buttonAnimationVariant,
    // submitButtonLabel = "Submit",
    cancelButtonLabel = "Cancel",
    isLoading = false,
    isSubmitting: externalIsSubmitting = false,
    showCancelButton = true,
    // animateFieldChanges = true,
    // animationIntensity = 'moderate',
    showSuccessNotification = true,
    successNotificationDuration = 3000,
    successNotificationMessage = "✨ Form submitted successfully!",
    theme: initialTheme = 'system',
    colorScheme = 'default',
    debug = false,
    className,
    containerClassName
}) => {
        const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>(() => {
            if (initialTheme !== 'system') return initialTheme;
            return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        });

        const [formData, setFormData] = useState<FormValues>(() => {
            const initial: FormValues = {};
            fields.forEach(field => {
                if (initialData[field.name] !== undefined) {
                    initial[field.name] = initialData[field.name];
                } else if (field.defaultValue !== undefined) {
                    initial[field.name] = field.defaultValue;
                }
            });
            return initial;
        });

        const [errors, setErrors] = useState<ValidationErrors>({});
        const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());
        const [internalIsSubmitting, setInternalIsSubmitting] = useState(false);
        const [notification, setNotification] = useState<Notification | null>(null);
        // const [preservedValues, setPreservedValues] = useState<FormValues>({});

        const isSubmitting = externalIsSubmitting || internalIsSubmitting;

        // Handle system theme changes
        useEffect(() => {
            if (initialTheme !== 'system') return;

            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            const handler = (e: MediaQueryListEvent): void => {
                setCurrentTheme(e.matches ? 'dark' : 'light');
            };

            mediaQuery.addEventListener('change', handler);
            return (): void => mediaQuery.removeEventListener('change', handler);
        }, [initialTheme]);

        const visibleFields = useMemo(() => {
            const visible = new Set<string>();

            fields.forEach(field => {
                if (field.conditions && field.conditions.length > 0) {
                    const shouldShow = field.conditions.every(condition =>
                        evaluateCondition(condition, formData)
                    );

                    if (shouldShow) {
                        visible.add(field.id);

                        if (field.conditionalFields) {
                            field.conditionalFields.forEach(conditionalField => {
                                const condition = conditionalField.condition;
                                if (evaluateCondition(condition, formData)) {
                                    visible.add(conditionalField.fieldId);
                                }
                            });
                        }
                    }
                } else {
                    visible.add(field.id);
                }
            });

            fields.forEach(field => {
                if (field.conditionalFields) {
                    field.conditionalFields.forEach(conditionalField => {
                        const condition = conditionalField.condition;
                        if (evaluateCondition(condition, formData)) {
                            visible.add(conditionalField.fieldId);
                        }
                    });
                }
            });

            return visible;
        }, [fields, formData]);

        useEffect(() => {
            onChange?.(formData, Array.from(visibleFields));
        }, [formData, visibleFields, onChange]);

        const validateField = useCallback((field: DynamicFormField, value: FieldValue, allValues: FormValues): string | undefined => {
            if (!visibleFields.has(field.id)) {
                return undefined;
            }

            if (field.required && (value === undefined || value === null || value === '')) {
                return `${field.label} is required`;
            }

            if (field.type === 'email' && value && typeof value === 'string' && value.trim() !== '') {
                const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

                if (!emailRegex.test(value)) {
                    return field.emailValidation?.message || 'Please enter a valid email address';
                }

                if (field.emailValidation?.domain && field.emailValidation.domain.length > 0) {
                    const domain = value.split('@')[1];
                    if (!field.emailValidation.domain.includes(domain)) {
                        return field.emailValidation.message ||
                            `Email must be from: ${field.emailValidation.domain.join(', ')}`;
                    }
                }

                if (field.emailValidation?.customPattern) {
                    if (!field.emailValidation.customPattern.test(value)) {
                        return field.emailValidation.message || 'Email format is invalid';
                    }
                }
            }

            if (field.type === 'number' && value !== undefined && value !== '') {
                const numValue = Number(value);

                if (isNaN(numValue)) {
                    return 'Please enter a valid number';
                }

                if (field.numberValidation?.integer && !Number.isInteger(numValue)) {
                    return field.numberValidation.message || 'Please enter a whole number';
                }

                if (field.numberValidation?.min !== undefined && numValue < field.numberValidation.min) {
                    return field.numberValidation.message || `Minimum value is ${field.numberValidation.min}`;
                }

                if (field.numberValidation?.max !== undefined && numValue > field.numberValidation.max) {
                    return field.numberValidation.message || `Maximum value is ${field.numberValidation.max}`;
                }
            }

            if ((field.type === 'text' || field.type === 'textarea') && typeof value === 'string') {
                if (field.textValidation?.minLength && value.length < field.textValidation.minLength) {
                    return field.textValidation.message || `Minimum length is ${field.textValidation.minLength} characters`;
                }

                if (field.textValidation?.maxLength && value.length > field.textValidation.maxLength) {
                    return field.textValidation.message || `Maximum length is ${field.textValidation.maxLength} characters`;
                }

                if (field.textValidation?.pattern && !field.textValidation.pattern.test(value)) {
                    return field.textValidation.message || 'Invalid format';
                }
            }

            if (field.validation) {
                return field.validation(value, allValues);
            }

            return undefined;
        }, [visibleFields]);

        const validateForm = useCallback((): boolean => {
            const newErrors: ValidationErrors = {};
            let isValid = true;

            fields.forEach(field => {
                if (visibleFields.has(field.id)) {
                    const error = validateField(field, formData[field.name], formData);
                    if (error) {
                        newErrors[field.name] = error;
                        isValid = false;
                    }
                }
            });

            setErrors(newErrors);
            return isValid;
        }, [fields, formData, visibleFields, validateField]);

        const updateField = useCallback((name: string, value: FieldValue) => {
            setFormData(prev => {
                const newData = { ...prev, [name]: value };

                if (errors[name]) {
                    setErrors(prevErrors => {
                        const newErrors = { ...prevErrors };
                        delete newErrors[name];
                        return newErrors;
                    });
                }

                return newData;
            });

            setTouchedFields(prev => new Set(prev).add(name));
        }, [errors]);

        const getFieldVisibility = useCallback((fieldId: string): boolean => {
            return visibleFields.has(fieldId);
        }, [visibleFields]);

        const resetForm = useCallback(() => {
            const initial: FormValues = {};
            fields.forEach(field => {
                if (initialData[field.name] !== undefined) {
                    initial[field.name] = initialData[field.name];
                } else if (field.defaultValue !== undefined) {
                    initial[field.name] = field.defaultValue;
                }
            });

            setFormData(initial);
            setErrors({});
            setTouchedFields(new Set());
            // setPreservedValues({});
        }, [fields, initialData]);

        const submitForm = async (): Promise<void> => {
            if (!onSubmit) return;

            if (!validateForm()) {
                const newTouchedFields = new Set(touchedFields);
                fields.forEach(field => {
                    if (visibleFields.has(field.id)) {
                        newTouchedFields.add(field.name);
                    }
                });
                setTouchedFields(newTouchedFields);

                setNotification({
                    id: Date.now().toString(),
                    type: 'error',
                    message: 'Please fix the errors before submitting',
                    duration: successNotificationDuration
                });

                return;
            }

            setInternalIsSubmitting(true);
            try {
                const submissionData: FormValues = {};
                fields.forEach(field => {
                    if (visibleFields.has(field.id) && formData[field.name] !== undefined) {
                        submissionData[field.name] = formData[field.name];
                    }
                });

                await onSubmit(submissionData);

                if (showSuccessNotification) {
                    setNotification({
                        id: Date.now().toString(),
                        type: 'success',
                        message: successNotificationMessage,
                        icon: CheckCircledIcon,
                        duration: successNotificationDuration
                    });
                }
            } catch (error) {
                setNotification({
                    id: Date.now().toString(),
                    type: 'error',
                    message: error instanceof Error ? error.message : 'Failed to submit form. Please try again.',
                    duration: successNotificationDuration
                });
            } finally {
                setInternalIsSubmitting(false);
            }
        };

        // const toggleTheme = () => {
        //     setCurrentTheme(prev => prev === 'light' ? 'dark' : 'light');
        // };

        const contextValue: DynamicFormContextType = {
            formData,
            errors,
            touchedFields,
            isSubmitting,
            visibleFields,
            updateField,
            validateForm,
            submitForm,
            resetForm,
            getFieldVisibility,
            fields,
            inputVariant,
            buttonVariant,
            buttonAnimationVariant,
            theme: currentTheme,
            colorScheme,
            onCancel,
            cancelButtonLabel,
            showCancelButton
        };

        if (isLoading) {
            return (
                <div className={cn("min-h-screen flex items-center justify-center", currentTheme === 'dark' && "dark")}>
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                        <RocketIcon className="w-12 h-12 text-primary" />
                    </motion.div>
                </div>
            );
        }

        return (
            <DynamicFormContext.Provider value={contextValue}>
                <div className={cn(
                    "py-10",
                    DynamicFormVariants({ variant }),
                    currentTheme === 'dark' && "dark",
                    className
                )}>
                    {notification && (
                        <DynamicNotification
                            type={notification.type}
                            message={notification.message}
                            onClose={(): void => setNotification(null)}
                            duration={notification.duration}
                            icon={notification.icon}
                        />
                    )}

                    {debug && <DynamicDebugger />}

                    <main className={cn("container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8", containerClassName)}>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="space-y-8"
                        >
                            {children}
                        </motion.div>
                    </main>

                </div>
            </DynamicFormContext.Provider>
        );
    };

/* ============================================
   HEADER COMPONENT
============================================ */

export interface DynamicHeaderProps {
    title?: string | React.ReactNode;
    description?: string;
    icon?: React.ReactNode;
    children?: React.ReactNode;
    className?: string;
    titleClassName?: string;
    descriptionClassName?: string;
    iconClassName?: string;
    containerClassName?: string;
    titleVariant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body-large' | 'body' | 'body-small' | 'lead' | 'large' | 'small' | 'label' | 'caption' | 'muted' | 'link' | 'code' | 'blockquote' | 'list';
    titleWeight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold';
    titleColor?: 'default' | 'primary' | 'secondary' | 'muted' | 'error' | 'success' | 'warning' | 'inherit';
    descriptionVariant?: 'body' | 'body-small' | 'caption' | 'muted';
    iconSize?: number;
    animated?: boolean;
    gradient?: boolean;
}

/**
 * Header component for the Dynamic Form with optional title, description, and icon.
 * Supports sticky positioning and animated transitions.
 * 
 * @component
 * @example
 * ```tsx
 * <DynamicForm.Header
 *   title="Contact Information"
 *   description="Please provide your contact details"
 *   icon={<UserIcon />}
 *   gradient
 * />
 * ```
 */
const DynamicHeader: React.FC<DynamicHeaderProps> = ({
    title,
    description,
    icon,
    children,
    className,
    titleClassName,
    descriptionClassName,
    iconClassName,
    containerClassName,
    titleVariant = 'h4',
    titleWeight = 'bold',
    titleColor = 'default',
    descriptionVariant = 'muted',
    iconSize = 24,
    animated = true,
    gradient = false
}) => {
    if (children) {
        return (
            <header className={cn(
                "z-10 bg-background/80 backdrop-blur-md border-b border-border",
                animated && "transition-all duration-300",
                className
            )}>
                <div className="container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {children}
                    </div>
                </div>
            </header>
        );
    }

    return (
        <header className={cn(
            "bg-background/0 p-3 border-b border-border",
            animated && "transition-all duration-300",
            className
        )}>
            <div className={cn("container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8", containerClassName)}>
                <div className="flex items-center gap-4 h-16">
                    {icon && (
                        <motion.div
                            initial={animated ? { scale: 0.8, rotate: -10 } : false}
                            animate={animated ? { scale: 1, rotate: 0 } : false}
                            transition={{ duration: 0.3, type: "spring" }}
                            className={cn(
                                "rounded-lg bg-primary/10 flex items-center justify-center text-primary",
                                iconClassName
                            )}
                        >
                            <div style={{ width: iconSize, height: iconSize }} className="flex items-center justify-center">
                                {icon}
                            </div>
                        </motion.div>
                    )}
                    <motion.div
                        initial={animated ? { opacity: 0, x: -10 } : false}
                        animate={animated ? { opacity: 1, x: 0 } : false}
                        transition={{ duration: 0.3, delay: 0.1 }}
                    >
                        {typeof title === 'string' ? (
                            <Typography
                                variant={titleVariant}
                                weight={titleWeight}
                                color={titleColor}
                                className={cn(
                                    gradient && "bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent",
                                    titleClassName
                                )}
                            >
                                {title}
                            </Typography>
                        ) : (
                            title
                        )}
                        {description && (
                            <Typography
                                variant={descriptionVariant}
                                color="muted"
                                className={cn("mt-1", descriptionClassName)}
                            >
                                {description}
                            </Typography>
                        )}
                    </motion.div>
                </div>
            </div>
        </header>
    );
};

/* ============================================
   CONTENT COMPONENT
============================================ */

export interface DynamicContentProps {
    children: React.ReactNode;
    className?: string;
    animateChanges?: boolean;
    cardVariant?: VariantProps<typeof CardVariants>["variant"];
    showFieldCount?: boolean;
}

/**
 * Content container for form fields with animated transitions and card styling.
 * Automatically handles field visibility and animations based on conditional logic.
 * 
 * @component
 * @example
 * ```tsx
 * <DynamicForm.Content
 *   cardVariant="glass"
 *   showFieldCount={true}
 *   animateChanges={true}
 * >
 *   <DynamicForm.Field field={fields.name} />
 *   <DynamicForm.Section title="Additional Info">
 *     <DynamicForm.Field field={fields.phone} />
 *   </DynamicForm.Section>
 * </DynamicForm.Content>
 * ```
 */
const DynamicContent: React.FC<DynamicContentProps> = ({
    children,
    className,
    animateChanges = true,
    cardVariant = "default",
    showFieldCount = true
}) => {
    const { fields, visibleFields, colorScheme } = useDynamicForm();

    const getCardGradient = (): string => {
        const gradients = {
            default: "bg-card",
            vibrant: "bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5",
            pastel: "bg-gradient-to-br from-blue-50/50 via-green-50/50 to-yellow-50/50 dark:from-blue-950/30 dark:via-green-950/30 dark:to-yellow-950/30",
            neon: "bg-gradient-to-br from-fuchsia-500/10 via-cyan-500/10 to-lime-500/10",
            earthy: "bg-gradient-to-br from-amber-500/10 via-stone-500/10 to-emerald-500/10",
            ocean: "bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-indigo-500/10",
            sunset: "bg-gradient-to-br from-orange-500/10 via-rose-500/10 to-purple-500/10",
            forest: "bg-gradient-to-br from-green-500/10 via-teal-500/10 to-lime-500/10",
        };
        return gradients[colorScheme as keyof typeof gradients] || gradients.default;
    };

    const renderFields = (): React.ReactNode => {
        return React.Children.map(children, child => {
            if (React.isValidElement(child) && child.type === DynamicField) {
                const field = (child.props as { field: DynamicFormField }).field;
                const isVisible = visibleFields.has(field.id);

                if (!isVisible) return null;

                if (animateChanges) {
                    return (
                        <motion.div
                            {...scaleIn}
                            layout
                            className="overflow-hidden"
                        >
                            {child}
                        </motion.div>
                    );
                }

                return child;
            }

            if (React.isValidElement(child) && child.type === DynamicSection) {
                return child;
            }

            return child;
        });
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className={cn(CardVariants({ variant: cardVariant }), getCardGradient(), "transition-all duration-500", className)}
        >
            <div className="p-6 md:p-8">
                <div className="space-y-6">
                    <AnimatePresence mode="popLayout">
                        {renderFields()}
                    </AnimatePresence>
                </div>

                {showFieldCount && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        <Typography variant="caption" color="muted" className="text-center block mt-4">
                            {visibleFields.size} of {fields.length} fields visible
                        </Typography>
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
};

/* ============================================
   FIELD COMPONENT
============================================ */

export interface DynamicFieldProps {
    field: DynamicFormField;
    className?: string;
    showLabel?: boolean;
    animationVariant?: 'fade' | 'slide' | 'scale' | 'rotate';
}

/**
 * Individual form field component that renders appropriate input type based on field configuration.
 * Supports various field types: text, email, password, number, textarea, select, checkbox, radio, date, range, color.
 * Includes validation, animations, and conditional visibility.
 * 
 * @component
 * @example
 * ```tsx
 * <DynamicForm.Field
 *   field={{
 *     id: 'email',
 *     name: 'email',
 *     label: 'Email Address',
 *     type: 'email',
 *     required: true,
 *     icon: EnvelopeIcon,
 *     validation: (value) => !value ? 'Email is required' : undefined
 *   }}
 *   animationVariant="slide"
 * />
 * ```
 */
const DynamicField: React.FC<DynamicFieldProps> = ({
    field,
    className,
    showLabel = true,
    animationVariant = 'fade'
}) => {
    const {
        formData,
        errors,
        touchedFields,
        updateField,
        getFieldVisibility,
        // theme
    } = useDynamicForm();

    const [showPassword, setShowPassword] = useState(false);
    const [localError, setLocalError] = useState<string | undefined>();
    const [isFocused, setIsFocused] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const Icon = field.icon;
    const value = formData[field.name];
    const error = touchedFields.has(field.name) ? errors[field.name] : undefined;
    const displayError = error || localError;
    const fieldId = `field-${field.id}`;

    const isVisible = getFieldVisibility(field.id);

    if (!isVisible) return null;

    const getAnimationVariant = (): Variants => {
        switch (animationVariant) {
            case 'slide': return slideInFromLeft;
            case 'scale': return scaleIn;
            case 'rotate': return rotateIn;
            default: return fadeInUp;
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>): void => {
        let val: FieldValue;

        if (e.target.type === 'checkbox') {
            val = (e as React.ChangeEvent<HTMLInputElement>).target.checked;
        } else {
            val = e.target.value;
        }

        updateField(field.name, val);
        setLocalError(undefined);
    };

    const handleBlur = (): void => {
        setIsFocused(false);
    };

    const handleFocus = (): void => {
        setIsFocused(true);
    };

    const renderField = (): React.ReactNode => {
        const commonClasses = cn(
            "w-full px-4 py-3 rounded-lg transition-all duration-300",
            "bg-background border-2",
            Icon && "pl-10",
            displayError ? "border-destructive/50 focus:border-destructive" : "border-border focus:border-primary",
            "focus:outline-none focus:ring-4 focus:ring-primary/20",
            "text-foreground placeholder:text-muted-foreground",
            isHovered && !displayError && "border-primary/50"
        );

        switch (field.type) {
            case 'textarea':
                return (
                    <textarea
                        id={fieldId}
                        name={field.name}
                        value={typeof value === 'string' ? value : ''}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        onFocus={handleFocus}
                        onMouseEnter={(): void => setIsHovered(true)}
                        onMouseLeave={(): void => setIsHovered(false)}
                        placeholder={field.placeholder}
                        required={field.required}
                        rows={4}
                        className={cn(commonClasses, "resize-none")}
                    />
                );

            case 'select':
                return (
                    <div className="relative">
                        <select
                            id={fieldId}
                            name={field.name}
                            value={typeof value === 'string' ? value : ''}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            onFocus={handleFocus}
                            onMouseEnter={(): void => setIsHovered(true)}
                            onMouseLeave={(): void => setIsHovered(false)}
                            required={field.required}
                            className={cn(commonClasses, "appearance-none pr-10")}
                        >
                            <option value="">Select {field.label}</option>
                            {field.options?.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                    </div>
                );

            case 'checkbox':
                return (
                    <div className="flex items-center gap-3">
                        <motion.input
                            type="checkbox"
                            id={fieldId}
                            name={field.name}
                            checked={typeof value === 'boolean' ? value : false}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            onFocus={handleFocus}
                            whileTap={{ scale: 0.95 }}
                            className="w-5 h-5 rounded border-2 border-input text-primary focus:ring-primary/20"
                        />
                        <Typography variant="body-small" color="muted">
                            {field.placeholder || field.label}
                        </Typography>
                    </div>
                );

            case 'radio':
                return (
                    <div className="space-y-2">
                        {field.options?.map(option => (
                            <motion.div
                                key={option.value}
                                className="flex items-center gap-3"
                                whileHover={{ x: 5 }}
                                transition={{ duration: 0.2 }}
                            >
                                <input
                                    type="radio"
                                    id={`${fieldId}-${option.value}`}
                                    name={field.name}
                                    value={option.value}
                                    checked={value === option.value}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    onFocus={handleFocus}
                                    className="w-5 h-5 border-2 border-input text-primary focus:ring-primary/20"
                                />
                                <label
                                    htmlFor={`${fieldId}-${option.value}`}
                                    className={cn(
                                        "text-sm cursor-pointer hover:text-foreground transition-colors",
                                        value === option.value ? "text-primary font-medium" : "text-muted-foreground"
                                    )}
                                >
                                    {option.label}
                                    {option.description && (
                                        <span className="block text-xs text-muted-foreground">{option.description}</span>
                                    )}
                                </label>
                            </motion.div>
                        ))}
                    </div>
                );

            case 'password':
                return (
                    <div className="relative">
                        <input
                            id={fieldId}
                            type={showPassword ? "text" : "password"}
                            value={typeof value === 'string' ? value : ''}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            onFocus={handleFocus}
                            onMouseEnter={(): void => setIsHovered(true)}
                            onMouseLeave={(): void => setIsHovered(false)}
                            placeholder={field.placeholder || field.label}
                            required={field.required}
                            className={cn(commonClasses, "pr-10")}
                        />
                        {Icon && (
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                <Icon className="w-4 h-4" />
                            </div>
                        )}
                        <motion.button
                            type="button"
                            onClick={(): void => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                            {showPassword ? (
                                <EyeClosedIcon className="w-4 h-4" />
                            ) : (
                                <EyeOpenIcon className="w-4 h-4" />
                            )}
                        </motion.button>
                    </div>
                );

            case 'range':
                return (
                    <div className="space-y-2">
                        <input
                            type="range"
                            id={fieldId}
                            name={field.name}
                            value={typeof value === 'number' ? value : field.numberValidation?.min || 0}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            onFocus={handleFocus}
                            min={field.numberValidation?.min || 0}
                            max={field.numberValidation?.max || 100}
                            step={field.numberValidation?.integer ? 1 : 0.1}
                            className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer"
                        />
                        <div className="flex justify-between text-sm text-muted-foreground">
                            <span>{field.numberValidation?.min || 0}</span>
                            <span>{value || field.numberValidation?.min || 0}</span>
                            <span>{field.numberValidation?.max || 100}</span>
                        </div>
                    </div>
                );

            case 'color':
                return (
                    <div className="flex items-center gap-3">
                        <input
                            type="color"
                            id={fieldId}
                            name={field.name}
                            value={typeof value === 'string' ? value : '#000000'}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            onFocus={handleFocus}
                            className="w-10 h-10 rounded cursor-pointer"
                        />
                        <span className="text-sm text-muted-foreground">
                            {typeof value === 'string' ? value : 'Select a color'}
                        </span>
                    </div>
                );

            default:
                return (
                    <div className="relative">
                        <input
                            type={field.type}
                            id={fieldId}
                            name={field.name}
                            value={typeof value === 'string' ? value : ''}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            onFocus={handleFocus}
                            onMouseEnter={(): void => setIsHovered(true)}
                            onMouseLeave={(): void => setIsHovered(false)}
                            placeholder={field.placeholder || field.label}
                            required={field.required}
                            className={cn(commonClasses)}
                        />
                        {Icon && (
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                <Icon className="w-4 h-4" />
                            </div>
                        )}
                    </div>
                );
        }
    };

    return (
        <motion.div
            {...getAnimationVariant()}
            layout
            className={cn(
                "space-y-2",
                field.colSpan === 'full' && "col-span-full",
                field.colSpan === 'half' && "col-span-1",
                field.colSpan === 'third' && "col-span-1 md:col-span-1",
                field.colSpan === 'quarter' && "col-span-1 md:col-span-1 lg:col-span-1",
                className
            )}
        >
            {showLabel && field.type !== 'checkbox' && field.type !== 'radio' && (
                <motion.div
                    className="flex items-center justify-between"
                    initial={false}
                    animate={isFocused ? { color: 'var(--primary)' } : {}}
                >
                    <label
                        htmlFor={fieldId}
                        className={cn(
                            "flex items-center gap-2 text-sm font-medium transition-colors duration-200 cursor-pointer",
                            isFocused ? "text-primary" : "text-muted-foreground"
                        )}
                    >
                        {Icon && <Icon className={cn("w-3 h-3", field.iconColor)} />}
                        {field.label}
                        {field.required && <span className="text-destructive">*</span>}
                    </label>

                    {(field.type === 'text' || field.type === 'textarea') &&
                        field.textValidation?.maxLength &&
                        typeof value === 'string' && (
                            <motion.div
                                animate={{ scale: value.length > field.textValidation.maxLength * 0.8 ? [1, 1.1, 1] : 1 }}
                                transition={{ duration: 0.3 }}
                            >
                                <Typography variant="caption" color="muted">
                                    {value.length}/{field.textValidation.maxLength}
                                </Typography>
                            </motion.div>
                        )}
                </motion.div>
            )}

            {renderField()}

            {displayError && (
                <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-1 text-destructive"
                >
                    <ExclamationTriangleIcon className="w-3 h-3" />
                    <Typography variant="caption" color="error">
                        {displayError}
                    </Typography>
                </motion.div>
            )}
        </motion.div>
    );
};

/* ============================================
   SECTION COMPONENT
============================================ */

export interface DynamicSectionProps {
    title?: string;
    description?: string;
    children: React.ReactNode;
    className?: string;
    condition?: Condition | Condition[];
    defaultCollapsed?: boolean;
    collapsible?: boolean;
    showWhenEmpty?: boolean;
    gradient?: boolean;
    icon?: React.ElementType;
}

/**
 * Section component that groups related fields together with optional collapsible functionality.
 * Can be conditionally shown/hidden based on field values.
 * 
 * @component
 * @example
 * ```tsx
 * <DynamicForm.Section
 *   title="Payment Details"
 *   description="Enter your payment information"
 *   condition={{ field: 'paymentMethod', operator: 'equals', value: 'credit' }}
 *   collapsible
 *   defaultCollapsed={false}
 *   icon={CreditCardIcon}
 * >
 *   <DynamicForm.Field field={fields.cardNumber} />
 *   <DynamicForm.Field field={fields.expiryDate} />
 * </DynamicForm.Section>
 * ```
 */
const DynamicSection: React.FC<DynamicSectionProps> = ({
    title,
    description,
    children,
    className,
    condition,
    defaultCollapsed = false,
    collapsible = false,
    showWhenEmpty = false,
    gradient = false,
    icon: SectionIcon
}) => {
    const { formData } = useDynamicForm();
    const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
    const [isHovered, setIsHovered] = useState(false);

    const shouldShow = useMemo(() => {
        if (!condition) return true;

        const conditions = Array.isArray(condition) ? condition : [condition];
        return conditions.every(cond => evaluateCondition(cond, formData));
    }, [condition, formData]);

    const hasVisibleChildren = useMemo(() => {
        const childrenArray = React.Children.toArray(children);
        return childrenArray.length > 0;
    }, [children]);

    if (!shouldShow || (!showWhenEmpty && !hasVisibleChildren)) {
        return null;
    }

    return (
        <motion.section
            {...scaleIn}
            layout
            onHoverStart={(): void => setIsHovered(true)}
            onHoverEnd={(): void => setIsHovered(false)}
            className={cn(
                "border border-border rounded-xl overflow-hidden",
                gradient && "bg-gradient-to-br from-primary/5 via-transparent to-secondary/5",
                isHovered && "border-primary/30 shadow-lg",
                className
            )}
        >
            {(title || description) && (
                <motion.div
                    className={cn(
                        "px-6 py-4 bg-secondary/30 border-b border-border",
                        collapsible && "cursor-pointer hover:bg-secondary/50 transition-colors"
                    )}
                    onClick={(): void => {
                        if (collapsible) {
                            setIsCollapsed(!isCollapsed);
                        }
                    }}
                    whileHover={collapsible ? { backgroundColor: 'rgba(var(--secondary), 0.5)' } : {}}
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            {SectionIcon && (
                                <motion.div
                                    animate={isHovered ? { rotate: 360 } : {}}
                                    transition={{ duration: 0.5 }}
                                >
                                    <SectionIcon className="w-5 h-5 text-primary" />
                                </motion.div>
                            )}
                            <div>
                                {title && (
                                    <Typography variant="h6" weight="semibold">
                                        {title}
                                    </Typography>
                                )}
                                {description && (
                                    <Typography variant="caption" color="muted">
                                        {description}
                                    </Typography>
                                )}
                            </div>
                        </div>
                        {collapsible && (
                            <motion.div
                                animate={{ rotate: isCollapsed ? -90 : 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <ChevronDownIcon className="w-5 h-5" />
                            </motion.div>
                        )}
                    </div>
                </motion.div>
            )}

            <AnimatePresence>
                {!isCollapsed && (
                    <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: 'auto' }}
                        exit={{ height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                    >
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {children}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.section>
    );
};

/* ============================================
   NAVIGATION COMPONENT
============================================ */

export interface DynamicNavigationProps {
    submitButtonLabel?: string;
    cancelButtonLabel?: string;
    showCancelButton?: boolean;
    onCancel?: () => void;
    className?: string;
    position?: 'bottom' | 'sticky';
    animated?: boolean;
    children?: React.ReactNode;
}

/**
 * Navigation component that provides form submission and cancellation controls.
 * Supports sticky positioning and various button styles.
 * 
 * @component
 * @example
 * ```tsx
 * <DynamicForm.Navigation
 *   submitButtonLabel="Register"
 *   cancelButtonLabel="Back"
 *   showCancelButton={true}
 *   position="sticky"
 *   animated={true}
 * />
 * ```
 */
const DynamicNavigation: React.FC<DynamicNavigationProps> = ({
    submitButtonLabel: customSubmitLabel,
    cancelButtonLabel: customCancelLabel,
    showCancelButton: customShowCancel,
    onCancel: customOnCancel,
    className,
    position = 'bottom',
    animated = true,
    children
}) => {
    const {
        isSubmitting,
        submitForm,
        buttonVariant,
        buttonAnimationVariant,
        theme,
        onCancel,
        cancelButtonLabel,
        showCancelButton
    } = useDynamicForm();

    const submitLabel = customSubmitLabel || "Submit";
    const cancelLabel = customCancelLabel || cancelButtonLabel || "Cancel";
    const showCancel = customShowCancel !== undefined ? customShowCancel : (showCancelButton ?? true);
    const handleCancel = customOnCancel || onCancel;

    if (children) {
        return (
            <motion.div
                initial={animated ? { opacity: 0, y: 20 } : false}
                animate={animated ? { opacity: 1, y: 0 } : false}
                transition={{ duration: 0.4, delay: 0.2 }}
                className={cn(
                    "flex items-center justify-between pt-8 mt-8",
                    "border-t border-border",
                    position === 'sticky' && "sticky bottom-0 bg-background/80 backdrop-blur-md py-4 -mb-8 z-10",
                    className
                )}
            >
                {children}
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={animated ? { opacity: 0, y: 20 } : false}
            animate={animated ? { opacity: 1, y: 0 } : false}
            transition={{ duration: 0.4, delay: 0.2 }}
            className={cn(
                "flex items-center justify-between pt-8 mt-8",
                "border-t border-border",
                position === 'sticky' && "sticky bottom-0 bg-background/80 backdrop-blur-md py-4 -mb-8 z-10",
                className
            )}
        >
            <div>
                {/* Empty div for flex spacing */}
            </div>

            <div className="flex items-center gap-3">
                {showCancel && handleCancel && (
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Button
                            variant={theme === 'dark' ? "ghost" : "ghost"}
                            onClick={handleCancel}
                            disabled={isSubmitting}
                            className={cn(
                                "cursor-pointer",
                                theme === 'dark' && "text-gray-300 hover:text-white hover:bg-gray-800"
                            )}
                        >
                            {cancelLabel}
                        </Button>
                    </motion.div>
                )}

                <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    animate={isSubmitting ? { scale: [1, 1.1, 1] } : {}}
                    transition={{ duration: 0.3, repeat: isSubmitting ? Infinity : 0 }}
                >
                    <Button
                        variant={buttonVariant as 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'outline' | 'ghost' | 'subtle' | 'elevated' | 'glass' | 'neon'}
                        onClick={submitForm}
                        disabled={isSubmitting}
                        className={cn(
                            "min-w-[140px] cursor-pointer",
                            theme === 'dark' && "bg-primary text-primary-foreground hover:bg-primary/90"
                        )}
                        animationVariant={isSubmitting ? "spinSlow" : buttonAnimationVariant}
                    >
                        {isSubmitting ? (
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            >
                                <ReloadIcon className="w-4 h-4 mr-2" />
                            </motion.div>
                        ) : (
                            <CheckIcon className="w-4 h-4 mr-2" />
                        )}
                        {isSubmitting ? 'Submitting...' : submitLabel}
                    </Button>
                </motion.div>
            </div>
        </motion.div>
    );
};

/* ============================================
   NOTIFICATION COMPONENT
============================================ */

export interface DynamicNotificationProps {
    type: 'success' | 'error' | 'info' | 'warning' | 'magic';
    message: string;
    onClose: () => void;
    duration?: number;
    className?: string;
    icon?: React.ElementType;
}

/**
 * Notification component that displays temporary feedback messages.
 * Automatically dismisses after specified duration.
 * 
 * @component
 * @example
 * ```tsx
 * <DynamicForm.Notification
 *   type="success"
 *   message="Form submitted successfully!"
 *   onClose={() => setNotification(null)}
 *   duration={3000}
 *   icon={CheckCircledIcon}
 * />
 * ```
 */
const DynamicNotification: React.FC<DynamicNotificationProps> = ({
    type = 'success',
    message,
    onClose,
    duration = 3000,
    className,
    icon: CustomIcon
}) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, duration);

        return (): void => clearTimeout(timer);
    }, [duration, onClose]);

    const icons = {
        success: <CheckCircledIcon className="w-5 h-5" />,
        error: <CrossCircledIcon className="w-5 h-5" />,
        info: <InfoCircledIcon className="w-5 h-5" />,
        warning: <ExclamationTriangleIcon className="w-5 h-5" />,
        magic: <MagicWandIcon className="w-5 h-5" />
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: -50, x: 20, scale: 0.3 }}
            animate={{ opacity: 1, y: 0, x: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.5, transition: { duration: 0.2 } }}
            className={cn(
                NotificationVariants({ type }),
                "fixed top-4 right-4 z-50 max-w-md",
                className
            )}
        >
            <motion.div
                animate={type === 'magic' ? { rotate: [0, 360] } : {}}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
                {CustomIcon ? <CustomIcon className="w-5 h-5" /> : icons[type]}
            </motion.div>
            <Typography variant="body-small" weight="medium" className="flex-1">
                {message}
            </Typography>
            <motion.button
                onClick={onClose}
                className="ml-4 text-current hover:opacity-70 transition-opacity"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
            >
                <Cross2Icon className="w-4 h-4" />
            </motion.button>
        </motion.div>
    );
};

/* ============================================
   DEBUGGER COMPONENT
============================================ */

export interface DynamicDebuggerProps {
    className?: string;
}

/**
 * Debugging component that displays form state, errors, and visible fields in real-time.
 * Useful for development and troubleshooting conditional logic.
 * 
 * @component
 * @example
 * ```tsx
 * <DynamicForm.Debugger className="bottom-20 left-4" />
 * ```
 */
const DynamicDebugger: React.FC<DynamicDebuggerProps> = ({ className }) => {
    const { formData, errors, visibleFields, fields } = useDynamicForm();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className={cn("fixed bottom-4 left-4 z-50", className)}>
            <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                <Button
                    variant="outline"
                    size="sm"
                    onClick={(): void => setIsOpen(!isOpen)}
                    className="shadow-lg"
                >
                    {isOpen ? 'Hide Debug' : 'Show Debug'}
                </Button>
            </motion.div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        {...scaleIn}
                        className="absolute bottom-12 left-0 w-96 bg-card border border-border rounded-lg shadow-xl p-4 max-h-[500px] overflow-auto"
                    >
                        <Typography variant="h6" weight="bold" className="mb-4">
                            Form Debugger
                        </Typography>

                        <div className="space-y-4">
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 }}
                            >
                                <Typography variant="label" weight="semibold" className="block mb-2">
                                    Form Data:
                                </Typography>
                                <pre className="bg-secondary/30 p-2 rounded text-xs overflow-auto">
                                    {JSON.stringify(formData, null, 2)}
                                </pre>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                <Typography variant="label" weight="semibold" className="block mb-2">
                                    Visible Fields ({visibleFields.size}):
                                </Typography>
                                <div className="bg-secondary/30 p-2 rounded">
                                    {Array.from(visibleFields).map((fieldId, index) => {
                                        const field = fields.find(f => f.id === fieldId);
                                        return (
                                            <motion.div
                                                key={fieldId}
                                                initial={{ opacity: 0, y: -5 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.1 + index * 0.05 }}
                                                className="text-xs py-1 border-b border-border last:border-0"
                                            >
                                                {field?.name} ({fieldId})
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                <Typography variant="label" weight="semibold" className="block mb-2">
                                    Errors:
                                </Typography>
                                <pre className="bg-secondary/30 p-2 rounded text-xs overflow-auto">
                                    {JSON.stringify(errors, null, 2)}
                                </pre>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

/* ============================================
   THEME TOGGLE COMPONENT
============================================ */

export interface ThemeToggleProps {
    className?: string;
}

/* ============================================
   ASSIGN COMPOUND COMPONENTS
============================================ */

DynamicForm.Header = DynamicHeader;
DynamicForm.Content = DynamicContent;
DynamicForm.Field = DynamicField;
DynamicForm.Section = DynamicSection;
DynamicForm.Navigation = DynamicNavigation;
DynamicForm.Notification = DynamicNotification;
DynamicForm.Debugger = DynamicDebugger;

export {
    DynamicForm,
    DynamicHeader,
    DynamicContent,
    DynamicField,
    DynamicSection,
    DynamicNavigation,
    DynamicNotification,
    DynamicDebugger,
};