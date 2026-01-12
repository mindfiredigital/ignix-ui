import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Mail, CheckCircle2, ArrowLeft, AlertCircle, MailCheck, Loader2 } from "lucide-react";
import { z } from "zod";
import { cn } from "../../../../../utils/cn";
import { CardDescription, CardHeader, CardTitle } from "../../../../components/card";
import { Button } from "../../../../components/button";
import AnimatedInput from "../../../../components/input";



/**
 * Type for header animation keys
 */
type HeaderAnimationKeys = keyof typeof headerAnimationVariant;

/**
 * Simple header configuration interface
 * @interface SimpleHeader
 */
interface SimpleHeader {
  /** The main heading text */
  head: string;
  /** The description/paragraph text */
  para: string;
}

/**
 * Props for the FormHeader component
 * @interface ForgotPasswordHeaderProps
 * @extends SimpleHeader
 */
interface ForgotPasswordHeaderProps extends SimpleHeader {
  /** Animation variant for the header */
  animationVariant?: HeaderAnimationKeys;
}

/**
 * Props for the LinkButton component
 * @interface LinkButtonProps
 */
interface LinkButtonProps {
  /** Label text for the button */
  label?: string;
  /** Custom text color classes */
  textColor?: string;
  /** Callback function when button is clicked */
  onBack?: () => void;
}

/**
 * Main props interface for ForgotPasswordPage component
 * @interface ForgotPasswordProps
 */
export interface ForgotPasswordProps {
  /** Simplified header API - provides head and para text */
  forgotPasswordHeader?: SimpleHeader;

  /** Backward compatible - custom header React node */
  formCardHeader?: React.ReactNode;

  /** Optional override for login link node */
  loginLink?: React.ReactNode;
  /** Optional override for button node */
  button?: React.ReactNode;
  /** Optional override for input node */
  input?: React.ReactNode;

  /** Visual theme variant for the page */
  variant?: VariantProps<typeof ForgotPasswordVariants>["variant"];
  /** Input field animation variant */
  inputVariant?:
    | "clean"
    | "underline"
    | "floating"
    | "borderGlow"
    | "shimmer"
    | "particles"
    | "slide"
    | "scale"
    | "rotate"
    | "bounce"
    | "elastic"
    | "glow"
    | "shake"
    | "wave"
    | "typewriter"
    | "magnetic"
    | "pulse"
    | "borderBeam"
    | "ripple"
    | "particleField"
    | "tilt3D";
  /** Button animation variant */
  animationVariant?:
    | "bounce"
    | "bounceSlow"
    | "bounceFast"
    | "bounceSmooth"
    | "bounceJelly"
    | "rotateClockwiseSlow"
    | "rotateClockwiseFast"
    | "rotateAntiClockwiseSlow"
    | "rotateAntiClockwiseFast"
    | "rotatePingPong"
    | "scaleUp"
    | "scaleDown"
    | "scaleHeartBeat"
    | "flipX"
    | "flipY"
    | "flipCard"
    | "fadeBlink"
    | "fadeInOut"
    | "press3D"
    | "press3DSoft"
    | "press3DHard"
    | "press3DPop"
    | "press3DDepth"
    | "spinSlow";
  /** Header animation variant */
  headerAnimation?: HeaderAnimationKeys;

  /** Current status of the form */
  status?: "idle" | "loading" | "success" | "error";
  /** Error message to display */
  errorMessage?: string;
  /** Success message to display */
  successMessage?: string;
  /** Label for the navigation/back button */
  navigateToLabel?: string;
  /** Label for the submit button */
  submitbuttonLabel?: string;

  /** Callback function when form is submitted with email */
  onSubmit?: (email: string) => void | Promise<void>;
  /** Callback function when navigate/back button is clicked */
  onNavigateTo?: () => void;
  /** Additional CSS classes */
  className?: string;

  /** CAPTCHA component to display */
  captcha?: React.ReactNode;
  /** Whether CAPTCHA is verified */
  captchaVerified?: boolean;
}

/**
 * CVA (Class Variance Authority) variants for the forgot password page
 * Defines different visual theme variants
 */
