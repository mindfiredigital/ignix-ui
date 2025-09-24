import React, { useState, useEffect } from 'react';
import {
  Component1Icon,
  DrawingPinIcon,
  MagicWandIcon,
  MixIcon,
  PlayIcon,
} from '@radix-ui/react-icons';
import { Button } from '../UI/button';
import { Slider } from '../UI/slider';
import { Switch } from '../UI/switch';
import { Breadcrumbs } from '../UI/breadcrumbs';
import { cn } from '@site/src/utils/cn';
// import { SectionTitleCapsule } from './section-title';
import { ComponentSelector } from './component-selector';

const AnimatedBreadcrumb = React.lazy(() =>
  Promise.resolve({
    default: () => {
      const [currentStep, setCurrentStep] = useState(0);
      const steps = ['Payment', 'Shipping', 'Done'];

      useEffect(() => {
        const interval = setInterval(() => {
          setCurrentStep((prev) => (prev + 1) % steps.length);
        }, 1500);
        return () => clearInterval(interval);
      }, [steps.length]);

      return (
        <div className="w-full h-full flex items-center justify-center">
          <Breadcrumbs steps={steps} currentStep={currentStep} variant="step" />
        </div>
      );
    },
  })
);

const AnimatedButtons = React.lazy(() =>
  Promise.resolve({
    default: () => {
      const [activeButton, setActiveButton] = useState(0);

      useEffect(() => {
        const interval = setInterval(() => {
          setActiveButton((prev) => (prev + 1) % 2);
        }, 1500);
        return () => clearInterval(interval);
      }, []);

      return (
        <div className="w-full h-full flex items-center justify-center">
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button
              animationVariant={activeButton === 0 ? 'wobble' : 'none'}
              className={cn(activeButton === 0 ? 'bg-green-500' : 'bg-red-500')}
            >
              {activeButton === 0 ? 'Active' : 'Inactive'}
            </Button>
            <Button
              animationVariant={activeButton === 1 ? 'pulse' : 'none'}
              className={cn(activeButton === 1 ? 'bg-green-500' : 'bg-red-500')}
            >
              {activeButton === 1 ? 'Active' : 'Inactive'}
            </Button>
          </div>
        </div>
      );
    },
  })
);

const AnimatedSlider = React.lazy(() =>
  Promise.resolve({
    default: () => {
      const [value, setValue] = useState(30);
      const [isIncreasing, setIsIncreasing] = useState(true);

      useEffect(() => {
        const interval = setInterval(() => {
          setValue((prev) => {
            if (prev >= 90) {
              setIsIncreasing(false);
              return 89;
            } else if (prev <= 10) {
              setIsIncreasing(true);
              return 11;
            }
            return isIncreasing ? prev + 10 : prev - 10;
          });
        }, 1000);
        return () => clearInterval(interval);
      }, [isIncreasing]);

      return (
        <div className="w-full max-w-sm">
          <Slider
            value={[value]}
            onValueChange={([v]) => setValue(v)}
            animationType="breathe"
            showValue
            valueSuffix="%"
            glowEffect
          />
          <Slider
            value={[value]}
            onValueChange={([v]) => setValue(v)}
            animationType="breathe"
            showValue
            valueSuffix="%"
            glowEffect
            variant="retro"
          />
        </div>
      );
    },
  })
);

const AnimatedSwitches = React.lazy(() =>
  Promise.resolve({
    default: () => {
      const [activeSwitch, setActiveSwitch] = useState(0);

      useEffect(() => {
        const interval = setInterval(() => {
          setActiveSwitch((prev) => (prev + 1) % 2);
        }, 1500);
        return () => clearInterval(interval);
      }, []);

      return (
        <div className="flex items-center justify-center gap-8 p-4">
          <Switch
            variant="ios"
            animation={activeSwitch === 0 ? 'bounce' : 'default'}
            checked={activeSwitch === 0}
          />
          <Switch
            variant="square"
            animation={activeSwitch === 1 ? 'jelly' : 'default'}
            checked={activeSwitch === 1}
          />
        </div>
      );
    },
  })
);

const demoComponents = [
  {
    id: 'buttons',
    title: 'Animated Buttons',
    description: 'Engage users with interactive, animated buttons for every occasion.',
    icon: Component1Icon,
    href: '/docs/components/button',
    demo: <AnimatedButtons />,
  },
  {
    id: 'sliders',
    title: 'Interactive Sliders',
    description: 'Allow users to select values with our sleek and customizable sliders.',
    icon: MixIcon,
    href: '/docs/components/slider',
    demo: (
      <div className="w-full h-full flex items-center justify-center">
        <AnimatedSlider />
      </div>
    ),
  },
  {
    id: 'switches',
    title: 'Tactile Switches',
    description: 'Modern, satisfying toggle switches with built-in animations.',
    icon: MagicWandIcon,
    href: '/docs/components/switch',
    demo: (
      <div className="w-full h-full flex items-center justify-center">
        <AnimatedSwitches />
      </div>
    ),
  },
  {
    id: 'breadcrumbs',
    title: 'Breadcrumbs',
    description: 'Guide and inform users with stylish status indicators and navigation aids.',
    icon: DrawingPinIcon,
    href: '/docs/components/breadcrumb',
    demo: (
      <div className="flex flex-col items-center justify-center gap-4 p-2 w-full h-full">
        <AnimatedBreadcrumb />
      </div>
    ),
  },
];

