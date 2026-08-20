import React from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { cn } from '../../../lib/utils';

interface Tab {
  value: string;
  label: string;
  icon?: React.ReactNode;
  content: React.ReactNode;
}

interface TabsProps {
  variant?: 'default' | 'pills' | 'underline' | 'elevated' | 'bordered';
  tabs: Tab[];
  defaultValue?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const Tabs = ({ variant = 'default', tabs, defaultValue, className, style }: TabsProps) => {
  const [activeTab, setActiveTab] = React.useState(defaultValue || tabs[0]?.value);
  const [hoveredTab, setHoveredTab] = React.useState<string | null>(null);

  const variants = {
    default: {
      list: 'flex space-x-1 rounded-xl bg-[var(--header)] p-1',
      trigger:
        'rounded-lg px-3 py-1.5 text-sm font-medium text-[var(--text)] transition-all duration-200',
      active: 'bg-[var(--sidebar-background)] text-[var(--button-red)] shadow-sm',
    },
    pills: {
      list: 'flex space-x-2',
      trigger:
        'rounded-full px-4 py-2 text-sm font-medium text-[var(--text)] transition-all duration-200',
      active: 'bg-[var(--button-red)] text-white shadow-lg',
    },
    underline: {
      list: 'flex space-x-8 border-b border-[var(--border)]',
      trigger:
        'px-1 py-4 text-sm font-medium text-[var(--text)] transition-all duration-200 border-b-2 border-transparent -mb-px',
      active: 'text-[var(--button-red)] border-[var(--button-red)]',
    },
    elevated: {
      list: 'flex space-x-2',
      trigger:
        'rounded-lg px-4 py-2 text-sm font-medium text-[var(--text)] transition-all duration-200 shadow-sm hover:shadow-md',
      active: 'bg-[var(--button-red)] text-white shadow-lg',
    },
    bordered: {
      list: 'flex space-x-2',
      trigger:
        'rounded-lg px-4 py-2 text-sm font-medium text-[var(--text)] transition-all duration-200 border border-[var(--border)]',
      active: 'border-[var(--button-red)] text-[var(--button-red)]',
    },
  };

  const tabListVariants: Variants = {
    hidden: {
      opacity: 0,
      y: -10,
      rotateX: -30,
    },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
        staggerChildren: 0.1,
      },
    },
  };

  const tabContentVariants: Variants = {
    hidden: {
      opacity: 0,
      x: 20,
      scale: 0.95,
      rotateY: -30,
    },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      rotateY: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
      },
    },
    exit: {
      opacity: 0,
      x: -20,
      scale: 0.95,
      rotateY: 30,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
      },
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

  const triggerVariants: Variants = {
    hidden: {
      opacity: 0,
      y: -10,
      rotateX: -30,
    },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
      },
    },
    hover: {
      scale: 1.02,
      y: -2,
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 10,
      },
    },
    tap: {
      scale: 0.98,
      rotateX: 10,
    },
  };

  const backgroundVariants: Variants = {
    hidden: {
      opacity: 0,
      scale: 0.9,
      rotateX: -30,
    },
    visible: {
      opacity: 1,
      scale: 1,
      rotateX: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      rotateX: 30,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
      },
    },
  };

  return (
    <TabsPrimitive.Root
      value={activeTab}
      onValueChange={setActiveTab}
      className={className}
      style={{
        ...style,
        perspective: '1000px',
      }}
    >
      <motion.div
        initial="hidden"
        animate="visible"
        variants={tabListVariants}
        style={{ transformStyle: 'preserve-3d' }}
      >
        <TabsPrimitive.List className={variants[variant].list}>
          {tabs.map((tab) => (
            <TabsPrimitive.Trigger
              key={tab.value}
              value={tab.value}
              className={cn(
                variants[variant].trigger,
                tab.value === activeTab && variants[variant].active,
                hoveredTab === tab.value &&
                  tab.value !== activeTab &&
                  'bg-[var(--header)] scale-[1.02]'
              )}
              onMouseEnter={() => setHoveredTab(tab.value)}
              onMouseLeave={() => setHoveredTab(null)}
            >
              <motion.div
                className="flex items-center gap-2"
                variants={triggerVariants}
                whileHover="hover"
                whileTap="tap"
                style={{ transformStyle: 'preserve-3d' }}
              >
                {tab.icon && (
                  <motion.span
                    variants={iconVariants}
                    whileHover="hover"
                    animate={hoveredTab === tab.value ? { scale: 1.1 } : { scale: 1 }}
                    style={{ transformStyle: 'preserve-3d' }}
                  >
                    {tab.icon}
                  </motion.span>
                )}
                {tab.label}
              </motion.div>
            </TabsPrimitive.Trigger>
          ))}
        </TabsPrimitive.List>
      </motion.div>

      <AnimatePresence mode="wait">
        {tabs.map((tab) => (
          <TabsPrimitive.Content
            key={tab.value}
            value={tab.value}
            className="mt-4 focus:outline-none"
          >
            {tab.value === activeTab && (
              <motion.div
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={tabContentVariants}
                className="relative"
                style={{ transformStyle: 'preserve-3d' }}
              >
                {variant === 'elevated' && (
                  <motion.div
                    className="absolute inset-0 bg-[var(--header)] rounded-lg -z-10"
                    variants={backgroundVariants}
                    style={{ transformStyle: 'preserve-3d' }}
                  />
                )}
                {tab.content}
              </motion.div>
            )}
          </TabsPrimitive.Content>
        ))}
      </AnimatePresence>
    </TabsPrimitive.Root>
  );
};
