import { useState } from 'react';
import { useToast } from "./use-toast";
import { 
  CheckCircledIcon, 
  CrossCircledIcon, 
  ExclamationTriangleIcon, 
  InfoCircledIcon,
  SunIcon,
  MoonIcon,
  MagicWandIcon,
  ClockIcon
} from "@radix-ui/react-icons";

// Simple Toast Demo for main preview
export const SimpleToastDemo = () => {
  const toast = useToast();
  
  const showToast = (): void => {
    toast.addToast({
      message: "Hello from Toast!",
      variant: "info",
      animation: "slide",
      icon: <InfoCircledIcon className="w-5 h-5" />
    });
  };
  
  return (
    <button
      onClick={showToast}
      className="px-6 py-3 bg-primary text-white rounded-md hover:bg-primary/80 flex items-center justify-center gap-2"
    >
      <InfoCircledIcon className="w-5 h-5" />
      Show Toast
    </button>
  );
};

// Basic Toast Types Demo
export const BasicToastDemo = () => {
  const toast = useToast();
  
  const showToast = (variant: 'success' | 'error' | 'warning' | 'info') => {
    const icons = {
      success: <CheckCircledIcon className="w-5 h-5" />,
      error: <CrossCircledIcon className="w-5 h-5" />,
      warning: <ExclamationTriangleIcon className="w-5 h-5" />,
      info: <InfoCircledIcon className="w-5 h-5" />
    };
    
    toast.addToast({
      message: `${variant.charAt(0).toUpperCase() + variant.slice(1)} message`,
      variant,
      animation: 'slide',
      mode: 'light',
      icon: icons[variant]
    });
  };
  
  return (
    <div className="grid grid-cols-2 gap-4">
      <button
        onClick={() => showToast('success')}
        className="px-6 py-3 bg-green-500 text-white rounded-md hover:bg-green-600 flex items-center justify-center gap-2"
      >
        <CheckCircledIcon className="w-5 h-5" />
        Success Toast
      </button>
      <button
        onClick={() => showToast('error')}
        className="px-6 py-3 bg-red-500 text-white rounded-md hover:bg-red-600 flex items-center justify-center gap-2"
      >
        <CrossCircledIcon className="w-5 h-5" />
        Error Toast
      </button>
      <button
        onClick={() => showToast('warning')}
        className="px-6 py-3 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 flex items-center justify-center gap-2"
      >
        <ExclamationTriangleIcon className="w-5 h-5" />
        Warning Toast
      </button>
      <button
        onClick={() => showToast('info')}
        className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center justify-center gap-2"
      >
        <InfoCircledIcon className="w-5 h-5" />
        Info Toast
      </button>
    </div>
  );
};

// Animation Demo
export const AnimationDemo = () => {
  const toast = useToast();
  const animations = ['slide', 'fade', 'bounce', 'pop'] as const;
  
  return (
    <div className="grid grid-cols-2 gap-4">
      {animations.map((anim) => (
        <button
          key={anim}
          onClick={() => {
            toast.addToast({
              message: `${anim} animation`,
              variant: "info",
              animation: anim,
              mode: "light",
              icon: <InfoCircledIcon className="w-5 h-5" />
            });
          }}
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
        >
          {anim.charAt(0).toUpperCase() + anim.slice(1)} Animation
        </button>
      ))}
    </div>
  );
};

// Appearance Demo
export const AppearanceDemo = () => {
  const toast = useToast();
  
  return (
    <div className="flex gap-4">
      <button
        onClick={() => {
          toast.addToast({
            message: "Glow effect toast",
            variant: "info",
            animation: "slide",
            mode: "light",
            appearance: "glow",
            icon: <InfoCircledIcon className="w-5 h-5" />
          });
        }}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Glow Effect
      </button>
      
      <button
        onClick={() => {
          toast.addToast({
            message: "Gradient effect toast",
            variant: "info",
            animation: "slide",
            mode: "light",
            appearance: "gradient",
            gradientColor: "rgba(59, 130, 246, 1)",
            icon: <InfoCircledIcon className="w-5 h-5" />
          });
        }}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Gradient Effect
      </button>
    </div>
  );
};

// Theme Demo
export const ThemeDemo = () => {
  const toast = useToast();
  const [mode, setMode] = useState<'light' | 'dark'>('light');

  return (
    <div className={`p-4 rounded ${mode === 'light' ? 'bg-white' : 'bg-gray-800'}`}>
      <div className="flex gap-4 mb-4">
        <button
          onClick={() => {
            setMode(m => m === 'light' ? 'dark' : 'light');
          }}
          className={`px-4 py-2 rounded flex items-center gap-2 ${
            mode === 'light' 
              ? 'bg-gray-800 text-white' 
              : 'bg-yellow-400 text-gray-900'
          }`}
        >
          {mode === 'light' ? (
            <><MoonIcon className="w-4 h-4" /> Dark Mode</>
          ) : (
            <><SunIcon className="w-4 h-4" /> Light Mode</>
          )}
        </button>
        <button
          onClick={() => {
            toast.addToast({
              message: "Theme demo message",
              variant: "info",
              animation: "slide",
              mode,
              icon: <InfoCircledIcon className="w-5 h-5" />
            });
          }}
          className={`px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600`}
        >
          Show Toast
        </button>
      </div>
    </div>
  );
};

