import React, { useRef, useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  CrossCircledIcon,
  CheckCircledIcon,
  ExclamationTriangleIcon,
  InfoCircledIcon,
} from '@radix-ui/react-icons';
import { ToastVariantTypes, ToastAnimationTypes } from './types';
import { cn } from '../../../utils/cn';

interface ToastContainerData {
  id: number;
  message: string;
  variant: ToastVariantTypes;
  animation: ToastAnimationTypes;
  mode?: 'dark' | 'light';
  icon?: React.ReactNode;
  appearance?: 'glow' | 'gradient' | 'glassmorphism' | 'premium' | 'neon';
  gradientColor?: string;
  duration?: number;
  size?: 'sm' | 'md' | 'lg';
  position?:
    | 'top-right'
    | 'top-left'
    | 'bottom-right'
    | 'bottom-left'
    | 'top-center'
    | 'bottom-center';
  showProgress?: boolean;
  pauseOnHover?: boolean;
  actionButton?: {
    label: string;
    onClick: () => void;
  };
  dismissible?: boolean;
  priority?: 'low' | 'normal' | 'high' | 'urgent';
}

interface ToastNotificationProps extends ToastContainerData {
  onClose: (id: number) => void;
  timeoutMapRef: React.RefObject<Map<number, ReturnType<typeof setTimeout>>>;
  index: number; // Add index for proper positioning
}

export type ToastDataArgs = Omit<ToastContainerData, 'id'>;

export interface ToastManagerRef {
  addToast: (data: ToastDataArgs) => void;
  removeToast: (id: number) => void;
  clearAll: () => void;
}

const variantColors = {
  success: {
    primary: 'hsl(142.1, 76.2%, 36.3%)',
    secondary: 'hsl(142.1, 70.6%, 45.3%)',
    light: 'hsl(143, 85%, 96%)',
    dark: 'hsl(144.9, 80.4%, 10%)',
  },
  error: {
    primary: 'hsl(0, 84.2%, 60.2%)',
    secondary: 'hsl(0, 84.2%, 60.2%)',
    light: 'hsl(0, 100%, 98%)',
    dark: 'hsl(0, 72.2%, 50.6%)',
  },
  warning: {
    primary: 'hsl(38, 92%, 50%)',
    secondary: 'hsl(32, 94.6%, 43.7%)',
    light: 'hsl(48, 100%, 96.1%)',
    dark: 'hsl(20, 90.2%, 48.2%)',
  },
  info: {
    primary: 'hsl(221.2, 83.2%, 53.3%)',
    secondary: 'hsl(222.2, 89.8%, 61.8%)',
    light: 'hsl(210, 100%, 98%)',
    dark: 'hsl(224.3, 76.3%, 48%)',
  },
  default: {
    primary: 'rgb(100, 116, 139)',
    secondary: 'rgb(71, 85, 105)',
    light: 'rgb(248, 250, 252)',
    dark: 'rgb(51, 65, 85)',
  },
};

export const ToastContext = React.createContext<ToastManagerRef | undefined>(undefined);

