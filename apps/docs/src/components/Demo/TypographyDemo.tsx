// TypographyDemo.tsx
import React, { useState } from 'react';
import { Typography } from '@site/src/components/UI/typography';
import VariantSelector from './VariantSelector';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';

//     const [variant, setVariant] = useState('body');
//     const [color, setColor] = useState('default');
//     const [weight, setWeight] = useState('normal');
//     const [align, setAlign] = useState('left');
//     const [decoration, setDecoration] = useState('none');
//     const [transform, setTransform] = useState('normal');
//     const [hover, setHover] = useState('none');
//     const [showMark, setShowMark] = useState(false);
//     const [showTruncate, setShowTruncate] = useState(false);
//     const [customText, setCustomText] = useState('The quick brown fox jumps over the lazy dog');

//     const codeString = `
// <Typography 
//   variant="${variant}"
//   color="${color}"
//   weight="${weight}"
//   align="${align}"
//   decoration="${decoration}"
//   transform="${transform}"
//   hover="${hover}"
//   ${showMark ? 'mark' : ''}
//   ${showTruncate ? 'truncate' : ''}
// >
//   ${customText}
// </Typography>
// `;

//     const getVariantLabel = (variant: string) => {
//         return typographyVariants.find(v => v.value === variant)?.label || variant;
//     };

//     return (
//         <div className="space-y-8 mb-8">
//             {/* Controls */}
//             <div className="flex flex-wrap gap-4 justify-start sm:justify-end">
//                 <div className="space-y-2">
//                     <VariantSelector
//                         variants={typographyVariants.map((v) => v.value)}
//                         selectedVariant={variant}
//                         onSelectVariant={setVariant}
//                         type="Variant"
//                     />
//                 </div>

//                 <div className="space-y-2">
//                     <VariantSelector
//                         variants={typographyColors.map((c) => c.value)}
//                         selectedVariant={color}
//                         onSelectVariant={setColor}
//                         type="Color"
//                     />
//                 </div>

//                 <div className="space-y-2">
//                     <VariantSelector
//                         variants={typographyWeights.map((w) => w.value)}
//                         selectedVariant={weight}
//                         onSelectVariant={setWeight}
//                         type="Weight"
//                     />
//                 </div>

//                 <div className="space-y-2">
//                     <VariantSelector
//                         variants={typographyAlignments.map((a) => a.value)}
//                         selectedVariant={align}
//                         onSelectVariant={setAlign}
//                         type="Align"
//                     />
//                 </div>
//             </div>

//             {/* Additional Controls */}
//             <div className="flex flex-wrap gap-4 justify-start sm:justify-end">
//                 <div className="space-y-2">
//                     <VariantSelector
//                         variants={typographyDecorations.map((d) => d.value)}
//                         selectedVariant={decoration}
//                         onSelectVariant={setDecoration}
//                         type="Decoration"
//                     />
//                 </div>

//                 <div className="space-y-2">
//                     <VariantSelector
//                         variants={typographyTransforms.map((t) => t.value)}
//                         selectedVariant={transform}
//                         onSelectVariant={setTransform}
//                         type="Transform"
//                     />
//                 </div>

//                 <div className="space-y-2">
//                     <VariantSelector
//                         variants={typographyHoverEffects.map((h) => h.value)}
//                         selectedVariant={hover}
//                         onSelectVariant={setHover}
//                         type="Hover"
//                     />
//                 </div>
//             </div>

//             {/* Text Input and Toggle Controls */}
//             <div className="flex flex-wrap gap-6 items-center p-4 border rounded-lg">
//                 <div className="flex-1 min-w-[200px]">
//                     <label className="block text-sm font-medium mb-2">Custom Text:</label>
//                     <input
//                         type="text"
//                         value={customText}
//                         onChange={(e) => setCustomText(e.target.value)}
//                         className="w-full px-3 py-2 border rounded-md text-sm"
//                         placeholder="Enter custom text..."
//                     />
//                 </div>

