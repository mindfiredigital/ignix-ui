import React, { useState } from 'react';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';
import VariantSelector from './VariantSelector';
import {
  MaintenancePage,
  MaintenancePageLogo,
  MaintenancePageHeading,
  MaintenancePageDesc,
  MaintenancePageCountdown,
  MaintenancePageEmailSubscription,
  MaintenancePageSocialIcons,
  MaintenancePageFooter,
} from '@site/src/components/UI/maintenance-page';
import { Settings, Facebook, Twitter, Linkedin, Mail, Wrench } from 'lucide-react';

type MaintenancePageVariant = 'default' | 'minimal' | 'gradient' | 'dark';
type CountdownAnimationType = 'fade' | 'slide' | 'scale' | 'bounce' | 'flip' | 'none';

const variants: MaintenancePageVariant[] = ['default', 'minimal', 'gradient', 'dark'];
const countdownAnimations: CountdownAnimationType[] = ['fade', 'slide', 'scale', 'bounce', 'flip', 'none'];

const defaultIcons = [
  { icon: Facebook, link: "https://www.facebook.com" },
  { icon: Twitter, link: "https://www.twitter.com" },
  { icon: Linkedin, link: "https://www.linkedin.com" },
  { icon: Mail, link: "mailto:support@example.com" },
];

const MaintenancePageDemo = () => {
  const [variant, setVariant] = useState<MaintenancePageVariant>('default');
  const [countdownAnimation, setCountdownAnimation] = useState<CountdownAnimationType>('fade');
  const [showBackgroundImage, setShowBackgroundImage] = useState<boolean>(false);
  const [showIcon, setShowIcon] = useState<boolean>(false);

  // Set target date to 30 days from now
  const targetDate = React.useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() + 30);
    return date;
  }, []);

  const generateCodeString = () => {
    let code = `  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + 30);\n  const icons = [
      { icon: Facebook, link: "https://www.facebook.com" },
      { icon: Twitter, link: "https://www.twitter.com" },
      { icon: Linkedin, link: "https://www.linkedin.com" },
      { icon: Mail, link: "mailto:support@example.com" },
    ];\n  <MaintenancePage\n  variant="${variant}"`;
    
    if (showBackgroundImage) {
      code += `\n  backgroundImage="https://images.unsplash.com/photo-1557683316-973673baf926?w=1600&h=900&fit=crop&q=90"`;
    }
    
    if (showIcon) {
      code += `\n  icon={Settings}`;
      if (showBackgroundImage || variant === 'dark') {
        code += `\n  iconColor="text-white"`;
      }
    }
    code += `\n  >`;
    code += `\n  <MaintenancePageLogo logo={Wrench} companyName="Mindfire Digital" />`;
    code += `\n  <MaintenancePageHeading>SITE UNDER MAINTENANCE</MaintenancePageHeading>`;
    code += `\n  <MaintenancePageDesc>Sorry for the inconvenience. To improve our services, we have momentarily shutdown our site.</MaintenancePageDesc>`;
    code += `\n  <MaintenancePageCountdown targetDate={targetDate} animationType="${countdownAnimation}" />`;
    code += `\n  <MaintenancePageEmailSubscription/>`;
    code += `\n  <MaintenancePageSocialIcons icons={icons} />`;
    code += '\n  <MaintenancePageFooter>copyright{`© ${new Date().getFullYear()} Site Under Maintenance. All rights reserved`}. Design by W3layouts</MaintenancePageFooter>';
  
    code += `\n</MaintenancePage>`;
    
    return code;
  };

  return (
    <div className="space-y-6 mb-8">
      <div className="flex flex-wrap gap-4 justify-start sm:justify-end">
        {!showBackgroundImage && (
          <VariantSelector
            variants={[...variants]}
            selectedVariant={variant}
            onSelectVariant={(v) => setVariant(v as MaintenancePageVariant)}
            type="Variant"
          />
        )}
        <VariantSelector
          variants={[...countdownAnimations]}
          selectedVariant={countdownAnimation}
          onSelectVariant={(v) => setCountdownAnimation(v as CountdownAnimationType)}
          type="Countdown Animation"
        />
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showBackgroundImage}
              onChange={(e) => setShowBackgroundImage(e.target.checked)}
              className="rounded"
            />
            <span className="text-sm">Background Image</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showIcon}
              onChange={(e) => setShowIcon(e.target.checked)}
              className="rounded"
            />
            <span className="text-sm">Animated Icons</span>
          </label>
        </div>
      </div>

      <Tabs>
        <TabItem value="preview" label="Preview">
          <div className="border border-gray-300 rounded-lg overflow-hidden">
            <div className="p-3">
              <MaintenancePage
                variant={variant}
                className="min-h-0"
                {...(showBackgroundImage && {
                  backgroundImage: "https://images.unsplash.com/photo-1557683316-973673baf926?w=1600&h=900&fit=crop&q=90",
                })}
                {...(showIcon && {
                  icon: Settings,
                  iconColor: showBackgroundImage || variant === 'dark' ? "text-white" : "text-gray-400",
                })}
              >
                <MaintenancePageLogo logo={Wrench} companyName="Mindfire Digital" />
                <MaintenancePageHeading>SITE UNDER MAINTENANCE</MaintenancePageHeading>
                <MaintenancePageDesc>Sorry for the inconvenience. To improve our services, we have momentarily shutdown our site.</MaintenancePageDesc>
                <MaintenancePageCountdown 
                  targetDate={targetDate} 
                  animationType={countdownAnimation}
                />
                <MaintenancePageEmailSubscription/>
                <MaintenancePageSocialIcons icons={defaultIcons} />
                <MaintenancePageFooter>copyright{`© ${new Date().getFullYear()} Site Under Maintenance. All rights reserved`}. Design by W3layouts</MaintenancePageFooter>
              </MaintenancePage>
            </div>
          </div>
        </TabItem>
        <TabItem value="code" label="Code">
          <CodeBlock language="tsx" className="whitespace-pre-wrap max-h-[500px] overflow-y-scroll">
            {generateCodeString()}
          </CodeBlock>
        </TabItem>
      </Tabs>
    </div>
  );
};