// Main Component
export default function ComponentShowcase() {
  const [activeDemo, setActiveDemo] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setActiveDemo((prev) => (prev + 1) % demoComponents.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <>
      {/* Keep your existing helper styles exactly as-is */}
      <style>{`
        .bg-gradient-showcase {
          background: linear-gradient(to right, var(--ifm-color-primary-light), var(--ifm-color-primary));
        }
      `}</style>

      {/* Spacing/container adjusted to match the example; colors unchanged */}
      <section className="relative py-12 px-4 overflow-hidden" aria-label="Featured components">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-black/0 rounded-full blur-3xl animate-float" />
          <div
            className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-black/0 rounded-full blur-3xl animate-float"
            style={{ animationDelay: '2s' }}
          />
          <div
            className="absolute top-1/2 right-1/4 w-64 h-64 bg-black/0 rounded-full blur-3xl animate-float"
            style={{ animationDelay: '4s' }}
          />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Header spacing only */}
          {/* <section
            className="relative rounded-3xl mb-16 bg-transparent p-4 lg:px-24"
            aria-label="Featured components"
          > */}
          <header className="mb-8">
            <h1 className="font-semibold tracking-tight text-3xl sm:text-4xl lg:text-5xl leading-[1.08] text-foreground text-center">
              Featured <span className="text-primary">Components</span>
            </h1>
            <p className="text-center text-muted-foreground">
              Explore our collection of high-quality, ready-to-use components.
            </p>
          </header>

          {/* Mobile selector with margin to breathe */}
          <div className="mb-10">
            <ComponentSelector
              components={demoComponents.map(({ id, title, icon }) => ({ id, title, icon }))}
              activeIndex={activeDemo}
              onSelect={setActiveDemo}
            />
          </div>

          {/* Main grid spacing only (gap-12, items-center, order retained) */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Demo Display */}
            <div className="order-2 lg:order-1">
              <div className="group h-96 relative overflow-hidden bg-gradient-to-br from-primary/5 via-background/30 to-primary/5 dark:from-primary/10 dark:via-background/40 dark:to-primary/10 border border-border/20 rounded-2xl shadow-lg transition-all duration-500 hover:shadow-xl hover:-translate-y-1 hover:border-primary/30">
                {/* Animated gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute inset-0" />
                {/* Title Bar */}
                <div className="absolute top-0 left-0 right-0 h-10 flex items-center px-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    {React.createElement(demoComponents[activeDemo].icon, { className: 'h-4 w-4' })}
                    <span>{demoComponents[activeDemo].title}</span>
                  </div>
                </div>
                {/* Demo Content with p-8 and pt-14 for bar clearance */}
                <div className="absolute inset-0 flex items-center justify-center p-8 pt-14">
                  <div key={activeDemo} className="w-full h-full flex items-center justify-center">
                    {demoComponents[activeDemo].demo}
                  </div>
                </div>
                <div className="absolute top-4 right-4 z-20">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="bg-background/10 hover:bg-background/20"
                  >
                    <PlayIcon className={`h-4 w-4 ${isPlaying ? 'animate-pulse' : ''}`} />
                  </Button>
                </div>
              </div>
            </div>

            {/* Desktop Component List - spacing only (space-y-4, p-6, rounded-2xl) */}
            <div className="hidden lg:block order-1 lg:order-2 space-y-4">
              {demoComponents.map((component, index) => (
                <div
                  key={component.id}
                  className={cn(
                    'cursor-pointer transition-all duration-500 rounded-2xl',
                    activeDemo === index
                      ? 'border border-primary/50 bg-background/10 scale-105'
                      : 'hover:border-white/30'
                  )}
                  onClick={() => setActiveDemo(index)}
                >
                  <div className="p-6">
                    <div className="flex items-center gap-4">
                      <div
                        className={cn(
                          'p-3 rounded-xl transition-all duration-300',
                          activeDemo === index
                            ? 'bg-gradient-showcase text-white'
                            : 'bg-background/10 text-muted-foreground'
                        )}
                      >
                        <component.icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <span
                          className={cn(
                            'font-semibold transition-colors duration-300',
                            activeDemo === index ? 'text-primary-light' : ''
                          )}
                        >
                          {component.title}
                        </span>
                        <p className="text-sm text-muted-foreground">{component.description}</p>
                      </div>
                      <div
                        className={cn(
                          'transition-all duration-300',
                          activeDemo === index ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
                        )}
                      >
                        <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
