import React from 'react';
import { Routes, Route, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  Box,
  Type,
  Radio,
  Navigation,
  ChevronRight,
  ChevronLeft,
  Sun,
  Moon,
} from 'lucide-react';
import SelectShowcase from './components/select/SelectShowcase';
import TextareaShowcase from './components/textarea/TextareaShowcase';
import RadioShowcase from './components/radio/RadioShowcase';
import InputShowcase from './components/input/InputShowcase';
import { NavigationDemo } from './pages/NavigationDemo';
import { Navbar } from './components/navigation/Navbar';
import { Sidebar } from './components/navigation/Sidebar';
import { Breadcrumbs } from './components/navigation/Breadcrumbs';
import { cn } from './lib/utils';

const menuItems = [
  {
    label: 'Getting Started',
    href: '/',
    icon: <Home className="h-4 w-4" />,
  },
  {
    label: 'Form Controls',
    icon: <Box className="h-4 w-4" />,
    children: [
      {
        label: 'Input',
        href: '/input',
        icon: <Type className="h-4 w-4" />,
      },
      {
        label: 'Select',
        href: '/select',
        icon: <Type className="h-4 w-4" />,
      },
      {
        label: 'Textarea',
        href: '/textarea',
        icon: <Type className="h-4 w-4" />,
      },
      {
        label: 'Radio',
        href: '/radio',
        icon: <Radio className="h-4 w-4" />,
      },
    ],
  },
  {
    label: 'Navigation',
    href: '/navigation',
    icon: <Navigation className="h-4 w-4" />,
  },
];

const navItems = [
  {
    label: 'Components',
    href: '#',
    children: [
      { label: 'Form Controls', href: '/input' },
      { label: 'Navigation', href: '/navigation' },
    ],
  },
  {
    label: 'Documentation',
    href: '#',
  },
  {
    label: 'GitHub',
    href: 'https://github.com',
  },
];

const PageTransition = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{
          type: 'spring',
          stiffness: 260,
          damping: 20,
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

function App() {
  const [isDark, setIsDark] = React.useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(false);
  const location = useLocation();

  React.useEffect(() => {
    // Load Google Fonts
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    // Apply theme
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // Get current breadcrumb items based on location
  const getBreadcrumbItems = () => {
    const paths = location.pathname.split('/').filter(Boolean);
    return [
      { label: 'Home', href: '/', icon: <Home className="h-4 w-4" /> },
      ...paths.map((path, index) => ({
        label: path.charAt(0).toUpperCase() + path.slice(1),
        href: '/' + paths.slice(0, index + 1).join('/'),
        icon: menuItems.find((item) => item.href === '/' + path)?.icon,
      })),
    ];
  };

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: 'var(--background)',
        color: 'var(--text)',
        fontFamily: 'Lato, sans-serif',
        fontSize: '13px',
      }}
    >
      {/* Top Navigation */}
      <Navbar
        items={navItems}
        variant="floating"
        className="!fixed top-4 left-4 right-4 z-50"
        logo={
          <Link to="/" className="text-2xl font-bold" style={{ color: 'var(--button-red)' }}>
            Ignix UI
          </Link>
        }
      />

      <div className="flex min-h-screen pt-20">
        {/* Sidebar */}
        <Sidebar
          items={menuItems}
          isOpen={isSidebarOpen}
          isCollapsed={isSidebarCollapsed}
          onClose={() => setIsSidebarOpen(false)}
          onCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className={cn(
            '!fixed left-0 top-20 bottom-0 transition-all duration-300',
            isSidebarCollapsed ? 'w-16' : 'w-64'
          )}
          style={{ backgroundColor: 'var(--sidebar-background)' }}
        />

        {/* Main Content */}
        <main
          className={cn(
            'flex-1 transition-all duration-300',
            isSidebarOpen ? (isSidebarCollapsed ? 'ml-16' : 'ml-64') : 'ml-0'
          )}
        >
          <div className="p-8">
            {/* Breadcrumbs */}
            <div className="mb-8">
              <Breadcrumbs
                items={getBreadcrumbItems()}
                variant="pills"
                className="!fixed top-20 left-[calc(var(--sidebar-width)+2rem)] right-8 z-40 bg-[var(--background)] py-4"
                style={
                  {
                    '--sidebar-width': isSidebarOpen
                      ? isSidebarCollapsed
                        ? '4rem'
                        : '16rem'
                      : '0rem',
                  } as React.CSSProperties
                }
              />
            </div>

            <PageTransition>
              <Routes>
                <Route path="/select" element={<SelectShowcase />} />
                <Route path="/input" element={<InputShowcase />} />
                <Route path="/textarea" element={<TextareaShowcase />} />
                <Route path="/radio" element={<RadioShowcase />} />
                <Route path="/navigation" element={<NavigationDemo />} />
                <Route path="/" element={<InputShowcase />} />
              </Routes>
            </PageTransition>
          </div>
        </main>

        {/* Controls */}
        <div className="fixed bottom-4 right-4 flex items-center gap-2">
          {/* Sidebar Toggle */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-full"
            style={{ backgroundColor: 'var(--button-red)' }}
          >
            {isSidebarOpen ? (
              <ChevronLeft className="h-4 w-4 text-white" />
            ) : (
              <ChevronRight className="h-4 w-4 text-white" />
            )}
          </motion.button>

          {/* Sidebar Collapse */}
          {isSidebarOpen && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="p-2 rounded-full"
              style={{ backgroundColor: 'var(--button-blue)' }}
            >
              {isSidebarCollapsed ? (
                <ChevronRight className="h-4 w-4 text-white" />
              ) : (
                <ChevronLeft className="h-4 w-4 text-white" />
              )}
            </motion.button>
          )}

          {/* Theme Toggle */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsDark(!isDark)}
            className="p-2 rounded-full"
            style={{ backgroundColor: 'var(--button-green)' }}
          >
            {isDark ? (
              <Sun className="h-4 w-4 text-white" />
            ) : (
              <Moon className="h-4 w-4 text-white" />
            )}
          </motion.button>
        </div>
      </div>
    </div>
  );
}

export default App;
