import * as React from 'react';
import { motion, AnimatePresence, type HTMLMotionProps, type Variants } from 'framer-motion';
import type { ComponentPropsWithoutRef, MouseEvent } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../../utils/cn';

/**
 * Built-in color schemes for the modal.
 */
export type ModalColorScheme =
  | 'primary'
  | 'accent'
  | 'success'
  | 'warning'
  | 'destructive'
  | 'info';

/**
 * Optional custom Tailwind classes to override default colors per area.
 */
export interface ModalColorOverrides {
  /** Overlay wrapper (outer) */
  overlay?: string;
  /** Backdrop (inner dimmed layer) */
  backdrop?: string;
  /** Modal content container (border, shadow) */
  content?: string;
  /** Header section */
  header?: string;
  /** Body section (e.g. left accent border) */
  body?: string;
  /** Footer section */
  footer?: string;
  /** Close (X) button */
  closeButton?: string;
  /** Cancel button */
  cancelButton?: string;
  /** Confirm button */
  confirmButton?: string;
}

/**
 * Props for the Modal component.
 */
export interface ModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Callback function called when modal should close */
  onClose: () => void;
  /** Callback function called when confirm button is clicked */
  onConfirm?: () => void;
  /** Callback function called when cancel button is clicked */
  onCancel?: () => void;
  /** Title text displayed in the header */
  title?: string;
  /** Content displayed in the body */
  children?: React.ReactNode;
  /** Text for the confirm button */
  confirmText?: string;
  /** Text for the cancel button */
  cancelText?: string;
  /** Whether to show the footer with action buttons */
  showFooter?: boolean;
  /** Whether to show the close button (X) */
  showCloseButton?: boolean;
  /** Whether clicking the overlay closes the modal */
  closeOnOverlayClick?: boolean;
  /** Whether pressing Escape closes the modal */
  closeOnEscape?: boolean;
  /** Size variant of the modal */
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  /** Color scheme for header, borders, and buttons. */
  colorScheme?: ModalColorScheme;
  /** Override default color classes for specific areas. Merged with colorScheme. */
  colorOverrides?: ModalColorOverrides;
  /** Custom className for the modal container */
  className?: string;
  /** Custom className for the overlay */
  overlayClassName?: string;
  /** Custom className for the header */
  headerClassName?: string;
  /** Custom className for the body */
  bodyClassName?: string;
  /** Custom className for the footer */
  footerClassName?: string;
}

/**
 * Props for the modal overlay sub-component.
 */
export interface ModalOverlayProps extends Omit<HTMLMotionProps<'div'>, 'onClick' | 'children'> {
  /** Whether clicking the overlay should trigger close. */
  closeOnOverlayClick?: boolean;
  /** Handler called when overlay requests close (e.g., clicked). */
  onRequestClose?: () => void;
  /** Child elements to render inside the overlay. */
  children?: React.ReactNode;
  /** Optional className for the inner backdrop (dimmed layer). */
  backdropClassName?: string;
}

/**
 * Props for the modal content container sub-component.
 */
export interface ModalContentProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  /** Size variant of the modal content. */
  size?: ModalProps['size'];
  /** Child elements to render inside the content. */
  children?: React.ReactNode;
}

/**
 * Props for the modal header sub-component.
 */
export interface ModalHeaderProps extends Omit<ComponentPropsWithoutRef<'div'>, 'title'> {
  /** Optional title to render in the header. */
  title?: React.ReactNode;
  /** Whether to show the close button (X) in the header. */
  showCloseButton?: boolean;
  /** Handler called when the close button is clicked. */
  onClose?: () => void;
  /** Optional className for the close (X) button. */
  closeButtonClassName?: string;
}

/**
 * Props for the modal body sub-component.
 */
export type ModalBodyProps = HTMLMotionProps<'div'>;

/**
 * Props for the modal footer sub-component.
 */
