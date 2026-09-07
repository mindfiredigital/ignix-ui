import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom';
import { Skeleton } from './index';

describe('Skeleton Component', () => {
    // 1. Shapes & Rendering
    it('renders with default rectangular variant', () => {
        const { container } = render(<Skeleton />);
        const element = container.querySelector('div') as HTMLElement;
        expect(element).toBeInTheDocument();
        expect(element).toHaveClass('rounded-xl');
    });

    it('renders with circular variant', () => {
        const { container } = render(<Skeleton variant="circular" />);
        const element = container.querySelector('div') as HTMLElement;
        expect(element).toHaveClass('rounded-full');
        expect(element).not.toHaveClass('rounded-xl');
    });

    it('renders with text variant', () => {
        const { container } = render(<Skeleton variant="text" />);
        const element = container.querySelector('div') as HTMLElement;
        expect(element).toHaveClass('rounded');
        expect(element).toHaveClass('h-4');
        expect(element).toHaveClass('w-full');
    });

    // 2. Custom Sizing
    it('applies custom width and height styles', () => {
        const { container } = render(<Skeleton width={100} height="50%" />);
        const element = container.querySelector('div') as HTMLElement;
        expect(element).toHaveStyle({
            width: '100px',
            height: '50%',
        });
    });

    // 3. Animations
    it('renders with default shimmer animation class', () => {
        const { container } = render(<Skeleton />);
        const element = container.querySelector('div') as HTMLElement;
        expect(element).toHaveClass('ignix-skeleton-shimmer');
    });

    it('renders with wave animation class when animation is wave', () => {
        const { container } = render(<Skeleton animation="wave" />);
        const element = container.querySelector('div') as HTMLElement;
        expect(element).toHaveClass('ignix-skeleton-wave');
    });

    it('applies pulse animation when animation is pulse', () => {
        const { container } = render(<Skeleton animation="pulse" />);
        const element = container.querySelector('div') as HTMLElement;
        expect(element).toHaveClass('animate-pulse');
        expect(element).toHaveClass('ignix-skeleton-pulse');
    });

    it('applies no animation classes when animation is none', () => {
        const { container } = render(<Skeleton animation="none" />);
        const element = container.querySelector('div') as HTMLElement;
        expect(element).not.toHaveClass('animate-pulse');
        expect(element).not.toHaveClass('ignix-skeleton-pulse');
        expect(element).not.toHaveClass('ignix-skeleton-shimmer');
        expect(element).not.toHaveClass('ignix-skeleton-wave');
    });

    // 4. Color Themes (Animated Gradients)
    it('applies default gradient theme classes', () => {
        const { container } = render(<Skeleton colorTheme="default" animation="shimmer" />);
        const element = container.querySelector('div') as HTMLElement;
        expect(element).toHaveClass('from-slate-100');
        expect(element).toHaveClass('via-slate-200/80');
    });

    it('applies primary gradient theme classes', () => {
        const { container } = render(<Skeleton colorTheme="primary" animation="shimmer" />);
        const element = container.querySelector('div') as HTMLElement;
        expect(element).toHaveClass('from-primary/10');
        expect(element).toHaveClass('via-primary/20');
    });

    it('applies success green gradient theme classes', () => {
        const { container } = render(<Skeleton colorTheme="success" animation="shimmer" />);
        const element = container.querySelector('div') as HTMLElement;
        expect(element).toHaveClass('from-green-50');
        expect(element).toHaveClass('via-green-100');
    });

    it('applies warning amber gradient theme classes', () => {
        const { container } = render(<Skeleton colorTheme="warning" animation="shimmer" />);
        const element = container.querySelector('div') as HTMLElement;
        expect(element).toHaveClass('from-amber-50');
        expect(element).toHaveClass('via-amber-100');
    });

    it('applies danger rose gradient theme classes', () => {
        const { container } = render(<Skeleton colorTheme="danger" animation="shimmer" />);
        const element = container.querySelector('div') as HTMLElement;
        expect(element).toHaveClass('from-rose-50');
        expect(element).toHaveClass('via-rose-100');
    });

    // 5. Color Themes (Solid backgrounds when animation is none)
    it('applies solid theme classes when animation is none', () => {
        const { container: containerDefault } = render(<Skeleton colorTheme="default" animation="none" />);
        expect(containerDefault.querySelector('div') as HTMLElement).toHaveClass('bg-slate-200');

        const { container: containerPrimary } = render(<Skeleton colorTheme="primary" animation="none" />);
        expect(containerPrimary.querySelector('div') as HTMLElement).toHaveClass('bg-primary/10');

        const { container: containerSuccess } = render(<Skeleton colorTheme="success" animation="none" />);
        expect(containerSuccess.querySelector('div') as HTMLElement).toHaveClass('bg-green-100');

        const { container: containerWarning } = render(<Skeleton colorTheme="warning" animation="none" />);
        expect(containerWarning.querySelector('div') as HTMLElement).toHaveClass('bg-amber-100');

        const { container: containerDanger } = render(<Skeleton colorTheme="danger" animation="none" />);
        expect(containerDanger.querySelector('div') as HTMLElement).toHaveClass('bg-rose-100');
    });

    // 6. Ref Forwarding
    it('forwards custom ref correctly', () => {
        const ref = React.createRef<HTMLDivElement>();
        render(<Skeleton ref={ref} />);
        expect(ref.current).not.toBeNull();
        expect(ref.current?.tagName).toBe('DIV');
    });
});
