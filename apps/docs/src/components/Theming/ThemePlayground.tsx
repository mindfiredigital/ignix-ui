"use client";

import React, { useState, useEffect } from "react";
import { ThemeEngine } from "../../themes/ThemeEngine";
import type { ThemeConfig, ContrastLevel } from "../../types/theme";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../UI/card";
import { Button } from "../UI/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../UI/select";
import { Tabs } from "../UI/tab";
import { CheckCircle, Clipboard, Sun, Moon, AlertTriangle } from "lucide-react";

// --- (Assume colorCategories is the same as your original code) ---
const colorCategories = [
  {
    name: "Modern",
    themes: [
      { name: "Ocean Blue", primary: "#2563EB", secondary: "#14B8A6", accent: "#F59E0B" },
      { name: "Forest Green", primary: "#059669", secondary: "#10B981", accent: "#F59E0B" },
      { name: "Purple Dream", primary: "#7C3AED", secondary: "#2563EB", accent: "#EC4899" },
    ],
  },
  {
    name: "Classic",
    themes: [
      { name: "Royal Blue", primary: "#4F46E5", secondary: "#7C3AED", accent: "#A78BFA" },
      { name: "Sunset Orange", primary: "#DC2626", secondary: "#F59E0B", accent: "#7C3AED" },
      { name: "Minimal Gray", primary: "#374151", secondary: "#6B7280", accent: "#9CA3AF" },
    ],
  },
];

// A more interactive color input component
const ColorInput = ({ label, value, onChange }) => (
  <div className="flex flex-col space-y-2">
    <label className="text-sm font-medium">{label}</label>
    <div className="flex items-center gap-2">
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 w-10 shrink-0 cursor-pointer appearance-none rounded-md border bg-transparent p-0"
        aria-label={`Select ${label.toLowerCase()} color`}
      />
      <input
        type="text"
        value={value.toUpperCase()}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        placeholder="#FFFFFF"
      />
    </div>
  </div>
);

// New Alert component for the live preview
const Alert = ({ variant, title, children }) => {
  const baseClasses = "flex items-start space-x-3 rounded-lg border p-4";
  const variants = {
    success: "border-green-300 bg-green-50 text-green-800 dark:border-green-700 dark:bg-green-950 dark:text-green-300",
    error: "border-red-300 bg-red-50 text-red-800 dark:border-red-700 dark:bg-red-950 dark:text-red-300",
  };
  const Icon = variant === 'success' ? CheckCircle : AlertTriangle;

  return (
    <div className={`${baseClasses} ${variants[variant]}`} role="alert">
      <Icon className="h-5 w-5" />
      <div className="flex-1 space-y-1">
        <p className="font-semibold">{title}</p>
        <p className="text-sm opacity-90">{children}</p>
      </div>
    </div>
  );
};