export interface ModalFooterProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  /** Text for the confirm button. */
  confirmText?: string;
  /** Text for the cancel button. */
  cancelText?: string;
  /** Handler for confirm action. */
  onConfirm?: () => void;
  /** Handler for cancel action. */
  onCancel?: () => void;
  /** Child elements to render inside the footer. */
  children?: React.ReactNode;
  /** Optional className for the cancel button. */
  cancelButtonClassName?: string;
  /** Optional className for the confirm button. */
  confirmButtonClassName?: string;
}

/**
 * Size configuration mapping for modal widths.
 */
const sizeConfig: Record<NonNullable<ModalProps['size']>, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  full: 'max-w-full',
};

/**
 * Default Tailwind classes per color scheme. Users can override via colorOverrides.
 */
const colorSchemeConfig: Record<
  ModalColorScheme,
  {
    backdrop: string;
    content: string;
    header: string;
    body: string;
    footer: string;
    closeButton: string;
    cancelButton: string;
    confirmButton: string;
  }
> = {
  primary: {
    backdrop: 'bg-gradient-to-br from-primary/30 via-background/80 to-accent/30',
    content:
      'shadow-primary/10 dark:shadow-primary/5 border-primary/20 dark:border-primary/30 before:from-primary/5 before:to-accent/5',
    header:
      'border-b border-primary/15 dark:border-primary/25 bg-gradient-to-r from-primary/10 via-primary/5 to-accent/10 dark:from-primary/20 dark:via-primary/10 dark:to-accent/15',
    body: 'border-l-primary/20 dark:border-l-primary/30',
    footer:
      'border-t border-primary/15 dark:border-primary/25 bg-gradient-to-r from-accent/5 via-primary/10 to-accent/5 dark:from-accent/10 dark:via-primary/15 dark:to-accent/10',
    closeButton: 'hover:text-primary hover:bg-primary/15 active:bg-primary/25 focus:ring-primary/50',
    cancelButton: 'hover:bg-accent/80 hover:text-accent-foreground hover:border-accent/30 focus:ring-accent/50',
    confirmButton:
      'bg-gradient-to-r from-primary to-primary/90 hover:from-primary/95 hover:to-primary shadow-primary/25 border-primary/30 focus:ring-primary',
  },
  accent: {
    backdrop: 'bg-gradient-to-br from-accent/40 via-background/80 to-primary/20',
    content:
      'shadow-accent/10 border-accent/20 before:from-accent/5 before:to-primary/5',
    header:
      'border-b border-accent/20 bg-gradient-to-r from-accent/15 via-accent/5 to-primary/10 dark:from-accent/25 dark:to-primary/15',
    body: 'border-l-accent/25 dark:border-l-accent/35',
    footer:
      'border-t border-accent/20 bg-gradient-to-r from-primary/5 via-accent/10 to-primary/5 dark:via-accent/15',
    closeButton: 'hover:text-accent-foreground hover:bg-accent/30 active:bg-accent/40 focus:ring-accent/50',
    cancelButton: 'hover:bg-muted hover:border-accent/40 focus:ring-accent/50',
    confirmButton:
      'bg-gradient-to-r from-accent to-accent/90 text-accent-foreground hover:from-accent/95 hover:to-accent shadow-accent/25 border-accent/30 focus:ring-accent',
  },
  success: {
    backdrop: 'bg-gradient-to-br from-success/25 via-background/80 to-primary/20',
    content:
      'shadow-success/10 border-success/20 before:from-success/5 before:to-primary/5',
    header:
      'border-b border-success/20 bg-gradient-to-r from-success/15 via-success/5 to-primary/10 dark:from-success/25 dark:to-primary/15',
    body: 'border-l-success/25 dark:border-l-success/35',
    footer:
      'border-t border-success/20 bg-gradient-to-r from-primary/5 via-success/10 to-primary/5 dark:via-success/15',
    closeButton: 'hover:text-success hover:bg-success/15 active:bg-success/25 focus:ring-success/50',
    cancelButton: 'hover:border-success/40 focus:ring-success/50',
    confirmButton:
      'bg-gradient-to-r from-success to-success/90 text-success-foreground hover:from-success/95 hover:to-success shadow-success/25 border-success/30 focus:ring-success',
  },
  warning: {
    backdrop: 'bg-gradient-to-br from-warning/25 via-background/80 to-primary/20',
    content:
      'shadow-warning/10 border-warning/20 before:from-warning/5 before:to-primary/5',
    header:
      'border-b border-warning/20 bg-gradient-to-r from-warning/15 via-warning/5 to-primary/10 dark:from-warning/25 dark:to-primary/15',
    body: 'border-l-warning/25 dark:border-l-warning/35',
    footer:
      'border-t border-warning/20 bg-gradient-to-r from-primary/5 via-warning/10 to-primary/5 dark:via-warning/15',
    closeButton: 'hover:text-warning hover:bg-warning/15 active:bg-warning/25 focus:ring-warning/50',
    cancelButton: 'hover:border-warning/40 focus:ring-warning/50',
    confirmButton:
      'bg-gradient-to-r from-warning to-warning/90 text-warning-foreground hover:from-warning/95 hover:to-warning shadow-warning/25 border-warning/30 focus:ring-warning',
  },
  destructive: {
    backdrop: 'bg-gradient-to-br from-destructive/25 via-background/80 to-primary/20',
    content:
      'shadow-destructive/10 border-destructive/20 before:from-destructive/5 before:to-primary/5',
    header:
      'border-b border-destructive/20 bg-gradient-to-r from-destructive/15 via-destructive/5 to-primary/10 dark:from-destructive/25 dark:to-primary/15',
    body: 'border-l-destructive/25 dark:border-l-destructive/35',
    footer:
      'border-t border-destructive/20 bg-gradient-to-r from-primary/5 via-destructive/10 to-primary/5 dark:via-destructive/15',
    closeButton: 'hover:text-destructive hover:bg-destructive/15 active:bg-destructive/25 focus:ring-destructive/50',
    cancelButton: 'hover:border-destructive/40 focus:ring-destructive/50',
    confirmButton:
      'bg-gradient-to-r from-destructive to-destructive/90 text-destructive-foreground hover:from-destructive/95 hover:to-destructive shadow-destructive/25 border-destructive/30 focus:ring-destructive',
  },
  info: {
    backdrop: 'bg-gradient-to-br from-info/25 via-background/80 to-primary/20',
    content:
      'shadow-info/10 border-info/20 before:from-info/5 before:to-primary/5',
    header:
      'border-b border-info/20 bg-gradient-to-r from-info/15 via-info/5 to-primary/10 dark:from-info/25 dark:to-primary/15',
    body: 'border-l-info/25 dark:border-l-info/35',
    footer:
      'border-t border-info/20 bg-gradient-to-r from-primary/5 via-info/10 to-primary/5 dark:via-info/15',
    closeButton: 'hover:text-info hover:bg-info/15 active:bg-info/25 focus:ring-info/50',
    cancelButton: 'hover:border-info/40 focus:ring-info/50',
    confirmButton:
      'bg-gradient-to-r from-info to-info/90 text-info-foreground hover:from-info/95 hover:to-info shadow-info/25 border-info/30 focus:ring-info',
  },
};

