import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { motion } from "framer-motion";
import {
  HelpCircle,
  Home,
  Menu,
  Settings,
  User,
  X,
} from "lucide-react";
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
      true: "w-64 h-full",
      false: `w-20 h-full`,
    },
    variant: {
      default: "bg-background text-foreground",
      dark: "bg-black text-white",
      light: "bg-white text-gray-900 border-r",
      glass: "bg-white/10 backdrop-blur-lg text-white",
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

export const Sidebar: React.FC<SidebarProps> = ({
  links,
  brandName = "Brand",
  position = "left",
  variant,
  className,
  direction,
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
        isMobile ? !isOpen ? "w-0" : isOpen: '',
        className
      )}
    >
      {/* Sidebar Header */}
      <div className="p-4 flex items-center justify-between gap-4">
        {isOpen && <h1 className="text-xl font-bold">{brandName}</h1>}
          {isOpen ? (
        <button onClick={onClose}>
            <span title="Close">
              <X size={24} />
            </span>
        </button>
          ) : (
            <button onClick={onOpen}>
              <span title="Open">
                <Menu size={24} />
              </span>
            </button>
          )}
      </div>

      {/* Sidebar Links */}
      <motion.nav
        className={cn(
          direction === "horizontal" ? "flex-row" : "flex-col",
          "flex"
        )}
      >
        {links.map((link, index) => (
          <a
            key={index}
            href={link.href}
            className="flex items-center p-4 gap-4 "
          >
            <link.icon size={24} />
            {isOpen && <span>{link.label}</span>}
          </a>
        ))}
      </motion.nav>
    </motion.div>
  );
};

export default function SidebarDemo() {
  return (
    <SidebarProvider>
      <Sidebar
        links={[
          { label: 'Home', href: '#', icon: Home },
          { label: 'Profile', href: '#', icon: User },
          { label: 'Settings', href: '#', icon: Settings },
          { label: 'Help', href: '#', icon: HelpCircle },
        ]}
        brandName="Demo App"
      />
    </SidebarProvider>
  );
}