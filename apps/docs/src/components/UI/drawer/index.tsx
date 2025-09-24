import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { cn } from '../../../utils/cn';

// --- TYPE DEFINITIONS ---
type Position = 'left' | 'right' | 'top' | 'bottom';
type AnimationType = 'slide' | 'reveal' | 'fade' | 'hinge' | 'zoom' | 'flip';

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  position?: Position;
  size?: string | number;
  showOverlay?: boolean;
  closeOnOverlayClick?: boolean;
  title?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  animationType?: AnimationType;
  zIndex?: number;
}

// --- MAIN COMPONENT ---
export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  children,
  position = 'right',
  size = '350px',
  showOverlay = true,
  closeOnOverlayClick = true,
  title,
  footer,
  className,
  animationType = 'slide',
  zIndex = 1000,
}) => {
  // Close drawer on 'Escape' key press
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    if (isOpen) document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent rendering on the server
  if (typeof window === 'undefined') return null;

  // Get dynamic inline styles for position and size
  const getDrawerDynamicStyles = (): React.CSSProperties => {
    const baseStyle: React.CSSProperties = { position: 'fixed', display: 'flex', flexDirection: 'column', overflow: 'hidden' };
    switch (position) {
      case 'left': return { ...baseStyle, top: 0, bottom: 0, left: 0, width: size };
      case 'right': return { ...baseStyle, top: 0, bottom: 0, right: 0, width: size };
      case 'top': return { ...baseStyle, top: 0, left: 0, right: 0, height: size };
      case 'bottom': return { ...baseStyle, bottom: 0, left: 0, right: 0, height: size };
      default: return baseStyle;
    }
  };

  // Get animation variants for framer-motion
  const getAnimationVariants = (): Record<AnimationType, Variants> => {
    const isHorizontal = position === 'left' || position === 'right';
    return {
      slide: {
        hidden: {
          x: position === 'left' ? '-100%' : position === 'right' ? '100%' : 0,
          y: position === 'top' ? '-100%' : position === 'bottom' ? '100%' : 0,
        },
        visible: { x: 0, y: 0, transition: { type: 'spring', damping: 30, stiffness: 250 } },
      },
      reveal: {
        hidden: { clipPath: isHorizontal ? `inset(0 ${position === 'left' ? '100%' : '0'} 0 ${position === 'right' ? '100%' : '0'})` : `inset(${position === 'top' ? '0' : '100%'} 0 ${position === 'bottom' ? '0' : '100%'} 0)`, transition: { duration: 0.4, ease: 'easeInOut' } },
        visible: { clipPath: 'inset(0 0 0 0)', transition: { duration: 0.4, ease: 'easeInOut' } },
      },
      fade: {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.3 } },
      },
      hinge: {
        hidden: { opacity: 0, rotateY: isHorizontal ? (position === 'left' ? -90 : 90) : 0, rotateX: !isHorizontal ? (position === 'top' ? 90 : -90) : 0, transformOrigin: position, transition: { duration: 0.4 } },
        visible: { opacity: 1, rotateY: 0, rotateX: 0, transition: { duration: 0.4 } },
      },
      zoom: {
        hidden: { opacity: 0, scale: 0.95 },
        visible: { opacity: 1, scale: 1, transition: { duration: 0.2, ease: 'easeOut' } },
      },
      flip: {
        hidden: { opacity: 0, rotateY: 180, scale: 0.9 },
        visible: { opacity: 1, rotateY: 0, scale: 1, transition: { duration: 0.4, ease: 'easeInOut' } },
      }
    };
  };

  // Get the specific animation variants for the current animation type
  const getAnimationVariantsForType = (): Variants => {
    const variants = getAnimationVariants();
    return variants[animationType] || variants.slide; // Fallback to slide animation
  };

  return ReactDOM.createPortal(
    <AnimatePresence>
      {isOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex, pointerEvents: 'auto' }} role="dialog" aria-modal="true" aria-labelledby={title ? 'drawer-title' : undefined}>
          {showOverlay && (
            <motion.div
              style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)' }} // Using rgba for overlay is fine as it needs transparency
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={closeOnOverlayClick ? onClose : undefined}
              aria-hidden="true"
            />
          )}
          <motion.div
            className={cn(
              'bg-background text-foreground shadow-xl',
              className
            )}
            style={getDrawerDynamicStyles()}
            variants={getAnimationVariantsForType()}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            {title && (
              <header className="flex items-center justify-between p-4 border-b border-border flex-shrink-0">
                <h2 id="drawer-title" className="text-lg font-semibold">{title}</h2>
                <button 
                  onClick={onClose} 
                  className="p-1 rounded-full hover:bg-muted transition-colors" 
                  aria-label="Close drawer"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="var(--foreground)">
                    <path d="M18 6L6 18" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M6 6L18 18" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </header>
            )}
            <main className="p-4 flex-grow overflow-y-auto">{children}</main>
            {footer && (
              <footer className="p-4 border-t border-border flex-shrink-0">
                {footer}
              </footer>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};