/**
 * Animation variants for modal entrance/exit with modern spring animation.
 */
const modalAnimation: Variants = {
  initial: {
    opacity: 0,
    scale: 0.96,
    y: 24,
    filter: 'blur(4px)',
  },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 30,
      mass: 0.8,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    y: 24,
    filter: 'blur(4px)',
    transition: {
      duration: 0.2,
      ease: 'easeIn',
    },
  },
};

/**
 * Overlay animation variants with smooth fade.
 */
const overlayAnimation: Variants = {
  initial: {
    opacity: 0,
    backdropFilter: 'blur(0px)',
  },
  animate: {
    opacity: 1,
    backdropFilter: 'blur(8px)',
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
  exit: {
    opacity: 0,
    backdropFilter: 'blur(0px)',
    transition: {
      duration: 0.2,
      ease: 'easeIn',
    },
  },
};

/**
 * Modal overlay sub-component.
 *
 * This handles overlay animation and click-to-close behavior.
 */
export const ModalOverlay = React.memo<ModalOverlayProps>(
  ({ closeOnOverlayClick = true, onRequestClose, className, backdropClassName, children, ...props }) => {
    
    const handleClick = React.useCallback(
      (event: MouseEvent<HTMLDivElement>) => {
        if (closeOnOverlayClick && event.target === event.currentTarget) {
          onRequestClose?.();
        }
      },
      [closeOnOverlayClick, onRequestClose]
    );

    return (
      <motion.div
        className={cn(
          'fixed inset-0 z-50 flex items-center justify-center p-4',
          className
        )}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={overlayAnimation}
        onClick={handleClick}
        role="dialog"
        aria-modal="true"
        {...props}
      >
        {/* Colored backdrop with gradient overlay */}
        <motion.div
          className={cn('absolute inset-0 backdrop-blur-md', backdropClassName)}
          initial="initial"
          animate="animate"
          exit="exit"
          variants={overlayAnimation}
        />
        {/* Animated multi-color gradient overlay (blue + indigo) */}
        <motion.div
          className="absolute inset-0 opacity-50 pointer-events-none"
          animate={{
            background: [
              'radial-gradient(ellipse 80% 50% at 20% 40%, rgba(59, 130, 246, 0.35) 0%, transparent 50%), radial-gradient(ellipse 60% 40% at 80% 60%, rgba(99, 102, 241, 0.3) 0%, transparent 50%)',
              'radial-gradient(ellipse 80% 50% at 80% 40%, rgba(99, 102, 241, 0.35) 0%, transparent 50%), radial-gradient(ellipse 60% 40% at 20% 60%, rgba(59, 130, 246, 0.3) 0%, transparent 50%)',
              'radial-gradient(ellipse 80% 50% at 20% 40%, rgba(59, 130, 246, 0.35) 0%, transparent 50%), radial-gradient(ellipse 60% 40% at 80% 60%, rgba(99, 102, 241, 0.3) 0%, transparent 50%)',
            ],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        {children}
      </motion.div>
    );
  }
);

ModalOverlay.displayName = 'ModalOverlay';

/**
 * Modal content container sub-component.
 *
 * Handles the main dialog panel, size variants and entrance animation.
 */
const defaultContentBase =
  'relative bg-background/95 backdrop-blur-xl rounded-2xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15),0_0_0_1px_rgba(0,0,0,0.05)] flex flex-col max-h-[90vh] w-full overflow-hidden before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-br before:via-transparent before:pointer-events-none after:absolute after:inset-0 after:rounded-2xl after:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)] after:pointer-events-none dark:after:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.03)] border';

export const ModalContent = React.memo<ModalContentProps>(
  ({ size = 'md', className, children, onClick, ...props }) => {
    const sizeClass = React.useMemo(() => sizeConfig[size ?? 'md'], [size]);

    const handleClick = React.useCallback(
      (event: MouseEvent<HTMLDivElement>) => {
        // Prevent overlay click handlers from triggering.
        event.stopPropagation();
        onClick?.(event);
      },
      [onClick]
    );

    return (
      <motion.div
        className={cn(
          defaultContentBase,
          'before:from-primary/5',
          sizeClass,
          className
        )}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={modalAnimation}
        onClick={handleClick}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

ModalContent.displayName = 'ModalContent';

/**
 * Modal header sub-component.
 */
export const ModalHeader = React.memo<ModalHeaderProps>(
  ({ title, showCloseButton = true, onClose, className, closeButtonClassName, children, ...props }) => (
    <div
      className={cn(
        'relative flex items-center justify-between px-6 py-5',
        'border-b',
        className
      )}
      {...props}
    >
      {title && (
        <motion.h2
          id="modal-title"
          className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-black tracking-tight"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
        >
          {title}
        </motion.h2>
      )}
      {children}
      {showCloseButton && onClose && (
        <motion.button
          onClick={onClose}
          className={cn(
            'ml-auto p-2 rounded-xl',
            'text-muted-foreground',
            'transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-offset-2',
            'group relative',
            closeButtonClassName
          )}
          aria-label="Close modal"
          whileHover={{ scale: 1.05, rotate: 90 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.2 }}
        >
          <X className="h-5 w-5 transition-transform duration-200 group-hover:rotate-90" />
        </motion.button>
      )}
    </div>
  )
);

ModalHeader.displayName = 'ModalHeader';

/**
 * Modal body sub-component.
 */
export const ModalBody = React.memo<ModalBodyProps>(
  ({ className, children, ...props }) => (
    <motion.div
      className={cn(
        'flex-1 overflow-y-auto px-6 py-5',
        'text-foreground text-base leading-relaxed',
        'bg-gradient-to-b from-transparent via-background/30 to-transparent',
        className
      )}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15, duration: 0.3 }}
      {...props}
    >
      {children}
    </motion.div>
  )
);

ModalBody.displayName = 'ModalBody';

/**
 * Modal footer sub-component with Confirm and Cancel actions.
 */
export const ModalFooter = React.memo<ModalFooterProps>(
  ({
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    onConfirm,
    onCancel,
    className,
    children,
    cancelButtonClassName,
    confirmButtonClassName,
    ...props
  }) => (
    <motion.div
      className={cn(
        'relative flex items-center justify-end gap-3 px-6 py-5',
        'border-t',
        className
      )}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.3 }}
      {...props}
    >
      {children}
      <motion.button
        onClick={onCancel}
        className={cn(
          'px-5 py-2.5 rounded-xl font-medium',
          'bg-muted/80 text-muted-foreground border border-border/50',
          'transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-offset-2',
          cancelButtonClassName
        )}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {cancelText}
      </motion.button>
      {onConfirm && (
        <motion.button
          onClick={onConfirm}
          className={cn(
            'px-5 py-2.5 rounded-xl font-medium',
            'transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-offset-2',
            'relative overflow-hidden',
            'before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/0 before:via-white/25 before:to-white/0 before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700',
            confirmButtonClassName
          )}
          whileHover={{ scale: 1.02, y: -1 }}
          whileTap={{ scale: 0.98 }}
        >
          <span className="relative z-10">{confirmText}</span>
        </motion.button>
      )}
    </motion.div>
  )
);

ModalFooter.displayName = 'ModalFooter';

/**
 * Modal component with overlay, header, body, footer, and action buttons
 * 
 * @example
 * ```tsx
 * const [isOpen, setIsOpen] = useState(false);
 * 
 * <Modal
 *   isOpen={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   onConfirm={() => {
 *     console.log('Confirmed');
 *     setIsOpen(false);
 *   }}
 *   title="Confirm Action"
 *   confirmText="Yes"
 *   cancelText="No"
 * >
 *   <p>Are you sure you want to proceed?</p>
 * </Modal>
 * ```
 */
export const Modal = React.memo<ModalProps>(
  ({
    isOpen,
    onClose,
    onConfirm,
    onCancel,
    title,
    children,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    showFooter = true,
    showCloseButton = true,
    closeOnOverlayClick = true,
    closeOnEscape = true,
    size = 'md',
    colorScheme = 'primary',
    colorOverrides,
    className,
    overlayClassName,
    headerClassName,
    bodyClassName,
    footerClassName,
  }) => {
    const schemeClasses = React.useMemo(
      () => colorSchemeConfig[colorScheme],
      [colorScheme]
    );
    const backdropClassName = React.useMemo(
      () => cn(schemeClasses.backdrop, colorOverrides?.backdrop),
      [schemeClasses.backdrop, colorOverrides?.backdrop]
    );
    const contentClassName = React.useMemo(
      () => cn(schemeClasses.content, colorOverrides?.content, className),
      [schemeClasses.content, colorOverrides?.content, className]
    );
    const headerClasses = React.useMemo(
      () => cn(schemeClasses.header, colorOverrides?.header, headerClassName),
      [schemeClasses.header, colorOverrides?.header, headerClassName]
    );
    const bodyClasses = React.useMemo(
      () => cn('border-l-4', schemeClasses.body, colorOverrides?.body, bodyClassName),
      [schemeClasses.body, colorOverrides?.body, bodyClassName]
    );
    const footerClasses = React.useMemo(
      () => cn(schemeClasses.footer, colorOverrides?.footer, footerClassName),
      [schemeClasses.footer, colorOverrides?.footer, footerClassName]
    );
    const closeBtnClasses = React.useMemo(
      () => cn(schemeClasses.closeButton, colorOverrides?.closeButton),
      [schemeClasses.closeButton, colorOverrides?.closeButton]
    );
    const cancelBtnClasses = React.useMemo(
      () => cn(schemeClasses.cancelButton, colorOverrides?.cancelButton),
      [schemeClasses.cancelButton, colorOverrides?.cancelButton]
    );
    const confirmBtnClasses = React.useMemo(
      () => cn(schemeClasses.confirmButton, colorOverrides?.confirmButton),
      [schemeClasses.confirmButton, colorOverrides?.confirmButton]
    );
    /**
     * Memoized handler for Escape key press
     */
    const handleEscapeKey = React.useCallback(
      (event: KeyboardEvent) => {
        if (event.key === 'Escape' && closeOnEscape && isOpen) {
          onClose();
        }
      },
      [closeOnEscape, isOpen, onClose]
    );

    /**
     * Effect to add/remove Escape key listener
     */
    React.useEffect(() => {
      if (isOpen && closeOnEscape) {
        document.addEventListener('keydown', handleEscapeKey);
        // Prevent body scroll when modal is open
        document.body.style.overflow = 'hidden';
      }

      return () => {
        document.removeEventListener('keydown', handleEscapeKey);
        document.body.style.overflow = '';
      };
    }, [isOpen, closeOnEscape, handleEscapeKey]);

    /**
     * Memoized handler for close button click
     */
    const handleCloseClick = React.useCallback(() => {
      onClose();
    }, [onClose]);

    /**
     * Memoized handler for confirm button click
     */
    const handleConfirmClick = React.useCallback(() => {
      onConfirm?.();
      onClose();
    }, [onConfirm, onClose]);

    /**
     * Memoized handler for cancel button click
     */
    const handleCancelClick = React.useCallback(() => {
      onCancel?.();
      onClose();
    }, [onCancel, onClose]);

    return (
      <AnimatePresence>
        {isOpen && (
          <ModalOverlay
            closeOnOverlayClick={closeOnOverlayClick}
            onRequestClose={onClose}
            className={overlayClassName}
            backdropClassName={backdropClassName}
            aria-labelledby={title ? 'modal-title' : undefined}
          >
            <ModalContent
              size={size}
              className={contentClassName}
            >
              {/* Header */}
              {(title || showCloseButton) && (
                <ModalHeader
                  title={title}
                  showCloseButton={showCloseButton}
                  onClose={handleCloseClick}
                  className={headerClasses}
                  closeButtonClassName={closeBtnClasses}
                />
              )}

              {/* Body */}
              <ModalBody className={bodyClasses}>{children}</ModalBody>

              {/* Footer */}
              {showFooter && (
                <ModalFooter
                  className={footerClasses}
                  cancelText={cancelText}
                  confirmText={confirmText}
                  onCancel={handleCancelClick}
                  onConfirm={onConfirm ? handleConfirmClick : undefined}
                  cancelButtonClassName={cancelBtnClasses}
                  confirmButtonClassName={confirmBtnClasses}
                />
              )}
            </ModalContent>
          </ModalOverlay>
        )}
      </AnimatePresence>
    );
  }
);

Modal.displayName = 'Modal';

export default Modal;
