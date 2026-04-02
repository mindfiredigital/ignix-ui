import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cva, type VariantProps } from 'class-variance-authority';
import {
    ChevronLeftIcon,
    ChevronRightIcon,
    CheckIcon,
    Cross2Icon,
    ReloadIcon,
    EyeOpenIcon,
    EyeClosedIcon,
    LightningBoltIcon,
    ExclamationTriangleIcon,
    CheckCircledIcon,
    CrossCircledIcon,
    InfoCircledIcon
} from '@radix-ui/react-icons';
import { cn } from '../../../../../utils/cn';
import { Button } from '../../../../components/button';
import { AnimatedInput } from '../../../../components/input';
import { Typography } from '../../../../components/typography';

/* ============================================
   TYPES & INTERFACES
============================================ */

// Add these type aliases
export type FieldValue = string | boolean | number | undefined;
export type FormValues = Record<string, FieldValue>;
export type ValidationErrors = Record<string, string>;

export interface FieldOption {
    value: string;
    label: string;
}

export interface FormField {
    id: string;
    name: string;
    label: string;
    type: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'date';
    placeholder?: string;
    required?: boolean;
    options?: FieldOption[];
    validation?: (value: FieldValue) => string | undefined;
    defaultValue?: FieldValue;
    colSpan?: 'full' | 'half';
    icon?: React.ElementType;

    emailValidation?: {
        pattern?: boolean;  // Use default email pattern
        customPattern?: RegExp;  // Custom regex pattern
        domain?: string[];  // Allowed domains
        message?: string;  // Custom error message
    };
}

export interface FormStep {
    id: string;
    title: string;
    description?: string;
    fields: FormField[];
    validation?: (values: FormValues) => Record<string, string>;
}

export interface FormData {
    [key: string]: FieldValue;
}

export interface Notification {
    id: string;
    type: 'success' | 'error' | 'info' | 'warning';
    message: string;
    duration?: number;
}

interface MultiStepFormContextType {
    // State
    currentStep: number;
    formData: FormData;
    errors: Record<string, string>;
    touchedFields: Set<string>;
    completedSteps: number[];
    isSubmitting: boolean;
    isReviewStep: boolean;
    allSteps: FormStep[];
    steps: FormStep[];

    // Actions
    goToStep: (step: number) => void;
    goToNext: () => void;
    goToPrevious: () => void;
    updateField: (name: string, value: FieldValue) => void;
    validateCurrentStep: () => boolean;
    submitForm: () => Promise<void>;

    // Configuration
    animationVariant: 'fadeUp' | 'scaleIn' | 'slideUp' | 'slideLeft' | 'slideRight';
    inputVariant: string;
    buttonVariant: string;
    buttonAnimationVariant?: string;
    showReviewStep: boolean;
    reviewStepTitle: string;

    // Theme
    theme?: 'light' | 'dark';

    // Navigation labels and callbacks
    backButtonLabel?: string;
    nextButtonLabel?: string;
    submitButtonLabel?: string;
    cancelButtonLabel?: string;
    showCancelButton?: boolean;
    onCancel?: () => void;
}

const MultiStepFormContext = React.createContext<MultiStepFormContextType | undefined>(undefined);

const useMultiStepForm = () => {
    const context = React.useContext(MultiStepFormContext);
    if (!context) {
        throw new Error('MultiStepForm components must be used within a MultiStepForm provider');
    }
    return context;
};

/* ============================================
   VARIANTS
============================================ */

const MultiStepVariants = cva("min-h-screen transition-all duration-300", {
    variants: {
        variant: {
            default: "bg-background text-foreground",
            gradient: "bg-gradient-to-br from-primary/5 via-accent/10 to-secondary/5",
            card: "bg-card",
            glass: "bg-background/80 backdrop-blur-md",
            dark: "bg-gray-950 text-gray-50",
        },
    },
    defaultVariants: {
        variant: "default",
    },
});

const CardVariants = cva("rounded-2xl overflow-hidden transition-smooth", {
    variants: {
        variant: {
            default: "bg-card shadow-lg",
            glass: "bg-card/80 backdrop-blur-md shadow-lg",
            border: "bg-card border-2 border-primary/10 shadow-lg",
            elevated: "bg-card shadow-xl",
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
                success: "bg-green-50 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-200 dark:border-green-800",
                error: "bg-red-50 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-200 dark:border-red-800",
                info: "bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:border-blue-800",
                warning: "bg-yellow-50 text-yellow-800 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-200 dark:border-yellow-800"
            }
        }
    }
);

/* ============================================
   MAIN PROVIDER COMPONENT
============================================ */

export interface MultiStepFormProps {
    children: React.ReactNode;

    // Steps configuration
    steps: FormStep[];
    initialData?: FormData;

    // Callbacks
    onSubmit?: (data: FormData) => Promise<void> | void;
    onStepChange?: (step: number, data: FormData) => void;
    onCancel?: () => void;

    // Variants
    variant?: VariantProps<typeof MultiStepVariants>["variant"];
    animationVariant?: "fadeUp" | "scaleIn" | "slideUp" | "slideLeft" | "slideRight";

    // Component variants
    inputVariant?: string;
    buttonVariant?: string;
    buttonAnimationVariant?: string;

    // Labels
    backButtonLabel?: string;
    nextButtonLabel?: string;
    submitButtonLabel?: string;
    cancelButtonLabel?: string;
    reviewStepTitle?: string;

