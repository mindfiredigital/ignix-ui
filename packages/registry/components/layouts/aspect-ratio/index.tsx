import { cn } from '../../../utils/cn';
import * as React from 'react';

export interface AspectRatioProps extends React.HTMLAttributes<HTMLDivElement> {
  ratio?: '1:1' | '4:3' | '16:9' | '21:9' | string;
  /**
   * The maximum width of the container.
   * - Accepts a string (e.g., '50%', '30rem', '400px')
   * - Or a number (auto-converted to 'px')
   */
  maxWidth?: string | number;
  children: React.ReactNode;
}

const parseRatio = (ratio: string) => {
  const [w, h] = ratio.split(':').map(Number);
  return w && h ? { w, h } : { w: 1, h: 1 };
};

const AspectRatio = React.forwardRef<HTMLDivElement, AspectRatioProps>(
  ({ ratio = '1:1', maxWidth, children, className, style, ...props }, ref) => {
    const { w, h } = parseRatio(ratio);

    const isAspectRatioSupported =
      typeof CSS !== 'undefined' && CSS.supports('aspect-ratio', '1/1');

    const computedMaxWidth =
      typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth;

    const containerStyle: React.CSSProperties = {
      width: '100%',
      maxWidth: computedMaxWidth,
      ...style,
    };

    if (isAspectRatioSupported) {
      containerStyle.aspectRatio = `${w} / ${h}`;
    } else {
      containerStyle.position = 'relative';
      containerStyle.paddingBottom = `${(h / w) * 100}%`;
    }

    const contentStyle: React.CSSProperties = isAspectRatioSupported
      ? { width: '100%', height: '100%' }
      : {
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
        };

    const enhancedChildren = React.Children.map(children, (child) => {
      if (
        React.isValidElement(child) &&
        typeof child.type === 'string' &&
        child.type === 'img'
      ) {
        const imgElement = child as React.ReactElement<
          React.ImgHTMLAttributes<HTMLImageElement>
        >;

        return React.cloneElement(imgElement, {
          className: cn(
            imgElement.props.className,
            'object-cover w-full h-full'
          ),
        });
      }
      return child;
    });

    return (
      <div
        ref={ref}
        className={cn('aspect-ratio-container', className)}
        style={containerStyle}
        {...props}
      >
        <div style={contentStyle}>{enhancedChildren}</div>
      </div>
    );
  }
);

AspectRatio.displayName = 'AspectRatio';

export { AspectRatio };
