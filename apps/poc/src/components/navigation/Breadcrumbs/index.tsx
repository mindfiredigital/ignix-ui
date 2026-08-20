import React from 'react';
import { motion, type Variants } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { Link } from 'react-router-dom';

interface BreadcrumbItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
}

interface BreadcrumbsProps {
  variant?: 'default' | 'pills' | 'arrows' | 'elevated' | 'bordered';
  items: BreadcrumbItem[];
  className?: string;
  style?: React.CSSProperties;
}

export const Breadcrumbs = ({ variant = 'default', items, className, style }: BreadcrumbsProps) => {
  const [hoveredItem, setHoveredItem] = React.useState<string | null>(null);

  const variants = {
    default: '',
    pills: 'space-x-2',
    arrows: 'space-x-2',
    elevated: 'space-x-2',
    bordered: 'space-x-2',
  };

  const itemVariants = {
    default: 'text-sm font-medium hover:text-[var(--hover)]',
    pills: 'px-3 py-1 text-sm font-medium rounded-full hover:bg-[var(--header)]',
    arrows: 'pl-2 pr-4 py-1 text-sm font-medium',
    elevated:
      'px-3 py-1 text-sm font-medium rounded-md shadow-sm hover:shadow-md bg-[var(--sidebar-background)]',
    bordered:
      'px-3 py-1 text-sm font-medium rounded-md border border-[var(--border)] hover:border-[var(--button-red)]',
  };

  const separatorVariants = {
    default: 'mx-2 text-[var(--text)]',
    pills: 'mx-0 text-[var(--text)]',
    arrows: 'mx-0',
    elevated: 'mx-2 text-[var(--text)]',
    bordered: 'mx-2 text-[var(--text)]',
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0, y: -10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
        staggerChildren: 0.1,
      },
    },
  };

  const itemAnimationVariants: Variants = {
    hidden: {
      opacity: 0,
      x: -10,
      rotateX: -90,
    },
    visible: {
      opacity: 1,
      x: 0,
      rotateX: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
      },
    },
    hover: {
      scale: 1.05,
      rotateY: [-5, 5, -5, 0],
      transition: {
        rotateY: {
          repeat: 0,
          duration: 0.5,
        },
        scale: {
          type: 'spring',
          stiffness: 400,
          damping: 10,
        },
      },
    },
    tap: {
      scale: 0.95,
      rotateX: 10,
    },
  };

  const iconVariants: Variants = {
    hidden: {
      opacity: 0,
      scale: 0,
      rotate: -180,
    },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 10,
      },
    },
    hover: {
      rotate: [0, 15, -15, 0],
      scale: 1.2,
      transition: {
        rotate: {
          repeat: 0,
          duration: 0.5,
        },
        scale: {
          type: 'spring',
          stiffness: 400,
          damping: 10,
        },
      },
    },
  };

  const separatorAnimationVariants: Variants = {
    hidden: {
      opacity: 0,
      scale: 0.5,
      rotate: -180,
    },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
      },
    },
    hover: {
      scale: 1.2,
      rotate: 360,
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 10,
      },
    },
  };

  const Separator = () => {
    if (variant === 'arrows') {
      return (
        <motion.div
          variants={separatorAnimationVariants}
          whileHover="hover"
          className="relative h-7"
          style={{ perspective: '1000px' }}
        >
          <div
            className={cn(
              'absolute inset-0 flex items-center justify-center',
              'text-[var(--text)]'
            )}
          >
            <ChevronRight className="h-5 w-5" />
          </div>
        </motion.div>
      );
    }

    return (
      <motion.span
        variants={separatorAnimationVariants}
        whileHover="hover"
        className={separatorVariants[variant]}
      >
        /
      </motion.span>
    );
  };

  return (
    <motion.nav
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className={cn('flex items-center', variants[variant], className)}
      style={{
        ...style,
        perspective: '1000px',
      }}
    >
      {items.map((item, index) => (
        <React.Fragment key={item.label}>
          {index > 0 && <Separator />}
          <Link to={item.href}>
            <motion.div
              variants={itemAnimationVariants}
              whileHover="hover"
              whileTap="tap"
              className={cn(
                itemVariants[variant],
                'flex items-center transition-all duration-200',
                hoveredItem === item.label && 'text-[var(--hover)]'
              )}
              onMouseEnter={() => setHoveredItem(item.label)}
              onMouseLeave={() => setHoveredItem(null)}
              style={{
                transformStyle: 'preserve-3d',
              }}
            >
              {item.icon && (
                <motion.span
                  variants={iconVariants}
                  whileHover="hover"
                  className="mr-1.5"
                  style={{
                    transformStyle: 'preserve-3d',
                  }}
                >
                  {item.icon}
                </motion.span>
              )}
              {item.label}
            </motion.div>
          </Link>
        </React.Fragment>
      ))}
    </motion.nav>
  );
};
