import React, { useState } from 'react';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';
import { AnimatePresence } from 'framer-motion';
import { Info, CheckCircle2, AlertTriangle, Trash2 } from 'lucide-react';

import {
  Modal,
  type ModalColorScheme,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from '@site/src/components/UI/modals';
import { Button } from '@site/src/components/UI/button';
import { cn } from '@site/src/utils/cn';
import VariantSelector from './VariantSelector';

type ModalWithColorConfig = typeof Modal & {
  colorSchemeConfig: Record<ModalColorScheme, {
    backdrop: string;
    content: string;
    header: string;
    body: string;
    footer: string;
    closeButton: string;
    cancelButton: string;
    confirmButton: string;
  }>;
};

const colorSchemes = ['primary', 'accent', 'success', 'warning', 'destructive', 'info'] as const;
const sizeVariants = ['sm', 'md', 'lg', 'xl', 'full'] as const;
const contentVariants = ['Default', 'No footer', 'No close button', 'No overlay close', 'Scrollable content', 'Custom Content'] as const;

type ColorScheme = (typeof colorSchemes)[number];
type SizeVariant = (typeof sizeVariants)[number];
type ContentVariant = (typeof contentVariants)[number];

const ModalsDemo: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scheme, setScheme] = useState<ColorScheme>('primary');
  const [withIcon, setWithIcon] = useState(true);
  const [size, setSize] = useState<SizeVariant>('md');
  const [contentVariant, setContentVariant] = useState<ContentVariant>('Default');

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  const headerIcon =
    !withIcon
      ? undefined
      : scheme === 'success'
        ? <CheckCircle2 className="h-5 w-5 text-success" />
        : scheme === 'destructive'
          ? <Trash2 className="h-5 w-5 text-destructive" />
          : scheme === 'warning'
            ? <AlertTriangle className="h-5 w-5 text-warning" />
            : <Info className="h-5 w-5 text-primary" />;

  const headerIconClassName =
    scheme === 'success'
      ? 'bg-success/10 border-success/30'
      : scheme === 'destructive'
        ? 'bg-destructive/10 border-destructive/30'
        : scheme === 'warning'
          ? 'bg-warning/10 border-warning/30'
          : scheme === 'info'
            ? 'bg-info/10 border-info/30'
            : 'bg-primary/10 border-primary/30';

  const codeString = `import { Modal } from './components/ui/modals';
import { Button } from './components/ui/button';
import { Info } from 'lucide-react';

function Example() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open modal</Button>
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Confirm action"
        colorScheme="primary"
        size="md"
        headerIcon={<Info className="h-5 w-5 text-primary" />}
        headerIconClassName="bg-primary/10 border-primary/30"
        confirmText="Confirm"
        cancelText="Cancel"
      >
        <p className="mb-2">
          Are you sure you want to proceed with this action? This cannot be undone.
        </p>
        <p className="text-sm text-muted-foreground">
          Press <kbd>Esc</kbd> or click outside the modal to close it.
        </p>
      </Modal>
    </>
  );
}`;

  const composableCodeString = `import { useState, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import {
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Modal,
} from './components/ui/modals';
import { Button } from './components/ui/button';
import { cn } from './utils/cn';
import { Info } from 'lucide-react';

// Use Modal.colorSchemeConfig for the same styles as the Modal component
type ModalWithColorConfig = typeof Modal & { colorSchemeConfig: Record<string, { backdrop: string; content: string; header: string; body: string; footer: string; closeButton: string; cancelButton: string; confirmButton: string; }> };
const colorScheme = 'primary';
const scheme = (Modal as ModalWithColorConfig).colorSchemeConfig[colorScheme];

function ComposableModalExample() {
  const [isOpen, setIsOpen] = useState(false);
  const close = useCallback(() => setIsOpen(false), []);

  const backdropClassName = cn(scheme.backdrop);
  const contentClassName = cn(scheme.content);
  const headerClassName = cn(scheme.header);
  const bodyClassName = cn('border-l-4', scheme.body);
  const footerClassName = cn(scheme.footer);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open modal</Button>
      <AnimatePresence>
        {isOpen && (
          <ModalOverlay closeOnOverlayClick onRequestClose={close} backdropClassName={backdropClassName}>
            <ModalContent size="md" className={contentClassName}>
              <ModalHeader
                title="Confirm action"
                icon={<Info className="h-5 w-5 text-primary" />}
                iconClassName="bg-primary/10 border-primary/30"
                showCloseButton
                onClose={close}
                className={headerClassName}
                closeButtonClassName={scheme.closeButton}
              />
              <ModalBody className={bodyClassName}>
                <p className="mb-2">Are you sure you want to proceed? This cannot be undone.</p>
                <p className="text-sm text-muted-foreground">Press Esc or click outside to close.</p>
              </ModalBody>
              <ModalFooter
                confirmText="Confirm"
                cancelText="Cancel"
                onConfirm={() => { close(); }}
                onCancel={close}
                className={footerClassName}
                cancelButtonClassName={scheme.cancelButton}
                confirmButtonClassName={scheme.confirmButton}
              />
            </ModalContent>
          </ModalOverlay>
        )}
      </AnimatePresence>
    </>
  );
}`;

  const schemeConfig = (Modal as ModalWithColorConfig).colorSchemeConfig;
  const schemeClasses = schemeConfig[scheme];

  const nestedBackdropClassName = cn(schemeClasses.backdrop);
  const nestedContentClassName = cn(schemeClasses.content);
  const nestedHeaderClassName = cn(schemeClasses.header);
  const nestedBodyClassName = cn('border-l-4', schemeClasses.body);
  const nestedFooterClassName = cn(schemeClasses.footer);

  const nestedBodyContent =
    contentVariant === 'Scrollable content' ? (
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
    ) : contentVariant === 'Custom Content' ? (
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
    ) : (
      <>
        <p className="mb-2">
          Are you sure you want to continue? This action cannot be undone.
        </p>
        <p className="text-sm text-muted-foreground">
          Press <kbd>Esc</kbd> or click on the overlay to close the modal.
        </p>
      </>
    );

  return (
    <div className="flex flex-col space-y-4 mb-8">
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap gap-4 sm:justify-between justify-start items-center">
          <VariantSelector
            variants={colorSchemes as unknown as string[]}
            selectedVariant={scheme}
            onSelectVariant={(v) => setScheme(v as ColorScheme)}
            type="Color scheme"
          />
          <VariantSelector
            variants={sizeVariants as unknown as string[]}
            selectedVariant={size}
            onSelectVariant={(v) => setSize(v as SizeVariant)}
            type="Size"
          />
          <VariantSelector
            variants={contentVariants as unknown as string[]}
            selectedVariant={contentVariant}
            onSelectVariant={(v) => setContentVariant(v as ContentVariant)}
            type="Content"
          />
          <button
            type="button"
            onClick={() => setWithIcon((prev) => !prev)}
            className="text-xs px-3 py-1 rounded-full border border-border bg-background hover:bg-muted transition-colors"
          >
            {withIcon ? 'Hide header icon' : 'Show header icon'}
          </button>
        </div>
      </div>

      <Tabs>
        <TabItem value="simple" label="Simple (Modal)" default>
          <Tabs>
            <TabItem value="preview" label="Preview">
              <div className="p-4 border rounded-lg mt-4">
                <Button onClick={open}>Open modal</Button>
                <Modal
                  isOpen={isOpen}
                  onClose={close}
                  title="Confirm action"
                  colorScheme={scheme}
                  size={size}
                  headerIcon={headerIcon}
                  headerIconClassName={headerIcon ? headerIconClassName : undefined}
                  confirmText="Confirm"
                  cancelText="Cancel"
                  closeOnOverlayClick={contentVariant !== 'No overlay close'}
                  closeOnEscape
                  showFooter={contentVariant !== 'No footer'}
                  showCloseButton={contentVariant !== 'No close button'}
                >
                  {contentVariant === 'Scrollable content' ? (
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
                  ) : contentVariant === 'Custom Content' ? (
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
                  ) : (
                    <>
                      <p className="mb-2">
                        Are you sure you want to continue? This action cannot be undone.
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Press <kbd>Esc</kbd> or click on the overlay to close the modal.
                      </p>
                    </>
                  )}
                </Modal>
              </div>
            </TabItem>
            <TabItem value="code" label="Code">
              <CodeBlock language="tsx" className="whitespace-pre-wrap max-h-[500px] overflow-y-auto">
                {codeString}
              </CodeBlock>
            </TabItem>
          </Tabs>
        </TabItem>
        <TabItem value="composable" label="Composable (nested)">
          <Tabs>
            <TabItem value="preview" label="Preview">
              <div className="p-4 border rounded-lg mt-4">
                <Button onClick={open}>Open modal</Button>
                <AnimatePresence>
                  {isOpen && (
                    <ModalOverlay
                      closeOnOverlayClick={contentVariant !== 'No overlay close'}
                      onRequestClose={close}
                      backdropClassName={nestedBackdropClassName}
                    >
                      <ModalContent size={size} className={nestedContentClassName}>
                        <ModalHeader
                          title="Confirm action"
                          icon={headerIcon}
                          iconClassName={headerIcon ? headerIconClassName : undefined}
                          showCloseButton={contentVariant !== 'No close button'}
                          onClose={close}
                          className={nestedHeaderClassName}
                          closeButtonClassName={schemeClasses.closeButton}
                        />
                        <ModalBody className={nestedBodyClassName}>
                          {nestedBodyContent}
                        </ModalBody>
                        {contentVariant !== 'No footer' && (
                          <ModalFooter
                            confirmText="Confirm"
                            cancelText="Cancel"
                            onConfirm={() => close()}
                            onCancel={close}
                            className={nestedFooterClassName}
                            cancelButtonClassName={schemeClasses.cancelButton}
                            confirmButtonClassName={schemeClasses.confirmButton}
                          />
                        )}
                      </ModalContent>
                    </ModalOverlay>
                  )}
                </AnimatePresence>
              </div>
            </TabItem>
            <TabItem value="code" label="Code">
              <CodeBlock language="tsx" className="whitespace-pre-wrap max-h-[500px] overflow-y-auto">
                {composableCodeString}
              </CodeBlock>
            </TabItem>
          </Tabs>
        </TabItem>
      </Tabs>
    </div>
  );
};

export default ModalsDemo;

