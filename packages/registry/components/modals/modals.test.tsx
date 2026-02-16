/**
 * Unit Tests for Modal Component (Registry)
 *
 * This suite covers:
 * - Basic rendering and visibility controlled by isOpen
 * - Header, body, footer rendering
 * - Overlay click, close button, and Escape key behavior
 * - Confirm and cancel callbacks
 * - Color scheme / overrides wiring (basic smoke checks)
 *
 * @file modals.test.tsx
 */

import React from 'react';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import '@testing-library/jest-dom';

import Modal, { Modal as NamedModal, type ModalProps } from './index';

// Mock framer-motion to simplify testing by removing animations
vi.mock('framer-motion', () => ({
  motion: {
    div: React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
      ({ children, ...props }, ref) => (
        <div {...props} ref={ref}>
          {children}
        </div>
      )
    ),
    h2: React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
      ({ children, ...props }, ref) => (
        <h2 {...props} ref={ref}>
          {children}
        </h2>
      )
    ),
    button: React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
      ({ children, ...props }, ref) => (
        <button type="button" {...props} ref={ref}>
          {children}
        </button>
      )
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe('Modal (registry component)', () => {
  const defaultProps: ModalProps = {
    isOpen: true,
    onClose: vi.fn(),
    title: 'Test Modal',
    children: <p>Modal body content</p>,
  };

  beforeEach(() => {
    // Ensure body styles are clean before each test
    document.body.style.overflow = '';
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
    document.body.style.overflow = '';
  });

  it('exports Modal as both default and named export', () => {
    expect(Modal).toBeDefined();
    expect(NamedModal).toBeDefined();
    expect(Modal).toBe(NamedModal);
  });

  it('does not render anything when isOpen is false', () => {
    render(<Modal {...defaultProps} isOpen={false} />);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.queryByText('Test Modal')).not.toBeInTheDocument();
  });

  it('renders overlay, header, body, and footer when open', () => {
    render(
      <Modal
        {...defaultProps}
        showFooter
        onConfirm={vi.fn()}
      />
    );

    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();

    // Header title
    expect(screen.getByText('Test Modal')).toBeVisible();
    // Body content
    expect(screen.getByText('Modal body content')).toBeVisible();
    // Footer buttons
    expect(screen.getByText('Confirm')).toBeVisible();
    expect(screen.getByText('Cancel')).toBeVisible();
  });

  it('does not render footer when showFooter is false', () => {
    render(<Modal {...defaultProps} showFooter={false} />);

    expect(screen.queryByText('Confirm')).not.toBeInTheDocument();
    expect(screen.queryByText('Cancel')).not.toBeInTheDocument();
  });

  describe('Close behavior', () => {
    it('calls onClose when close button is clicked', async () => {
      const user = userEvent.setup();
      const onClose = vi.fn();
      render(<Modal {...defaultProps} onClose={onClose} showCloseButton />);

      const closeButton = screen.getByLabelText('Close modal');
      await user.click(closeButton);

      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('does not render close button when showCloseButton is false', () => {
      render(<Modal {...defaultProps} showCloseButton={false} />);

      expect(screen.queryByLabelText('Close modal')).not.toBeInTheDocument();
    });

    it('calls onClose when overlay is clicked and closeOnOverlayClick is true', async () => {
      const user = userEvent.setup();
      const onClose = vi.fn();
      render(<Modal {...defaultProps} onClose={onClose} closeOnOverlayClick />);

      const dialog = screen.getByRole('dialog');
      await user.click(dialog);

      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('does not call onClose from overlay click when closeOnOverlayClick is false', async () => {
      const user = userEvent.setup();
      const onClose = vi.fn();
      render(<Modal {...defaultProps} onClose={onClose} closeOnOverlayClick={false} />);

      const dialog = screen.getByRole('dialog');
      await user.click(dialog);

      expect(onClose).not.toHaveBeenCalled();
    });

    it('calls onClose when Escape key is pressed and closeOnEscape is true', () => {
      const onClose = vi.fn();
      render(<Modal {...defaultProps} onClose={onClose} closeOnEscape />);

      fireEvent.keyDown(document, { key: 'Escape' });

      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('does not call onClose on Escape when closeOnEscape is false', () => {
      const onClose = vi.fn();
      render(<Modal {...defaultProps} onClose={onClose} closeOnEscape={false} />);

      fireEvent.keyDown(document, { key: 'Escape' });

      expect(onClose).not.toHaveBeenCalled();
    });

    it('locks and restores body scroll when opened and closed', () => {
      const { rerender } = render(<Modal {...defaultProps} isOpen={true} closeOnEscape />);

      expect(document.body.style.overflow).toBe('hidden');

      rerender(<Modal {...defaultProps} isOpen={false} closeOnEscape />);

      expect(document.body.style.overflow).toBe('');
    });
  });

  describe('Confirm and cancel callbacks', () => {
    it('calls onConfirm and onClose when Confirm button is clicked', async () => {
      const user = userEvent.setup();
      const onConfirm = vi.fn();
      const onClose = vi.fn();

      render(
        <Modal
          {...defaultProps}
          onConfirm={onConfirm}
          onClose={onClose}
          showFooter
        />
      );

      const confirmButton = screen.getByText('Confirm');
      await user.click(confirmButton);

      expect(onConfirm).toHaveBeenCalledTimes(1);
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('calls onCancel and onClose when Cancel button is clicked', async () => {
      const user = userEvent.setup();
      const onCancel = vi.fn();
      const onClose = vi.fn();

      render(
        <Modal
          {...defaultProps}
          onCancel={onCancel}
          onClose={onClose}
          showFooter
        />
      );

      const cancelButton = screen.getByText('Cancel');
      await user.click(cancelButton);

      expect(onCancel).toHaveBeenCalledTimes(1);
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('does not render Confirm button when onConfirm is not provided', () => {
      render(<Modal {...defaultProps} showFooter onConfirm={undefined} />);

      // Cancel is always rendered; Confirm is conditional on onConfirm
      expect(screen.getByText('Cancel')).toBeInTheDocument();
      expect(screen.queryByText('Confirm')).not.toBeInTheDocument();
    });
  });

  describe('Color schemes and overrides', () => {
    it('applies primary color scheme by default', () => {
      render(<Modal {...defaultProps} isOpen showFooter />);

      const footer = screen.getByText('Cancel').closest('div');
      expect(footer).toBeInTheDocument();
    });

    it('accepts a different colorScheme value without crashing', () => {
      const { rerender } = render(<Modal {...defaultProps} colorScheme="success" />);

      expect(screen.getByText('Test Modal')).toBeInTheDocument();

      rerender(<Modal {...defaultProps} colorScheme="destructive" />);
      expect(screen.getByText('Test Modal')).toBeInTheDocument();
    });

    it('merges colorOverrides for footer and buttons', () => {
      render(
        <Modal
          {...defaultProps}
          showFooter
          colorOverrides={{
            footer: 'custom-footer',
            cancelButton: 'custom-cancel',
            confirmButton: 'custom-confirm',
          }}
          onConfirm={vi.fn()}
        />
      );

      const footer = screen.getByText('Cancel').closest('div');
      expect(footer).toHaveClass('custom-footer');

      const cancelButton = screen.getByText('Cancel').closest('button');
      const confirmButton = screen.getByText('Confirm').closest('button');
      expect(cancelButton).toHaveClass('custom-cancel');
      expect(confirmButton).toHaveClass('custom-confirm');
    });
  });
});

