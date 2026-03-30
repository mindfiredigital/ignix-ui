import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { ToastProvider, useToast } from './index';
import type { ToastDataArgs } from './index';

const ToastTrigger = ({
  label,
  toastArgs,
}: {
  label: string;
  toastArgs: ToastDataArgs;
}) => {
  const { addToast } = useToast();
  return (
    <button
      onClick={() => addToast(toastArgs)}
      className="
        inline-flex items-center justify-center gap-2
        px-5 py-2.5 rounded-lg text-sm font-semibold
        bg-slate-900 text-white
        hover:bg-slate-700 active:scale-95
        transition-all duration-150 shadow-md
        focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-slate-900
      "
    >
      {label}
    </button>
  );
};

const withProvider =
  (
    position: ToastDataArgs['position'] = 'top-right',
    maxToasts?: number
  ) =>
  (Story: React.ComponentType) => (
    <ToastProvider defaultPosition={position} maxToasts={maxToasts}>
      <Story />
    </ToastProvider>
  );
  
const meta: Meta = {
  title: 'Components/Toast',
  tags: ["autodocs"],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
**Toast** is a context-based notification system. Wrap your app in \`<ToastProvider>\` and call \`useToast()\` anywhere inside it.`
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const Variants: Story = {
  name: 'Variants',
  decorators: [withProvider('top-right')],
  render: () => {
    const { addToast } = useToast();
    return (
      <div className="flex flex-col items-center gap-4 p-8">
        <h2 className="text-lg font-semibold text-slate-800 mb-2">Variant Showcase</h2>
        <div className="flex flex-wrap gap-3 justify-center">
          {(
            [
              { variant: 'success', message: 'Changes saved successfully!' },
              { variant: 'error',   message: 'Something went wrong. Please retry.' },
              { variant: 'warning', message: 'You are approaching your storage limit.' },
              { variant: 'info',    message: 'A new update is available.' },
            ] as { variant: ToastDataArgs['variant']; message: string }[]
          ).map(({ variant, message }) => (
            <button
              key={variant}
              onClick={() =>
                addToast({
                  message,
                  variant,
                  animation: 'slide',
                  appearance: 'premium',
                })
              }
              className={`
                px-4 py-2 rounded-lg text-sm font-semibold capitalize
                transition-all duration-150 active:scale-95 shadow-sm
                ${variant === 'success' ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : ''}
                ${variant === 'error'   ? 'bg-red-600   hover:bg-red-700   text-white' : ''}
                ${variant === 'warning' ? 'bg-amber-500 hover:bg-amber-600  text-white' : ''}
                ${variant === 'info'    ? 'bg-blue-600  hover:bg-blue-700   text-white' : ''}
              `}
            >
              {variant}
            </button>
          ))}
        </div>
      </div>
    );
  },
};

export const Animations: Story = {
  name: 'Animations',
  decorators: [withProvider('top-right')],
  render: () => {
    const { addToast } = useToast();
    const animations: ToastDataArgs['animation'][] = [
      'slide', 'fade', 'bounce', 'pop', 'elastic', 'flip',
    ];
    return (
      <div className="flex flex-col items-center gap-4 p-8">
        <h2 className="text-lg font-semibold text-slate-800 mb-2">Animation Playground</h2>
        <div className="grid grid-cols-3 gap-3">
          {animations.map((animation) => (
            <button
              key={animation}
              onClick={() =>
                addToast({
                  message: `Animation: ${animation}`,
                  variant: 'info',
                  animation: animation!,
                  appearance: 'premium',
                })
              }
              className="
                px-4 py-2 rounded-lg text-sm font-semibold capitalize
                bg-indigo-600 hover:bg-indigo-700 text-white
                transition-all duration-150 active:scale-95 shadow-sm
              "
            >
              {animation}
            </button>
          ))}
        </div>
      </div>
    );
  },
};

export const Appearances: Story = {
  name: 'Appearances',
  decorators: [withProvider('top-right')],
  render: () => {
    const { addToast } = useToast();
    return (
      <div className="flex flex-col items-center gap-4 p-8">
        <h2 className="text-lg font-semibold text-slate-800 mb-2">Appearance Presets</h2>
        <div className="flex gap-3">
          {(['premium', 'gradient'] as ToastDataArgs['appearance'][]).map((appearance) => (
            <button
              key={appearance}
              onClick={() =>
                addToast({
                  message: `This is a "${appearance}" toast.`,
                  variant: 'success',
                  animation: 'slide',
                  appearance,
                })
              }
              className="
                px-4 py-2 rounded-lg text-sm font-semibold capitalize
                bg-slate-800 hover:bg-slate-700 text-white
                transition-all duration-150 active:scale-95 shadow-sm
              "
            >
              {appearance}
            </button>
          ))}
        </div>
      </div>
    );
  },
};

export const Sizes: Story = {
  name: 'Sizes',
  decorators: [withProvider('top-right')],
  render: () => {
    const { addToast } = useToast();
    return (
      <div className="flex flex-col items-center gap-4 p-8">
        <h2 className="text-lg font-semibold text-slate-800 mb-2">Size Variants</h2>
        <div className="flex gap-3">
          {(['sm', 'md', 'lg'] as ToastDataArgs['size'][]).map((size) => (
            <button
              key={size}
              onClick={() =>
                addToast({
                  message: `This is a "${size}" sized toast notification.`,
                  variant: 'info',
                  animation: 'slide',
                  appearance: 'premium',
                  size,
                })
              }
              className="
                px-4 py-2 rounded-lg text-sm font-semibold uppercase
                bg-violet-600 hover:bg-violet-700 text-white
                transition-all duration-150 active:scale-95 shadow-sm
              "
            >
              {size}
            </button>
          ))}
        </div>
      </div>
    );
  },
};

export const Positions: Story = {
  name: 'Positions',
  decorators: [
    (Story) => (
      <div className="flex flex-col items-center gap-4 p-8">
        <Story />
      </div>
    ),
  ],
  render: () => {
    const positions: NonNullable<ToastDataArgs['position']>[] = [
      'top-left', 'top-center', 'top-right',
      'bottom-left', 'bottom-center', 'bottom-right',
    ];
    return (
      <div className="grid grid-cols-3 gap-3">
        {positions.map((position) => (
          <ToastProvider key={position} defaultPosition={position}>
            <PositionButton position={position} />
          </ToastProvider>
        ))}
      </div>
    );
  },
};

const PositionButton = ({ position }: { position: NonNullable<ToastDataArgs['position']> }) => {
  const { addToast } = useToast();
  return (
    <button
      onClick={() =>
        addToast({
          message: `Positioned: ${position}`,
          variant: 'info',
          animation: 'fade',
          appearance: 'premium',
          size: 'sm',
          position,
        })
      }
      className="
        px-3 py-2 rounded-lg text-xs font-semibold
        bg-teal-600 hover:bg-teal-700 text-white
        transition-all duration-150 active:scale-95 shadow-sm
      "
    >
      {position}
    </button>
  );
};

export const WithActionButton: Story = {
  name: 'With Action Button',
  decorators: [withProvider('top-right')],
  render: () => (
    <div className="flex flex-col items-center gap-4 p-8">
      <h2 className="text-lg font-semibold text-slate-800 mb-2">Action Button</h2>
      <ToastTrigger
        label="Show toast with action"
        toastArgs={{
          message: 'Your file has been deleted.',
          variant: 'warning',
          animation: 'slide',
          appearance: 'premium',
          actionButton: {
            label: 'Undo',
            onClick: () => alert('Undo clicked!'),
          },
          duration: 8000,
        }}
      />
    </div>
  ),
};

export const CustomIcon: Story = {
  name: 'Custom Icon',
  decorators: [withProvider('top-right')],
  render: () => (
    <div className="flex flex-col items-center gap-4 p-8">
      <h2 className="text-lg font-semibold text-slate-800 mb-2">Custom Icon</h2>
      <ToastTrigger
        label="Toast with emoji icon"
        toastArgs={{
          message: 'Deployment to production succeeded 🎉',
          variant: 'success',
          animation: 'bounce',
          appearance: 'premium',
          icon: <span className="text-xl leading-none"></span>,
        }}
      />
    </div>
  ),
};

export const PriorityLevels: Story = {
  name: 'Priority Levels',
  decorators: [withProvider('top-right', 8)],
  render: () => {
    const { addToast } = useToast();
    const priorities: NonNullable<ToastDataArgs['priority']>[] = [
      'low', 'normal', 'high', 'urgent',
    ];
    const colourMap: Record<string, string> = {
      low:    'bg-slate-500 hover:bg-slate-600',
      normal: 'bg-blue-600  hover:bg-blue-700',
      high:   'bg-orange-500 hover:bg-orange-600',
      urgent: 'bg-red-600   hover:bg-red-700',
    };
    return (
      <div className="flex flex-col items-center gap-4 p-8">
        <h2 className="text-lg font-semibold text-slate-800 mb-2">Priority Queue</h2>
        <p className="text-sm text-slate-500 mb-2 text-center max-w-xs">
          Add a few normal toasts first, then hit <strong>urgent</strong> to see it jump to the top.
        </p>
        <div className="flex gap-3">
          {priorities.map((priority) => (
            <button
              key={priority}
              onClick={() =>
                addToast({
                  message: `Priority: ${priority}`,
                  variant: priority === 'urgent' ? 'error' : priority === 'high' ? 'warning' : 'info',
                  animation: 'slide',
                  appearance: 'premium',
                  priority,
                  duration: 6000,
                })
              }
              className={`
                px-4 py-2 rounded-lg text-sm font-semibold capitalize text-white
                ${colourMap[priority]}
                transition-all duration-150 active:scale-95 shadow-sm
              `}
            >
              {priority}
            </button>
          ))}
        </div>
      </div>
    );
  },
};

export const ProgressBar: Story = {
  name: 'Progress Bar',
  decorators: [withProvider('top-right')],
  render: () => (
    <div className="flex flex-col items-center gap-4 p-8">
      <h2 className="text-lg font-semibold text-slate-800 mb-2">Progress Bar</h2>
      <div className="flex gap-3">
        <ToastTrigger
          label="With progress (hover to pause)"
          toastArgs={{
            message: 'Hover me to pause the timer.',
            variant: 'info',
            animation: 'slide',
            appearance: 'premium',
            showProgress: true,
            pauseOnHover: true,
            duration: 6000,
          }}
        />
        <ToastTrigger
          label="No progress bar"
          toastArgs={{
            message: 'No countdown bar on this one.',
            variant: 'info',
            animation: 'slide',
            appearance: 'premium',
            showProgress: false,
            duration: 4000,
          }}
        />
      </div>
    </div>
  ),
};

export const NonDismissible: Story = {
  name: 'Non-Dismissible',
  decorators: [withProvider('top-right')],
  render: () => (
    <div className="flex flex-col items-center gap-4 p-8">
      <h2 className="text-lg font-semibold text-slate-800 mb-2">Non-Dismissible Toast</h2>
      <ToastTrigger
        label="Show non-dismissible toast"
        toastArgs={{
          message: 'You cannot manually close this toast.',
          variant: 'warning',
          animation: 'pop',
          appearance: 'premium',
          dismissible: false,
          duration: 5000,
        }}
      />
    </div>
  ),
};

export const MaxToastsStack: Story = {
  name: 'Max Toasts / Stack Overflow',
  decorators: [withProvider('top-right', 3)],
  render: () => {
    const { addToast, clearAll } = useToast();
    const variants: ToastDataArgs['variant'][] = ['success', 'error', 'warning', 'info'];
    let counter = 0;
    return (
      <div className="flex flex-col items-center gap-4 p-8">
        <h2 className="text-lg font-semibold text-slate-800 mb-2">Stack (max 3)</h2>
        <div className="flex gap-3">
          <button
            onClick={() => {
              const v = variants[counter % variants.length];
              counter++;
              addToast({
                message: `Toast #${counter} – variant: ${v}`,
                variant: v!,
                animation: 'slide',
                appearance: 'premium',
                duration: 10000,
              });
            }}
            className="
              px-4 py-2 rounded-lg text-sm font-semibold
              bg-slate-900 hover:bg-slate-700 text-white
              transition-all duration-150 active:scale-95 shadow-sm
            "
          >
            Add toast
          </button>
          <button
            onClick={clearAll}
            className="
              px-4 py-2 rounded-lg text-sm font-semibold
              bg-red-500 hover:bg-red-600 text-white
              transition-all duration-150 active:scale-95 shadow-sm
            "
          >
            Clear all
          </button>
        </div>
      </div>
    );
  },
};

export const PersistentToast: Story = {
  name: 'Persistent Toast (No Auto-Dismiss)',
  decorators: [withProvider('top-right')],
  render: () => (
    <div className="flex flex-col items-center gap-4 p-8">
      <h2 className="text-lg font-semibold text-slate-800 mb-2">Persistent Toast</h2>
      <ToastTrigger
        label="Show persistent toast"
        toastArgs={{
          message: 'This toast will not auto-dismiss. Close it manually.',
          variant: 'info',
          animation: 'flip',
          appearance: 'premium',
          duration: 0,
          showProgress: false,
        }}
      />
    </div>
  ),
};