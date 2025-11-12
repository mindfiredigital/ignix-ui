import React, { useState, useEffect, useMemo } from "react";
import { ThemeEngine } from "../../themes/ThemeEngine";
import type {
  ThemeConfig,
  ContrastLevel,
  ThemeCategory,
} from "../../types/theme";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../UI/card";
import { Button } from "../UI/button";
import { Tabs } from "../UI/tab";
import { Clipboard, Loader2, Box, Gift, Zap, X } from "lucide-react";
import AutoGrid from "../UI/auto-grid";
import { getTheme } from "../Homepage/hero";

// Simple Dialog Component
interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  className?: string;
}

const Dialog = ({ open, children, className = '' }: DialogProps) => {
  if (!open) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div 
        className={`bg-background rounded-lg shadow-lg ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

const DialogHeader = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`p-4 border-b ${className}`}>
    {children}
  </div>
);

const DialogTitle = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <h3 className={`text-lg font-semibold ${className}`}>
    {children}
  </h3>
);

const DialogContent = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`p-4 ${className}`}>
    {children}
  </div>
);

const THEMES_JSON_URL =
  "https://raw.githubusercontent.com/mindfiredigital/ignix-ui/main/packages/registry/themes.json";

const groupThemesByCategory = (
  themes: Record<string, ThemeConfig>
): ThemeCategory[] => {
  const categories: Record<string, ThemeCategory> = {};
  Object.values(themes).forEach((theme) => {
    if (!categories[theme.category]) {
      categories[theme.category] = {
        id: theme.category,
        name: theme.category
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" "),
        description: `Themes in the ${theme.category} category`,
        themes: [],
      };
    }
    categories[theme.category].themes.push(theme);
  });
  return Object.values(categories).sort((a, b) => a.name.localeCompare(b.name));
};

const ColorInput = ({ label, value, onChange }) => (
  <div className="flex flex-col space-y-2">
    <label className="text-sm font-medium">{label}</label>
    <div className="flex items-center gap-2">
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 w-10 cursor-pointer rounded-md border bg-transparent"
      />
      <input
        type="text"
        value={value.toUpperCase()}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 w-full rounded-md border bg-transparent px-3 py-2 text-sm"
      />
    </div>
  </div>
);

export default function ThemePlayground() {
  const [categories, setCategories] = useState<ThemeCategory[]>([]);
  const [selectedCategoryName, setSelectedCategoryName] = useState<string | null>(
    null
  );
  const [theme, setTheme] = useState<ThemeConfig | null>(null);
  const [customColors, setCustomColors] = useState({
    primary: "#2563EB",
    secondary: "#10B981",
    accent: "#F59E0B",
  });
  const [contrastLevel, setContrastLevel] = useState<ContrastLevel>("AA");
  const [previewMode, setPreviewMode] = useState<"light" | "dark">("light");
  const [isLoading, setIsLoading] = useState(true);
  const [copyStatus, setCopyStatus] = useState("Copy");
  const [search, setSearch] = useState("");
  const [showCssDialog, setShowCssDialog] = useState(false);

  useEffect(() => {
    // Set initial theme mode
    setPreviewMode(getTheme() as "light" | "dark");
    
    const fetchThemes = async () => {
      try {
        const resp = await fetch(THEMES_JSON_URL);
        if (!resp.ok) throw new Error("Failed to fetch themes");
        const themes = await resp.json();
        const grouped = groupThemesByCategory(themes);
        setCategories(grouped);
        if (grouped.length > 0) {
          const firstCategory = grouped[0];
          setSelectedCategoryName(firstCategory.name);
          if (firstCategory.themes?.length) {
            const firstTheme = firstCategory.themes[0];
            setCustomColors({
              primary: firstTheme.colors.primary,
              secondary: firstTheme.colors.secondary,
              accent: firstTheme.colors.accent,
            });
          }
        }
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchThemes();
    
    // Set up theme observer for changes after initial load
    const observer = new MutationObserver(() => {
      setPreviewMode(getTheme() as "light" | "dark");
    });
    
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    
    return () => observer.disconnect();
  }, []);

  const handleColorChange = (colorName: string, value: string) => {
    const newCustomColors = { ...customColors, [colorName]: value };
    setCustomColors(newCustomColors);

    const newTheme = ThemeEngine.createTheme({
      id: "custom",
      name: "Custom",
      category: "custom",
      ...newCustomColors,
      generateDark: true,
      contrastLevel,
    });
    const { theme: fixed } = ThemeEngine.validateAndFix(
      newTheme,
      contrastLevel
    );
    setTheme(fixed);
  };

  const activeTheme = useMemo(() => {
    if (!theme) return null;
    const { theme: fixed } = ThemeEngine.validateAndFix(theme, contrastLevel);
    return fixed;
  }, [theme, contrastLevel]);

  const currentColors =
    previewMode === "dark" && activeTheme?.dark
      ? activeTheme.dark
      : activeTheme?.colors;

  const previewStyles = useMemo(() => {
    if (!currentColors) return {};
    console.log(currentColors);
    console.log(previewMode);
    return {
      "--background": currentColors.background,
      "--foreground": currentColors.text,
      "--card": currentColors.surface,
      "--card-foreground": currentColors.text,
      "--popover": currentColors.surface,
      "--popover-foreground": currentColors.text,
      "--primary": currentColors.primary,
      "--primary-foreground": currentColors.textInverse,
      "--secondary": currentColors.secondary,
      "--secondary-foreground": currentColors.textInverse,
      "--muted": currentColors.surface,
      "--muted-foreground": currentColors.textMuted,
      "--accent": currentColors.accent,
      "--accent-foreground": currentColors.textInverse,
      "--border": currentColors.border,
      "--input": currentColors.border,
      "--ring": currentColors.primary,
      "--radius": "0.5rem",
      "--destructive": currentColors.error,
      "--destructive-foreground": currentColors.textInverse,
      "--success": currentColors.success,
    } as React.CSSProperties;
  }, [currentColors]);

  const filteredCategories = useMemo(() => {
    if (!search.trim()) return categories;
    return categories
      .map((cat) => ({
        ...cat,
        themes: cat.themes.filter((t) =>
          t.name.toLowerCase().includes(search.toLowerCase())
        ),
      }))
      .filter((cat) => cat.themes.length > 0);
  }, [categories, search]);

  const handleCopyToClipboard = () => {
    if (activeTheme) {
      navigator.clipboard.writeText(ThemeEngine.toCss(activeTheme));
      setCopyStatus("Copied!");
      setTimeout(() => setCopyStatus("Copy"), 2000);
    }
  };

  const handleExportClick = () => {
    setShowCssDialog(true);
  };


  useEffect(() => {
    if (!theme) return;


    const currentColors = previewMode === 'dark' && theme.dark ? theme.dark : theme.colors;
    const root = document.documentElement;


    // Apply Docusaurus CSS variables
    root.style.setProperty('--ifm-color-primary', currentColors.primary);
   root.style.setProperty('--ifm-background-color', currentColors.background);
  }, [theme, previewMode]);
  
  const handleThemeChange = (t: ThemeConfig) => {
    setTheme(t);
    setCustomColors({
    primary: t.colors.primary,
    secondary: t.colors.secondary,
    accent: t.colors.accent,
  });
  };

  if (isLoading)
    return (
      <div className="flex h-64 items-center justify-center gap-2">
        <Loader2 className="animate-spin h-6 w-6" />
        <span>Loading themes...</span>
      </div>
    );

  return (
    <div
      className="space-y-8 my-8 text-foreground"
      style={previewStyles}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Explore Themes</CardTitle>
              <CardDescription>
                Browse our curated theme collections.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <input
                placeholder="Search themes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-3 py-2 border rounded-md bg-transparent"
              />
              <div className="flex gap-4" style={{ minHeight: "300px" }}>
                <div
                  className="w-1/2 border-r pr-4"
                  style={{ borderColor: "var(--border)" }}
                >
                  <p className="text-sm font-semibold mb-3">Categories</p>
                  <div className="flex flex-col gap-1">
                    {filteredCategories.map((category) => (
                      <button
                        key={category.name}
                        onClick={() => setSelectedCategoryName(category.name)}
                        className={`w-full text-left p-2 rounded-md text-xs transition ${
                          selectedCategoryName === category.name
                            ? "bg-primary/10 text-primary font-semibold"
                            : "hover:bg-muted/50"
                        }`}
                      >
                        {category.name}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="w-1/2">
                  <AutoGrid minItemWidth="100px" gap="normal">
                    {filteredCategories
                      .find((c) => c.name === selectedCategoryName)
                      ?.themes.map((t) => (
                        <div
                          key={t.id}
                          onClick={() => handleThemeChange(t)}
                          className={`p-2 rounded-md border cursor-pointer transition ${
                            theme && t.id === theme.id && t.id !== "custom"
                              ? "ring-2 ring-primary border-transparent"
                              : "hover:border-primary/40"
                          }`}
                          style={{
                            borderColor:
                              theme && t.id === theme.id && t.id !== "custom"
                                ? "transparent"
                                : "var(--border)",
                          }}
                        >
                          <div className="flex mb-2 rounded overflow-hidden h-10">
                            <div
                              className="w-1/3"
                              style={{ background: t.colors.primary }}
                            />
                            <div
                              className="w-1/3"
                              style={{ background: t.colors.secondary }}
                            />
                            <div
                              className="w-1/3"
                              style={{ background: t.colors.accent }}
                            />
                          </div>
                          <p className="font-medium text-xs text-center">
                            {t.name}
                          </p>
                        </div>
                      ))}
                  </AutoGrid>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Customize Colors</CardTitle>
              <CardDescription>
                Adjust colors and test accessibility.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <ColorInput
                label="Primary"
                value={customColors.primary}
                onChange={(val) => handleColorChange("primary", val)}
              />
              <ColorInput
                label="Secondary"
                value={customColors.secondary}
                onChange={(val) => handleColorChange("secondary", val)}
              />
              <ColorInput
                label="Accent"
                value={customColors.accent}
                onChange={(val) => handleColorChange("accent", val)}
              />
              <Tabs
                options={["AA", "AAA"]}
                selected={contrastLevel === "AA" ? 0 : 1}
                value={(idx) => setContrastLevel(idx === 0 ? "AA" : "AAA")}
                variant="underline"
              />
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex flex-row items-center justify-between w-full">
                  <p>Preview</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExportClick}
                  >
                  Export CSS
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0 lg:p-6 bg-muted/20 overflow-hidden">
              <div className="w-full max-w-6xl mx-auto bg-muted/30 rounded-2xl border-8 border-muted p-1 sm:p-2 lg:p-4 shadow-lg">
                <div className="w-full h-full rounded-lg overflow-hidden bg-background">
                  <div className="w-full h-full bg-background text-foreground font-sans p-4 sm:p-6 lg:p-8 overflow-y-auto">
                    <div className="text-center my-8">
                      <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                        Ignite Your UI
                      </h1>
                      <p className="text-lg text-muted-foreground mt-2 max-w-md mx-auto">
                        A beautiful showcase of what you can build with this
                        theme.
                      </p>
                      <div className="mt-8 flex gap-4 justify-center">
                        <Button size="lg">Get Started</Button>
                        <Button size="lg" variant="secondary">
                          Learn More
                        </Button>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6 my-16">
                      <div className="p-6 rounded-lg bg-card border border-border text-center">
                        <div className="w-12 h-12 rounded-lg bg-accent text-accent-foreground inline-flex items-center justify-center mb-4">
                          <Zap size={24} />
                        </div>
                        <h3 className="font-bold mb-2">Blazing Fast</h3>
                        <p className="text-sm text-muted-foreground">
                          Optimized for performance and speed.
                        </p>
                      </div>
                      <div className="p-6 rounded-lg bg-card border border-border text-center">
                        <div className="w-12 h-12 rounded-lg bg-accent text-accent-foreground inline-flex items-center justify-center mb-4">
                          <Box size={24} />
                        </div>
                        <h3 className="font-bold mb-2">Fully Modular</h3>
                        <p className="text-sm text-muted-foreground">
                          Easily customizable and extendable.
                        </p>
                      </div>
                      <div className="p-6 rounded-lg bg-card border border-border text-center">
                        <div className="w-12 h-12 rounded-lg bg-accent text-accent-foreground inline-flex items-center justify-center mb-4">
                          <Gift size={24} />
                        </div>
                        <h3 className="font-bold mb-2">Free to Use</h3>
                        <p className="text-sm text-muted-foreground">
                          Open source and free for everyone.
                        </p>
                      </div>
                    </div>

                    <div className="max-w-md mx-auto my-16 p-6 bg-muted/50 rounded-lg border border-border">
                      <h2 className="text-2xl font-bold text-center mb-6">
                        Contact Us
                      </h2>
                      <div className="space-y-4">
                        <input
                          type="text"
                          placeholder="Your Name"
                          className="w-full p-3 rounded-md bg-card border-border"
                        />
                        <input
                          type="email"
                          placeholder="Your Email"
                          className="w-full p-3 rounded-md bg-card border-border"
                        />
                        <Button className="w-full" size="lg">
                          Submit
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
{/* 
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Generated CSS Variables</CardTitle>
                <CardDescription>
                  Ready to use in your project.
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExportClick}
                >
                  Export CSS
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyToClipboard}
                >
                  <Clipboard size={14} className="mr-2" />
                  {copyStatus}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <pre className="p-4 rounded-md overflow-x-auto text-sm bg-muted text-muted-foreground">
                {activeTheme && <code>{ThemeEngine.toCss(activeTheme)}</code>}
              </pre>
            </CardContent>
          </Card> */}
        </div>
      </div>

      <Dialog open={showCssDialog} onOpenChange={setShowCssDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] flex flex-col">
          <DialogHeader>
            <div className="flex justify-between items-center">
              <DialogTitle>Generated CSS Variables</DialogTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowCssDialog(false)}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </Button>
            </div>
          </DialogHeader>
          <div className="flex-1 overflow-auto">
            <pre className="p-4 rounded-md text-sm bg-muted text-muted-foreground">
              <code>{activeTheme ? ThemeEngine.toCss(activeTheme) : 'No theme selected'}</code>
            </pre>
          </div>
          <div className="flex justify-end pt-4 border-t">
            <Button onClick={handleCopyToClipboard}>
              <Clipboard size={16} className="mr-2" />
              {copyStatus}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

