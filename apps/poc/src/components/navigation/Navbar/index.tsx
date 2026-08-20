import React from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import * as NavigationMenu from '@radix-ui/react-navigation-menu';
import { ChevronDown, Menu, X } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { Link } from 'react-router-dom';

interface NavItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
  children?: NavItem[];
}

interface NavbarProps {
  variant?: 'modern' | 'minimal' | 'elevated' | 'bordered' | 'floating' | 'gradient' | 'accent';
  items: NavItem[];
  logo?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const Navbar = ({ variant = 'modern', items, logo, className, style }: NavbarProps) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [hoveredItem, setHoveredItem] = React.useState<string | null>(null);

  const variants = {
    modern:
      'bg-[var(--sidebar-background)]/80 backdrop-blur-md border border-[var(--border)] rounded-lg',
    minimal: 'bg-transparent',
    elevated: 'bg-[var(--sidebar-background)] shadow-lg rounded-lg',
    bordered: 'border border-[var(--border)] rounded-lg',
    floating: 'bg-[var(--sidebar-background)] shadow-lg rounded-full mx-4',
    gradient:
      'bg-gradient-to-r from-[var(--button-red)] to-[var(--button-blue)] text-white rounded-lg',
    accent: 'bg-[var(--button-red)] text-white rounded-lg',
  };