const ForgotPasswordVariants = cva("", {
  variants: {
    variant: {
      default: "bg-background text-foreground",
      dark: "bg-gradient-to-br from-black via-neutral-900 to-neutral-800 text-white",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

/**
 * Header animation variants configuration
 * Defines different animation styles for the header component
 */
const headerAnimationVariant = {
  fadeUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
  },
  slideLeft: {
    initial: { opacity: 0, x: -40 },
    animate: { opacity: 1, x: 0 },
  },
  slideRight: {
    initial: { opacity: 0, x: 40 },
    animate: { opacity: 1, x: 0 },
  },
  flipIn: {
    initial: { rotateX: -90, opacity: 0 },
    animate: { rotateX: 0, opacity: 1 },
  },
};

/**
 * Skeleton loader component for the forgot password form
 * Displays animated placeholder elements while content is loading
 * @component
 * @param {Object} props - Component props
 * @param {string} [props.variant] - Theme variant (e.g., "dark")
 * @returns {JSX.Element} Skeleton loader element
 */
const FormSkeleton = React.memo(({ variant }: { variant?: string }) => {
  const isDark = variant === "dark";
  
  return (
    <div className={cn(
      "w-full max-w-lg p-10 rounded-3xl shadow-2xl border backdrop-blur-sm animate-pulse",
      isDark
        ? "bg-gradient-to-br from-neutral-900/95 via-neutral-800/95 to-black/95 border-neutral-700/50"
        : "bg-white/95 border-gray-200/50"
    )}>
      <div className="flex flex-col items-center gap-4 mb-6">
        {/* Icon Skeleton */}
        <div className={cn(
          "w-16 h-16 rounded-full",
          isDark ? "bg-neutral-700" : "bg-gray-200"
        )} />
        
        {/* Title Skeleton */}
        <div className={cn(
          "w-48 h-8 rounded-lg mb-2",
          isDark ? "bg-neutral-700" : "bg-gray-200"
        )} />
        
        {/* Description Skeleton */}
        <div className={cn(
          "w-64 h-4 rounded-lg",
          isDark ? "bg-neutral-700" : "bg-gray-200"
        )} />
        <div className={cn(
          "w-56 h-4 rounded-lg",
          isDark ? "bg-neutral-700" : "bg-gray-200"
        )} />
      </div>
      
      <div className="space-y-6">
        {/* Input Skeleton */}
        <div className={cn(
          "w-full h-12 rounded-lg",
          isDark ? "bg-neutral-700" : "bg-gray-200"
        )} />
        
        {/* Button Skeleton */}
        <div className={cn(
          "w-full h-12 rounded-xl",
          isDark ? "bg-neutral-700" : "bg-gray-200"
        )} />
        
        {/* Link Button Skeleton */}
        <div className={cn(
          "w-full h-12 rounded-xl",
          isDark ? "bg-neutral-700" : "bg-gray-200"
        )} />
      </div>
    </div>
  );
});

FormSkeleton.displayName = "FormSkeleton";

/**
 * Form header component with animated title and description
 * @component
 * @param {ForgotPasswordHeaderProps} props - Component props
 * @param {string} props.head - Main heading text
 * @param {string} props.para - Description text
 * @param {HeaderAnimationKeys} [props.animationVariant="fadeUp"] - Animation variant
 * @returns {JSX.Element} Animated header element
 */
export const FormHeader = React.memo(({
  head,
  para,
  animationVariant = "fadeUp",
}: ForgotPasswordHeaderProps) => {
  const anim = React.useMemo(
    () => headerAnimationVariant[animationVariant] ?? headerAnimationVariant.fadeUp,
    [animationVariant]
  );

  return (
    <motion.div
      initial={anim.initial}
      animate={anim.animate}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="w-full"
    >
      <CardTitle size="lg" className="text-center text-foreground font-bold text-2xl mb-2">
        {head}
      </CardTitle>
      <CardDescription className="text-center text-muted-foreground text-base leading-relaxed">
        {para}
      </CardDescription>
    </motion.div>
  );
});

FormHeader.displayName = "FormHeader";

/**
 * Link button component for navigation (e.g., "Back to Login")
 * @component
 * @param {LinkButtonProps} props - Component props
 * @param {string} [props.label="Back to Login"] - Button label text
 * @param {string} [props.textColor] - Custom text color classes
 * @param {() => void} [props.onBack] - Callback function on button click
 * @returns {JSX.Element} Animated link button element
 */
export const LinkButton = React.memo(({
  label = "Back to Login",
  onBack,
  textColor,
}: LinkButtonProps) => {
  return (
    <motion.div
      whileHover={{ x: -4 }}
      whileTap={{ scale: 0.97 }}
      className="inline-flex w-full"
    >
      <Button
        variant="outline"
        size="lg"
        onClick={onBack}
        className={cn(
          "w-full h-12 rounded-xl text-base cursor-pointer",
          "flex items-center justify-center gap-2 font-medium",
          "border-2 hover:border-primary/50 transition-all duration-300",
          "hover:bg-primary/5 hover:shadow-md hover:shadow-primary/10",
          "backdrop-blur-sm",
          textColor
        )}
      >
        <motion.div
          whileHover={{ x: -2 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          <ArrowLeft className="h-4 w-4" />
        </motion.div>
        <span>{label}</span>
      </Button>
    </motion.div>
  );
});

LinkButton.displayName = "LinkButton";

/**
 * Email validation regex pattern
 * Validates standard email format according to RFC 5322
 * @constant
 */
const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

/**
 * Generates user-friendly error messages for email validation
 * @param {string} email - Email address to validate
 * @returns {string} Error message if invalid, empty string if valid
 */
const getEmailErrorMessage = (email: string): string => {
  if (!email || email.trim() === "") {
    return "";
  }

  // Check for common mistakes
  if (email.includes(" ")) {
    return "Email addresses cannot contain spaces";
  }

  if (!email.includes("@")) {
    return "Email must include @ symbol";
  }

  if (email.startsWith("@") || email.endsWith("@")) {
    return "Email cannot start or end with @";
  }

  const parts = email.split("@");
  if (parts.length !== 2) {
    return "Email must have exactly one @ symbol";
  }

  const [localPart, domain] = parts;

  if (!localPart || localPart.length === 0) {
    return "Email must have a username before @";
  }

  if (localPart.length > 64) {
    return "Email username is too long (max 64 characters)";
  }

  if (!domain || domain.length === 0) {
    return "Email must have a domain after @";
  }

  if (!domain.includes(".")) {
    return "Email domain must include a dot (.)";
  }

  if (domain.startsWith(".") || domain.endsWith(".")) {
    return "Email domain cannot start or end with a dot";
  }

  // Final regex validation
  if (!emailRegex.test(email)) {
    return "Please enter a valid email address (e.g., name@example.com)";
  }

  return "";
};

/**
 * Zod validation schema for email validation
 * Uses regex pattern for email format validation
 * @constant
 */
const emailSchema = z
  .string()
  .min(1, "Email is required")
  .refine((val) => emailRegex.test(val), {
    message: "Please enter a valid email address",
  });

/**
 * Main forgot password content component
 * Handles form state, validation, and submission
 * @component
 * @param {ForgotPasswordProps} props - Component props
 * @returns {JSX.Element} Forgot password form or success page
 */
const ForgotPasswordContent: React.FC<ForgotPasswordProps> = ({
  forgotPasswordHeader,
  formCardHeader,
  variant = "default",
  inputVariant = "clean",
  headerAnimation = "fadeUp",
  successMessage = "Check your email for a reset link",
  onSubmit,
  onNavigateTo,
  navigateToLabel = "Back To Login",
  submitbuttonLabel = "Send Reset Link",
  className,
  captcha,
  captchaVerified,
}) => {
  const [email, setEmail] = React.useState("");
  const [status, setStatus] = React.useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );
  const [errorMessage, setErrorMessage] = React.useState("");
  
  /**
   * Memoized email validation check
   * Validates email format using regex and checks for error messages
   */
  const isEmailValid = React.useMemo(() => {
    if (!email || email.trim() === "") return false;
    // Check both regex validation and ensure no error message exists
    const hasRegexError = !emailRegex.test(email.trim());
    const hasDetailedError = !!getEmailErrorMessage(email.trim());
    return !hasRegexError && !hasDetailedError;
  }, [email]);

  /**
   * Memoized resolved header component
   * Uses forgotPasswordHeader if provided, otherwise falls back to formCardHeader
   */
  const resolvedFormCardHeader = React.useMemo(() => {
    return forgotPasswordHeader ? (
      <FormHeader
        head={forgotPasswordHeader.head}
        para={forgotPasswordHeader.para}
        animationVariant={headerAnimation}
      />
    ) : (
      formCardHeader
    );
  }, [forgotPasswordHeader, formCardHeader, headerAnimation]);

  /**
   * Memoized variant-based CSS classes
   * Pre-computes classes based on variant to avoid recalculation
   */
  const variantClasses = React.useMemo(() => {
    const isDark = variant === "dark";
    return {
      card: cn(
        "w-full max-w-lg p-10 rounded-3xl shadow-2xl border backdrop-blur-sm relative overflow-hidden",
        isDark
          ? "bg-gradient-to-br from-neutral-900/95 via-neutral-800/95 to-black/95 border-neutral-700/50 text-white shadow-black/50"
          : "bg-white/95 border-gray-200/50 text-foreground shadow-gray-200/50",
        className
      ),
      background: cn(
        "flex min-h-screen items-center justify-center px-4 py-10 relative overflow-hidden",
        isDark
          ? "bg-gradient-to-br from-black via-neutral-900 to-neutral-800"
          : "bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50",
        className
      ),
      iconBg: isDark ? "bg-primary/20" : "bg-primary/10",
      iconColor: isDark ? "text-primary-300" : "text-primary",
    };
  }, [variant, className]);

  /**
   * Handles form submission
   * Validates email and calls onSubmit callback
   * Supports both synchronous and asynchronous onSubmit callbacks
   * @async
   */
  const handleSubmit = React.useCallback(async () => {
    const result = emailSchema.safeParse(email);

    if (!result.success) {
      setStatus("error");
      setErrorMessage(result.error.issues[0].message);
      return;
    }

    // Set loading state
    setStatus("loading");

    try {
      // If onSubmit returns a promise, wait for it
      const result = onSubmit?.(email);
      if (result && typeof result === "object" && "then" in result) {
        await result;
      }
      setStatus("success");
      setErrorMessage(successMessage);
    } catch (err: any) {
      setStatus("error");
      setErrorMessage(err?.message ?? "Failed to submit");
    }
  }, [email, onSubmit, successMessage]);

  /**
   * Handles navigation/back button click
   * Calls onNavigateTo callback if provided
   */
  const handleNavigateTo = React.useCallback(() => {
    onNavigateTo?.();
  }, [onNavigateTo]);

  /**
   * Handles email input changes
   * Updates email state and validates in real-time
   * @param {string} val - New email value
   */
  const handleEmailChange = React.useCallback((val: string) => {
    setEmail(val);

    if (!val || val.trim() === "") {
      setStatus("idle");
      setErrorMessage("");
      return;
    }

    const errorMsg = getEmailErrorMessage(val);
    if (errorMsg) {
      setStatus("error");
      setErrorMessage(errorMsg);
    } else {
      setStatus("idle");
      setErrorMessage("");
    }
  }, []);

  /**
   * Reset Password Sent Page Component
   * Displays success state after email is sent
   * Shows confirmation message with email address and navigation options
   */
  const ResetPasswordSentPage = (
    <motion.div
      initial={{ opacity: 0, scale: 0.98, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={cn(
        "w-full max-w-xl p-10 rounded-3xl shadow-2xl border backdrop-blur-sm",
        variant === "dark" 
          ? "bg-gradient-to-br from-neutral-900/95 via-neutral-800/95 to-black/95 border-neutral-700/50 text-white"
          : "bg-white/95 border-gray-200/50 text-foreground shadow-gray-200/50",
        className
      )}
    >
      <CardHeader>
        <div className="flex flex-col items-center gap-6 mb-8">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ 
              type: "spring", 
              stiffness: 200, 
              damping: 15,
              delay: 0.2
            }}
            className={cn(
              "p-5 rounded-full relative",
              variant === "dark" 
                ? "bg-gradient-to-br from-emerald-500/30 to-emerald-600/20 shadow-lg shadow-emerald-500/20" 
                : "bg-gradient-to-br from-emerald-100 to-emerald-50 shadow-lg shadow-emerald-200/50"
            )}
          >
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatDelay: 3
              }}
            >
              <MailCheck className={cn(
                "h-14 w-14",
                variant === "dark" ? "text-emerald-400" : "text-emerald-600"
              )} />
            </motion.div>
            <motion.div
              className={cn(
                "absolute inset-0 rounded-full",
                variant === "dark"
                  ? "bg-emerald-500/20"
                  : "bg-emerald-500/10"
              )}
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.5, 0, 0.5]
              }}
              transition={{
                duration: 2,
                repeat: Infinity
              }}
            />
          </motion.div>
          <div className="text-center space-y-3">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <CardTitle size="lg" className={cn(
                "text-2xl font-bold",
                variant === "dark" ? "text-white" : "text-foreground"
              )}>
                Check your email
              </CardTitle>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <CardDescription className={cn(
                "text-base leading-relaxed",
                variant === "dark" ? "text-gray-300" : "text-muted-foreground"
              )}>
                We've sent a password reset link to
              </CardDescription>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, type: "spring" }}
                className={cn(
                  "mt-2 px-4 py-2 rounded-lg inline-block",
                  variant === "dark"
                    ? "bg-primary/20 border border-primary/30"
                    : "bg-primary/10 border border-primary/20"
                )}
              >
                <span className="font-semibold text-primary text-lg">{email}</span>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </CardHeader>

      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className={cn(
            "p-5 rounded-xl border backdrop-blur-sm",
            variant === "dark"
              ? "bg-neutral-800/40 border-neutral-700/50 text-gray-200 shadow-lg shadow-black/20"
              : "bg-blue-50/80 border-blue-200/50 text-blue-800 shadow-md"
          )}
        >
          <p className="text-sm text-center leading-relaxed">
            <span className="font-medium">Didn't receive the email?</span> Check your spam folder or try again in a few minutes.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Button
            animationVariant="press3D"
            size="lg"
            onClick={handleNavigateTo}
            className={cn(
              "w-full h-12 rounded-xl text-base font-semibold",
              "flex items-center justify-center gap-2",
              "transition-all duration-300",
              variant === "dark"
                ? "bg-white text-black hover:bg-gray-100 hover:shadow-lg hover:shadow-white/20"
                : "bg-primary text-white hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/30"
            )}
          >
            <ArrowLeft className="h-4 w-4" />
            {navigateToLabel}
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );

  /**
   * Main Form Card Component
   * Contains the email input form with validation, error handling, and submission
   * Includes decorative background elements and animated transitions
   */
  const FormCard = (
    <motion.div
      initial={{ opacity: 0, scale: 0.98, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={variantClasses.card}
    >
      {/* Decorative background elements */}
      {variant === "dark" && (
        <>
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        </>
      )}
      {variant !== "dark" && (
        <>
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        </>
      )}

      <CardHeader className="relative z-10">
        <div className="flex flex-col items-center gap-3 mb-4">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ 
              type: "spring", 
              stiffness: 200, 
              damping: 15,
              delay: 0.2
            }}
            className="flex items-center justify-center mb-2"
          >
            <motion.div
              className={cn(
                "p-4 rounded-2xl relative",
                variantClasses.iconBg,
                "shadow-lg shadow-primary/20"
              )}
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Lock className={cn(
                "h-10 w-10",
                variantClasses.iconColor
              )} />
              <motion.div
                className={cn(
                  "absolute inset-0 rounded-2xl",
                  variant === "dark"
                    ? "bg-primary/10"
                    : "bg-primary/5"
                )}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0, 0.5]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity
                }}
              />
            </motion.div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="w-full"
          >
            {resolvedFormCardHeader}
          </motion.div>
        </div>
      </CardHeader>

      <div className="space-y-6 mt-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className={cn(
            (variant === "dark") && 
            "[&_svg]:!text-gray-300 [&_svg]:group-focus-within:!text-primary-300"
          )}
        >
          <AnimatedInput
            placeholder="Email address"
            variant={inputVariant}
            value={email}
            onChange={handleEmailChange}
            type="email"
            icon={Mail}
            size="md"
            labelClassName={cn(
              "ms-6",
              (variant === "dark") && 
              "!text-gray-300"
            )}
            inputClassName={cn(
              (variant === "dark") && [
                "!text-white",
                "!bg-neutral-800/50",
                "!border-neutral-600/50",
                "placeholder:!text-gray-400",
                "placeholder:!opacity-100",
                "focus:!bg-neutral-800/70",
                "focus:!border-primary-400/50",
                "hover:!border-neutral-500/50"
              ]
            )}
          />
        </motion.div>

        <AnimatePresence mode="wait">
          {status === "error" && errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300 }}
              className={cn(
                "flex items-center gap-2 text-sm p-3 rounded-lg border",
                variant === "dark"
                  ? "bg-red-500/10 border-red-500/30 text-red-400"
                  : "bg-red-50 border-red-200 text-red-600"
              )}
            >
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span className="font-medium">{errorMessage}</span>
            </motion.div>
          )}

          {isEmailValid && status === "idle" && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300 }}
              className={cn(
                "flex items-center gap-2 text-sm p-3 rounded-lg border",
                variant === "dark"
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                  : "bg-emerald-50 border-emerald-200 text-emerald-600"
              )}
            >
              <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
              <span className="font-medium">Email looks good!</span>
            </motion.div>
          )}
        </AnimatePresence>

        {captcha && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-4 flex justify-center"
          >
            {captcha}
          </motion.div>
        )}
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Button
            animationVariant="press3D"
            size="lg"
            disabled={!isEmailValid || status === "loading" || status === "success" || (captcha ? !captchaVerified : false)}
            className={cn(
              "w-full h-12 rounded-xl text-base font-semibold",
              "flex items-center justify-center gap-2",
              "transition-all duration-300",
              variant === "dark"
                ? "bg-white text-black hover:bg-gray-100 hover:shadow-lg hover:shadow-white/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
                : "bg-gradient-to-r from-primary to-primary/90 text-white hover:from-primary/90 hover:to-primary hover:shadow-lg hover:shadow-primary/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
            )}
            onClick={handleSubmit}
          >
            {status === "loading" && (
              <Loader2 className="h-4 w-4 animate-spin" />
            )}
            {status === "loading" ? "Sending..." : submitbuttonLabel}
          </Button>
        </motion.div>

        {/* If consumer passed a `loginLink` node use it; otherwise render default LinkButton */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <LinkButton
            label={navigateToLabel}
            onBack={handleNavigateTo}
            textColor={
              variant === "dark" 
                ? "text-white border-white/20 hover:border-white/40 hover:bg-white/5" 
                : "hover:bg-gray-50"
            }
          />
        </motion.div>
      </div>
    </motion.div>
  );

  // Show skeleton during loading state (optional - can be removed if not needed)
  // This is useful for initial page load scenarios

  return (
    <div className={variantClasses.background}>
      {/* Animated background elements for dark theme */}
      {variant === "dark" && (
        <>
          <motion.div
            className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
            animate={{
              x: [0, 100, 0],
              y: [0, 50, 0],
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"
            animate={{
              x: [0, -100, 0],
              y: [0, -50, 0],
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </>
      )}
      
      {/* Animated background elements for light theme */}
      {variant !== "dark" && (
        <>
          <motion.div
            className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl"
            animate={{
              x: [0, 100, 0],
              y: [0, 50, 0],
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"
            animate={{
              x: [0, -100, 0],
              y: [0, -50, 0],
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </>
      )}
      <AnimatePresence mode="wait">
        {status === "success" ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            {ResetPasswordSentPage}
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            {FormCard}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/**
 * Forgot Password Page Component
 * 
 * A comprehensive forgot password page with email validation, loading states,
 * and support for various themes and animations.
 * 
 * @component
 * @example
 * ```tsx
 * <ForgotPasswordPage
 *   variant="dark"
 *   inputVariant="clean"
 *   forgotPasswordHeader={{
 *     head: "Forgot Password",
 *     para: "Enter your email to receive a reset link."
 *   }}
 *   onSubmit={(email) => console.log(email)}
 *   onNavigateTo={() => navigate('/login')}
 * />
 * ```
 * 
 * @param {ForgotPasswordProps} props - Component props
 * @returns {JSX.Element} Forgot password page component
 */
export const ForgotPasswordPage: React.FC<ForgotPasswordProps> = (props) => {
  return <ForgotPasswordContent {...props} />;
};
