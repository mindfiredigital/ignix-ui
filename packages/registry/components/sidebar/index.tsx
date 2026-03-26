import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { motion } from "framer-motion";
import {HamburgerMenuIcon, DoubleArrowLeftIcon, ChevronDownIcon} from '@radix-ui/react-icons'
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../../utils/cn";

interface LinkItem {
  label: string;
  href: string;
  icon: React.ElementType;
  children?: Omit<LinkItem, 'children'>[];
}

interface SidebarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof sidebarVariants> {
  links: LinkItem[];
  brandName?: string;
  position?: "left" | "right" | "bottomLeft" | "bottomRight";
  mobileBreakPoint?: number;
}

const sidebarVariants = cva("absolute h-full overflow-hidden transition-all", {
  variants: {
    position: {
      left: "top-0 left-0",
      right: "top-0 right-0",
      bottomLeft: "bottom-0 left-0",
      bottomRight: "bottom-0 right-0",
    },
    isOpen: {
      true: "h-full",
      false: "h-full",
    },
    variant: {
      default: "bg-background text-foreground [&_a]:!text-foreground [&_button]:!text-foreground [&_span]:!text-accent-foreground shadow-md",
      dark: "bg-black text-accent-foreground [&_a]:!text-accent-foreground [&_button]:!text-accent-foreground [&_span]:!text-accent-foreground",
      light: "bg-white text-gray-900 shadow-[4px_0_16px_rgba(0,0,0,0.08)] [&_a]:!text-gray-900 [&_button]:!text-gray-900 [&_span]:!text-gray-900",
      glass: "bg-muted/25 backdrop-blur-3xl backdrop-saturate-200 backdrop-brightness-90 border border-white/30 shadow-[inset_0_1.5px_0_rgba(255,255,255,0.6),inset_0_-1px_0_rgba(0,0,0,0.15),0_8px_32px_rgba(0,0,0,0.25)] [&_a]:!text-foreground [&_button]:!text-foreground [&_span]:!text-accent-foreground",
      gradient: "bg-gradient-to-b from-gray-800 to-gray-500 [&_a]:!text-accent-foreground [&_button]:!text-accent-foreground [&_span]:!text-accent-foreground",
      dropdown: "bg-background text-foreground [&_a]:!text-foreground [&_button]:!text-foreground [&_span]:!text-forground shadow-md",
    },

    direction: {
      horizontal: "flex-row",
      vertical: "flex-col items-start",
    },
  },
  defaultVariants: {
    position: "left",
    isOpen: true,
    variant: "default",
    direction: "vertical",
  },
});

interface SidebarContextType {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  toggle: () => void;
  onClose: () => void;
  onOpen: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

interface SidebarProviderProps {
  children: ReactNode;
  initialOpen?: boolean;
}

export const SidebarProvider: React.FC<SidebarProviderProps> = ({ 
  children, 
  initialOpen = true 
}) => {
  const [isOpen, setIsOpen] = useState(initialOpen);

  const toggle = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  const onClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  const onOpen = useCallback(() => {
    setIsOpen(true);
  }, []);

  const value: SidebarContextType = {
    isOpen,
    setIsOpen,
    toggle,
    onClose,
    onOpen,
  };

  return (
    <SidebarContext.Provider value={value}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
};

const SidebarLink: React.FC<{
  link: LinkItem;
  sidebarOpen: boolean;
  variant?: string | null;
}> = ({ link, sidebarOpen, variant}) => {
  const [open, setOpen] = useState(false);

  React.useEffect(() => {
    if (!sidebarOpen) setOpen(false);
  }, [sidebarOpen]);

  if(!link.children?.length || variant !== "dropdown"){
    return (
      <a
        href={link.href}
        className='flex items-center pl-4 pr-3 gap-3 transition-colors'
      >
        <link.icon width={15} height={15} className="text-primary shrink-0"/>
        {sidebarOpen && <span className="text-sm !text-accent-foreground">{link.label}</span>}
      </a>
    );
  }

  return (
    <div>
      <button
        onClick={() => sidebarOpen && setOpen(prev => !prev)}
        className="w-full flex items-center justify-between pl-4 pr-4 py-2 hover:bg-accent transition-colors"
      >
        <div className='flex items-center gap-3'>
          <link.icon width={15} height={15} className="text-primary shrink-0" />
          {sidebarOpen && <span className="text-sm !text-accent-foreground">{link.label}</span>}
        </div>

        {sidebarOpen && (
          <motion.span
            animate={{ rotate: open ? 180 : 0}}
            transition={{ duration: 0.2 }}
            style={{ display: "flex"}}
          >
            <ChevronDownIcon width={12} height={12} className='cursor-pointer' />
          </motion.span>
        )}
      </button>

      <motion.div
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.2, ease: "easeInOut"}}
        style={{ overflow: "hidden" }}
      >

        {link.children.map((child, i) => (
          <a
            key={i}
            href={child.href}
            className="flex items-center pl-10 pr-3 py-2 gap-3 transition-colors"
          >
            <child.icon width={13} height={13} className="text-primary shrink-0" />
            <span className="text-sm !text-accent-foreground">{child.label}</span>
          </a>
        ))}
      </motion.div>
    </div>
  );
}

const Sidebar: React.FC<SidebarProps> = ({
  links,
  brandName = "Brand",
  position = "left",
  variant,
  className,
  direction,
  mobileBreakPoint = 768,
}) => {
  const { isOpen, onClose, onOpen } = useSidebar();
  const [isMobile, setIsMobile] = React.useState(false);
  
  React.useEffect(() => {
    const check = () => {
      const mobile = window.innerWidth < mobileBreakPoint;
      setIsMobile(mobile);
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [mobileBreakPoint]);

  return (
    <motion.div
      initial={{ x: 0 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.4 }}
      className={cn(
        sidebarVariants({ position, isOpen, variant, direction }),
        'flex flex-col',
        isOpen
          ? "w-[var(--sidebar-w,11rem)]"
          : "w-[var(--sidebar-w-collapsed,3rem)]",
        isMobile && !isOpen && "w-0",
        className
      )}
    >
      {variant === "glass" && (
        <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-white/10 to-transparent pointer-events-none z-0" />
      )}

      {/* Sidebar Header */}
      <div className="relative z-10 shrink-0 p-4 flex items-center justify-between w-full">
        <span className={cn("text-base font-semibold truncate", !isOpen && "invisible")}>
          {brandName}
        </span>
        {isOpen ? (
          <button onClick={onClose} className='cursor-pointer'>
            <span title="Close">
              <DoubleArrowLeftIcon width={14} height={14} />
            </span>
          </button>
        ) : (
          <button onClick={onOpen} className='cursor-pointer'>
            <span title="Open">
              <HamburgerMenuIcon width={16} height={16} />
            </span>
          </button>
        )}
      </div>

      {/* Sidebar Links */}
      <motion.nav
        className={cn(
          direction === "horizontal" ? "flex-row overflow-x-auto" : "flex-col overflow-y-auto",
          "relative z-10 flex flex-1 w-full min-h-0 scrollbar-hidden"
        )}
      >
        {links.map((link, index) => (
          <SidebarLink
            key={index}
            link={link}
            sidebarOpen={isOpen}
            variant={variant}
          />
        ))}
      </motion.nav>
    </motion.div>
  );
};

export { Sidebar };