const SplitDemo = () => {
  // Set target date to 37 days from now
  const targetDate = React.useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() + 37);
    date.setHours(2, 57, 19);
    return date;
  }, []);

  const codeString = `  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + 30);\n  const icons = [
      { icon: Facebook, link: "https://www.facebook.com" },
      { icon: Twitter, link: "https://www.twitter.com" },
      { icon: Linkedin, link: "https://www.linkedin.com" },
      { icon: Mail, link: "mailto:support@example.com" },
    ];\n  <MaintenancePage
    variant="default"
    split
    backgroundImage="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&h=900&fit=crop&q=90"
  >
  {/* Left Section - Logo, Heading, Description */}
  <MaintenancePageLogo logo={Wrench} companyName="MEETANSHI" />
  <MaintenancePageHeading>COMING SOON!</MaintenancePageHeading>
  <MaintenancePageDesc>
    Our Website is under Maintenance. We'll be here soon with our new awesome site.
  </MaintenancePageDesc>

  {/* Right Section - Countdown */}
  <div className="w-full">
    <p className="text-white text-sm mb-4 text-center lg:text-left">
      The maintenance will ends on
    </p>
    <MaintenancePageCountdown targetDate={targetDate} />
  </div>

  {/* Bottom Section - Email Subscription */}
  <div className="w-full max-w-2xl space-y-4">
    <p className="text-white text-center mb-2">
      Get mail for exclusive offers in your inbox
    </p>
    <MaintenancePageEmailSubscription
      placeholder="Your email address"
      buttonText="Notify me"
    />
  </div>

  {/* Social Icons Section */}
  <div className="w-full max-w-2xl space-y-2">
    <p className="text-white text-center">Connect with us</p>
    <MaintenancePageSocialIcons icons={icons} />
  </div>

  {/* Footer */}
  <MaintenancePageFooter>
    This store is maintained by meetanshi.com
  </MaintenancePageFooter>
</MaintenancePage>`;

  return (
    <div className="space-y-6 mb-8">
      <div>
        <Tabs>
          <TabItem value="split-preview" label="Preview">
            <div className="border border-gray-300 rounded-lg overflow-hidden">
              <div className="p-3">
                <MaintenancePage
                  variant="default"
                  split
                  backgroundImage="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&h=900&fit=crop&q=90"
                  className="min-h-0"
                >
                  {/* Left Section - Logo, Heading, Description */}
                  <MaintenancePageLogo logo={Wrench} companyName="MEETANSHI" />
                  <MaintenancePageHeading>COMING SOON!</MaintenancePageHeading>
                  <MaintenancePageDesc>
                    Our Website is under Maintenance. We'll be here soon with our new awesome site.
                  </MaintenancePageDesc>

                  {/* Right Section - Countdown */}
                  <div className="w-full">
                    <p className="text-white text-sm mb-4 text-center lg:text-left">
                      The maintenance will ends on
                    </p>
                    <MaintenancePageCountdown targetDate={targetDate} />
                  </div>

                  {/* Bottom Section - Email Subscription */}
                  <div className="w-full max-w-2xl space-y-4">
                    <p className="text-white text-center mb-2">
                      Get mail for exclusive offers in your inbox
                    </p>
                    <MaintenancePageEmailSubscription
                      placeholder="Your email address"
                      buttonText="Notify me"
                    />
                  </div>

                  {/* Social Icons Section */}
                  <div className="w-full max-w-2xl space-y-2">
                    <p className="text-white text-center">Connect with us</p>
                    <MaintenancePageSocialIcons icons={defaultIcons} />
                  </div>

                  {/* Footer */}
                  <MaintenancePageFooter>
                    This store is maintained by meetanshi.com
                  </MaintenancePageFooter>
                </MaintenancePage>
              </div>
            </div>
          </TabItem>
          <TabItem value="split-code" label="Code">
            <CodeBlock language="tsx" className="whitespace-pre-wrap max-h-[500px] overflow-y-scroll">
              {codeString}
            </CodeBlock>
          </TabItem>
        </Tabs>
      </div>
    </div>
  );
};

export { MaintenancePageDemo, SplitDemo };
