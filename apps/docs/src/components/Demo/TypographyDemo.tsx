// TypographyDemo.tsx
import React, { useState } from 'react';
import { Typography } from '@site/src/components/UI/typography';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';

// Interactive Features Demo
const InteractiveFeaturesDemo = () => {
    const [activeHover, setActiveHover] = useState<string>('');

    const codeString = `
// Interactive Features Example
import { Typography } from '@ignix-ui/typography';

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