// FIXED: Enhanced animation variants with proper positioning
const animationVariants = {
  slide: {
    hidden: {
      x: '120%',
      opacity: 0,
      scale: 0.8,
      filter: 'blur(8px)',
    },
    visible: (index: number) => ({
      x: 0,
      opacity: 1,
      scale: 1,
      filter: 'blur(0px)',
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 25,
        mass: 0.8,
        delay: index * 0.1, // Stagger animation based on position
      },
    }),
    exit: {
      x: '120%',
      opacity: 0,
      scale: 0.8,
      filter: 'blur(8px)',
      transition: {
        duration: 0.3,
        ease: [0.4, 0, 1, 1],
      },
    },
  },
  fade: {
    hidden: {
      opacity: 0,
      scale: 0.95,
      filter: 'blur(4px)',
    },
    visible: (index: number) => ({
      opacity: 1,
      scale: 1,
      filter: 'blur(0px)',
      transition: {
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1],
        delay: index * 0.05,
      },
    }),
    exit: {
      opacity: 0,
      scale: 0.95,
      filter: 'blur(4px)',
      transition: {
        duration: 0.2,
        ease: [0.4, 0, 1, 1],
      },
    },
  },
  bounce: {
    hidden: {
      y: -100,
      opacity: 0,
      scale: 0.3,
    },
    visible: (index: number) => ({
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 15,
        mass: 0.6,
        delay: index * 0.1,
      },
    }),
    exit: {
      y: -100,
      opacity: 0,
      scale: 0.3,
      transition: {
        duration: 0.3,
        ease: [0.4, 0, 1, 1],
      },
    },
  },
  pop: {
    hidden: {
      opacity: 0,
      scale: 0,
      filter: 'brightness(0.5)',
    },
    visible: (index: number) => ({
      opacity: 1,
      scale: [0, 1.1, 1],
      filter: 'brightness(1)',
      transition: {
        type: 'spring',
        stiffness: 500,
        damping: 20,
        mass: 0.5,
        delay: index * 0.08,
      },
    }),
    exit: {
      opacity: 0,
      scale: 0,
      filter: 'brightness(0.5)',
      transition: {
        duration: 0.2,
        ease: [0.4, 0, 1, 1],
      },
    },
  },
  elastic: {
    hidden: {
      opacity: 0,
      scale: 0,
      x: -50,
    },
    visible: (index: number) => ({
      opacity: 1,
      scale: [0, 1.2, 0.9, 1.05, 1],
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 12,
        mass: 0.8,
        delay: index * 0.1,
      },
    }),
    exit: {
      opacity: 0,
      scale: 0,
      x: 50,
      transition: {
        duration: 0.3,
        ease: [0.4, 0, 1, 1],
      },
    },
  },
  flip: {
    hidden: {
      opacity: 0,
      rotateX: -90,
      scale: 0.8,
    },
    visible: (index: number) => ({
      opacity: 1,
      rotateX: 0,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 20,
        delay: index * 0.08,
      },
    }),
    exit: {
      opacity: 0,
      rotateX: 90,
      scale: 0.8,
      transition: {
        duration: 0.3,
        ease: [0.4, 0, 1, 1],
      },
    },
  },
};

// Enhanced variant styles (same as before)
// Helper function to get enhanced variant styles
const getEnhancedVariantStyles = (
  appearance: ToastContainerData['appearance'],
  variant: ToastVariantTypes,
  gradientColor: string,
  size: 'sm' | 'md' | 'lg' = 'md'
): { className: string; style: React.CSSProperties } => {
  const sizeStyles = {
    sm: 'min-w-[280px] max-w-[320px] p-3',
    md: 'min-w-[320px] max-w-[400px] p-4',
    lg: 'min-w-[400px] max-w-[500px] p-5',
  };

  const baseStyles = cn(
    'relative overflow-hidden backdrop-blur-sm border rounded-xl shadow-lg',
    'transform-gpu will-change-transform',
    sizeStyles[size]
  );

  const colors = variantColors[variant as keyof typeof variantColors] || variantColors.default;

  switch (appearance) {
    case 'premium':
      return {
        className: cn(
          baseStyles,
          'bg-gradient-to-br from-background to-muted/20',
          'border-border/40 shadow-2xl'
        ),
        style: {
          background: `
            linear-gradient(135deg,
              ${colors.light} 0%,
              ${colors.primary}10 50%,
              ${colors.secondary}10 100%
            )
          `,
          borderLeft: `4px solid ${colors.primary}`,
          boxShadow: `
            0 20px 25px -5px rgba(0,0,0,0.1),
            0 10px 10px -5px rgba(0,0,0,0.04),
            0 0 0 1px ${colors.primary}20,
            inset 0 1px 0 rgba(255,255,255,0.1)
          `,
        },
      };
      

    case 'gradient':
    default: {
      const parsedColor = gradientColor.includes('rgb') ? gradientColor : colors.primary;
      return {
        className: baseStyles,
        style: {
          borderLeft: `4px solid ${parsedColor}`,
          background: `
            linear-gradient(135deg, 
              ${createEnhancedGradient(parsedColor)} 0%, 
              ${parsedColor}20 100%
            )
          `,
          boxShadow: `
            0 10px 15px -3px rgba(0,0,0,0.1),
            0 4px 6px -2px rgba(0,0,0,0.05),
            0 0 0 1px ${parsedColor}20
          `,
          color: 'hsl(0, 0%, 100%)', // Ensure text is always readable
        },
      };
    }
  }
};

const createEnhancedGradient = (color: string) => {
  if (!color.includes('rgb')) return 'rgba(59, 130, 246, 0.1)';

  const arr = color.slice(color.indexOf('(') + 1, color.indexOf(')')).split(',');
  if (arr.length > 3) arr.pop();

  return `rgba(${arr.join(',')}, 0.08)`;
};

// FIXED: Position configurations
const positionConfig = {
  'top-right': 'top-4 right-4',
  'top-left': 'top-4 left-4',
  'bottom-right': 'bottom-4 right-4',
  'bottom-left': 'bottom-4 left-4',
  'top-center': 'top-4 left-1/2 -translate-x-1/2',
  'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
};

