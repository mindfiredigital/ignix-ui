import { cva } from 'class-variance-authority';
/**
 * CVA variants for the ButtonGroup container.
 * Defines layout and spacing options.
 */
export const buttonGroupVariants = cva(
  'inline-flex items-center',
  {
    variants: {
      orientation: {
        horizontal: 'flex-row',
        vertical: 'flex-col',
      },
      wrap: {
        true: 'flex-wrap',
        false: 'flex-nowrap',
      },
    },
    defaultVariants: {
      orientation: 'horizontal',
      wrap: true,
    },
  }
);