//                 <label className="flex items-center gap-2">
//                     <input
//                         type="checkbox"
//                         checked={showMark}
//                         onChange={(e) => setShowMark(e.target.checked)}
//                     />
//                     Mark Highlight
//                 </label>

//                 <label className="flex items-center gap-2">
//                     <input
//                         type="checkbox"
//                         checked={showTruncate}
//                         onChange={(e) => setShowTruncate(e.target.checked)}
//                     />
//                     Truncate Text
//                 </label>
//             </div>

//             {/* Demo */}
//             <Tabs>
//                 <TabItem value="preview" label="Preview">
//                     <div className="p-6 border rounded-lg mt-4">
//                         <div className="space-y-6">
//                             {/* Main Demo */}
//                             <div className="space-y-4">
//                                 <h4 className="text-sm font-medium text-muted-foreground">
//                                     {getVariantLabel(variant)} Preview
//                                 </h4>
//                                 <div className={`p-4 border rounded-lg ${showTruncate ? 'max-w-md' : ''}`}>
//                                     <Typography
//                                         variant={variant as any}
//                                         color={color as any}
//                                         weight={weight as any}
//                                         align={align as any}
//                                         decoration={decoration as any}
//                                         transform={transform as any}
//                                         hover={hover as any}
//                                         mark={showMark}
//                                         truncate={showTruncate}
//                                     >
//                                         {customText}
//                                     </Typography>
//                                 </div>
//                             </div>

//                             {/* All Variants Showcase */}
//                             <div className="space-y-4">
//                                 <h4 className="text-sm font-medium text-muted-foreground">All Variants</h4>
//                                 <div className="space-y-3">
//                                     {typographyVariants.map((v) => (
//                                         <div key={v.value} className="flex items-center gap-4">
//                                             <div className="w-32 text-sm text-muted-foreground">
//                                                 {v.label}
//                                             </div>
//                                             <Typography variant={v.value as any}>
//                                                 {customText}
//                                             </Typography>
//                                         </div>
//                                     ))}
//                                 </div>
//                             </div>

//                             {/* All Colors Showcase */}
//                             <div className="space-y-4">
//                                 <h4 className="text-sm font-medium text-muted-foreground">All Colors</h4>
//                                 <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
//                                     {typographyColors.map((c) => (
//                                         <div key={c.value} className="flex flex-col gap-1">
//                                             <Typography
//                                                 variant="body-small"
//                                                 color={c.value as any}
//                                                 className="font-medium"
//                                             >
//                                                 {c.label}
//                                             </Typography>
//                                             <Typography
//                                                 variant="body-small"
//                                                 color={c.value as any}
//                                             >
//                                                 Sample text
//                                             </Typography>
//                                         </div>
//                                     ))}
//                                 </div>
//                             </div>

//                             {/* All Weights Showcase */}
//                             <div className="space-y-4">
//                                 <h4 className="text-sm font-medium text-muted-foreground">All Weights</h4>
//                                 <div className="space-y-2">
//                                     {typographyWeights.map((w) => (
//                                         <Typography key={w.value} weight={w.value as any}>
//                                             {w.label} weight - {customText}
//                                         </Typography>
//                                     ))}
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </TabItem>

//                 <TabItem value="code" label="Code">
//                     <div className="mt-4">
//                         <CodeBlock language="tsx" className="text-sm">
//                             {codeString}
//                         </CodeBlock>
//                     </div>
//                 </TabItem>
//             </Tabs>
//         </div>
//     );
// };

// // Heading Hierarchy Demo
// const HeadingHierarchyDemo = () => {
//     const codeString = `
// // Heading Hierarchy Example
// <div className="space-y-4">
//   <Typography variant="h1">Main Title (H1)</Typography>
//   <Typography variant="h2">Section Heading (H2)</Typography>
//   <Typography variant="h3">Subsection (H3)</Typography>
//   <Typography variant="h4">Sub-subsection (H4)</Typography>
//   <Typography variant="h5">Minor heading (H5)</Typography>
//   <Typography variant="h6">Smallest heading (H6)</Typography>
// </div>
// `;