export const ToastProvider = ({
  children,
  maxToasts = 5,
  defaultPosition = 'top-right',
}: {
  children: React.ReactNode;
  maxToasts?: number;
  defaultPosition?: keyof typeof positionConfig;
}) => {
  const [toasts, setToasts] = useState<ToastContainerData[]>([]);
  const timeoutMapRef = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());

  const removeToast = useCallback((id: number) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
    const timeout = timeoutMapRef.current.get(id);
    if (timeout) {
      clearTimeout(timeout);
      timeoutMapRef.current.delete(id);
    }
  }, []);

  const clearAll = useCallback(() => {
    setToasts([]);
    timeoutMapRef.current.forEach((timeout) => clearTimeout(timeout));
    timeoutMapRef.current.clear();
  }, []);

  const addToast = useCallback(
    (data: ToastDataArgs) => {
      const {
        message,
        variant,
        animation,
        mode,
        icon,
        appearance = 'premium',
        gradientColor = 'var(--primary)',
        duration = 4000,
        size = 'md',
        position = defaultPosition,
        showProgress = true,
        pauseOnHover = true,
        actionButton,
        dismissible = true,
        priority = 'normal',
      } = data;

      const newToast: ToastContainerData = {
        id: Date.now() + Math.random(),
        message,
        variant,
        animation,
        mode,
        icon,
        appearance,
        gradientColor,
        duration,
        size,
        position,
        showProgress,
        pauseOnHover,
        actionButton,
        dismissible,
        priority,
      };

      setToasts((prevToasts) => {
        // FIXED: Always add new toasts to the beginning (top)
        let updatedToasts = [newToast, ...prevToasts];

        // Handle priority-based insertion
        if (priority === 'urgent') {
          const urgentToasts = [newToast];
          const nonUrgentToasts = prevToasts.filter((t) => t.priority !== 'urgent');
          updatedToasts = [...urgentToasts, ...nonUrgentToasts];
        }

        // Remove excess toasts from the end (bottom)
        if (updatedToasts.length > maxToasts) {
          const toRemove = updatedToasts.slice(maxToasts);
          toRemove.forEach((toast) => {
            const timeout = timeoutMapRef.current.get(toast.id);
            if (timeout) {
              clearTimeout(timeout);
              timeoutMapRef.current.delete(toast.id);
            }
          });
          updatedToasts = updatedToasts.slice(0, maxToasts);
        }

        return updatedToasts;
      });
    },
    [maxToasts, defaultPosition]
  );

  return (
    <ToastContext.Provider value={{ addToast, removeToast, clearAll }}>
      {children}
      {/* FIXED: Container with proper flex layout */}
      <div
        className={cn(
          'fixed flex flex-col gap-3 pointer-events-none',
          'z-[9999]', // Increased z-index to ensure it's above other content
          positionConfig[defaultPosition],
          'backdrop-blur-sm'
        )}
        style={
          {
            '--primary': variantColors.default.primary,
            '--primary-foreground': 'hsl(0, 0%, 100%)',
          } as React.CSSProperties
        }
      >
        {/* FIXED: Use proper AnimatePresence with layout */}
        <AnimatePresence mode="popLayout" initial={false}>
          {toasts.map((toast, index) => (
            <motion.div
              key={toast.id}
              layout // CRITICAL: This ensures proper repositioning
              className="pointer-events-auto"
            >
              <Toast
                {...toast}
                index={index} // Pass index for staggered animations
                onClose={removeToast}
                timeoutMapRef={timeoutMapRef}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

// FIXED: Enhanced Toast Component with proper index handling
const Toast = ({
  message,
  onClose,
  id,
  animation,
  variant = 'default',
  mode = 'light',
  icon,
  appearance = 'premium',
  gradientColor = 'rgb(59, 130, 246)',
  duration = 4000,
  size = 'md',
  showProgress = true,
  pauseOnHover = true,
  actionButton,
  dismissible = true,
  index, // FIXED: Accept index prop
  timeoutMapRef,
}: ToastNotificationProps) => {
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(100);

  const progressRef = useRef<number>(100);
  const intervalRef = useRef<ReturnType<typeof setInterval>>(null);

  // Default icons for variants
  const getDefaultIcon = (variant: ToastVariantTypes) => {
    const iconClass = 'h-5 w-5';
    switch (variant) {
      case 'success':
        return <CheckCircledIcon className={cn(iconClass, 'text-emerald-500')} />;
      case 'error':
        return <CrossCircledIcon className={cn(iconClass, 'text-red-500')} />;
      case 'warning':
        return <ExclamationTriangleIcon className={cn(iconClass, 'text-amber-500')} />;
      case 'info':
        return <InfoCircledIcon className={cn(iconClass, 'text-blue-500')} />;
      default:
        return <InfoCircledIcon className={cn(iconClass, 'text-(var(--primary))')} />;
    }
  };

  const displayIcon = icon || getDefaultIcon(variant);
  const styles = getEnhancedVariantStyles(appearance, variant, gradientColor, size);

  // Progress bar logic
  useEffect(() => {
    if (!showProgress || duration <= 0) return;

    const interval = 50;
    const step = (100 / duration) * interval;

    intervalRef.current = setInterval(() => {
      if (!isPaused) {
        progressRef.current = Math.max(0, progressRef.current - step);
        setProgress(progressRef.current);

        if (progressRef.current <= 0) {
          onClose(id);
        }
      }
    }, interval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [duration, isPaused, showProgress, id, onClose]);

  // Auto-close timeout
  useEffect(() => {
    if (duration <= 0) return;

    const timeoutId = setTimeout(() => onClose(id), duration);
    timeoutMapRef.current?.set(id, timeoutId);

    return () => {
      clearTimeout(timeoutId);
      timeoutMapRef.current?.delete(id);
    };
  }, [duration, id, onClose, timeoutMapRef]);

  const handleMouseEnter = () => {
    if (pauseOnHover) {
      setIsPaused(true);
    }
  };

  const handleMouseLeave = () => {
    if (pauseOnHover) {
      setIsPaused(false);
    }
  };

  return (
    <motion.div
      className={styles.className}
      style={styles.style}
      variants={animationVariants[animation]}
      initial="hidden"
      animate="visible"
      exit="exit"
      custom={index} // FIXED: Pass index to animation variants
      layout="position" // FIXED: Only animate position changes
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      whileHover={{
        scale: 1.02,
        transition: { duration: 0.2 },
      }}
      aria-live="assertive"
      role="alert"
    >
      {/* Progress Bar */}
      {showProgress && duration > 0 && (
        <motion.div
          className="absolute top-0 left-0 h-1 bg-gradient-to-r from-primary/60 to-primary rounded-t-xl"
          initial={{ width: '100%' }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.1, ease: 'linear' }}
        />
      )}

      <div className="flex items-start gap-3 relative z-[1]">
        {/* Icon */}
        <motion.div
          className="flex-shrink-0 mt-0.5"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            type: 'spring',
            stiffness: 400,
            damping: 15,
            delay: 0.1,
          }}
        >
          {displayIcon}
        </motion.div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <motion.p
            className={cn(
              'text-sm font-medium leading-relaxed',
              mode === 'dark' ? 'text-card-foreground' : 'text-foreground'
            )}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {message}
          </motion.p>

          {/* Action Button */}
          {actionButton && (
            <motion.button
              className={cn(
                'mt-2 px-3 py-1 text-xs font-medium rounded-md',
                'bg-primary/10 hover:bg-primary/20 text-primary',
                'transition-colors duration-200'
              )}
              onClick={actionButton.onClick}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {actionButton.label}
            </motion.button>
          )}
        </div>

        {/* Close Button */}
        {dismissible && (
          <motion.button
            onClick={() => onClose(id)}
            className={cn(
              'flex-shrink-0 p-1 rounded-md transition-all duration-200',
              'hover:bg-black/10 dark:hover:bg-white/10',
              'text-muted-foreground hover:text-foreground'
            )}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Close notification"
          >
            <CrossCircledIcon className="h-4 w-4" />
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};

// Enhanced hook for using toasts
export const useToast = () => {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }

  return {
    ...context,
    success: (message: string, options?: Partial<ToastDataArgs>) =>
      context.addToast({
        message,
        variant: 'success',
        animation: 'slide',
        ...options,
      }),
    error: (message: string, options?: Partial<ToastDataArgs>) =>
      context.addToast({
        message,
        variant: 'error',
        animation: 'bounce',
        ...options,
      }),
    warning: (message: string, options?: Partial<ToastDataArgs>) =>
      context.addToast({
        message,
        variant: 'warning',
        animation: 'pop',
        ...options,
      }),
    info: (message: string, options?: Partial<ToastDataArgs>) =>
      context.addToast({
        message,
        variant: 'info',
        animation: 'fade',
        ...options,
      }),
  };
};

export default { ToastProvider, useToast };
