import { cva, type VariantProps } from "class-variance-authority";
import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { cn } from "../../../utils/cn";

export type SidebarPosition = "left" | "right" | "bottomLeft" | "bottomRight";

interface SidebarContextType {
  sidebars: Record<SidebarPosition, boolean>;
  setSidebar: (position: SidebarPosition, open: boolean) => void;
  toggle: (position: SidebarPosition) => void;
  onOpen: (position: SidebarPosition) => void;
  onClose: (position: SidebarPosition) => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

interface SidebarProviderProps {
  children: ReactNode;
  initialState?: Partial<Record<SidebarPosition, boolean>>;
}

export const SidebarProvider: React.FC<SidebarProviderProps> = ({
  children,
  initialState = {},
}) => {
  const [sidebars, setSidebars] = useState<Record<SidebarPosition, boolean>>({
    left: initialState.left ?? true,
    right: initialState.right ?? true,
    bottomLeft: initialState.bottomLeft ?? false,
    bottomRight: initialState.bottomRight ?? false,
  });

  const setSidebar = useCallback((position: SidebarPosition, open: boolean) => {
    setSidebars((prev) => {
      if (prev[position] === open) return prev;
      return { ...prev, [position]: open };
    });
  }, []);

  const toggle = useCallback((position: SidebarPosition) => {
    setSidebars((prev) => ({
      ...prev,
      [position]: !prev[position],
    }));
  }, []);

  const onOpen = useCallback(
    (position: SidebarPosition) => setSidebar(position, true),
    [setSidebar]
  );

  const onClose = useCallback(
    (position: SidebarPosition) => setSidebar(position, false),
    [setSidebar]
  );

  const value = useMemo(
    () => ({ sidebars, setSidebar, toggle, onOpen, onClose }),
    [sidebars, setSidebar, toggle, onOpen, onClose]
  );

  return (
    <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
  );
};

export const useSidebar = (position: SidebarPosition = "left") => {
  const context = useContext(SidebarContext);

  if (!context) {
    throw new Error("useSidebar must be used inside SidebarProvider");
  }

  const { sidebars, setSidebar, toggle, onOpen, onClose } = context;

  return {
    isOpen: sidebars[position],
    setOpen: (open: boolean) => setSidebar(position, open),
    toggle: () => toggle(position),
    onOpen: () => onOpen(position),
    onClose: () => onClose(position),
  };
};

interface LinkItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

interface ThreeColumnSidebarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof sidebarVariants> {
  links: LinkItem[];
  brandName?: string;
  position?: SidebarPosition;
  sidebarLayoutMode?: "OVERLAY_ONLY" | "BOTTOM_DOCKED" | "OVERLAY_WITH_PANE";
}

const sidebarVariants = cva("relative transition-all", {
  variants: {
    position: {
      left: "top-0 left-0 h-full",
      right: "top-0 right-0 h-full",
      bottomLeft: "bottom-0 left-0 w-full h-auto",
      bottomRight: "bottom-0 right-0 w-full h-auto",
    },
    isOpen: {
      true: "",
      false: "",
    },
    direction: {
      horizontal: "flex-row",
      vertical: "flex-col items-start",
    },
  },
  compoundVariants: [
    {
      position: ["left", "right"],
      isOpen: true,
      className: "w-50",
    },
    {
      position: ["left", "right"],
      isOpen: false,
      className: "w-15",
    },
    {
      position: ["bottomLeft", "bottomRight"],
      isOpen: true,
      className: "h-auto",
    },
  ],
  defaultVariants: {
    position: "left",
    isOpen: true,
    direction: "vertical",
  },
});

const ThreeColumnSidebar: React.FC<ThreeColumnSidebarProps> = ({
  links,
  brandName = "Brand",
  position = "left",
  className,
  direction,
  style,
  sidebarLayoutMode = "OVERLAY_ONLY",
}) => {
  const { isOpen, onClose, onOpen } = useSidebar(position);
  const [isMobile, setIsMobile] = React.useState(false);
  const isBottom = position === "bottomLeft" || position === "bottomRight";
  const bp = 768;
  const [showAll, setShowAll] = React.useState(false);
  console.log(bp,isMobile)

  const visibleLinks =
    sidebarLayoutMode === "OVERLAY_ONLY" ? links : links.slice(0, 0);

  React.useEffect(() => {
    const check = () => {
      const mobile = window.innerWidth < bp;
      setIsMobile((prev) => (prev !== mobile ? mobile : prev));
    };

    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <>
      {/* iOS Backdrop */}
      <AnimatePresence>
        {isMobile && isBottom && showAll && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowAll(false)}
            className="fixed inset-0 bg-black z-998"
          />
        )}
      </AnimatePresence>

      <motion.div
        initial={false}
        animate={{
          x: isMobile
            ? 0
            : isOpen
            ? 0
            : position === "left" || position === "right"
            ? ""
            : "100%",
          width: isOpen ? (isBottom ? "100%" : "256px") : "80px",
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={cn(
          sidebarVariants({ position, isOpen, direction }),
          className
        )}
        style={isOpen && !isMobile ? style : undefined}
      >
        {/* Header */}
        {!isBottom && (
          <div className="p-4 flex items-center justify-between gap-4">
            {isOpen && <h1 className="text-xl font-bold">{brandName}</h1>}

            {isOpen ? (
              <button onClick={onClose}>
                <X size={24} />
              </button>
            ) : (
              <button onClick={onOpen}>
                <Menu size={24} />
              </button>
            )}
          </div>
        )}

        <div className="flex flex-col items-center justify-end w-full">
          {/* BOTTOM DRAWER BUTTON */}
          {isBottom && (
            <span
              onClick={() => setShowAll((prev) => !prev)}
              className="my-2 flex items-center justify-center min-w-[100px]"
            >
              ...
            </span>
          )}

          {/* DESKTOP NAV (if drawer closed) */}
          {!showAll && (
            <motion.nav
              className={cn(
                "flex w-full justify-center gap-2",
                direction === "horizontal" ? "flex-row flex-wrap" : "flex-col"
              )}
            >
              {visibleLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className="flex flex-row items-center gap-1 p-2"
                >
                  <link.icon size={24} />
                  {isOpen && sidebarLayoutMode === "OVERLAY_ONLY" && (
                    <span className="text-xl">{link.label}</span>
                  )}
                </a>
              ))}
            </motion.nav>
          )}
        </div>
      </motion.div>

      {/* iOS BOTTOM SHEET */}
      <AnimatePresence>
        {isMobile && isBottom && showAll && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 50) setShowAll(false);
            }}
            className="fixed left-0 bottom-0 w-full rounded-t-2xl shadow-xl bg-black max-h-[90vh] overflow-y-auto z-999"
          >
            <div className="p-4 flex justify-center">
              <div
                className="w-12 h-1.5 bg-gray-400 rounded-full"
                onClick={() => setShowAll((prev) => !prev)}
              />
            </div>

            <nav className="flex flex-col w-full justify-center gap-3 px-4 pb-6">
              {links.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className="flex flex-row items-center gap-2 p-2"
                >
                  <link.icon size={24} />
                  {isOpen && <span className="text-xl">{link.label}</span>}
                </a>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ThreeColumnSidebar;