// Full Featured Demo
export const FullFeaturedDemo = () => {
  const toast = useToast();
  const [mode, setMode] = useState<'light' | 'dark'>('light');
  const [animation, setAnimation] = useState<'slide' | 'fade' | 'bounce' | 'pop'>('slide');
  const [appearance, setAppearance] = useState<'glow' | 'gradient'>('gradient');
  const [customDuration, setCustomDuration] = useState(4000);
  const [customMessage, setCustomMessage] = useState('Custom message here');

  const showToast = (variant: 'success' | 'error' | 'warning' | 'info', message?: string) => {
    const icons = {
      success: <CheckCircledIcon className="w-5 h-5" />,
      error: <CrossCircledIcon className="w-5 h-5" />,
      warning: <ExclamationTriangleIcon className="w-5 h-5" />,
      info: <InfoCircledIcon className="w-5 h-5" />
    };

    const gradientColors = {
      success: 'rgba(34, 197, 94, 1)',
      error: 'rgba(239, 68, 68, 1)',
      warning: 'rgba(234, 179, 8, 1)',
      info: 'rgba(59, 130, 246, 1)'
    };

    toast.addToast({
      message: message || `${variant.charAt(0).toUpperCase() + variant.slice(1)} message`,
      variant,
      animation,
      mode,
      icon: icons[variant],
      appearance,
      gradientColor: gradientColors[variant],
      duration: customDuration
    });
  };

  return (
    <div className={`p-6 rounded-lg ${mode === 'light' ? 'bg-white' : 'bg-gray-900'} shadow-lg`}>
      <div className="mb-6">
        <h2 className={`text-xl font-bold mb-4 ${mode === 'light' ? 'text-gray-900' : 'text-white'}`}>Toast Demo</h2>
        
        <div className="flex flex-wrap gap-4 mb-6">
          <button
            onClick={() => setMode(m => m === 'light' ? 'dark' : 'light')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md ${
              mode === 'light' 
                ? 'bg-gray-800 text-white' 
                : 'bg-yellow-400 text-gray-900'
            }`}
          >
            {mode === 'light' ? (
              <><MoonIcon className="w-4 h-4" /> Dark Mode</>
            ) : (
              <><SunIcon className="w-4 h-4" /> Light Mode</>
            )}
          </button>
          
          <button
            onClick={() => setAppearance(a => a === 'glow' ? 'gradient' : 'glow')}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-md"
          >
            <MagicWandIcon className="w-4 h-4" />
            {appearance === 'glow' ? 'Glow' : 'Gradient'} Effect
          </button>
        </div>

        <div className="mb-6">
          <h3 className={`text-lg font-semibold mb-2 ${mode === 'light' ? 'text-gray-900' : 'text-white'}`}>Animation</h3>
          <div className="flex flex-wrap gap-2">
            {['slide', 'fade', 'bounce', 'pop'].map((anim) => (
              <button
                key={anim}
                onClick={() => setAnimation(anim as any)}
                className={`px-3 py-1 rounded-md ${
                  animation === anim
                    ? 'bg-blue-600 text-white'
                    : mode === 'light'
                      ? 'bg-gray-200 hover:bg-gray-300 text-gray-900'
                      : 'bg-gray-700 hover:bg-gray-600 text-white'
                }`}
              >
                {anim.charAt(0).toUpperCase() + anim.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <h3 className={`text-lg font-semibold mb-2 ${mode === 'light' ? 'text-gray-900' : 'text-white'}`}>
            Duration: {customDuration}ms
          </h3>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="1000"
              max="10000"
              step="500"
              value={customDuration}
              onChange={(e) => setCustomDuration(Number(e.target.value))}
              className="flex-1"
            />
            <div className={`text-sm ${mode === 'light' ? 'text-gray-500' : 'text-gray-400'} flex items-center`}>
              <ClockIcon className="w-4 h-4 mr-1" />
              {customDuration / 1000}s
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className={`text-lg font-semibold mb-2 ${mode === 'light' ? 'text-gray-900' : 'text-white'}`}>Custom Message</h3>
          <div className="flex gap-2">
            <input
              type="text"
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              className={`flex-1 px-3 py-2 border rounded-md ${
                mode === 'light'
                  ? 'border-gray-300 bg-white text-gray-900'
                  : 'border-gray-600 bg-gray-800 text-white'
              }`}
              placeholder="Enter custom message"
            />
            <button
              onClick={() => showToast('info', customMessage)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Show Toast
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={() => showToast('success')}
          className="px-6 py-3 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
        >
          <CheckCircledIcon className="w-5 h-5" />
          Success Toast
        </button>
        
        <button
          onClick={() => showToast('error')}
          className="px-6 py-3 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
        >
          <CrossCircledIcon className="w-5 h-5" />
          Error Toast
        </button>
        
        <button
          onClick={() => showToast('warning')}
          className="px-6 py-3 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors flex items-center justify-center gap-2"
        >
          <ExclamationTriangleIcon className="w-5 h-5" />
          Warning Toast
        </button>
        
        <button
          onClick={() => showToast('info')}
          className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
        >
          <InfoCircledIcon className="w-5 h-5" />
          Info Toast
        </button>
      </div>
    </div>
  );
};