//     return (
//         <div className="space-y-6">
//             <h3 className="text-lg font-semibold">Heading Hierarchy</h3>

//             <Tabs>
//                 <TabItem value="preview" label="Preview">
//                     <div className="p-6 border rounded-lg">
//                         <div className="space-y-4">
//                             <Typography variant="h1">Main Title (H1)</Typography>
//                             <Typography variant="body-large">
//                                 This is the main title of the page. It should be used only once per page.
//                             </Typography>

//                             <Typography variant="h2">Section Heading (H2)</Typography>
//                             <Typography variant="body">
//                                 Section headings organize the main content areas of your page.
//                             </Typography>

//                             <Typography variant="h3">Subsection (H3)</Typography>
//                             <Typography variant="body">
//                                 Subsections break down larger sections into more specific topics.
//                             </Typography>

//                             <Typography variant="h4">Sub-subsection (H4)</Typography>
//                             <Typography variant="body-small">
//                                 Further breakdown of content for better organization.
//                             </Typography>

//                             <Typography variant="h5">Minor heading (H5)</Typography>
//                             <Typography variant="body-small">
//                                 Used for less important headings within complex content structures.
//                             </Typography>

//                             <Typography variant="h6">Smallest heading (H6)</Typography>
//                             <Typography variant="caption">
//                                 The smallest heading level, rarely used in most designs.
//                             </Typography>
//                         </div>
//                     </div>
//                 </TabItem>

//                 <TabItem value="code" label="Code">
//                     <CodeBlock language="tsx" className="text-sm">
//                         {codeString}
//                     </CodeBlock>
//                 </TabItem>
//             </Tabs>
//         </div>
//     );
// };

// // Text Combination Demo
// const TextCombinationDemo = () => {
//     const codeString = `
// // Text Combination Example
// <div className="space-y-4">
//   <Typography variant="h2">Article Title</Typography>
//   <div className="flex gap-4">
//     <Typography variant="label">By: John Doe</Typography>
//     <Typography variant="label">Published: March 15, 2024</Typography>
//   </div>
//   <Typography variant="body-large">
//     This is the lead paragraph that introduces the main content of the article.
//   </Typography>
//   <Typography variant="body">
//     This is the main body text where most of your content will live. It provides 
//     detailed information and supports the main points of your article.
//   </Typography>
//   <Typography variant="blockquote">
//     "This is an important quote that deserves special attention in the content."
//   </Typography>
//   <Typography variant="body-small">
//     Additional notes or less important information can go here in smaller text.
//   </Typography>
//   <Typography variant="caption">
//     Footer text or copyright information typically uses caption style.
//   </Typography>
// </div>
// `;

//     return (
//         <div className="space-y-6">
//             <h3 className="text-lg font-semibold">Text Combination</h3>

//             <Tabs>
//                 <TabItem value="preview" label="Preview">
//                     <div className="p-6 border rounded-lg">
//                         <div className="space-y-4 max-w-2xl">
//                             <Typography variant="h2">Building a Modern Design System</Typography>
//                             <div className="flex gap-4 flex-wrap">
//                                 <Typography variant="label">By: Jane Smith</Typography>
//                                 <Typography variant="label">Published: March 15, 2024</Typography>
//                                 <Typography variant="label">Category: Design</Typography>
//                             </div>
//                             <Typography variant="body-large">
//                                 Creating a consistent and scalable design system is crucial for modern web applications.
//                                 It ensures uniformity across all components and improves developer experience.
//                             </Typography>
//                             <Typography variant="body">
//                                 A well-implemented design system provides a single source of truth for both designers
//                                 and developers. It includes typography scales, color palettes, spacing systems, and
//                                 reusable component libraries that work together harmoniously.
//                             </Typography>
//                             <Typography variant="blockquote">
//                                 "Good design is obvious. Great design is transparent." — Joe Sparano
//                             </Typography>
//                             <Typography variant="body">
//                                 When building your typography system, consider factors like readability, accessibility,
//                                 and emotional impact. The right typeface and hierarchy can significantly improve user
//                                 experience and content comprehension.
//                             </Typography>
//                             <Typography variant="code">
//                                 {`const DesignSystem = () => (
//   <Typography variant="h1">Welcome to our system</Typography>
// );`}
//                             </Typography>
//                             <Typography variant="body-small">
//                                 Remember to test your typography choices across different devices and screen sizes
//                                 to ensure optimal readability.
//                             </Typography>
//                             <Typography variant="caption">
//                                 © 2024 Design System Inc. All rights reserved.
//                             </Typography>
//                         </div>
//                     </div>
//                 </TabItem>

