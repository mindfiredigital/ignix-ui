import React from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import * as Collapsible from '@radix-ui/react-collapsible';
import { ChevronRight, X } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { Link, useLocation } from 'react-router-dom';

interface SidebarItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
  badge?: string;
  children?: SidebarItem[];
}

interface SidebarProps {
  variant?: 'default' | 'minimal' | 'floating' | 'bordered' | 'elevated';
  items: SidebarItem[];
  isOpen?: boolean;
  isCollapsed?: boolean;
  onClose?: () => void;
  onCollapse?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export const Sidebar = ({
  variant = 'default',
  items,
  isOpen = true,
  isCollapsed = false,
  onClose,
  onCollapse,
  className,
  style,
}: SidebarProps) => {
  const location = useLocation();
  const [hoveredItem, setHoveredItem] = React.useState<string | null>(null);

  const variants = {
    default: 'border-r border-[var(--border)]',
    minimal: 'bg-[var(--background)]',
    floating: 'shadow-lg rounded-lg m-4',
    bordered: 'border border-[var(--border)] rounded-lg',
    elevated: 'shadow-lg',
  };

  const sidebarVariants: Variants = {
    open: {
      width: isCollapsed ? 64 : 256,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
        staggerChildren: 0.1,
      },
    },
    closed: {
      width: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
        staggerChildren: 0.1,
        staggerDirection: -1,
      },
    },
  };

  const itemVariants: Variants = {
    open: {
      x: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
      },
    },
    closed: {
      x: -20,
      opacity: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
      },
    },
    hover: {
      x: 4,
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 10,
      },
    },
    tap: {
      scale: 0.98,
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
    collapsed: {
      scale: 1.2,
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 10,
      },
    },
  };

  const badgeVariants: Variants = {
    hover: {
      scale: 1.1,
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 10,
      },
    },
  };

  const tooltipVariants: Variants = {
    hidden: {
      opacity: 0,
      x: -20,
      transition: {
        duration: 0.2,
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
  };

  const SidebarItem = ({ item, depth = 0 }: { item: SidebarItem; depth?: number }) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [showTooltip, setShowTooltip] = React.useState(false);
    const isActive = item.href === location.pathname;
    const isHovered = hoveredItem === item.label;

    return (
      <motion.div
        className="w-full relative"
        variants={itemVariants}
        onHoverStart={() => {
          setHoveredItem(item.label);
          if (isCollapsed) setShowTooltip(true);
        }}
        onHoverEnd={() => {
          setHoveredItem(null);
          if (isCollapsed) setShowTooltip(false);
        }}
      >
        {item.children ? (
          <Collapsible.Root open={isOpen && !isCollapsed} onOpenChange={setIsOpen}>
            <Collapsible.Trigger
              className={cn(
                'flex items-center justify-between w-full px-4 py-2 text-sm font-medium transition-all duration-200 ease-in-out rounded-md',
                depth > 0 && 'pl-8',
                isHovered ? 'bg-[var(--header)] scale-[1.02]' : 'hover:bg-[var(--header)]'
              )}
            >
              <span className="flex items-center gap-2">
                {item.icon && (
                  <motion.span
                    variants={iconVariants}
                    whileHover="hover"
                    animate={isCollapsed ? 'collapsed' : ''}
                    transition={{ duration: 0.2 }}
                  >
                    {item.icon}
                  </motion.span>
                )}
                {!isCollapsed && <span className="truncate">{item.label}</span>}
                {item.badge && !isCollapsed && (
                  <motion.span
                    variants={badgeVariants}
                    whileHover="hover"
                    className="px-2 py-0.5 text-xs font-medium rounded-full bg-[var(--button-red)] text-white"
                  >
                    {item.badge}
                  </motion.span>
                )}
              </span>
              {!isCollapsed && (
                <motion.div
                  initial={false}
                  animate={{ rotate: isOpen ? 90 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="ml-auto"
                >
                  <ChevronRight className="h-4 w-4" />
                </motion.div>
              )}
            </Collapsible.Trigger>
            <Collapsible.Content>
              <motion.div
                initial="closed"
                animate="open"
                exit="closed"
                variants={{
                  open: {
                    opacity: 1,
                    height: 'auto',
                    transition: {
                      type: 'spring',
                      stiffness: 300,
                      damping: 30,
                    },
                  },
                  closed: {
                    opacity: 0,
                    height: 0,
                    transition: {
                      type: 'spring',
                      stiffness: 300,
                      damping: 30,
                    },
                  },
                }}
                className="pl-4"
              >
                {item.children.map((child) => (
                  <SidebarItem key={child.label} item={child} depth={depth + 1} />
                ))}
              </motion.div>
            </Collapsible.Content>
          </Collapsible.Root>
        ) : (
          <Link to={item.href || '#'}>
            <motion.div
              className={cn(
                'flex items-center justify-between px-4 py-2 text-sm font-medium transition-all duration-200 ease-in-out rounded-md',
                depth > 0 && 'pl-8',
                isActive ? 'bg-[var(--button-red)] text-white' : 'hover:bg-[var(--header)]',
                isHovered && !isActive && 'scale-[1.02]'
              )}
              whileHover="hover"
              whileTap="tap"
            >
              <span className="flex items-center gap-2">
                {item.icon && (
                  <motion.span
                    className={cn('mr-2', isActive && 'text-white')}
                    variants={iconVariants}
                    whileHover="hover"
                    animate={isCollapsed ? 'collapsed' : ''}
                  >
                    {item.icon}
                  </motion.span>
                )}
                {!isCollapsed && <span className="truncate">{item.label}</span>}
              </span>
              {item.badge && !isCollapsed && (
                <motion.span
                  variants={badgeVariants}
                  whileHover="hover"
                  className={cn(
                    'px-2 py-0.5 text-xs font-medium rounded-full',
                    isActive
                      ? 'bg-white text-[var(--button-red)]'
                      : 'bg-[var(--button-red)] text-white'
                  )}
                >
                  {item.badge}
                </motion.span>
              )}
            </motion.div>
          </Link>
        )}

        {/* Tooltip for collapsed state */}
        {isCollapsed && showTooltip && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={tooltipVariants}
            className="absolute left-full top-0 ml-2 z-50"
          >
            <div className="bg-[var(--sidebar-background)] shadow-lg rounded-md px-3 py-2 text-sm">
              <span>{item.label}</span>
              {item.badge && (
                <span className="ml-2 px-2 py-0.5 text-xs font-medium rounded-full bg-[var(--button-red)] text-white">
                  {item.badge}
                </span>
              )}
            </div>
          </motion.div>
        )}
      </motion.div>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.aside
            initial="closed"
            animate="open"
            exit="closed"
            variants={sidebarVariants}
            className={cn('z-40', 'bg-[var(--sidebar-background)]', variants[variant], className)}
            style={style}
          >
            <div className="flex items-center justify-between px-4 py-2">
              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-lg font-bold"
                  style={{ color: 'var(--button-red)' }}
                >
                  Menu
                </motion.span>
              )}
              <div className="flex items-center gap-2">
                {onCollapse && (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onCollapse}
                    className="p-1 rounded-md hover:bg-[var(--header)]"
                  >
                    <ChevronRight
                      className={cn(
                        'h-4 w-4 transition-transform duration-200',
                        isCollapsed && 'rotate-180'
                      )}
                    />
                  </motion.button>
                )}
                {onClose && (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onClose}
                    className="p-1 rounded-md hover:bg-[var(--header)]"
                  >
                    <X className="h-4 w-4" />
                  </motion.button>
                )}
              </div>
            </div>
            <div className="h-full overflow-y-auto py-4">
              <motion.div
                variants={{
                  open: {
                    transition: {
                      staggerChildren: 0.05,
                    },
                  },
                  closed: {
                    transition: {
                      staggerChildren: 0.05,
                      staggerDirection: -1,
                    },
                  },
                }}
                className="space-y-1"
              >
                {items.map((item) => (
                  <SidebarItem key={item.label} item={item} />
                ))}
              </motion.div>
            </div>
          </motion.aside>
          {/* Backdrop for mobile */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 md:hidden"
            onClick={onClose}
          />
        </>
      )}
    </AnimatePresence>
  );
};