export default function ThemePlayground() {
  const defaultColors = {
    primary: "#ff0000",
    secondary: "#f5f5f5",
    accent: "#F59E0B",
  };

  const [theme, setTheme] = useState<ThemeConfig | null>(null);
  const [validation, setValidation] = useState<any>(null);
  const [contrastLevel, setContrastLevel] = useState<ContrastLevel>("AA");
  const [customColors, setCustomColors] = useState(defaultColors);
  const [previewMode, setPreviewMode] = useState<'light' | 'dark'>('light');
  const [copyStatus, setCopyStatus] = useState('Copy');

  useEffect(() => {
    const newTheme = ThemeEngine.createTheme({
      id: "playground-theme",
      name: "Playground Theme",
      category: "custom",
      ...customColors,
      generateDark: true,
      contrastLevel,
    });
    
    const { theme: fixedTheme, validation: newValidation } = ThemeEngine.validateAndFix(newTheme, contrastLevel);
    setTheme(fixedTheme);
    setValidation(newValidation);
  }, [customColors, contrastLevel]);

  // Apply theme colors to Docusaurus CSS variables
  useEffect(() => {
    if (!theme) return;

    const currentColors = previewMode === 'dark' && theme.dark ? theme.dark : theme.colors;
    const root = document.documentElement;

    // Apply Docusaurus CSS variables
    root.style.setProperty('--ifm-color-primary', currentColors.primary);
    // root.style.setProperty('--ifm-color-primary-dark', currentColors.primary || currentColors.primary);
    // root.style.setProperty('--ifm-color-primary-darker', currentColors.primary || currentColors.primary);
    // root.style.setProperty('--ifm-color-primary-darkest', currentColors.primary || currentColors.primary);
    // root.style.setProperty('--ifm-color-primary-light', currentColors.primary || currentColors.primary);
    // root.style.setProperty('--ifm-color-primary-lighter', currentColors.primary || currentColors.primary);
    // root.style.setProperty('--ifm-color-primary-lightest', currentColors.primary || currentColors.primary);
    
    // // Background and text colors
    // root.style.setProperty('--ifm-font-color-base', currentColors.text);
    // root.style.setProperty('--ifm-color-content', currentColors.text);
    
    // // Link colors
    // root.style.setProperty('--ifm-link-color', currentColors.primary);
    // root.style.setProperty('--ifm-link-hover-color', currentColors.primary);
    
    // // Navbar colors
    // root.style.setProperty('--ifm-navbar-background-color', currentColors.surface);
    // root.style.setProperty('--ifm-navbar-link-color', currentColors.text);
    // root.style.setProperty('--ifm-navbar-link-hover-color', currentColors.primary);
    
    // // Footer colors
    // root.style.setProperty('--ifm-footer-background-color', currentColors.surface);
    // root.style.setProperty('--ifm-footer-color', currentColors.textMuted);
    
    // // Code block colors
    // root.style.setProperty('--ifm-code-background', currentColors.surface);
    // root.style.setProperty('--ifm-code-color', currentColors.accent);

    // Cleanup function to reset on unmount (optional)
    return () => {
      // You can reset to default values here if needed
    };
  }, [theme, previewMode]);

  const handlePresetSelect = (value: string) => {
    if (!value) return;
    const [catName, themeName] = value.split(":::");
    const category = colorCategories.find((c) => c.name === catName);
    const selected = category?.themes.find((t) => t.name === themeName);
    if (selected) {
      setCustomColors({
        primary: selected.primary,
        secondary: selected.secondary,
        accent: selected.accent,
      });
    }
  };
  
  const handleCopyToClipboard = () => {
    if (theme) {
      navigator.clipboard.writeText(ThemeEngine.toCss(theme));
      setCopyStatus('Copied!');
      setTimeout(() => setCopyStatus('Copy'), 2000);
    }
  };

  if (!theme || !validation) return <div className="p-10 text-center">Generating Theme...</div>;

  const currentColors = previewMode === 'dark' && theme.dark ? theme.dark : theme.colors;
  const previewStyles = {
    '--background': currentColors.background,
    '--foreground': currentColors.text,
    '--muted': currentColors.surface,
    '--muted-foreground': currentColors.textMuted,
    '--border': currentColors.border,
    '--primary': currentColors.primary,
    '--primary-foreground': currentColors.textInverse,
    '--secondary': currentColors.secondary,
    '--secondary-foreground': currentColors.textInverse,
    '--accent': currentColors.accent,
    '--accent-foreground': currentColors.textInverse,
    '--destructive': currentColors.error,
    '--destructive-foreground': currentColors.textInverse,
    '--success': currentColors.success,
  } as React.CSSProperties;

  // Docusaurus integration: Use a simple container div. 
  // Removed outer padding, shadow, and blur to let it fit into the page flow.
  return (
    <div className="w-full space-y-8 my-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN: Controls */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Color Controls</CardTitle>
                <CardDescription>Pick a preset or craft your own.</CardDescription>
              </div>
              {/* Moved Tabs here for better grouping of controls */}
              <Tabs
                options={["AA", "AAA"]}
                selected={contrastLevel === "AA" ? 0 : 1}
                value={(index) => setContrastLevel(index === 0 ? "AA" : "AAA")}
              />
            </CardHeader>
            <CardContent className="space-y-6">
              <Select onValueChange={handlePresetSelect}>
                <SelectTrigger><SelectValue placeholder="Choose a preset..." /></SelectTrigger>
                <SelectContent>
                  {colorCategories.map((cat) => (
                    <div key={cat.name}>
                      <div className="text-xs text-muted-foreground px-2 py-1">{cat.name}</div>
                      {cat.themes.map((t) => (
                        <SelectItem key={t.name} value={`${cat.name}:::${t.name}`}>{t.name}</SelectItem>
                      ))}
                    </div>
                  ))}
                </SelectContent>
              </Select>
              
              <ColorInput label="Primary" value={customColors.primary} onChange={(v) => setCustomColors(c => ({...c, primary: v}))} />
              <ColorInput label="Secondary" value={customColors.secondary} onChange={(v) => setCustomColors(c => ({...c, secondary: v}))} />
              <ColorInput label="Accent" value={customColors.accent} onChange={(v) => setCustomColors(c => ({...c, accent: v}))} />
              
              <Button variant="outline" className="w-full" onClick={() => setCustomColors(defaultColors)}>Reset Colors</Button>
            </CardContent>
          </Card>

           <Card>
            <CardHeader>
              <CardTitle>Theme Health & Insights</CardTitle>
              <CardDescription>Real-time accessibility data.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
                <div className="flex items-center justify-between p-3 bg-muted rounded-md">
                    <span className="font-semibold">Validation Score</span>
                    <span className={`font-bold ${validation.score > 80 ? 'text-green-500' : 'text-yellow-500'}`}>{validation.score} / 100</span>
                </div>
                {validation.errors.length > 0 && (
                    <div className="text-red-600 dark:text-red-400 space-y-1 text-xs">
                        <h4 className="font-semibold text-sm">Errors:</h4>
                        <ul className="list-disc pl-5">
                            {validation.errors.map((e, i) => <li key={i}>{e}</li>)}
                        </ul>
                    </div>
                )}
                 {validation.warnings.length > 0 && (
                    <div className="text-yellow-600 dark:text-yellow-400 space-y-1 text-xs">
                        <h4 className="font-semibold text-sm">Warnings:</h4>
                        <ul className="list-disc pl-5">
                            {validation.warnings.map((w, i) => <li key={i}>{w}</li>)}
                        </ul>
                    </div>
                )}
                {validation.isValid && <p className="text-green-600 dark:text-green-400 flex items-center gap-2"><CheckCircle size={16}/> All accessibility checks passed!</p>}
            </CardContent>
          </Card>
        </div>

        {/* RIGHT COLUMN: Previews */}
        <div className="lg:col-span-2 space-y-6">
          <Card style={previewStyles}>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle style={{ color: 'var(--foreground)' }}>Live Preview</CardTitle>
                <CardDescription style={{ color: 'var(--muted-foreground)' }}>See your theme in action.</CardDescription>
              </div>
              <div className="flex items-center gap-1 rounded-lg bg-muted p-1">
                  <button onClick={() => setPreviewMode('light')} className={`p-1.5 rounded-md ${previewMode === 'light' ? 'bg-background text-black' : ''}`}><Sun size={16}/></button>
                  <button onClick={() => setPreviewMode('dark')} className={`p-1.5 rounded-md ${previewMode === 'dark' ? 'bg-background' : 'text-black'}`}><Moon size={16}/></button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 p-6 bg-background rounded-b-lg">
              <div className="p-6 rounded-xl border" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--muted)' }}>
                <h2 className="text-lg font-semibold mb-2" style={{ color: 'var(--foreground)' }}>Card Title Example</h2>
                <p className="text-sm mb-4" style={{ color: 'var(--muted-foreground)' }}>This is a sample paragraph that uses the 'muted-foreground' color for less important text.</p>
                <div className="flex flex-wrap items-center gap-3">
                  <Button style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }}>Primary</Button>
                  <Button style={{ backgroundColor: 'var(--secondary)', color: 'var(--secondary-foreground)' }}>Secondary</Button>
                  <Button variant="outline" style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}>Outline</Button>
                  <Button disabled style={{ color: 'var(--muted-foreground)' }}>Disabled</Button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Alert variant="success" title="Success Message">Your action was completed successfully.</Alert>
                  <Alert variant="error" title="Error Message">There was an issue with your submission.</Alert>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Generated CSS Variables</CardTitle>
                <CardDescription>Ready to use in your project.</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={handleCopyToClipboard}>
                <Clipboard size={14} className="mr-2"/>
                {copyStatus}
              </Button>
            </CardHeader>
            <CardContent>
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-md overflow-x-auto text-sm">
                <code>{ThemeEngine.toCss(theme)}</code>
              </pre>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}