//                 <TabItem value="code" label="Code">
//                     <CodeBlock language="tsx" className="text-sm">
//                         {codeString}
//                     </CodeBlock>
//                 </TabItem>
//             </Tabs>
//         </div>
//     );
// };

// Interactive Features Demo
const InteractiveFeaturesDemo = () => {
    const [activeHover, setActiveHover] = useState<string>('');

    const codeString = `
// Interactive Features Example
<div>
  <Typography hover="underline" className="cursor-pointer">
    Hover to underline this text
  </Typography>
  <Typography hover="color" className="cursor-pointer">
    Hover to change color
  </Typography>
  <Typography hover="scale" className="cursor-pointer">
    Hover to scale
  </Typography>
  <Typography mark>
    This text is highlighted with mark
  </Typography>
  <Typography truncate className="max-w-xs">
    This is a very long text that will be truncated with an ellipsis...
  </Typography>
  <Typography variant="link">
    This looks like a clickable link
  </Typography>
</div>
`;

    return (
        <div className="space-y-6">
            <h3 className="text-lg font-semibold">Interactive Features</h3>

            <Tabs>
                <TabItem value="preview" label="Preview">
                    <div className="p-6 border rounded-lg">
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <Typography variant="h4">Hover Effects</Typography>
                                    <Typography
                                        hover="underline"
                                        className="cursor-pointer p-2 border rounded"
                                        onMouseEnter={() => setActiveHover('underline')}
                                        onMouseLeave={() => setActiveHover('')}
                                    >
                                        Hover to underline this text
                                        {activeHover === 'underline' && ' ✨'}
                                    </Typography>
                                    <Typography
                                        hover="color"
                                        className="cursor-pointer p-2 border rounded"
                                        onMouseEnter={() => setActiveHover('color')}
                                        onMouseLeave={() => setActiveHover('')}
                                    >
                                        Hover to change color
                                        {activeHover === 'color' && ' ✨'}
                                    </Typography>
                                    <Typography
                                        hover="scale"
                                        className="cursor-pointer p-2 border rounded"
                                        onMouseEnter={() => setActiveHover('scale')}
                                        onMouseLeave={() => setActiveHover('')}
                                    >
                                        Hover to scale
                                        {activeHover === 'scale' && ' ✨'}
                                    </Typography>
                                </div>

                                <div className="space-y-4">
                                    <Typography variant="h4">Special Features</Typography>
                                    <Typography mark className="p-2 border rounded">
                                        This text is highlighted with mark
                                    </Typography>
                                    <Typography
                                        truncate
                                        className="max-w-xs p-2 border rounded"
                                    >
                                        This is a very long text that will be truncated with an ellipsis when it exceeds the container width
                                    </Typography>
                                    <Typography
                                        variant="link"
                                        className="p-2 border rounded inline-block"
                                    >
                                        This looks like a clickable link
                                    </Typography>
                                </div>
                            </div>
                        </div>
                    </div>
                </TabItem>

                <TabItem value="code" label="Code">
                    <CodeBlock language="tsx" className="text-sm">
                        {codeString}
                    </CodeBlock>
                </TabItem>
            </Tabs>
        </div>
    );
};

export { InteractiveFeaturesDemo };