  const navVariants: Variants = {
    hidden: {
      y: -20,
      opacity: 0,
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: -10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
      },
    },
    hover: {
      scale: 1.05,
      color:
        variant === 'gradient' || variant === 'accent'
          ? 'rgba(255, 255, 255, 0.9)'
          : 'var(--hover)',
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 10,
      },
    },
    tap: {
      scale: 0.95,
    },
  };

  const dropdownVariants: Variants = {
    hidden: {
      opacity: 0,
      scale: 0.95,
      y: -10,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
      },
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      y: -10,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
      },
    },
  };

  const mobileMenuVariants: Variants = {
    hidden: {
      opacity: 0,
      x: '100%',
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
      },
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
      },
    },
    exit: {
      opacity: 0,
      x: '100%',
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
      },
    },
  };

  const iconVariants: Variants = {
    hover: {
      rotate: 10,
      scale: 1.1,
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 10,
      },
    },
  };

  const backdropVariants: Variants = {
    hidden: {
      opacity: 0,
      transition: {
        duration: 0.2,
      },
    },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.2,
      },
    },
  };

  return (
    <motion.nav
      initial="hidden"
      animate="visible"
      variants={navVariants}
      className={cn('z-50 px-4 py-3', variants[variant], className)}
      style={style}
    >
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo */}
        <motion.div
          variants={itemVariants}
          whileHover="hover"
          whileTap="tap"
          className="relative z-10"
        >
          {logo}
        </motion.div>

        {/* Desktop Navigation */}
        <NavigationMenu.Root className="hidden md:flex relative z-10">
          <NavigationMenu.List className="flex items-center gap-6">
            {items.map((item) => (
              <NavigationMenu.Item key={item.label}>
                {item.children ? (
                  <NavigationMenu.Trigger
                    className={cn(
                      'group flex items-center gap-1 text-sm font-medium transition-colors',
                      hoveredItem === item.label &&
                        (variant === 'gradient' || variant === 'accent'
                          ? 'text-white/90'
                          : 'text-[var(--hover)]')
                    )}
                    onMouseEnter={() => setHoveredItem(item.label)}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    <motion.div
                      variants={itemVariants}
                      whileHover="hover"
                      whileTap="tap"
                      className="flex items-center gap-1"
                    >
                      {item.icon && (
                        <motion.span
                          variants={iconVariants}
                          whileHover="hover"
                          className={
                            variant === 'gradient' || variant === 'accent' ? 'text-white' : ''
                          }
                        >
                          {item.icon}
                        </motion.span>
                      )}
                      {item.label}
                      <motion.span
                        animate={hoveredItem === item.label ? { rotate: 180 } : { rotate: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronDown className="h-4 w-4" />
                      </motion.span>
                    </motion.div>
                  </NavigationMenu.Trigger>
                ) : (
                  <Link to={item.href}>
                    <motion.div
                      variants={itemVariants}
                      whileHover="hover"
                      whileTap="tap"
                      className={cn(
                        'text-sm font-medium',
                        variant === 'gradient' || variant === 'accent' ? 'text-white' : ''
                      )}
                      onMouseEnter={() => setHoveredItem(item.label)}
                      onMouseLeave={() => setHoveredItem(null)}
                    >
                      {item.icon && (
                        <motion.span variants={iconVariants} whileHover="hover" className="mr-2">
                          {item.icon}
                        </motion.span>
                      )}
                      {item.label}
                    </motion.div>
                  </Link>
                )}

                {item.children && (
                  <NavigationMenu.Content>
                    <AnimatePresence>
                      <motion.div
                        variants={dropdownVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className={cn(
                          'absolute top-full mt-2 w-48 rounded-lg overflow-hidden',
                          variant === 'gradient' || variant === 'accent'
                            ? 'bg-[var(--sidebar-background)] border border-[var(--border)]'
                            : 'bg-[var(--sidebar-background)] shadow-lg border border-[var(--border)]'
                        )}
                      >
                        <ul className="p-2">
                          {item.children.map((child) => (
                            <motion.li key={child.label} variants={itemVariants}>
                              <Link to={child.href}>
                                <motion.div
                                  className={cn(
                                    'block px-4 py-2 text-sm rounded-md transition-colors',
                                    'hover:bg-[var(--header)]'
                                  )}
                                  whileHover="hover"
                                  whileTap="tap"
                                >
                                  {child.label}
                                </motion.div>
                              </Link>
                            </motion.li>
                          ))}
                        </ul>
                      </motion.div>
                    </AnimatePresence>
                  </NavigationMenu.Content>
                )}
              </NavigationMenu.Item>
            ))}
          </NavigationMenu.List>
        </NavigationMenu.Root>

        {/* Mobile Menu Button */}
        <motion.button
          whileHover="hover"
          whileTap="tap"
          variants={itemVariants}
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            'md:hidden relative z-10 p-2 rounded-lg',
            variant === 'gradient' || variant === 'accent' ? 'text-white' : ''
          )}
          aria-label="Toggle menu"
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X className="h-6 w-6" />
              </motion.div>
            ) : (
              <motion.div
                key="menu"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Menu className="h-6 w-6" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <>
              <motion.div
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={backdropVariants}
                className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
                onClick={() => setIsOpen(false)}
              />
              <motion.div
                variants={mobileMenuVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className={cn(
                  'fixed top-[calc(100% + 1rem)] right-4 w-64 rounded-lg overflow-hidden z-50 md:hidden',
                  variant === 'gradient'
                    ? 'bg-gradient-to-r from-[var(--button-red)] to-[var(--button-blue)]'
                    : variant === 'accent'
                    ? 'bg-[var(--button-red)]'
                    : 'bg-[var(--sidebar-background)] border border-[var(--border)]'
                )}
              >
                <div className="p-4 space-y-4">
                  {items.map((item) => (
                    <motion.div
                      key={item.label}
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      className={variant === 'gradient' || variant === 'accent' ? 'text-white' : ''}
                    >
                      {item.children ? (
                        <div className="space-y-2">
                          <div className="font-medium flex items-center gap-2">
                            {item.icon && (
                              <motion.span variants={iconVariants} whileHover="hover">
                                {item.icon}
                              </motion.span>
                            )}
                            {item.label}
                          </div>
                          <div className="pl-4 space-y-2">
                            {item.children.map((child) => (
                              <Link key={child.label} to={child.href}>
                                <motion.div
                                  className={cn(
                                    'block text-sm transition-colors',
                                    variant === 'gradient' || variant === 'accent'
                                      ? 'hover:text-white/90'
                                      : 'hover:text-[var(--hover)]'
                                  )}
                                  whileHover="hover"
                                  whileTap="tap"
                                >
                                  {child.label}
                                </motion.div>
                              </Link>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <Link to={item.href}>
                          <motion.div
                            className={cn(
                              'block font-medium transition-colors flex items-center gap-2',
                              variant === 'gradient' || variant === 'accent'
                                ? 'hover:text-white/90'
                                : 'hover:text-[var(--hover)]'
                            )}
                            whileHover="hover"
                            whileTap="tap"
                          >
                            {item.icon && (
                              <motion.span variants={iconVariants} whileHover="hover">
                                {item.icon}
                              </motion.span>
                            )}
                            {item.label}
                          </motion.div>
                        </Link>
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};
