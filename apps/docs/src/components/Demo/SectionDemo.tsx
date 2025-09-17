import React, { useState } from 'react';
import { Section, SectionSpacing, SectionPadding, SectionMaxWidth, SectionAnimation } from '../UI/section';
import VariantSelector from './VariantSelector';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';
import { cn } from '@site/src/utils/cn';

const spacingOptions = [
  { value: "none", label: "None" },
  { value: "small", label: "Small" },
  { value: "normal", label: "Normal" },
  { value: "large", label: "Large" },
  { value: "xl", label: "XL" },
];

const paddingOptions = [
  { value: "none", label: "None" },
  { value: "small", label: "Small" },
  { value: "normal", label: "Normal" },
  { value: "large", label: "Large" },
  { value: "comfortable", label: "Comfortable" },
  { value: "generous", label: "Generous" },
];

const maxWidthOptions = [
  { value: "sm", label: "Small" },
  { value: "md", label: "Medium" },
  { value: "lg", label: "Large" },
  { value: "xl", label: "XL" },
  { value: "full", label: "Full" },
  { value: "readable", label: "Readable" },
  { value: "800px", label: "Custom (800px)" },
];

const animationOptions = [
  { value: "none", label: "None" },
  { value: "fade", label: "Fade" },
  { value: "slide-up", label: "Slide Up" },
  { value: "zoom", label: "Zoom" },
  { value: "stagger", label: "Stagger" },
];

const SectionDemo = () => {
  const [spacing, setSpacing] = useState<SectionSpacing>("normal");
  const [padding, setPadding] = useState<SectionPadding>("normal");
  const [maxWidth, setMaxWidth] = useState<SectionMaxWidth>("readable");
  const [animation, setAnimation] = useState<SectionAnimation>("none");

  const codeString = `<Section
  spacing="${spacing}"
  padding="${padding}"
  maxWidth="${maxWidth}"
  animation="${animation}"
>
  <div className="text-center">
    <h2 className="text-2xl font-bold mb-4">Section Content</h2>
    <p className="text-gray-600">
      This is a section with ${spacing} spacing,
      ${padding} padding, and ${maxWidth} max width.
    </p>
  </div>
</Section>`;

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="">
        <div className="flex flex-wrap gap-4 justify-end">
          <div className="flex flex-col items-center">
            <VariantSelector
              variants={spacingOptions.map((option) => option.value)}
              selectedVariant={spacing}
              onSelectVariant={(value) => setSpacing(value as SectionSpacing)}
              type="Spacing"
            />
          </div>
          <div className="flex flex-col items-center">
            <VariantSelector
              variants={paddingOptions.map((option) => option.value)}
              selectedVariant={padding}
              onSelectVariant={(value) => setPadding(value as SectionPadding)}
              type="Padding"
            />
          </div>
          
          <div className="flex flex-col items-center">
            <VariantSelector
              variants={maxWidthOptions.map((option) => option.value)}
              selectedVariant={maxWidth}
              onSelectVariant={(value) => setMaxWidth(value as SectionMaxWidth)}
              type="Max Width"
            />
          </div>

          <div className="flex flex-col items-center">
            <VariantSelector
              variants={animationOptions.map((option) => option.value)}
              selectedVariant={animation}
              onSelectVariant={(value) => setAnimation(value as SectionAnimation)}
              type="Animation"
            />
          </div>

        </div>
      </div>

      {/* Preview and Code Tabs */}
      <Tabs>
        <TabItem value="preview" label="Preview" default>
          <div className="relative">
            
            <div className="relative">
              <div className="mx-auto">
                {/* Preview container */}
                <div className="p-6 border border-gray-100">
                  <Section
                    key={`section-${animation}`}
                    spacing={spacing}
                    padding={padding}
                    maxWidth={maxWidth}
                    animation={animation}
                    className={cn(
                      'transition-all duration-300 ease-in-out transform hover:scale-[1.01]',
                      'bg-gradient-to-br from-gray-50 to-white border-2 border-dashed border-gray-300'
                    )}
                  >
                    <div className="text-center">
                      {/* Icon */}
                      <div className="mb-6">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-lg">
                          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                          </svg>
                        </div>
                      </div>

                      <p className="text-3xl font-bold mb-4 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                        Beautiful Section
                      </p>
                      <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                        This is a stunning section with <span className="font-semibold text-blue-600">{spacing}</span> spacing,
                        <span className="font-semibold text-green-600"> {padding}</span> padding,
                        <span className="font-semibold text-orange-600">{maxWidth}</span> max width,
                        and <span className="font-semibold text-pink-600">{animation}</span> animation.
                      </p>

                      {/* Feature cards - show for all animations */}
                      {(
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                          <div className="group bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
                            <div className="flex items-center mb-4">
                              <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                </svg>
                              </div>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Responsive</h3>
                            <p className="text-blue-100 text-sm">Adapts beautifully to all screen sizes</p>
                          </div>

                          <div className="group bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
                            <div className="flex items-center mb-4">
                              <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                </svg>
                              </div>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Dark Mode</h3>
                            <p className="text-purple-100 text-sm">Perfect dark mode support built-in</p>
                          </div>

                          <div className="group bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
                            <div className="flex items-center mb-4">
                              <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                                </svg>
                              </div>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Customizable</h3>
                            <p className="text-green-100 text-sm">Endless styling possibilities</p>
                          </div>
                        </div>
                      )}

                      {/* Current settings */}
                      <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                        <p className="text-sm font-semibold text-gray-700 mb-3">Current Settings</p>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                          <div className="text-center">
                            <div className="text-xs text-gray-500 mb-1">Spacing</div>
                            <div className="font-semibold text-blue-600">{spacing}</div>
                          </div>
                          <div className="text-center">
                            <div className="text-xs text-gray-500 mb-1">Padding</div>
                            <div className="font-semibold text-green-600">{padding}</div>
                          </div>
                          <div className="text-center">
                            <div className="text-xs text-gray-500 mb-1">Max Width</div>
                            <div className="font-semibold text-orange-600">{maxWidth}</div>
                          </div>
                          <div className="text-center">
                            <div className="text-xs text-gray-500 mb-1">Animation</div>
                            <div className="font-semibold text-pink-600">{animation}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Section>
                </div>
              </div>
            </div>
          </div>
        </TabItem>

        <TabItem value="code" label="Code">
              <CodeBlock language="tsx" className="">
                {codeString}
              </CodeBlock>
        </TabItem>
      </Tabs>
    </div>
  );
};

export default SectionDemo;