    // States
    isLoading?: boolean;
    isSubmitting?: boolean;

    // Features
    showStepIndicator?: boolean;
    showReviewStep?: boolean;
    showCancelButton?: boolean;

    // Notification options
    showSuccessNotification?: boolean;
    successNotificationDuration?: number;
    successNotificationMessage?: string;

    // Theme
    darkMode?: boolean;
}

/**
 * MultiStepForm - A comprehensive multi-step form component with validation, navigation, and review capabilities
 * 
 * @component
 * @example
 * ```tsx
 * <MultiStepForm steps={steps} onSubmit={handleSubmit}>
 *   <MultiStepForm.Header title="Registration Form" />
 *   <MultiStepForm.StepIndicator />
 *   <MultiStepForm.Content>
 *     {steps.map(step => (
 *       <div key={step.id}>
 *         {step.fields.map(field => (
 *           <MultiStepForm.Field key={field.id} field={field} />
 *         ))}
 *       </div>
 *     ))}
 *   </MultiStepForm.Content>
 *   <MultiStepForm.Navigation />
 *   <MultiStepForm.Review />
 * </MultiStepForm>
 * ```
 */
const MultiStepForm: React.FC<MultiStepFormProps> & {
    Header: typeof MultiStepHeader;
    StepIndicator: typeof MultiStepStepIndicator;
    Content: typeof MultiStepContent;
    Navigation: typeof MultiStepNavigation;
    Review: typeof MultiStepReview;
    Field: typeof MultiStepField;
    Notification: typeof MultiStepNotification;
} = ({
    children,
    steps,
    initialData = {},
    onSubmit,
    onStepChange,
    onCancel,
    variant = "default",
    animationVariant = "fadeUp",
    inputVariant = 'clean',
    buttonVariant = 'default',
    buttonAnimationVariant,
    backButtonLabel = "← Back",
    nextButtonLabel = "Next →",
    submitButtonLabel = "Submit",
    cancelButtonLabel = "Cancel",
    reviewStepTitle = "Review",
    isLoading = false,
    isSubmitting: externalIsSubmitting = false,
    // showStepIndicator = true,
    showReviewStep = true,
    showCancelButton = true,
    showSuccessNotification = true,
    successNotificationDuration = 3000,
    successNotificationMessage = "Form submitted successfully!",
    darkMode
}) => {
        // Add review step if enabled
        const allSteps = showReviewStep
            ? [...steps, { id: 'review', title: reviewStepTitle, description: 'Review your information', fields: [] }]
            : steps;

        const [currentStep, setCurrentStep] = useState(1);
        const [formData, setFormData] = useState<FormData>(() => {
            const initial: FormData = {};
            steps.forEach(step => {
                step.fields.forEach(field => {
                    if (initialData[field.name] !== undefined) {
                        initial[field.name] = initialData[field.name];
                    } else if (field.defaultValue !== undefined) {
                        initial[field.name] = field.defaultValue;
                    }
                });
            });
            return initial;
        });
        const [errors, setErrors] = useState<ValidationErrors>({});
        const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());
        const [completedSteps, setCompletedSteps] = useState<number[]>([]);
        const [internalIsSubmitting, setInternalIsSubmitting] = useState(false);
        const [notification, setNotification] = useState<Notification | null>(null);

        const isSubmitting = externalIsSubmitting || internalIsSubmitting;
        const isReviewStep = showReviewStep && currentStep === allSteps.length;
        // const currentStepData = isReviewStep ? null : steps[currentStep - 1];

        const validateField = (field: FormField, value: FieldValue): string | undefined => {
            if (field.required && (value === undefined || value === null || value === '')) {
                return `${field.label} is required`;
            }

            if (field.type === 'email' && value && typeof value === 'string' && value.trim() !== '') {
                // Default email regex pattern
                const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

                // Check if it's a valid email format
                if (!emailRegex.test(value)) {
                    return 'Please enter a valid email address';
                }

                // Check domain restrictions if specified
                if (field.emailValidation?.domain && field.emailValidation.domain.length > 0) {
                    const domain = value.split('@')[1];
                    if (!field.emailValidation.domain.includes(domain)) {
                        return field.emailValidation.message ||
                            `Email must be from: ${field.emailValidation.domain.join(', ')}`;
                    }
                }

                // Use custom pattern if provided
                if (field.emailValidation?.customPattern) {
                    if (!field.emailValidation.customPattern.test(value)) {
                        return field.emailValidation.message || 'Email format is invalid';
                    }
                }
            }

            if (field.validation) {
                return field.validation(value);
            }
            return undefined;
        };

        const validateStep = (stepIndex: number): boolean => {
            if (stepIndex >= steps.length) return true;

            const step = steps[stepIndex];
            const newErrors: ValidationErrors = {};
            let isValid = true;

            step.fields.forEach(field => {
                const error = validateField(field, formData[field.name]);
                if (error) {
                    newErrors[field.name] = error;
                    isValid = false;
                }
            });

            if (step.validation) {
                const stepErrors = step.validation(formData);
                Object.assign(newErrors, stepErrors);
                if (Object.keys(stepErrors).length > 0) {
                    isValid = false;
                }
            }

            setErrors(prev => ({ ...prev, ...newErrors }));
            return isValid;
        };

        const updateField = (name: string, value: FieldValue) => {
            setFormData(prev => ({ ...prev, [name]: value }));

            if (errors[name]) {
                setErrors(prev => {
                    const newErrors = { ...prev };
                    delete newErrors[name];
                    return newErrors;
                });
            }

            setTouchedFields(prev => new Set(prev).add(name));
        };

        const goToNext = () => {
            if (isReviewStep) return;

            const stepIndex = currentStep - 1;
            if (validateStep(stepIndex)) {
                if (!completedSteps.includes(currentStep)) {
                    setCompletedSteps(prev => [...prev, currentStep]);
                }

                const nextStep = currentStep + 1;
                setCurrentStep(nextStep);
                onStepChange?.(nextStep, formData);
            } else {
                const step = steps[stepIndex];
                step.fields.forEach(field => {
                    setTouchedFields(prev => new Set(prev).add(field.name));
                });
            }
        };

        const goToPrevious = () => {
            if (currentStep > 1) {
                const prevStep = currentStep - 1;
                setCurrentStep(prevStep);
                onStepChange?.(prevStep, formData);
            }
        };

        const goToStep = (step: number) => {
            if (step < currentStep || completedSteps.includes(step)) {
                setCurrentStep(step);
                onStepChange?.(step, formData);
            }
        };

        const submitForm = async () => {
            if (!onSubmit) return;

            setInternalIsSubmitting(true);
            try {
                await onSubmit(formData);

                if (showSuccessNotification) {
                    setNotification({
                        id: Date.now().toString(),
                        type: 'success',
                        message: successNotificationMessage,
                        duration: successNotificationDuration
                    });
                }

                // Reset form state after successful submission
                // Reset to first step
                setCurrentStep(1);

                // Reset form data to initial values
                setFormData(() => {
                    const initial: FormData = {};
                    steps.forEach(step => {
                        step.fields.forEach(field => {
                            if (initialData[field.name] !== undefined) {
                                initial[field.name] = initialData[field.name];
                            } else if (field.defaultValue !== undefined) {
                                initial[field.name] = field.defaultValue;
                            }
                        });
                    });
                    return initial;
                });

                // Clear errors and touched fields
                setErrors({});
                setTouchedFields(new Set());

                // Reset completed steps
                setCompletedSteps([]);

                // Optional: Call onStepChange to notify parent
                onStepChange?.(1, {});
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

        const validateCurrentStep = () => {
            if (isReviewStep) return true;
            return validateStep(currentStep - 1);
        };

        const animationVariants = {
            fadeUp: {
                initial: { opacity: 0, y: 20 },
                animate: { opacity: 1, y: 0 },
                exit: { opacity: 0, y: -20 }
            },
            scaleIn: {
                initial: { opacity: 0, scale: 0.95 },
                animate: { opacity: 1, scale: 1 },
                exit: { opacity: 0, scale: 0.95 }
            },
            slideUp: {
                initial: { opacity: 0, y: 40 },
                animate: { opacity: 1, y: 0 },
                exit: { opacity: 0, y: -40 }
            },
            slideLeft: {
                initial: { opacity: 0, x: -40 },
                animate: { opacity: 1, x: 0 },
                exit: { opacity: 0, x: 40 }
            },
            slideRight: {
                initial: { opacity: 0, x: 40 },
                animate: { opacity: 1, x: 0 },
                exit: { opacity: 0, x: -40 }
            },
        };

        const contextValue: MultiStepFormContextType = {
            currentStep,
            formData,
            errors,
            touchedFields,
            completedSteps,
            isSubmitting,
            isReviewStep,
            allSteps,
            steps,
            goToStep,
            goToNext,
            goToPrevious,
            updateField,
            validateCurrentStep,
            submitForm,
            animationVariant,
            inputVariant,
            buttonVariant,
            buttonAnimationVariant,
            showReviewStep,
            reviewStepTitle,
            theme: darkMode ? 'dark' : 'light',
            // Add the missing props to context
            backButtonLabel,
            nextButtonLabel,
            submitButtonLabel,
            cancelButtonLabel,
            showCancelButton,
            onCancel
        };

        if (isLoading) {
            return (
                <div className="min-h-screen flex items-center justify-center">
                    <ReloadIcon className="w-8 h-8 animate-spin text-primary" />
                </div>
            );
        }

        return (
            <MultiStepFormContext.Provider value={contextValue}>
                <div className={cn(MultiStepVariants({ variant }), darkMode && "dark")}>
                    {/* Notification */}
                    {notification && (
                        <MultiStepNotification
                            type={notification.type}
                            message={notification.message}
                            onClose={() => setNotification(null)}
                            duration={notification.duration}
                        />
                    )}

                    {/* Main Content */}
                    <main className="container max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <motion.div
                            initial={animationVariants[animationVariant].initial}
                            animate={animationVariants[animationVariant].animate}
                            transition={{ duration: 0.5 }}
                            className="space-y-8"
                        >
                            {/* Conditionally render step indicator */}
                            {/* {showStepIndicator && (
                                <MultiStepStepIndicator />
                            )} */}

                            {children}
                        </motion.div>
                    </main>
                </div>
            </MultiStepFormContext.Provider>
        );
    };

/* ============================================
   HEADER COMPONENT
============================================ */

export interface MultiStepHeaderProps {
    title?: string | React.ReactNode;
    icon?: React.ReactNode;
    children?: React.ReactNode;
    className?: string;
    titleClassName?: string;
    iconClassName?: string;
    containerClassName?: string;
    titleVariant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body-large' | 'body' | 'body-small' | 'lead' | 'large' | 'small' | 'label' | 'caption' | 'muted' | 'link' | 'code' | 'blockquote' | 'list';
    titleWeight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold';
    titleColor?: 'default' | 'primary' | 'secondary' | 'muted' | 'error' | 'success' | 'warning' | 'inherit';
    iconSize?: number;
}

/**
 * MultiStepHeader - Sticky header component for the multi-step form
 * 
 * @component
 * @example
 * ```tsx
 * <MultiStepForm.Header 
 *   title="Registration Form"
 *   icon={<UserIcon />}
 *   titleVariant="h4"
 *   titleWeight="bold"
 * />
 * ```
 */
const MultiStepHeader: React.FC<MultiStepHeaderProps> = ({
    title,
    icon = <LightningBoltIcon className="w-4 h-4" />,
    children,
    className,
    titleClassName,
    iconClassName,
    containerClassName,
    titleVariant = 'h6',
    titleWeight = 'semibold',
    titleColor = 'default',
    iconSize = 16,
}) => {
    // If children are provided, render them directly
    if (children) {
        return (
            <header className={cn("sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border", className)}>
                <div className="container max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {children}
                    </div>
                </div>
            </header>
        );
    }

    // Create icon style object
    const iconStyle = {
        width: iconSize,
        height: iconSize,
    };

    // Render default header with customizable title
    return (
        <header className={cn("sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border", className)}>
            <div className={cn("container max-w-3xl mx-auto px-4 sm:px-6 lg:px-8", containerClassName)}>
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center gap-3">
                        <div className={cn(
                            "rounded-lg bg-primary flex items-center justify-center text-primary-foreground",
                            iconClassName
                        )}>
                            <div style={iconStyle} className="flex items-center justify-center">
                                {icon}
                            </div>
                        </div>
                        {typeof title === 'string' ? (
                            <Typography
                                variant={titleVariant}
                                weight={titleWeight}
                                color={titleColor}
                                className={cn("text-foreground", titleClassName)}
                            >
                                {title || "Multi-Step Form"}
                            </Typography>
                        ) : (
                            title || <Typography variant="h6" weight="semibold">Multi-Step Form</Typography>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

/* ============================================
   STEP INDICATOR COMPONENT
============================================ */

export interface MultiStepStepIndicatorProps {
    variant?: 'default' | 'pills' | 'tabs';
    className?: string;
    completedColor?: string; // Add this
    completedTextColor?: string; // Add this
}

/**
 * MultiStepStepIndicator - Visual indicator showing progress through form steps
 * 
 * @component
 * @example
 * ```tsx
 * <MultiStepForm.StepIndicator 
 *   variant="pills"
 *   completedColor="bg-green-600"
 *   completedTextColor="text-green-600"
 * />
 * ```
 */
const MultiStepStepIndicator: React.FC<MultiStepStepIndicatorProps> = ({
    variant = 'default',
    className,
    completedColor = 'bg-green-900 dark:bg-green-600',
    completedTextColor = 'text-green-900 dark:text-green-600'
}) => {
    const { allSteps, currentStep, completedSteps, goToStep } = useMultiStepForm();
    const totalSteps = allSteps.length;

    return (
        <div className={cn("w-full", className)}>
            <div className="relative">
                {/* Progress Bar - Background */}
                <div className="absolute top-5 left-0 w-full h-1 bg-secondary -translate-y-1/2 rounded-full" />

                {/* Progress Bar - Filled */}
                <div
                    className={cn(
                        "absolute top-5 left-0 h-1 -translate-y-1/2 rounded-full transition-all duration-500",
                        completedColor.replace('bg-', 'bg-') // Extract bg class for progress bar
                    )}
                    style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
                />

                {/* Step Numbers */}
                <div className={cn(
                    "flex justify-between relative",
                    variant === 'tabs' && "border-b border-border pb-2"
                )}>
                    {allSteps.map((step, index) => {
                        const stepNumber = index + 1;
                        const isCompleted = completedSteps.includes(stepNumber);
                        const isCurrent = currentStep === stepNumber;
                        const isClickable = isCompleted || stepNumber < currentStep;

                        return (
                            <div
                                key={step.id}
                                className={cn(
                                    "flex flex-col items-center relative z-10",
                                    isClickable && "cursor-pointer hover:opacity-80"
                                )}
                                onClick={() => isClickable && goToStep(stepNumber)}
                            >
                                <div
                                    className={cn(
                                        "w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 mb-2",
                                        "border-2",
                                        // Completed step
                                        isCompleted && !isCurrent && [
                                            completedColor,
                                            completedColor.replace('bg-', 'border-'), // Same color for border
                                            "text-white",
                                            "shadow-lg"
                                        ],
                                        // Current step
                                        isCurrent && [
                                            "bg-primary border-primary text-primary-foreground",
                                            "ring-4 ring-primary/20"
                                        ],
                                        // Incomplete step
                                        !isCompleted && !isCurrent && [
                                            "bg-secondary border-secondary text-muted-foreground"
                                        ],
                                        // Hover effects
                                        isClickable && "hover:scale-110 hover:shadow-lg",
                                        !isClickable && "opacity-75"
                                    )}
                                >
                                    {isCompleted ? (
                                        <CheckIcon className="w-5 h-5" />
                                    ) : (
                                        stepNumber
                                    )}
                                </div>
                                <Typography
                                    variant="body-small"
                                    weight={isCurrent ? "semibold" : "normal"}
                                    className={cn(
                                        "text-center hidden sm:block transition-colors duration-300",
                                        isCompleted && !isCurrent && completedTextColor,
                                        isCurrent && "text-primary",
                                        !isCompleted && !isCurrent && "text-muted-foreground"
                                    )}
                                >
                                    {step.title}
                                </Typography>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

/* ============================================
   CONTENT COMPONENT
============================================ */

export interface MultiStepContentProps {
    children?: React.ReactNode;
    className?: string;
}

/**
 * MultiStepContent - Container for form step content with animations
 * 
 * @component
 * @example
 * ```tsx
 * <MultiStepForm.Content className="p-6">
 *   {steps.map(step => (
 *     <div key={step.id}>
 *       {step.fields.map(field => (
 *         <MultiStepForm.Field key={field.id} field={field} />
 *       ))}
 *     </div>
 *   ))}
 * </MultiStepForm.Content>
 * ```
 */
const MultiStepContent: React.FC<MultiStepContentProps> = ({
    children,
    className
}) => {
    const {
        isReviewStep,
        currentStep,
        reviewStepTitle,
        steps,
        animationVariant,
        showReviewStep
    } = useMultiStepForm();

    const currentStepData = isReviewStep ? null : steps[currentStep - 1];

    const animationVariants = {
        fadeUp: { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -20 } },
        scaleIn: { initial: { opacity: 0, scale: 0.95 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.95 } },
        slideUp: { initial: { opacity: 0, y: 40 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -40 } },
        slideLeft: { initial: { opacity: 0, x: -40 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: 40 } },
        slideRight: { initial: { opacity: 0, x: 40 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: -40 } },
    };

    const anim = animationVariants[animationVariant];

    // Render the appropriate content based on current step
    const renderContent = () => {
        // If it's review step, render the Review component
        if (isReviewStep && showReviewStep) {
            // Find the Review component among children
            const reviewComponent = React.Children.toArray(children).find(
                child => React.isValidElement(child) && child.type === MultiStepReview
            );

            return reviewComponent || <MultiStepReview />;
        }

        // For regular steps, render the step fields
        // We expect that the children are in order: Step1 fields, Step2 fields, etc.
        const stepIndex = currentStep - 1;
        const stepChildren = React.Children.toArray(children);

        // If we have step children at this index, render it
        if (stepIndex < stepChildren.length) {
            const stepChild = stepChildren[stepIndex];
            // Make sure we're not rendering a Review component
            if (React.isValidElement(stepChild) && stepChild.type !== MultiStepReview) {
                return stepChild;
            }
        }

        // Fallback: render nothing
        return null;
    };

    return (
        <div className={cn(CardVariants({ variant: "default" }), "transition-all duration-300", className)}>
            <div className="p-6 md:p-8">
                {/* Step Title */}
                <div className="text-center mb-6">
                    <Typography variant="h4" weight="bold" className="text-foreground">
                        {isReviewStep ? reviewStepTitle : currentStepData?.title}
                    </Typography>
                    {!isReviewStep && currentStepData?.description && (
                        <Typography variant="body" color="muted" className="mt-2">
                            {currentStepData.description}
                        </Typography>
                    )}
                </div>

                {/* Content - Now renders only the current step */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStep}
                        initial={anim.initial}
                        animate={anim.animate}
                        exit={anim.exit}
                        transition={{ duration: 0.3 }}
                    >
                        {renderContent()}
                    </motion.div>
                </AnimatePresence>

                {/* Step completion text */}
                {!isReviewStep && (
                    <Typography variant="caption" color="muted" className="text-center block mt-4">
                        Step {currentStep} of {steps.length}
                    </Typography>
                )}
            </div>
        </div>
    );
};

/* ============================================
   FIELD COMPONENT
============================================ */

export interface MultiStepFieldProps {
    field: FormField;
    className?: string;
}

/**
 * MultiStepField - Renders an individual form field with validation and error handling
 * 
 * @component
 * @example
 * ```tsx
 * <MultiStepForm.Field 
 *   field={{
 *     id: 'email',
 *     name: 'email',
 *     label: 'Email Address',
 *     type: 'email',
 *     required: true
 *   }}
 *   className="mb-4"
 * />
 * ```
 */
const MultiStepField: React.FC<MultiStepFieldProps> = ({
    field,
    className
}) => {
    const { formData, errors, touchedFields, updateField, inputVariant } = useMultiStepForm();
    const [showPassword, setShowPassword] = useState(false);
    const [localError, setLocalError] = useState<string | undefined>();
    const Icon = field.icon;
    const value = formData[field.name];
    const error = touchedFields.has(field.name) ? errors[field.name] : undefined;
    const fieldId = `field-${field.id}`;

    // Email validation function
    const validateEmail = (email: string): string | undefined => {
        if (!email) return undefined;

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (!emailRegex.test(email)) {
            return 'Please enter a valid email address';
        }

        const domain = email.split('@')[1];

        if (domain && !domain.includes('.')) {
            return 'Email domain seems invalid';
        }

        if (field.emailValidation?.domain && field.emailValidation.domain.length > 0) {
            if (!field.emailValidation.domain.includes(domain)) {
                return field.emailValidation.message ||
                    `Email must be from: ${field.emailValidation.domain.join(', ')}`;
            }
        }

        if (field.emailValidation?.customPattern) {
            if (!field.emailValidation.customPattern.test(email)) {
                return field.emailValidation.message || 'Email format is invalid';
            }
        }

        return undefined;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        let val: FieldValue;

        if (e.target.type === 'checkbox') {
            val = (e as React.ChangeEvent<HTMLInputElement>).target.checked;
        } else {
            val = e.target.value;
        }

        updateField(field.name, val);

        if (field.type === 'email' && typeof val === 'string') {
            const emailError = validateEmail(val);
            setLocalError(emailError);
        } else {
            setLocalError(undefined);
        }
    };

    const handleBlur = () => {
        if (field.type === 'email' && typeof value === 'string') {
            const emailError = validateEmail(value);
            setLocalError(emailError);
        }
    };

    const displayError = error || localError;

    return (
        <div className={cn("space-y-2", className)}>
            <div className="flex items-center justify-between">
                <label htmlFor={fieldId} className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    {Icon && <Icon className="w-3 h-3" />}
                    {field.label}
                    {field.required && <span className="text-destructive">*</span>}
                </label>
            </div>

            {field.type === 'textarea' ? (
                <textarea
                    id={fieldId}
                    name={field.name}
                    value={typeof value === 'string' ? value : ''}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder={field.placeholder}
                    required={field.required}
                    rows={4}
                    className={cn(
                        "w-full px-4 py-3 rounded-lg transition-all duration-300",
                        "bg-background border",
                        displayError ? "border-destructive focus:ring-destructive/20" : "border-input focus:ring-primary/20",
                        "focus:outline-none focus:ring-2 focus:border-primary",
                        "resize-none",
                        "text-foreground",
                        "placeholder:text-muted-foreground"
                    )}
                />
            ) : field.type === 'select' ? (
                <select
                    id={fieldId}
                    name={field.name}
                    value={typeof value === 'string' ? value : ''}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required={field.required}
                    className={cn(
                        "w-full px-4 py-3 rounded-lg transition-all duration-300",
                        "bg-background border",
                        displayError ? "border-destructive focus:ring-destructive/20" : "border-input focus:ring-primary/20",
                        "focus:outline-none focus:ring-2 focus:border-primary",
                        "text-foreground",
                        "appearance-none"
                    )}
                >
                    <option value="">Select {field.label}</option>
                    {field.options?.map(option => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            ) : field.type === 'checkbox' ? (
                <div className="flex items-center gap-3">
                    <input
                        type="checkbox"
                        id={fieldId}
                        name={field.name}
                        checked={typeof value === 'boolean' ? value : false}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="w-5 h-5 rounded border-input text-primary focus:ring-primary/20"
                    />
                    <Typography variant="body-small" color="muted">
                        {field.placeholder || field.label}
                    </Typography>
                </div>
            ) : field.type === 'radio' ? (
                <div className="space-y-2">
                    {field.options?.map(option => (
                        <div key={option.value} className="flex items-center gap-3">
                            <input
                                type="radio"
                                id={`${fieldId}-${option.value}`}
                                name={field.name}
                                value={option.value}
                                checked={value === option.value}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className="w-5 h-5 border-input text-primary focus:ring-primary/20"
                            />
                            <label
                                htmlFor={`${fieldId}-${option.value}`}
                                className={cn(
                                    "text-sm cursor-pointer hover:text-foreground transition-colors",
                                    value === option.value ? "text-primary font-medium" : "text-muted-foreground"
                                )}
                            >
                                {option.label}
                            </label>
                        </div>
                    ))}
                </div>
            ) : field.type === 'password' ? (
                // Special handling for password fields - bypass AnimatedInput
                <div className="relative">
                    <input
                        id={fieldId}
                        type={showPassword ? "text" : "password"}
                        value={typeof value === 'string' ? value : ''}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder={field.placeholder || field.label}
                        required={field.required}
                        className={cn(
                            "w-full px-4 py-3 rounded-lg transition-all duration-300",
                            "bg-background border",
                            "pl-10 pr-10", // Padding for icon on left and toggle on right
                            displayError ? "border-destructive focus:ring-destructive/20" : "border-input focus:ring-primary/20",
                            "focus:outline-none focus:ring-2 focus:border-primary",
                            "text-foreground",
                            "placeholder:text-muted-foreground"
                        )}
                    />
                    {/* Icon on the left */}
                    {Icon && (
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                            <Icon className="w-4 h-4" />
                        </div>
                    )}
                    {/* Password toggle button */}
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className={cn(
                            "absolute right-3 top-1/2 -translate-y-1/2",
                            "text-muted-foreground hover:text-foreground transition-colors",
                            "focus:outline-none focus:ring-2 focus:ring-primary/20 rounded-sm",
                            "p-1"
                        )}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                        {showPassword ? (
                            <EyeClosedIcon className="w-4 h-4" />
                        ) : (
                            <EyeOpenIcon className="w-4 h-4" />
                        )}
                    </button>
                </div>
            ) : (
                // For other input types, use AnimatedInput
                <div className="relative">
                    <AnimatedInput
                        placeholder={field.placeholder || field.label}
                        variant={inputVariant}
                        value={typeof value === 'string' ? value : ''}
                        onChange={(val: string) => {
                            updateField(field.name, val);
                            if (field.type === 'email') {
                                const emailError = validateEmail(val);
                                setLocalError(emailError);
                            }
                        }}
                        onBlur={handleBlur}
                        type={field.type}
                        icon={Icon}
                        error={displayError}
                        inputClassName={cn(
                            "pl-10",
                            displayError ? "border-destructive" : ""
                        )}
                    />

                    {/* Email format hint */}
                    {field.type === 'email' &&
                        !displayError &&
                        value &&
                        typeof value === 'string' &&
                        value.length > 3 && (
                            <Typography
                                variant="caption"
                                color="muted"
                                className="absolute -bottom-5 left-0 flex items-center gap-1"
                            >
                                <CheckCircledIcon className="w-3 h-3 text-green-500" />
                                Valid email format
                            </Typography>
                        )}
                </div>
            )}
        </div>
    );
};

/* ============================================
   REVIEW COMPONENT
============================================ */

export interface MultiStepReviewProps {
    onEditStep?: (step: number) => void;
    className?: string;
    children?: React.ReactNode;
}

/**
 * MultiStepReview - Review step showing all form data before submission
 * 
 * @component
 * @example
 * ```tsx
 * <MultiStepForm.Review 
 *   onEditStep={(step) => console.log(`Edit step ${step}`)}
 *   className="mt-4"
 * />
 * ```
 */
const MultiStepReview: React.FC<MultiStepReviewProps> = ({
    onEditStep,
    className,
    children
}) => {
    const { steps, formData, goToStep } = useMultiStepForm();

    const handleEditStep = (step: number) => {
        if (onEditStep) {
            onEditStep(step);
        } else {
            goToStep(step);
        }
    };

    if (children) {
        return <div className={className}>{children}</div>;
    }

    return (
        <div className={cn("space-y-8", className)}>
            <div className="text-center">
                <CheckCircledIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <Typography variant="h3" weight="bold" className="mb-2">
                    Review Your Information
                </Typography>
                <Typography variant="lead" color="muted">
                    Please verify everything looks correct before submitting.
                </Typography>
            </div>

            {steps.map((step, stepIndex) => {
                const stepNumber = stepIndex + 1;
                const hasData = step.fields.some(field => {
                    const value = formData[field.name];
                    return value !== undefined && value !== null && value !== '';
                });

                if (!hasData) return null;

                return (
                    <div key={step.id} className="border border-border rounded-xl overflow-hidden">
                        <div className="bg-secondary/30 px-6 py-4 border-b border-border flex items-center justify-between">
                            <div>
                                <Typography variant="h6" weight="semibold" className="text-foreground">
                                    {step.title}
                                </Typography>
                                {step.description && (
                                    <Typography variant="caption" color="muted">
                                        {step.description}
                                    </Typography>
                                )}
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditStep(stepNumber)}
                                className="cursor-pointer"
                            >
                                Edit
                            </Button>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {step.fields.map(field => {
                                    const value = formData[field.name];
                                    // const hasValue = value !== undefined && value !== null && value !== '';

                                    return (
                                        <div key={field.id} className={field.colSpan === 'full' ? 'md:col-span-2' : ''}>
                                            <Typography variant="label" color="muted" className="block mb-1">
                                                {field.label}
                                                {field.required && <span className="text-destructive ml-1">*</span>}
                                            </Typography>
                                            <ReviewFieldValue field={field} value={value} />
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

const ReviewFieldValue: React.FC<{ field: FormField; value: FieldValue }> = ({ field, value }) => {
    if (field.type === 'checkbox') {
        return value ? <CheckCircledIcon className="w-5 h-5 text-green-500" /> : <Cross2Icon className="w-5 h-5 text-red-400" />;
    }

    if (value === undefined || value === null || value === '') {
        return <span className="text-muted-foreground italic">—</span>;
    }

    if (field.type === 'select' || field.type === 'radio') {
        const option = field.options?.find(opt => opt.value === value);
        return <span className="text-foreground">{option?.label || value as string}</span>;
    }

    return <span className="text-foreground">{value as string}</span>;
};

/* ============================================
   NAVIGATION COMPONENT
============================================ */

export interface MultiStepNavigationProps {
    backButtonLabel?: string;
    nextButtonLabel?: string;
    submitButtonLabel?: string;
    cancelButtonLabel?: string;
    showCancelButton?: boolean;
    onCancel?: () => void;
    className?: string;
}
// Add this type alias near your other types
export type ButtonVariant = "default" | "link" | "primary" | "secondary" | "success" | "warning" | "none" | "danger" | "outline" | "ghost" | "subtle" | "elevated" | "glass" | "neon";

/**
 * MultiStepNavigation - Navigation controls for moving between form steps
 * 
 * @component
 * @example
 * ```tsx
 * <MultiStepForm.Navigation 
 *   backButtonLabel="← Previous"
 *   nextButtonLabel="Continue →"
 *   submitButtonLabel="Complete"
 *   showCancelButton={true}
 *   onCancel={handleCancel}
 * />
 * ```
 */
const MultiStepNavigation: React.FC<MultiStepNavigationProps> = ({
    backButtonLabel: customBackLabel,
    nextButtonLabel: customNextLabel,
    submitButtonLabel: customSubmitLabel,
    cancelButtonLabel: customCancelLabel,
    showCancelButton: customShowCancel,
    onCancel: customOnCancel,
    className
}) => {
    const {
        currentStep,
        isReviewStep,
        isSubmitting,
        goToPrevious,
        goToNext,
        submitForm,
        buttonVariant,
        buttonAnimationVariant,
        theme  // Add this from context
    } = useMultiStepForm();

    const backLabel = customBackLabel || "← Back";
    const nextLabel = customNextLabel || "Next →";
    const submitLabel = customSubmitLabel || "Submit";
    const cancelLabel = customCancelLabel || "Cancel";
    const showCancel = customShowCancel !== undefined ? customShowCancel : true;
    const handleCancel = customOnCancel;

    // Determine button variant based on theme
    const getButtonVariant = () => {
        if (theme === 'dark') {
            if (isReviewStep) {
                return 'primary'; // Use primary variant for submit in dark mode
            }
            return 'outline'; // Use outline for next in dark mode
        }
        return buttonVariant;
    };

    const getSubmitButtonVariant = () => {
        if (theme === 'dark') {
            return 'primary'; // Primary has proper contrast in dark mode
        }
        return buttonVariant;
    };

    return (
        <div className={cn(
            "flex items-center justify-between pt-8 mt-8",
            "border-t border-border",
            className
        )}>
            <div>
                {currentStep > 1 && (
                    <Button
                        variant={theme === 'dark' ? "outline" : "outline"}
                        onClick={goToPrevious}
                        disabled={isSubmitting}
                        className={cn(
                            "cursor-pointer",
                            theme === 'dark' && "text-foreground border-gray-600 hover:bg-gray-800"
                        )}
                        animationVariant="press3DSoft"
                    >
                        <ChevronLeftIcon className="w-4 h-4 mr-2" />
                        {backLabel}
                    </Button>
                )}
            </div>

            <div className="flex items-center gap-3">
                {showCancel && handleCancel && (
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
                )}

                {isReviewStep ? (
                    <Button
                        variant={getSubmitButtonVariant() as ButtonVariant}
                        onClick={submitForm}
                        disabled={isSubmitting}
                        className={cn(
                            "min-w-[120px] cursor-pointer",
                            theme === 'dark' && "bg-primary text-primary-foreground hover:bg-primary/90"
                        )}
                        animationVariant={isSubmitting ? "spinSlow" : "scaleHeartbeat"}
                    >
                        {isSubmitting ? (
                            <ReloadIcon className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                            <CheckIcon className="w-4 h-4 mr-2" />
                        )}
                        {isSubmitting ? 'Submitting...' : submitLabel}
                    </Button>
                ) : (
                    <Button
                        variant={getButtonVariant() as ButtonVariant}
                        onClick={goToNext}
                        disabled={isSubmitting}
                        className={cn(
                            "min-w-[120px] cursor-pointer",
                            theme === 'dark' && "bg-primary text-primary-foreground hover:bg-primary/90"
                        )}
                        animationVariant={buttonAnimationVariant}
                    >
                        {nextLabel}
                        <ChevronRightIcon className="w-4 h-4 ml-2" />
                    </Button>
                )}
            </div>
        </div>
    );
};

/* ============================================
   NOTIFICATION COMPONENT
============================================ */

export interface MultiStepNotificationProps {
    type: 'success' | 'error' | 'info' | 'warning';
    message: string;
    onClose: () => void;
    duration?: number;
    className?: string;
}

/**
 * MultiStepNotification - Toast notification for form submission feedback
 * 
 * @component
 * @example
 * ```tsx
 * <MultiStepForm.Notification 
 *   type="success"
 *   message="Form submitted successfully!"
 *   onClose={() => setShowNotification(false)}
 *   duration={3000}
 * />
 * ```
 */
const MultiStepNotification: React.FC<MultiStepNotificationProps> = ({
    type = 'success',
    message,
    onClose,
    duration = 3000,
    className
}) => {
    React.useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const icons = {
        success: <CheckCircledIcon className="w-5 h-5" />,
        error: <CrossCircledIcon className="w-5 h-5" />,
        info: <InfoCircledIcon className="w-5 h-5" />,
        warning: <ExclamationTriangleIcon className="w-5 h-5" />
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={cn(
                NotificationVariants({ type }),
                "fixed top-4 right-4 z-50",
                className
            )}
        >
            {icons[type]}
            <Typography variant="body-small" weight="medium">
                {message}
            </Typography>
            <button
                onClick={onClose}
                className="ml-4 text-current hover:opacity-70 transition-opacity"
            >
                <Cross2Icon className="w-4 h-4" />
            </button>
        </motion.div>
    );
};

/* ============================================
   ASSIGN COMPOUND COMPONENTS
============================================ */

MultiStepForm.Header = MultiStepHeader;
MultiStepForm.StepIndicator = MultiStepStepIndicator;
MultiStepForm.Content = MultiStepContent;
MultiStepForm.Field = MultiStepField;
MultiStepForm.Review = MultiStepReview;
MultiStepForm.Navigation = MultiStepNavigation;
MultiStepForm.Notification = MultiStepNotification;

export {
    MultiStepForm,
    MultiStepHeader,
    MultiStepStepIndicator,
    MultiStepContent,
    MultiStepField,
    MultiStepReview,
    MultiStepNavigation,
    MultiStepNotification,
};