export type ToastAnimationTypes = 'slide' | 'fade' | 'bounce' | 'pop';
export type ToastVariantTypes = 'success' | 'error' | 'warning' | 'info' | 'default';

export type RGB = `rgb(${number}, ${number}, ${number})`;
export type RGBA = `rgba(${number}, ${number}, ${number}, ${number})`;
export type HEX = `#${string}`;
export type Color = RGB | RGBA | HEX | string;

export interface GradientOptions {
  start: Color;
  end: Color;
  angle?: number;
}

export const DEFAULT_GRADIENTS: Record<ToastVariantTypes, GradientOptions> = {
  success: {
    start: 'var(--success)',
    end: 'var(--success)',
    angle: 135
  },
  error: {
    start: 'var(--destructive)',
    end: 'var(--destructive)',
    angle: 135
  },
  warning: {
    start: 'var(--warning)',
    end: 'var(--warning)',
    angle: 135
  },
  info: { 
    start: 'var(--info)',
    end: 'var(--info)',
    angle: 135
  },
  default: {
    start: 'var(--primary)',
    end: 'var(--primary)',
    angle: 135
  }
};