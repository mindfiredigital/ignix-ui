import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Info, CheckCircle2, Trash2 } from 'lucide-react';
import {
  Modal,
  type ModalProps,
  type ModalColorScheme,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from './index';
import { cn } from '../../../utils/cn';
import { Button } from '../button';

/**
 * Meta configuration for Modal component stories
 */
const meta: Meta<typeof Modal> = {
  title: 'Components/Modals',
  component: Modal,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
The **Modal** component is a flexible dialog component that displays content in an overlay.
It supports keyboard navigation, overlay clicks, and customizable header, body, and footer sections.

### Features
- Modal overlay with backdrop blur
- Header with optional title and close button (X)
- Scrollable body content
- Footer with action buttons (confirm, cancel)
- Keyboard support: Escape key closes modal
- Overlay clickable to close
- Multiple size variants
- **Color schemes**: \`primary\`, \`accent\`, \`success\`, \`warning\`, \`destructive\`, \`info\`
- **Color overrides**: optional Tailwind classes per area (overlay, backdrop, content, header, body, footer, closeButton, cancelButton, confirmButton)
- Fully accessible with ARIA attributes
- Optimized re-rendering with React.memo and useCallback

### Usage
The Modal component requires controlled state management. Use \`isOpen\` to control visibility
and \`onClose\` callback to handle closing the modal.
        `,
      },
    },
  },
  argTypes: {
    isOpen: {
      control: 'boolean',
      description: 'Whether the modal is open',
    },
    onClose: {
      action: 'closed',
      description: 'Callback function called when modal should close',
    },
    onConfirm: {
      action: 'confirmed',
      description: 'Callback function called when confirm button is clicked',
    },
    onCancel: {
      action: 'cancelled',
      description: 'Callback function called when cancel button is clicked',
    },
    title: {
      control: 'text',
      description: 'Title text displayed in the header',
    },
    confirmText: {
      control: 'text',
      description: 'Text for the confirm button',
    },
    cancelText: {
      control: 'text',
      description: 'Text for the cancel button',
    },
    showFooter: {
      control: 'boolean',
      description: 'Whether to show the footer with action buttons',
    },
    showCloseButton: {
      control: 'boolean',
      description: 'Whether to show the close button (X)',
    },
    closeOnOverlayClick: {
      control: 'boolean',
      description: 'Whether clicking the overlay closes the modal',
    },
    closeOnEscape: {
      control: 'boolean',
      description: 'Whether pressing Escape closes the modal',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl', 'full'],
      description: 'Size variant of the modal',
    },
    headerIcon: {
      control: false,
      description: 'Optional icon rendered to the left of the title in the header',
    },
    headerIconClassName: {
      control: 'text',
      description: 'Optional Tailwind classes for the header icon wrapper',
    },
    colorScheme: {
      control: 'select',
      options: ['primary', 'accent', 'success', 'warning', 'destructive', 'info'],
      description: 'Color scheme for header, borders, and buttons',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Modal>;

/**
 * Template component that manages modal state
 */
// const ModalTemplate = (args: ModalProps) => {
//   const [isOpen, setIsOpen] = useState(false);

//   const handleOpen = useCallback(() => {
//     setIsOpen(true);
//   }, []);

//   const handleClose = useCallback(() => {
//     setIsOpen(false);
//     args.onClose?.();
//   }, [args]);

//   const handleConfirm = useCallback(() => {
//     args.onConfirm?.();
//   }, [args]);

//   const handleCancel = useCallback(() => {
//     args.onCancel?.();
//   }, [args]);

//   return (
//     <div className="p-8">
//       <Button onClick={handleOpen}>Open Modal</Button>
//       <Modal
//         {...args}
//         isOpen={isOpen}
//         onClose={handleClose}
//         onConfirm={handleConfirm}
//         onCancel={handleCancel}
//       />
//     </div>
//   );
// };

/**
 * Default modal with all features enabled
 */
// export const Default: Story = {
//   render: ModalTemplate,
//   args: {
//     title: 'Confirm Action',
//     headerIcon: <Info className="h-5 w-5 text-primary" />,
//     headerIconClassName: 'bg-primary/10 border-primary/30',
//     children: (
//       <div>
//         <p className="mb-4">
//           Are you sure you want to proceed with this action? This cannot be undone.
//         </p>
//         <p className="text-sm text-muted-foreground">
//           Please review your decision carefully before confirming.
//         </p>
//       </div>
//     ),
//     confirmText: 'Confirm',
//     cancelText: 'Cancel',
//     showFooter: true,
//     showCloseButton: true,
//     closeOnOverlayClick: true,
//     closeOnEscape: true,
//     size: 'md',
//   },
// };

/**
 * Color scheme: success (green)
 */
// export const ColorSchemeSuccess: Story = {
//   render: ModalTemplate,
//   args: {
//     title: 'Success',
//     colorScheme: 'success',
//     headerIcon: <CheckCircle2 className="h-5 w-5 text-success" />,
//     headerIconClassName: 'bg-success/10 border-success/30',
//     children: (
//       <div>
//         <p className="mb-4">Your changes have been saved successfully.</p>
//         <p className="text-sm text-muted-foreground">
//           You can close this modal to continue.
//         </p>
//       </div>
//     ),
//     confirmText: 'Done',
//     cancelText: 'Close',
//     size: 'md',
//   },
// };

/**
 * Color scheme: destructive (red)
 */
// export const ColorSchemeDestructive: Story = {
//   render: ModalTemplate,
//   args: {
//     title: 'Delete item?',
//     colorScheme: 'destructive',
//     headerIcon: <Trash2 className="h-5 w-5 text-destructive" />,
//     headerIconClassName: 'bg-destructive/10 border-destructive/30',
//     children: (
//       <div>
//         <p className="mb-4">
//           This action cannot be undone. This will permanently delete the item.
//         </p>
//         <p className="text-sm text-muted-foreground">
//           Are you sure you want to continue?
//         </p>
//       </div>
//     ),
//     confirmText: 'Delete',
//     cancelText: 'Cancel',
//     size: 'md',
//   },
// };

/**
 * Color scheme: info
 */
// export const ColorSchemeInfo: Story = {
//   render: ModalTemplate,
//   args: {
//     title: 'Information',
//     colorScheme: 'info',
//     headerIcon: <Info className="h-5 w-5 text-info" />,
//     headerIconClassName: 'bg-info/10 border-info/30',
//     children: (
//       <div>
//         <p className="mb-4">
//           Here is some helpful information. You can set \`colorScheme\` to \`primary\`, \`accent\`, \`success\`, \`warning\`, \`destructive\`, or \`info\`.
//         </p>
//         <p className="text-sm text-muted-foreground">
//           Use \`colorOverrides\` to pass custom Tailwind classes for any area.
//         </p>
//       </div>
//     ),
//     confirmText: 'Got it',
//     cancelText: 'Cancel',
//     size: 'md',
//   },
// };

/**
 * Custom colors via colorOverrides
 */
// export const CustomColorOverrides: Story = {
//   render: ModalTemplate,
//   args: {
//     title: 'Custom colors',
//     colorScheme: 'primary',
//     colorOverrides: {
//       header: 'border-b border-violet-500/30 bg-gradient-to-r from-violet-500/20 via-fuchsia-500/10 to-violet-500/20',
//       content: 'border-violet-500/30 shadow-violet-500/20 before:from-violet-500/10 before:to-fuchsia-500/10',
//       body: 'border-l-violet-500/30',
//       footer: 'border-t border-violet-500/20 bg-gradient-to-r from-fuchsia-500/5 via-violet-500/10 to-fuchsia-500/5',
//       closeButton: 'hover:text-violet-600 hover:bg-violet-500/20 focus:ring-violet-500/50',
//       cancelButton: 'hover:border-violet-500/40 focus:ring-violet-500/50',
//       confirmButton:
//         'bg-gradient-to-r from-violet-600 to-violet-500 text-white hover:from-violet-500 hover:to-violet-600 shadow-violet-500/30 border-violet-500/40 focus:ring-violet-500',
//     },
//     children: (
//       <div>
//         <p className="mb-4">
//           This modal uses \`colorOverrides\` to apply violet/fuchsia Tailwind classes.
//         </p>
//         <p className="text-sm text-muted-foreground">
//           Override any of: overlay, backdrop, content, header, body, footer, closeButton, cancelButton, confirmButton.
//         </p>
//       </div>
//     ),
//     confirmText: 'Confirm',
//     cancelText: 'Cancel',
//     size: 'md',
//   },
// };

/**
 * Small modal variant
 */
// export const Small: Story = {
//   render: ModalTemplate,
//   args: {
//     title: 'Small Modal',
//     children: <p>This is a small modal with limited content.</p>,
//     confirmText: 'OK',
//     cancelText: 'Cancel',
//     size: 'sm',
//   },
// };

/**
 * Large modal variant
 */
// export const Large: Story = {
//   render: ModalTemplate,
//   args: {
//     title: 'Large Modal',
//     children: (
//       <div>
//         <p className="mb-4">
//           This is a large modal that can accommodate more content. It's useful for
//           displaying detailed information or forms.
//         </p>
//         <div className="space-y-2">
//           <p>• Feature 1: Detailed information display</p>
//           <p>• Feature 2: Form inputs and validation</p>
//           <p>• Feature 3: Rich content with images</p>
//         </div>
//       </div>
//     ),
//     confirmText: 'Save',
//     cancelText: 'Cancel',
//     size: 'lg',
//   },
// };

/**
 * Extra large modal variant
 */
// export const ExtraLarge: Story = {
//   render: ModalTemplate,
//   args: {
//     title: 'Extra Large Modal',
//     children: (
//       <div>
//         <p className="mb-4">
//           This is an extra large modal perfect for displaying extensive content,
//           tables, or complex forms.
//         </p>
//         <div className="grid grid-cols-2 gap-4">
//           <div className="p-4 border border-border rounded-md">
//             <h3 className="font-semibold mb-2">Section 1</h3>
//             <p className="text-sm text-muted-foreground">
//               Content for the first section goes here.
//             </p>
//           </div>
//           <div className="p-4 border border-border rounded-md">
//             <h3 className="font-semibold mb-2">Section 2</h3>
//             <p className="text-sm text-muted-foreground">
//               Content for the second section goes here.
//             </p>
//           </div>
//         </div>
//       </div>
//     ),
//     confirmText: 'Submit',
//     cancelText: 'Cancel',
//     size: 'xl',
//   },
// };

/**
 * Modal without footer
 */
// export const NoFooter: Story = {
//   render: ModalTemplate,
//   args: {
//     title: 'Information Modal',
//     children: (
//       <div>
//         <p className="mb-4">
//           This modal doesn't have a footer. Users can only close it using the X button
//           or by clicking the overlay.
//         </p>
//         <p className="text-sm text-muted-foreground">
//           This is useful for informational messages that don't require user action.
//         </p>
//       </div>
//     ),
//     showFooter: false,
//     showCloseButton: true,
//   },
// };

/**
 * Modal without close button
 */
// export const NoCloseButton: Story = {
//   render: ModalTemplate,
//   args: {
//     title: 'Required Action',
//     children: (
//       <div>
//         <p className="mb-4">
//           This modal requires user interaction. The close button is hidden, so users
//           must use the action buttons or press Escape to close.
//         </p>
//       </div>
//     ),
//     showCloseButton: false,
//     confirmText: 'I Understand',
//     cancelText: 'Cancel',
//   },
// };

/**
 * Modal with custom content
 */
// export const CustomContent: Story = {
//   render: ModalTemplate,
//   args: {
//     title: 'Custom Content Modal',
//     children: (
//       <div>
//         <div className="mb-4 p-4 bg-primary/10 rounded-md">
//           <h3 className="font-semibold mb-2">Important Notice</h3>
//           <p className="text-sm">
//             This modal contains custom formatted content with styled sections.
//           </p>
//         </div>
//         <ul className="list-disc list-inside space-y-2 mb-4">
//           <li>Feature one with detailed description</li>
//           <li>Feature two with additional information</li>
//           <li>Feature three with more context</li>
//         </ul>
//         <div className="p-4 border border-border rounded-md bg-muted/50">
//           <p className="text-sm font-medium mb-1">Additional Information</p>
//           <p className="text-xs text-muted-foreground">
//             This is a custom styled section within the modal body.
//           </p>
//         </div>
//       </div>
//     ),
//     confirmText: 'Accept',
//     cancelText: 'Decline',
//   },
// };

/**
 * Modal that doesn't close on overlay click
 */
// export const NoOverlayClose: Story = {
//   render: ModalTemplate,
//   args: {
//     title: 'Important Decision',
//     children: (
//       <div>
//         <p className="mb-4">
//           This modal requires explicit action. Clicking the overlay will not close it.
//           You must use the action buttons or press Escape.
//         </p>
//         <p className="text-sm text-muted-foreground">
//           This is useful for critical actions where accidental dismissal should be prevented.
//         </p>
//       </div>
//     ),
//     closeOnOverlayClick: false,
//     confirmText: 'Proceed',
//     cancelText: 'Cancel',
//   },
// };

/**
 * Modal with long scrollable content
 */
// export const ScrollableContent: Story = {
//   render: ModalTemplate,
//   args: {
//     title: 'Terms and Conditions',
//     children: (
//       <div>
//         {Array.from({ length: 20 }, (_, i) => (
//           <p key={i} className="mb-4">
//             Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
//             tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
//             quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
//             consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
//             cillum dolore eu fugiat nulla pariatur.
//           </p>
//         ))}
//       </div>
//     ),
//     confirmText: 'I Agree',
//     cancelText: 'Cancel',
//     size: 'lg',
//   },
// };



type ModalColorSchemeConfig = {
  backdrop: string;
  content: string;
  header: string;
  body: string;
  footer: string;
  closeButton: string;
  cancelButton: string;
  confirmButton: string;
};

type ModalWithColorConfig = typeof Modal & {
  colorSchemeConfig: Record<ModalColorScheme, ModalColorSchemeConfig>;
};
/**
 * Template component that manages modal state
 */
const ModalTemplate = (args: ModalProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const colorScheme = (args.colorScheme ?? 'primary') as NonNullable<ModalProps['colorScheme']>;
  const scheme = (Modal as ModalWithColorConfig).colorSchemeConfig[colorScheme];

  const backdropClassName = cn(scheme.backdrop, args.colorOverrides?.backdrop);
  const contentClassName = cn(scheme.content, args.colorOverrides?.content, args.className);
  const headerClassName = cn(scheme.header, args.colorOverrides?.header, args.headerClassName);
  const bodyClassName = cn('border-l-4', scheme.body, args.colorOverrides?.body, args.bodyClassName);
  const footerClassName = cn(scheme.footer, args.colorOverrides?.footer, args.footerClassName);
  const closeButtonClassName = cn(scheme.closeButton, args.colorOverrides?.closeButton);
  const cancelButtonClassName = cn(scheme.cancelButton, args.colorOverrides?.cancelButton);
  const confirmButtonClassName = cn(scheme.confirmButton, args.colorOverrides?.confirmButton);

  const handleOpen = useCallback(() => {
    setIsOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    args.onClose?.();
  }, [args]);

  const handleConfirm = useCallback(() => {
    args.onConfirm?.();
    setIsOpen(false);
  }, [args]);

  const handleCancel = useCallback(() => {
    args.onCancel?.();
    setIsOpen(false);
  }, [args]);

  return (
    <div className="p-8">
      <Button onClick={handleOpen}>Open Modal</Button>

      <AnimatePresence>
        {isOpen && (
          <ModalOverlay
            closeOnOverlayClick={args.closeOnOverlayClick}
            onRequestClose={handleClose}
            className={args.overlayClassName}
            backdropClassName={backdropClassName}
          >
            <ModalContent size={args.size} className={contentClassName}>
              <ModalHeader
                title={args.title}
                icon={args.headerIcon}
                iconClassName={args.headerIconClassName}
                showCloseButton={args.showCloseButton}
                onClose={handleClose}
                className={headerClassName}
                closeButtonClassName={closeButtonClassName}
              />
              <ModalBody className={bodyClassName}>{args.children}</ModalBody>
              {args.showFooter !== false && (
                <ModalFooter
                  confirmText={args.confirmText}
                  cancelText={args.cancelText}
                  onConfirm={handleConfirm}
                  onCancel={handleCancel}
                  className={footerClassName}
                  cancelButtonClassName={cancelButtonClassName}
                  confirmButtonClassName={confirmButtonClassName}
                />
              )}
            </ModalContent>
          </ModalOverlay>
        )}
      </AnimatePresence>
    </div>
  );
};

/**
 * Default modal with all features enabled
 */
export const Default: Story = {
  render: (args) => <ModalTemplate {...args} />,
  args: {
    title: 'Confirm Action',
    headerIcon: <Info className="h-5 w-5 text-primary" />,
    headerIconClassName: 'bg-primary/10 border-primary/30',
    children: (
      <div>
        <p className="mb-4">
          Are you sure you want to proceed with this action? This cannot be undone.
        </p>
        <p className="text-sm text-muted-foreground">
          Please review your decision carefully before confirming.
        </p>
      </div>
    ),
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    showFooter: true,
    showCloseButton: true,
    closeOnOverlayClick: true,
    closeOnEscape: true,
    size: 'md',
  },
};

/**
 * Color scheme: success (green)
 */
export const ColorSchemeSuccess: Story = {
  render: (args) => <ModalTemplate {...args} />,
  args: {
    title: 'Success',
    colorScheme: 'success',
    headerIcon: <CheckCircle2 className="h-5 w-5 text-success" />,
    headerIconClassName: 'bg-success/10 border-success/30',
    children: (
      <div>
        <p className="mb-4">Your changes have been saved successfully.</p>
        <p className="text-sm text-muted-foreground">
          You can close this modal to continue.
        </p>
      </div>
    ),
    confirmText: 'Done',
    cancelText: 'Close',
    size: 'md',
  },
};

/**
 * Color scheme: destructive (red)
 */
export const ColorSchemeDestructive: Story = {
  render: (args) => <ModalTemplate {...args} />,
  args: {
    title: 'Delete item?',
    colorScheme: 'destructive',
    headerIcon: <Trash2 className="h-5 w-5 text-destructive" />,
    headerIconClassName: 'bg-destructive/10 border-destructive/30',
    children: (
      <div>
        <p className="mb-4">
          This action cannot be undone. This will permanently delete the item.
        </p>
        <p className="text-sm text-muted-foreground">
          Are you sure you want to continue?
        </p>
      </div>
    ),
    confirmText: 'Delete',
    cancelText: 'Cancel',
    size: 'md',
  },
};

/**
 * Color scheme: info
 */
export const ColorSchemeInfo: Story = {
  render: (args) => <ModalTemplate {...args} />,
  args: {
    title: 'Information',
    colorScheme: 'info',
    headerIcon: <Info className="h-5 w-5 text-info" />,
    headerIconClassName: 'bg-info/10 border-info/30',
    children: (
      <div>
        <p className="mb-4">
          Here is some helpful information. You can set \`colorScheme\` to \`primary\`, \`accent\`, \`success\`, \`warning\`, \`destructive\`, or \`info\`.
        </p>
        <p className="text-sm text-muted-foreground">
          Use \`colorOverrides\` to pass custom Tailwind classes for any area.
        </p>
      </div>
    ),
    confirmText: 'Got it',
    cancelText: 'Cancel',
    size: 'md',
  },
};

/**
 * Custom colors via colorOverrides
 */
export const CustomColorOverrides: Story = {
  render: (args) => <ModalTemplate {...args} />,
  args: {
    title: 'Custom colors',
    colorScheme: 'primary',
    colorOverrides: {
      header: 'border-b border-violet-500/30 bg-gradient-to-r from-violet-500/20 via-fuchsia-500/10 to-violet-500/20',
      content: 'border-violet-500/30 shadow-violet-500/20 before:from-violet-500/10 before:to-fuchsia-500/10',
      body: 'border-l-violet-500/30',
      footer: 'border-t border-violet-500/20 bg-gradient-to-r from-fuchsia-500/5 via-violet-500/10 to-fuchsia-500/5',
      closeButton: 'hover:text-violet-600 hover:bg-violet-500/20 focus:ring-violet-500/50',
      cancelButton: 'hover:border-violet-500/40 focus:ring-violet-500/50',
      confirmButton:
        'bg-gradient-to-r from-violet-600 to-violet-500 text-white hover:from-violet-500 hover:to-violet-600 shadow-violet-500/30 border-violet-500/40 focus:ring-violet-500',
    },
    children: (
      <div>
        <p className="mb-4">
          This modal uses \`colorOverrides\` to apply violet/fuchsia Tailwind classes.
        </p>
        <p className="text-sm text-muted-foreground">
          Override any of: overlay, backdrop, content, header, body, footer, closeButton, cancelButton, confirmButton.
        </p>
      </div>
    ),
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    size: 'md',
  },
};

/**
 * Small modal variant
 */
export const Small: Story = {
  render: (args) => <ModalTemplate {...args} />,
  args: {
    title: 'Small Modal',
    children: <p>This is a small modal with limited content.</p>,
    confirmText: 'OK',
    cancelText: 'Cancel',
    size: 'sm',
  },
};

/**
 * Large modal variant
 */
export const Large: Story = {
  render: (args) => <ModalTemplate {...args} />,
  args: {
    title: 'Large Modal',
    children: (
      <div>
        <p className="mb-4">
          This is a large modal that can accommodate more content. It's useful for
          displaying detailed information or forms.
        </p>
        <div className="space-y-2">
          <p>• Feature 1: Detailed information display</p>
          <p>• Feature 2: Form inputs and validation</p>
          <p>• Feature 3: Rich content with images</p>
        </div>
      </div>
    ),
    confirmText: 'Save',
    cancelText: 'Cancel',
    size: 'lg',
  },
};

/**
 * Extra large modal variant
 */
export const ExtraLarge: Story = {
  render: (args) => <ModalTemplate {...args} />,
  args: {
    title: 'Extra Large Modal',
    children: (
      <div>
        <p className="mb-4">
          This is an extra large modal perfect for displaying extensive content,
          tables, or complex forms.
        </p>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 border border-border rounded-md">
            <h3 className="font-semibold mb-2">Section 1</h3>
            <p className="text-sm text-muted-foreground">
              Content for the first section goes here.
            </p>
          </div>
          <div className="p-4 border border-border rounded-md">
            <h3 className="font-semibold mb-2">Section 2</h3>
            <p className="text-sm text-muted-foreground">
              Content for the second section goes here.
            </p>
          </div>
        </div>
      </div>
    ),
    confirmText: 'Submit',
    cancelText: 'Cancel',
    size: 'xl',
  },
};

/**
 * Modal without footer
 */
export const NoFooter: Story = {
  render: (args) => <ModalTemplate {...args} />,
  args: {
    title: 'Information Modal',
    children: (
      <div>
        <p className="mb-4">
          This modal doesn't have a footer. Users can only close it using the X button
          or by clicking the overlay.
        </p>
        <p className="text-sm text-muted-foreground">
          This is useful for informational messages that don't require user action.
        </p>
      </div>
    ),
    showFooter: false,
    showCloseButton: true,
  },
};

/**
 * Modal without close button
 */
export const NoCloseButton: Story = {
  render: (args) => <ModalTemplate {...args} />,
  args: {
    title: 'Required Action',
    children: (
      <div>
        <p className="mb-4">
          This modal requires user interaction. The close button is hidden, so users
          must use the action buttons or press Escape to close.
        </p>
      </div>
    ),
    showCloseButton: false,
    confirmText: 'I Understand',
    cancelText: 'Cancel',
  },
};

/**
 * Modal with custom content
 */
export const CustomContent: Story = {
  render: (args) => <ModalTemplate {...args} />,
  args: {
    title: 'Custom Content Modal',
    children: (
      <div>
        <div className="mb-4 p-4 bg-primary/10 rounded-md">
          <h3 className="font-semibold mb-2">Important Notice</h3>
          <p className="text-sm">
            This modal contains custom formatted content with styled sections.
          </p>
        </div>
        <ul className="list-disc list-inside space-y-2 mb-4">
          <li>Feature one with detailed description</li>
          <li>Feature two with additional information</li>
          <li>Feature three with more context</li>
        </ul>
        <div className="p-4 border border-border rounded-md bg-muted/50">
          <p className="text-sm font-medium mb-1">Additional Information</p>
          <p className="text-xs text-muted-foreground">
            This is a custom styled section within the modal body.
          </p>
        </div>
      </div>
    ),
    confirmText: 'Accept',
    cancelText: 'Decline',
  },
};

/**
 * Modal that doesn't close on overlay click
 */
export const NoOverlayClose: Story = {
  render: (args) => <ModalTemplate {...args} />,
  args: {
    title: 'Important Decision',
    children: (
      <div>
        <p className="mb-4">
          This modal requires explicit action. Clicking the overlay will not close it.
          You must use the action buttons or press Escape.
        </p>
        <p className="text-sm text-muted-foreground">
          This is useful for critical actions where accidental dismissal should be prevented.
        </p>
      </div>
    ),
    closeOnOverlayClick: false,
    confirmText: 'Proceed',
    cancelText: 'Cancel',
  },
};

/**
 * Modal with long scrollable content
 */
export const ScrollableContent: Story = {
  render: (args) => <ModalTemplate {...args} />,
  args: {
    title: 'Terms and Conditions',
    children: (
      <div>
        {Array.from({ length: 20 }, (_, i) => (
          <p key={i} className="mb-4">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
            tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
            quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
            consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
            cillum dolore eu fugiat nulla pariatur.
          </p>
        ))}
      </div>
    ),
    confirmText: 'I Agree',
    cancelText: 'Cancel',
    size: 'lg',
  },
};


