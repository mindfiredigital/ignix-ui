import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, afterEach } from 'vitest';
import '@testing-library/jest-dom';

import { Drawer, type DrawerProps } from '.';

// Mock framer-motion to simplify testing by removing animations
vi.mock('framer-motion', async () => {
  const actual = await vi.importActual('framer-motion');
  return {
    ...actual,
    motion: {
      div: React.forwardRef(({ ...props }, ref: React.Ref<HTMLDivElement>) => (
        <div {...props} ref={ref} />
      )),
    },
    AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  };
});

// Mock createPortal to render content within the test container instead of document.body
vi.mock('react-dom', async () => {
    const actual = await vi.importActual('react-dom');
    return {
        ...actual,
        createPortal: (node: React.ReactNode) => node,
    };
});


describe('Drawer', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  const defaultProps: DrawerProps = {
    isOpen: true,
    onClose: vi.fn(),
    children: <div>Drawer Content</div>,
  };

  it('does not render when isOpen is false', () => {
    render(<Drawer {...defaultProps} isOpen={false} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders correctly with title, children, and footer when isOpen is true', () => {
    render(
      <Drawer
        {...defaultProps}
        title="My Drawer"
        footer={<p>Footer Info</p>}
      >
        <p>Main Content</p>
      </Drawer>
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('My Drawer')).toBeVisible();
    expect(screen.getByText('Main Content')).toBeVisible();
    expect(screen.getByText('Footer Info')).toBeVisible();
  });

  describe('Interactions and Callbacks', () => {
    it('calls onClose when the close button is clicked', async () => {
      const user = userEvent.setup();
      const onCloseMock = vi.fn();
      render(<Drawer {...defaultProps} onClose={onCloseMock} title="Drawer Title" />);

      const closeButton = screen.getByLabelText('Close drawer');
      await user.click(closeButton);

      expect(onCloseMock).toHaveBeenCalledTimes(1);
    });

    it('calls onClose when the overlay is clicked', async () => {
      const user = userEvent.setup();
      const onCloseMock = vi.fn();
      render(<Drawer {...defaultProps} onClose={onCloseMock} />);
      
      // The overlay is the first child div of the dialog
      const overlay = screen.getByRole('dialog')?.firstChild as HTMLElement;
      await user.click(overlay);

      expect(onCloseMock).toHaveBeenCalledTimes(1);
    });

    it('does not call onClose on overlay click when closeOnOverlayClick is false', async () => {
      const user = userEvent.setup();
      const onCloseMock = vi.fn();
      render(<Drawer {...defaultProps} onClose={onCloseMock} closeOnOverlayClick={false} />);

      const overlay = screen.getByRole('dialog')?.firstChild as HTMLElement;
      await user.click(overlay);

      expect(onCloseMock).not.toHaveBeenCalled();
    });

    it('calls onClose when the "Escape" key is pressed', () => {
      const onCloseMock = vi.fn();
      render(<Drawer {...defaultProps} onClose={onCloseMock} />);

      fireEvent.keyDown(document, { key: 'Escape' });

      expect(onCloseMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('Props and Customization', () => {
    it('does not render the overlay when showOverlay is false', () => {
      render(<Drawer {...defaultProps} showOverlay={false} />);
      const dialog = screen.getByRole('dialog');
      // The overlay is identified by its `aria-hidden` attribute
      expect(dialog.querySelector('[aria-hidden="true"]')).not.toBeInTheDocument();
    });

    it('applies custom className to the drawer panel', () => {
      render(<Drawer {...defaultProps} className="my-custom-drawer" />);
      const drawerPanel = screen.getByText('Drawer Content').parentElement?.parentElement;
      expect(drawerPanel).toHaveClass('my-custom-drawer');
    });

    it.each([
      ['left', 'width', '400px', 'left: 0px;'],
      ['right', 'width', '30%', 'right: 0px;'],
      ['top', 'height', '200px', 'top: 0px;'],
      ['bottom', 'height', '50vh', 'bottom: 0px;'],
    ])('applies correct styles for position="%s" and size', (position, sizeProp, sizeValue, expectedStyle) => {
      render(
        <Drawer
          {...defaultProps}
          position={position as DrawerProps['position']}
          size={sizeValue}
        />
      );
      const drawerPanel = screen.getByText('Drawer Content').parentElement?.parentElement;
      expect(drawerPanel).toHaveStyle(expectedStyle);
      expect(drawerPanel).toHaveStyle(`${sizeProp}: ${sizeValue}`);
    });
  });

  describe('Accessibility', () => {
    it('has correct ARIA attributes when a title is provided', () => {
      render(<Drawer {...defaultProps} title="Contact Form" />);
      const dialog = screen.getByRole('dialog');
      const title = screen.getByText('Contact Form');

      expect(dialog).toHaveAttribute('aria-modal', 'true');
      expect(title).toHaveAttribute('id', 'drawer-title');
      expect(dialog).toHaveAttribute('aria-labelledby', 'drawer-title');
    });

    it('does not have aria-labelledby when title is not provided', () => {
      render(<Drawer {...defaultProps} />);
      const dialog = screen.getByRole('dialog');
      expect(dialog).not.toHaveAttribute('aria-labelledby');
    });
  });
});