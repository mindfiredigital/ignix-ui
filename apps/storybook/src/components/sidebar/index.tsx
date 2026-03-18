import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { motion } from "framer-motion";
import {HamburgerMenuIcon, DoubleArrowLeftIcon} from '@radix-ui/react-icons'
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../../utils/cn";

interface LinkItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

interface SidebarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof sidebarVariants> {
  links: LinkItem[];
  brandName?: string;
  position?: "left" | "right" | "bottomLeft" | "bottomRight";
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
      default: "bg-background text-foreground shadow-md",
      dark: "bg-black text-white [&_a]:text-white [&_button]:text-white [&_span]:text-white",
      light: "bg-white text-gray-900 shadow-[4px_0_16px_rgba(0,0,0,0.08)]",
      glass: "glass-sidebar",
      gradient: "bg-gradient-to-b from-gray-800 to-gray-500 text-foreground [&_a]:text-white [&_button]:text-white [&_span]:text-white",    
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

const Sidebar: React.FC<SidebarProps> = ({
  links,
  brandName = "Brand",
  position = "left",
  variant,
  className,
  direction
}) => {
  const { isOpen, onClose, onOpen } = useSidebar();
    const [isMobile, setIsMobile] = React.useState(false);
  
    // breakpoint width
    const bp = 768; // 1024;
  
    React.useEffect(() => {
      const check = () => {
        const mobile = window.innerWidth < bp;
        setIsMobile(mobile);
      };
      check();
      window.addEventListener("resize", check);
      return () => window.removeEventListener("resize", check);
    }, [bp]);

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
        isMobile ? !isOpen ? "w-0" : isOpen: '',
        className
      )}
    >
      {/* Sidebar Header */}
      <div className="p-4 flex items-center justify-between w-full gap-4 shrink-0">
        {isOpen && <span className="text-xl font-semibold truncate">{brandName}</span>}
          {isOpen ? (
        <button onClick={onClose}>
            <span title="Close">
              <DoubleArrowLeftIcon width={14} height={14} />
            </span>
        </button>
          ) : (
            <button onClick={onOpen}>
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
          "flex flex-1 min-h-0 scrollbar-hidden"
        )}
      >
        {links.map((link, index) => (
          <a
            key={index}
            href={link.href}
            className="flex items-center pl-4 pr-3 py-2 gap-3"
          >
            <link.icon width={15} height={15} />
            {isOpen && <span className='text-sm'>{link.label}</span>}
          </a>
        ))}
      </motion.nav>
    </motion.div>
  );
};

export default Sidebar;
