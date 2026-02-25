// import React, { useState } from 'react';
// import {
//     Accordion,
//     AccordionItem,
//     AccordionTitle,
//     AccordionSummary,
//     AccordionDetails,
//     AccordionLink
// } from '@site/src/components/UI/faq-accordion';
// import Tabs from '@theme/Tabs';
// import TabItem from '@theme/TabItem';
// import CodeBlock from '@theme/CodeBlock';
// import VariantSelector from './VariantSelector';
// import {
//     Globe, Users, Shield, Settings, Cpu, TrendingUp,
//     Lock, Zap, Sparkles, Award, Rocket, Mail, Handshake,
//     Sun, Moon, Coffee
// } from 'lucide-react';
// import { Typography } from '@site/src/components/UI/typography';
// import { useColorMode } from '@docusaurus/theme-common';

// // Handshake icon component (since it might not be in lucide-react)
// function HandshakeIcon(props: React.SVGProps<SVGSVGElement>) {
//     return (
//         <svg
//             {...props}
//             xmlns="http://www.w3.org/2000/svg"
//             width="24"
//             height="24"
//             viewBox="0 0 24 24"
//             fill="none"
//             stroke="currentColor"
//             strokeWidth="2"
//             strokeLinecap="round"
//             strokeLinejoin="round"
//         >
//             <path d="M11 15L6 10" />
//             <path d="M18 8L13 13" />
//             <path d="M2 11L6 15" />
//             <path d="M22 11L18 15" />
//             <path d="M6 15L11 20" />
//             <path d="M18 15L13 20" />
//             <path d="M9 7L12 4L15 7" />
//             <path d="M12 4V8" />
//         </svg>
//     );
// }

// const themeOptions = [
//     { value: 'light', label: 'Light' },
//     { value: 'dark', label: 'Dark' },
//     { value: 'midnight', label: 'Midnight' },
//     { value: 'ocean', label: 'Ocean' },
//     { value: 'forest', label: 'Forest' },
//     { value: 'sunset', label: 'Sunset' },
// ];

// const iconStyleOptions = [
//     { value: 'chevron', label: 'Chevron' },
//     { value: 'plus-minus', label: 'Plus/Minus' },
//     { value: 'arrow', label: 'Arrow' },
//     { value: 'checkmark', label: 'Checkmark' },
// ];

// const variantOptions = [
//     { value: 'default', label: 'Default' },
//     { value: 'card', label: 'Card' },
//     { value: 'bordered', label: 'Bordered' },
//     { value: 'minimal', label: 'Minimal' },
//     { value: 'glass', label: 'Glass' },
//     { value: 'gradient', label: 'Gradient' },
// ];

// const animationOptions = [
//     { value: 'fade', label: 'Fade' },
//     { value: 'slide', label: 'Slide' },
//     { value: 'scale', label: 'Scale' },
//     { value: 'flip', label: 'Flip' },
//     { value: 'reveal', label: 'Reveal' },
// ];

// /* ============================================
//    DEMO 1: CENTERED ACCORDION
//    Simple centered accordions with heading
// ============================================ */

// export const AccordionCenteredDemo = () => {
//     const { colorMode } = useColorMode();
//     const [openItems, setOpenItems] = useState<string[]>(['1']);
//     const [theme, setTheme] = useState<'light' | 'dark' | 'midnight' | 'ocean' | 'forest' | 'sunset'>(colorMode === 'dark' ? 'dark' : 'light');
//     const [iconStyle, setIconStyle] = useState<'chevron' | 'plus-minus' | 'arrow' | 'checkmark'>('chevron');
//     const [variant, setVariant] = useState<'default' | 'card' | 'bordered' | 'minimal' | 'glass' | 'gradient'>('default');
//     const [animation, setAnimation] = useState<'fade' | 'slide' | 'scale' | 'flip' | 'reveal'>('slide');
//     const [singleOpen, setSingleOpen] = useState(false);
//     const [showBorder, setShowBorder] = useState(true);

//     // Build code string
//     const codeString = `<Accordion
//   value={openItems}
//   onValueChange={setOpenItems}
//   variant="${variant}"
//   animationVariant="${animation}"
//   iconStyle="${iconStyle}"
//   theme="${theme}"
//   enableSingleOpen={${singleOpen}}
// >
//   <AccordionItem id="1">
//     <AccordionSummary id="1">
//       <AccordionTitle icon={<Globe className="w-5 h-5" />} category="General">
//         What is Web3 Africa?
//       </AccordionTitle>
//     </AccordionSummary>
//     <AccordionDetails id="1">
//       <Typography variant="body-small">
//         Web3 Africa is a community-driven initiative focused on educating and empowering
//         African developers, entrepreneurs, and creators to build in the decentralized web.
//       </Typography>
//       <AccordionLink href="/learn-more">
//         Learn more about Web3 Africa
//       </AccordionLink>
//     </AccordionDetails>
//   </AccordionItem>

//   <AccordionItem id="2">
//     <AccordionSummary id="2">
//       <AccordionTitle icon={<Users className="w-5 h-5" />} category="Programs">
//         Who can join the SkillChain Program?
//       </AccordionTitle>
//     </AccordionSummary>
//     <AccordionDetails id="2">
//       <Typography variant="body-small">
//         The SkillChain Program is open to anyone with a passion for blockchain technology
//         and Web3 development, from beginners to experienced developers.
//       </Typography>
//     </AccordionDetails>
//   </AccordionItem>

//   <AccordionItem id="3">
//     <AccordionSummary id="3">
//       <AccordionTitle icon={<HandshakeIcon className="w-5 h-5" />} category="Partnership">
//         How can I become a partner?
//       </AccordionTitle>
//     </AccordionSummary>
//     <AccordionDetails id="3">
//       <Typography variant="body-small">
//         We're always open to collaborating with organizations that share our vision.
//         Reach out to our partnership team to explore opportunities.
//       </Typography>
//       <AccordionLink href="mailto:partners@web3africa.com">
//         Contact partnership team
//       </AccordionLink>
//     </AccordionDetails>
//   </AccordionItem>
// </Accordion>`;

//     const effectiveVariant = showBorder ? variant : 'minimal';

//     return (
//         <div className="space-y-4">
//             <div className="flex flex-wrap gap-4 justify-start sm:justify-end">
//                 <div className="space-y-2">
//                     <VariantSelector
//                         variants={themeOptions.map(t => t.value)}
//                         selectedVariant={theme}
//                         onSelectVariant={(value) => setTheme(value as any)}
//                         type="Theme"
//                     />
//                 </div>
//                 <div className="space-y-2">
//                     <VariantSelector
//                         variants={iconStyleOptions.map(i => i.value)}
//                         selectedVariant={iconStyle}
//                         onSelectVariant={(value) => setIconStyle(value as any)}
//                         type="Icon Style"
//                     />
//                 </div>
//                 <div className="space-y-2">
//                     <VariantSelector
//                         variants={variantOptions.map(v => v.value)}
//                         selectedVariant={variant}
//                         onSelectVariant={(value) => setVariant(value as any)}
//                         type="Variant"
//                     />
//                 </div>
//                 <div className="space-y-2">
//                     <VariantSelector
//                         variants={animationOptions.map(a => a.value)}
//                         selectedVariant={animation}
//                         onSelectVariant={(value) => setAnimation(value as any)}
//                         type="Animation"
//                     />
//                 </div>
//             </div>

//             <div className="flex flex-wrap gap-4 justify-start sm:justify-end rounded-lg">
//                 <label className="flex items-center gap-2 cursor-pointer">
//                     <input
//                         type="checkbox"
//                         checked={singleOpen}
//                         onChange={(e) => {
//                             setSingleOpen(e.target.checked);
//                             if (e.target.checked && openItems.length > 1) {
//                                 setOpenItems([openItems[0]]);
//                             }
//                         }}
//                         className="rounded"
//                     />
//                     <span className="text-sm">Single Open</span>
//                 </label>
//                 <label className="flex items-center gap-2 cursor-pointer">
//                     <input
//                         type="checkbox"
//                         checked={showBorder}
//                         onChange={(e) => setShowBorder(e.target.checked)}
//                         className="rounded"
//                     />
//                     <span className="text-sm">Show Border</span>
//                 </label>
//             </div>


//             <Tabs>
//                 <TabItem value="preview" label="Preview">
//                     <div className={`border border-gray-300 p-6 rounded-lg overflow-hidden mt-4 ${theme === 'dark' || theme === 'midnight' || theme === 'ocean' ||
//                         theme === 'forest' || theme === 'sunset' ? 'bg-gray-950' : 'bg-white'
//                         }`}>
//                         <Accordion
//                             value={openItems}
//                             onValueChange={setOpenItems}
//                             variant={effectiveVariant}
//                             animationVariant={animation}
//                             iconStyle={iconStyle}
//                             theme={theme}
//                             enableSingleOpen={singleOpen}
//                         >
//                             <AccordionItem id="1">
//                                 <AccordionSummary id="1">
//                                     <AccordionTitle icon={<Globe className="w-5 h-5" />} category="General">
//                                         What is Web3 Africa?
//                                     </AccordionTitle>
//                                 </AccordionSummary>
//                                 <AccordionDetails id="1">
//                                     <Typography variant="body-small" className="leading-relaxed">
//                                         Web3 Africa is a community-driven initiative focused on educating and empowering
//                                         African developers, entrepreneurs, and creators to build and participate in the
//                                         decentralized web. We offer training programs, hackathons, and networking events across the continent.
//                                     </Typography>
//                                     <AccordionLink href="/learn-more">
//                                         Learn more about Web3 Africa
//                                     </AccordionLink>
//                                 </AccordionDetails>
//                             </AccordionItem>

//                             <AccordionItem id="2">
//                                 <AccordionSummary id="2">
//                                     <AccordionTitle icon={<Users className="w-5 h-5" />} category="Programs">
//                                         Who can join the SkillChain Program?
//                                     </AccordionTitle>
//                                 </AccordionSummary>
//                                 <AccordionDetails id="2">
//                                     <Typography variant="body-small" className="leading-relaxed">
//                                         The SkillChain Program is open to anyone with a passion for blockchain technology
//                                         and Web3 development. Whether you're a complete beginner or an experienced developer,
//                                         we have tracks tailored to your skill level. Basic programming knowledge is recommended but not required.
//                                     </Typography>
//                                 </AccordionDetails>
//                             </AccordionItem>

//                             <AccordionItem id="3">
//                                 <AccordionSummary id="3">
//                                     <AccordionTitle icon={<HandshakeIcon className="w-5 h-5" />} category="Partnership">
//                                         How can I become a partner?
//                                     </AccordionTitle>
//                                 </AccordionSummary>
//                                 <AccordionDetails id="3">
//                                     <Typography variant="body-small" className="leading-relaxed">
//                                         We are always open to collaborating with organizations that share our vision for a
//                                         decentralized Africa. If you're interested in partnering with us on events, education,
//                                         or ecosystem development, please reach out to our partnership team.
//                                     </Typography>
//                                     <AccordionLink href="mailto:partners@web3africa.com">
//                                         Contact partnership team
//                                     </AccordionLink>
//                                 </AccordionDetails>
//                             </AccordionItem>
//                         </Accordion>
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

// /* ============================================
//    DEMO 2: SPLIT ACCORDION
//    Accordions with content on left/right
// ============================================ */

// export const AccordionSplitDemo = () => {
//     const { colorMode } = useColorMode();
//     const [openItems, setOpenItems] = useState<string[]>(['1']);
//     const [theme, setTheme] = useState<'light' | 'dark' | 'midnight' | 'ocean' | 'forest' | 'sunset'>(colorMode === 'dark' ? 'dark' : 'light');
//     const [iconStyle, setIconStyle] = useState<'chevron' | 'plus-minus' | 'arrow' | 'checkmark'>('chevron');
//     const [variant, setVariant] = useState<'default' | 'card' | 'bordered' | 'minimal' | 'glass' | 'gradient'>('default');
//     const [animation, setAnimation] = useState<'fade' | 'slide' | 'scale' | 'flip' | 'reveal'>('slide');
//     const [contentSide, setContentSide] = useState<'left' | 'right'>('left');

//     // Build code string
//     const codeString = `<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
//   <div className={${contentSide === 'left' ? '"order-1"' : '"order-2"'}}>
//     <Typography variant="h2" weight="bold" className="text-4xl mb-4">
//       Frequently Asked Questions
//     </Typography>
//     <Typography variant="lead" color="muted" className="text-lg mb-6">
//       Have questions? We're here to help you understand everything about our platform.
//     </Typography>
//     <div className="bg-primary/5 p-6 rounded-2xl">
//       <Typography variant="h6" weight="semibold" className="mb-2">
//         Still have questions?
//       </Typography>
//       <Typography variant="body-small" color="muted" className="mb-4">
//         Can't find what you're looking for? Reach out to our support team.
//       </Typography>
//       <Button variant="default">Contact Support</Button>
//     </div>
//   </div>

//   <div className={${contentSide === 'left' ? '"order-2"' : '"order-1"'}}>
//     <Accordion
//       value={openItems}
//       onValueChange={setOpenItems}
//       variant="${variant}"
//       animationVariant="${animation}"
//       iconStyle="${iconStyle}"
//       theme="${theme}"
//     >
//       {/* Accordion items */}
//     </Accordion>
//   </div>
// </div>`;

//     return (
//         <div className="space-y-4">
//             <div className="flex flex-wrap gap-4 justify-start sm:justify-end">
//                 <div className="space-y-2">
//                     <VariantSelector
//                         variants={themeOptions.map(t => t.value)}
//                         selectedVariant={theme}
//                         onSelectVariant={(value) => setTheme(value as any)}
//                         type="Theme"
//                     />
//                 </div>
//                 <div className="space-y-2">
//                     <VariantSelector
//                         variants={iconStyleOptions.map(i => i.value)}
//                         selectedVariant={iconStyle}
//                         onSelectVariant={(value) => setIconStyle(value as any)}
//                         type="Icon Style"
//                     />
//                 </div>
//                 <div className="space-y-2">
//                     <VariantSelector
//                         variants={variantOptions.map(v => v.value)}
//                         selectedVariant={variant}
//                         onSelectVariant={(value) => setVariant(value as any)}
//                         type="Variant"
//                     />
//                 </div>
//                 <div className="space-y-2">
//                     <VariantSelector
//                         variants={animationOptions.map(a => a.value)}
//                         selectedVariant={animation}
//                         onSelectVariant={(value) => setAnimation(value as any)}
//                         type="Animation"
//                     />
//                 </div>
//                 <div className="space-y-2">
//                     <VariantSelector
//                         variants={['left', 'right']}
//                         selectedVariant={contentSide}
//                         onSelectVariant={(value) => setContentSide(value as 'left' | 'right')}
//                         type="Content Side"
//                     />
//                 </div>
//             </div>

//             <Tabs>
//                 <TabItem value="preview" label="Preview">
//                     <div className={`border border-gray-300 p-6 rounded-lg overflow-hidden mt-4 ${theme === 'dark' || theme === 'midnight' || theme === 'ocean' ||
//                         theme === 'forest' || theme === 'sunset' ? 'bg-gray-950' : 'bg-white'
//                         }`}>
//                         <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
//                             {/* Content side */}
//                             <div className={contentSide === 'left' ? 'order-1' : 'order-2'}>
//                                 <Typography
//                                     variant="h2"
//                                     weight="bold"
//                                     className={`text-4xl mb-4 ${theme !== 'light' ? 'text-white' : 'text-gray-900'
//                                         }`}
//                                 >
//                                     Frequently Asked Questions
//                                 </Typography>
//                                 <Typography
//                                     variant="lead"
//                                     className={`text-lg mb-6 ${theme !== 'light' ? 'text-gray-400' : 'text-gray-500'
//                                         }`}
//                                 >
//                                     Have questions? We're here to help you understand everything about our platform.
//                                 </Typography>
//                                 <div className={`p-6 rounded-2xl ${theme !== 'light' ? 'bg-white/5' : 'bg-primary/5'
//                                     }`}>
//                                     <Typography
//                                         variant="h6"
//                                         weight="semibold"
//                                         className={`mb-2 ${theme !== 'light' ? 'text-white' : 'text-gray-900'
//                                             }`}
//                                     >
//                                         Still have questions?
//                                     </Typography>
//                                     <Typography
//                                         variant="body-small"
//                                         className={`mb-4 ${theme !== 'light' ? 'text-gray-400' : 'text-gray-500'
//                                             }`}
//                                     >
//                                         Can't find what you're looking for? Reach out to our support team.
//                                     </Typography>
//                                     <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
//                                         Contact Support
//                                     </button>
//                                 </div>
//                             </div>

//                             {/* Accordion side */}
//                             <div className={contentSide === 'left' ? 'order-2' : 'order-1'}>
//                                 <Accordion
//                                     value={openItems}
//                                     onValueChange={setOpenItems}
//                                     variant={variant}
//                                     animationVariant={animation}
//                                     iconStyle={iconStyle}
//                                     theme={theme}
//                                 >
//                                     <AccordionItem id="1">
//                                         <AccordionSummary id="1">
//                                             <AccordionTitle icon={<Rocket className="w-5 h-5" />}>
//                                                 How do I get started?
//                                             </AccordionTitle>
//                                         </AccordionSummary>
//                                         <AccordionDetails id="1">
//                                             <Typography variant="body-small">
//                                                 Getting started is easy! Sign up for a free account, complete your profile,
//                                                 and you'll have access to all our basic features. Upgrade to premium for
//                                                 advanced features and priority support.
//                                             </Typography>
//                                         </AccordionDetails>
//                                     </AccordionItem>

//                                     <AccordionItem id="2">
//                                         <AccordionSummary id="2">
//                                             <AccordionTitle icon={<Shield className="w-5 h-5" />}>
//                                                 Is my data secure?
//                                             </AccordionTitle>
//                                         </AccordionSummary>
//                                         <AccordionDetails id="2">
//                                             <Typography variant="body-small">
//                                                 Yes, we take security seriously. All data is encrypted using AES-256,
//                                                 we're GDPR compliant, and we perform regular security audits. Your privacy
//                                                 is our priority.
//                                             </Typography>
//                                         </AccordionDetails>
//                                     </AccordionItem>

//                                     <AccordionItem id="3">
//                                         <AccordionSummary id="3">
//                                             <AccordionTitle icon={<Users className="w-5 h-5" />}>
//                                                 Can I invite team members?
//                                             </AccordionTitle>
//                                         </AccordionSummary>
//                                         <AccordionDetails id="3">
//                                             <Typography variant="body-small">
//                                                 Absolutely! Our team plans allow you to invite unlimited team members with
//                                                 role-based access control. You can manage permissions, assign tasks, and
//                                                 collaborate seamlessly.
//                                             </Typography>
//                                         </AccordionDetails>
//                                     </AccordionItem>
//                                 </Accordion>
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

// /* ============================================
//    DEMO 3: VIBRANT/PASTEL/GLASS/GRADIENT ACCORDION
//    Colorful themed accordions with custom styling
// ============================================ */

// export const AccordionVibrantDemo = () => {
//     const [openItems, setOpenItems] = useState<string[]>(['1']);
//     const [theme, setTheme] = useState<'light' | 'dark' | 'midnight' | 'ocean' | 'forest' | 'sunset'>('ocean');
//     const [iconStyle, setIconStyle] = useState<'chevron' | 'plus-minus' | 'arrow' | 'checkmark'>('chevron');
//     const [variant, setVariant] = useState<'default' | 'card' | 'bordered' | 'minimal' | 'glass' | 'gradient'>('glass');
//     const [animation, setAnimation] = useState<'fade' | 'slide' | 'scale' | 'flip' | 'reveal'>('slide');
//     const [showGradient, setShowGradient] = useState(true);
//     const [showIcons, setShowIcons] = useState(true);

//     // Build code string
//     const codeString = `<div className="relative overflow-hidden rounded-2xl p-8 md:p-12 ${theme === 'ocean' ? 'bg-gradient-to-br from-[#0A1929] via-[#0A1A2F] to-[#0C1E3A]' :
//         theme === 'forest' ? 'bg-gradient-to-br from-[#0A1F1A] via-[#0C231E] to-[#0E2822]' :
//             theme === 'sunset' ? 'bg-gradient-to-br from-[#1A0F1F] via-[#201524] to-[#2A1A28]' :
//                 'bg-gradient-to-br from-primary-500/20 via-secondary-500/20 to-accent-500/20'
//         }">
//   <div className="text-center mb-8">
//     <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white mb-4">
//       <Sparkles className="w-4 h-4" />
//       <span className="text-sm font-medium">PREMIUM SUPPORT</span>
//     </div>
//     <Typography variant="h2" weight="bold" className="text-4xl text-white mb-2">
//       Frequently Asked Questions
//     </Typography>
//     <Typography variant="lead" className="text-white/80">
//       Everything you need to know about our premium services
//     </Typography>
//   </div>

//   <Accordion
//     value={openItems}
//     onValueChange={setOpenItems}
//     variant="${variant}"
//     animationVariant="${animation}"
//     iconStyle="${iconStyle}"
//     theme="dark"
//   >
//     {/* Accordion items */}
//   </Accordion>
// </div>`;

//     // Theme-specific gradient backgrounds
//     const getGradientClass = () => {
//         if (!showGradient) return theme !== 'light' ? 'bg-gray-950' : 'bg-white';

//         switch (theme) {
//             case 'ocean':
//                 return 'bg-gradient-to-br from-[#0A1929] via-[#0A1A2F] to-[#0C1E3A]';
//             case 'forest':
//                 return 'bg-gradient-to-br from-[#0A1F1A] via-[#0C231E] to-[#0E2822]';
//             case 'sunset':
//                 return 'bg-gradient-to-br from-[#1A0F1F] via-[#201524] to-[#2A1A28]';
//             case 'midnight':
//                 return 'bg-gradient-to-br from-[#0B1120] via-[#0F1524] to-[#131B2C]';
//             case 'dark':
//                 return 'bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900';
//             default:
//                 return 'bg-gradient-to-br from-primary-500/10 via-secondary-500/10 to-accent-500/10';
//         }
//     };

//     return (
//         <div className="space-y-4">
//             <div className="flex flex-wrap gap-4 justify-start sm:justify-end">
//                 <div className="space-y-2">
//                     <VariantSelector
//                         variants={themeOptions.map(t => t.value)}
//                         selectedVariant={theme}
//                         onSelectVariant={(value) => setTheme(value as any)}
//                         type="Theme"
//                     />
//                 </div>
//                 <div className="space-y-2">
//                     <VariantSelector
//                         variants={iconStyleOptions.map(i => i.value)}
//                         selectedVariant={iconStyle}
//                         onSelectVariant={(value) => setIconStyle(value as any)}
//                         type="Icon Style"
//                     />
//                 </div>
//                 <div className="space-y-2">
//                     <VariantSelector
//                         variants={variantOptions.map(v => v.value)}
//                         selectedVariant={variant}
//                         onSelectVariant={(value) => setVariant(value as any)}
//                         type="Variant"
//                     />
//                 </div>
//                 <div className="space-y-2">
//                     <VariantSelector
//                         variants={animationOptions.map(a => a.value)}
//                         selectedVariant={animation}
//                         onSelectVariant={(value) => setAnimation(value as any)}
//                         type="Animation"
//                     />
//                 </div>
//             </div>

//             <div className="flex flex-wrap gap-4 justify-start sm:justify-end rounded-lg">
//                 <label className="flex items-center gap-2 cursor-pointer">
//                     <input
//                         type="checkbox"
//                         checked={showGradient}
//                         onChange={(e) => setShowGradient(e.target.checked)}
//                         className="rounded"
//                     />
//                     <span className="text-sm">Show Gradient</span>
//                 </label>
//                 <label className="flex items-center gap-2 cursor-pointer">
//                     <input
//                         type="checkbox"
//                         checked={showIcons}
//                         onChange={(e) => setShowIcons(e.target.checked)}
//                         className="rounded"
//                     />
//                     <span className="text-sm">Show Icons</span>
//                 </label>
//             </div>

//             <Tabs>
//                 <TabItem value="preview" label="Preview">
//                     <div className={`border border-gray-300 p-6 rounded-lg overflow-hidden mt-4 ${getGradientClass()}`}>
//                         <div className="text-center mb-8">
//                             <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white mb-4">
//                                 <Sparkles className="w-4 h-4" />
//                                 <span className="text-sm font-medium">PREMIUM SUPPORT</span>
//                             </div>
//                             <Typography
//                                 variant="h2"
//                                 weight="bold"
//                                 className="text-4xl text-white mb-2"
//                             >
//                                 Frequently Asked Questions
//                             </Typography>
//                             <Typography
//                                 variant="lead"
//                                 className="text-white/80"
//                             >
//                                 Everything you need to know about our premium services
//                             </Typography>
//                         </div>

//                         <Accordion
//                             value={openItems}
//                             onValueChange={setOpenItems}
//                             variant={variant}
//                             animationVariant={animation}
//                             iconStyle={iconStyle}
//                             theme="dark"
//                         >
//                             <AccordionItem id="1">
//                                 <AccordionSummary id="1">
//                                     <AccordionTitle
//                                         icon={showIcons ? <Cpu className="w-5 h-5" /> : undefined}
//                                         category="Technology"
//                                     >
//                                         What technology stack do you use?
//                                     </AccordionTitle>
//                                 </AccordionSummary>
//                                 <AccordionDetails id="1">
//                                     <Typography variant="body-small" className="text-white/80">
//                                         We use cutting-edge technologies including React, TypeScript, Node.js, and
//                                         Web3 libraries. Our stack is carefully chosen for performance, security,
//                                         and developer experience.
//                                     </Typography>
//                                 </AccordionDetails>
//                             </AccordionItem>

//                             <AccordionItem id="2">
//                                 <AccordionSummary id="2">
//                                     <AccordionTitle
//                                         icon={showIcons ? <TrendingUp className="w-5 h-5" /> : undefined}
//                                         category="Growth"
//                                     >
//                                         How can your platform help my business grow?
//                                     </AccordionTitle>
//                                 </AccordionSummary>
//                                 <AccordionDetails id="2">
//                                     <Typography variant="body-small" className="text-white/80">
//                                         Our platform provides analytics, automation tools, and insights that help
//                                         you make data-driven decisions. Join thousands of businesses that have
//                                         grown 3x faster with our solutions.
//                                     </Typography>
//                                 </AccordionDetails>
//                             </AccordionItem>

//                             <AccordionItem id="3">
//                                 <AccordionSummary id="3">
//                                     <AccordionTitle
//                                         icon={showIcons ? <Award className="w-5 h-5" /> : undefined}
//                                         category="Premium"
//                                     >
//                                         What's included in the premium plan?
//                                     </AccordionTitle>
//                                 </AccordionSummary>
//                                 <AccordionDetails id="3">
//                                     <Typography variant="body-small" className="text-white/80">
//                                         Premium includes unlimited projects, priority support, advanced analytics,
//                                         custom integrations, and dedicated account manager. Perfect for growing
//                                         businesses and enterprises.
//                                     </Typography>
//                                     <AccordionLink href="/pricing" className="text-white/90 hover:text-white">
//                                         View pricing details
//                                     </AccordionLink>
//                                 </AccordionDetails>
//                             </AccordionItem>

//                             <AccordionItem id="4">
//                                 <AccordionSummary id="4">
//                                     <AccordionTitle
//                                         icon={showIcons ? <Mail className="w-5 h-5" /> : undefined}
//                                         category="Support"
//                                     >
//                                         How do I contact support?
//                                     </AccordionTitle>
//                                 </AccordionSummary>
//                                 <AccordionDetails id="4">
//                                     <Typography variant="body-small" className="text-white/80">
//                                         Premium users get 24/7 priority support via live chat and phone.
//                                         Free users can reach us via email with 24-hour response time.
//                                         We're always here to help!
//                                     </Typography>
//                                 </AccordionDetails>
//                             </AccordionItem>
//                         </Accordion>

//                         <div className="mt-8 text-center">
//                             <button className="px-6 py-3 bg-white/10 backdrop-blur-sm text-white rounded-xl hover:bg-white/20 transition-all duration-300 border border-white/20">
//                                 Still have questions? Contact us
//                             </button>
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


import React, { useState } from 'react';
import {
    Accordion,
    AccordionItem,
    AccordionTitle,
    AccordionSummary,
    AccordionDetails,
    AccordionLink
} from '@site/src/components/UI/faq-accordion';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';
import VariantSelector from './VariantSelector';
import {
    Globe, Users, Shield,  Cpu, TrendingUp,
     Zap, Sparkles, Award, Rocket, Mail,
    Sun, Moon,  Star, Leaf, Flower,
    Cloud, Droplets, Flame, Crown, Gem, Heart,
    Palette, Brush, Snowflake
} from 'lucide-react';
import { Typography } from '@site/src/components/UI/typography';
import { useColorMode } from '@docusaurus/theme-common';

// Handshake icon component
function HandshakeIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M11 15L6 10" />
            <path d="M18 8L13 13" />
            <path d="M2 11L6 15" />
            <path d="M22 11L18 15" />
            <path d="M6 15L11 20" />
            <path d="M18 15L13 20" />
            <path d="M9 7L12 4L15 7" />
            <path d="M12 4V8" />
        </svg>
    );
}

// Theme categories data
const THEME_CATEGORIES = {
    vibrant: [
        { id: 'electric-blue', name: 'Electric Blue', gradient: 'from-blue-600 via-blue-500 to-cyan-500', bg: 'bg-gradient-to-br from-blue-950 via-blue-900 to-cyan-950', icon: <Zap />, accent: 'blue' },
        { id: 'emerald-green', name: 'Emerald Green', gradient: 'from-emerald-600 via-green-500 to-teal-500', bg: 'bg-gradient-to-br from-emerald-950 via-green-950 to-teal-950', icon: <Leaf />, accent: 'emerald' },
        { id: 'royal-purple', name: 'Royal Purple', gradient: 'from-purple-600 via-violet-500 to-fuchsia-500', bg: 'bg-gradient-to-br from-purple-950 via-violet-950 to-fuchsia-950', icon: <Crown />, accent: 'purple' },
        { id: 'sunset-orange', name: 'Sunset Orange', gradient: 'from-orange-600 via-amber-500 to-red-500', bg: 'bg-gradient-to-br from-orange-950 via-amber-950 to-red-950', icon: <Flame />, accent: 'orange' },
        { id: 'ruby-red', name: 'Ruby Red', gradient: 'from-red-600 via-rose-500 to-pink-500', bg: 'bg-gradient-to-br from-red-950 via-rose-950 to-pink-950', icon: <Gem />, accent: 'red' },
        { id: 'cosmic-pink', name: 'Cosmic Pink', gradient: 'from-pink-600 via-fuchsia-500 to-purple-500', bg: 'bg-gradient-to-br from-pink-950 via-fuchsia-950 to-purple-950', icon: <Sparkles />, accent: 'pink' },
    ],
    pastel: [
        { id: 'lavender-dream', name: 'Lavender Dream', gradient: 'from-purple-200 via-pink-200 to-blue-200', bg: 'bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50', icon: <Flower />, accent: 'purple' },
        { id: 'mint-fresh', name: 'Mint Fresh', gradient: 'from-green-200 via-emerald-200 to-teal-200', bg: 'bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50', icon: <Leaf />, accent: 'green' },
        { id: 'peach-blush', name: 'Peach Blush', gradient: 'from-orange-200 via-amber-200 to-yellow-200', bg: 'bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50', icon: <Sun />, accent: 'orange' },
        { id: 'baby-blue', name: 'Baby Blue', gradient: 'from-blue-200 via-cyan-200 to-indigo-200', bg: 'bg-gradient-to-br from-blue-50 via-cyan-50 to-indigo-50', icon: <Cloud />, accent: 'blue' },
        { id: 'cotton-candy', name: 'Cotton Candy', gradient: 'from-pink-200 via-rose-200 to-purple-200', bg: 'bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50', icon: <Heart />, accent: 'pink' },
        { id: 'seafoam', name: 'Seafoam', gradient: 'from-teal-200 via-cyan-200 to-green-200', bg: 'bg-gradient-to-br from-teal-50 via-cyan-50 to-green-50', icon: <Droplets />, accent: 'teal' },
    ],
    glass: [
        { id: 'crystal-clear', name: 'Crystal Clear', bg: 'backdrop-blur-md bg-white/10 border-white/20', icon: <Sparkles />, accent: 'white' },
        { id: 'frosted-amber', name: 'Frosted Amber', bg: 'backdrop-blur-md bg-amber-500/10 border-amber-500/20', icon: <Sun />, accent: 'amber' },
        { id: 'ocean-mist', name: 'Ocean Mist', bg: 'backdrop-blur-md bg-blue-500/10 border-blue-500/20', icon: <Droplets />, accent: 'blue' },
        { id: 'rose-quartz', name: 'Rose Quartz', bg: 'backdrop-blur-md bg-pink-500/10 border-pink-500/20', icon: <Heart />, accent: 'pink' },
        { id: 'emerald-frost', name: 'Emerald Frost', bg: 'backdrop-blur-md bg-emerald-500/10 border-emerald-500/20', icon: <Leaf />, accent: 'emerald' },
        { id: 'amethyst-glow', name: 'Amethyst Glow', bg: 'backdrop-blur-md bg-purple-500/10 border-purple-500/20', icon: <Gem />, accent: 'purple' },
    ],
    gradient: [
        { id: 'aurora-borealis', name: 'Aurora', gradient: 'from-green-400 via-blue-500 to-purple-600', bg: 'bg-gradient-to-br from-green-900 via-blue-900 to-purple-900', icon: <Sparkles />, accent: 'blue' },
        { id: 'sunset-blaze', name: 'Sunset Blaze', gradient: 'from-red-500 via-orange-500 to-yellow-500', bg: 'bg-gradient-to-br from-red-900 via-orange-900 to-yellow-900', icon: <Sun />, accent: 'orange' },
        { id: 'ocean-deep', name: 'Ocean Deep', gradient: 'from-cyan-500 via-blue-500 to-indigo-600', bg: 'bg-gradient-to-br from-cyan-900 via-blue-900 to-indigo-900', icon: <Droplets />, accent: 'blue' },
        { id: 'forest-canopy', name: 'Forest Canopy', gradient: 'from-green-500 via-emerald-500 to-teal-500', bg: 'bg-gradient-to-br from-green-900 via-emerald-900 to-teal-900', icon: <Leaf />, accent: 'green' },
        { id: 'fire-and-ice', name: 'Fire & Ice', gradient: 'from-red-500 via-purple-500 to-blue-500', bg: 'bg-gradient-to-br from-red-900 via-purple-900 to-blue-900', icon: <Flame />, accent: 'purple' },
        { id: 'golden-hour', name: 'Golden Hour', gradient: 'from-amber-500 via-yellow-500 to-orange-500', bg: 'bg-gradient-to-br from-amber-900 via-yellow-900 to-orange-900', icon: <Crown />, accent: 'yellow' },
    ],
    seasonal: [
        { id: 'christmas', name: 'Christmas', gradient: 'from-red-600 via-green-500 to-red-600', bg: 'bg-gradient-to-br from-red-900 via-green-900 to-red-900', icon: <Star />, accent: 'red' },
        { id: 'halloween', name: 'Halloween', gradient: 'from-orange-600 via-purple-600 to-black', bg: 'bg-gradient-to-br from-orange-900 via-purple-900 to-gray-950', icon: <Moon />, accent: 'orange' },
        { id: 'spring', name: 'Spring', gradient: 'from-pink-400 via-green-300 to-yellow-200', bg: 'bg-gradient-to-br from-pink-900 via-green-900 to-yellow-900', icon: <Flower />, accent: 'pink' },
        { id: 'summer', name: 'Summer', gradient: 'from-yellow-400 via-orange-400 to-red-400', bg: 'bg-gradient-to-br from-yellow-900 via-orange-900 to-red-900', icon: <Sun />, accent: 'yellow' },
        { id: 'autumn', name: 'Autumn', gradient: 'from-orange-600 via-amber-600 to-yellow-600', bg: 'bg-gradient-to-br from-orange-900 via-amber-900 to-yellow-900', icon: <Leaf />, accent: 'orange' },
        { id: 'winter', name: 'Winter', gradient: 'from-blue-300 via-cyan-200 to-white', bg: 'bg-gradient-to-br from-blue-900 via-cyan-900 to-gray-900', icon: <Snowflake />, accent: 'blue' },
    ],
};

const themeOptions = [
    { value: 'light', label: 'Light' },
    { value: 'dark', label: 'Dark' },
    { value: 'midnight', label: 'Midnight' },
    { value: 'ocean', label: 'Ocean' },
    { value: 'forest', label: 'Forest' },
    { value: 'sunset', label: 'Sunset' },
];

const iconStyleOptions = [
    { value: 'chevron', label: 'Chevron' },
    { value: 'plus-minus', label: 'Plus/Minus' },
    { value: 'arrow', label: 'Arrow' },
    { value: 'checkmark', label: 'Checkmark' },
];

const variantOptions = [
    { value: 'default', label: 'Default' },
    { value: 'card', label: 'Card' },
    { value: 'bordered', label: 'Bordered' },
    { value: 'minimal', label: 'Minimal' },
    { value: 'glass', label: 'Glass' },
    { value: 'gradient', label: 'Gradient' },
];

const animationOptions = [
    { value: 'fade', label: 'Fade' },
    { value: 'slide', label: 'Slide' },
    { value: 'scale', label: 'Scale' },
    { value: 'flip', label: 'Flip' },
    { value: 'reveal', label: 'Reveal' },
];

/* ============================================
   DEMO 1: CENTERED ACCORDION
============================================ */

export const AccordionCenteredDemo = () => {
    const { colorMode } = useColorMode();
    const [openItems, setOpenItems] = useState<string[]>(['1']);
    const [theme, setTheme] = useState<'light' | 'dark' | 'midnight' | 'ocean' | 'forest' | 'sunset'>(colorMode === 'dark' ? 'dark' : 'light');
    const [iconStyle, setIconStyle] = useState<'chevron' | 'plus-minus' | 'arrow' | 'checkmark'>('chevron');
    const [variant, setVariant] = useState<'default' | 'card' | 'bordered' | 'minimal' | 'glass' | 'gradient'>('default');
    const [animation, setAnimation] = useState<'fade' | 'slide' | 'scale' | 'flip' | 'reveal'>('slide');
    const [singleOpen, setSingleOpen] = useState(false);
    const [showBorder, setShowBorder] = useState(true);

    // Build code string
    const codeString = `<Accordion
  value={openItems}
  onValueChange={setOpenItems}
  variant="${variant}"
  animationVariant="${animation}"
  iconStyle="${iconStyle}"
  theme="${theme}"
  enableSingleOpen={${singleOpen}}
>
  <AccordionItem id="1">
    <AccordionSummary id="1">
      <AccordionTitle icon={<Globe className="w-5 h-5" />} category="General">
        What is Web3 Africa?
      </AccordionTitle>
    </AccordionSummary>
    <AccordionDetails id="1">
      <Typography variant="body-small">
        Web3 Africa is a community-driven initiative...
      </Typography>
      <AccordionLink href="/learn-more">
        Learn more about Web3 Africa
      </AccordionLink>
    </AccordionDetails>
  </AccordionItem>
</Accordion>`;

    const effectiveVariant = showBorder ? variant : 'minimal';

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap gap-4 justify-start sm:justify-end">
                <VariantSelector
                    variants={themeOptions.map(t => t.value)}
                    selectedVariant={theme}
                    onSelectVariant={(value) => setTheme(value as any)}
                    type="Theme"
                />
                <VariantSelector
                    variants={iconStyleOptions.map(i => i.value)}
                    selectedVariant={iconStyle}
                    onSelectVariant={(value) => setIconStyle(value as any)}
                    type="Icon Style"
                />
                <VariantSelector
                    variants={variantOptions.map(v => v.value)}
                    selectedVariant={variant}
                    onSelectVariant={(value) => setVariant(value as any)}
                    type="Variant"
                />
                <VariantSelector
                    variants={animationOptions.map(a => a.value)}
                    selectedVariant={animation}
                    onSelectVariant={(value) => setAnimation(value as any)}
                    type="Animation"
                />
            </div>

            <div className="flex flex-wrap gap-4 justify-start sm:justify-end rounded-lg">
                <label className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={singleOpen}
                        onChange={(e) => {
                            setSingleOpen(e.target.checked);
                            if (e.target.checked && openItems.length > 1) {
                                setOpenItems([openItems[0]]);
                            }
                        }}
                        className="rounded"
                    />
                    <span className="text-sm">Single Open</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={showBorder}
                        onChange={(e) => setShowBorder(e.target.checked)}
                        className="rounded"
                    />
                    <span className="text-sm">Show Border</span>
                </label>
            </div>

            <Tabs>
                <TabItem value="preview" label="Preview">
                    <div className={`border border-gray-300 p-6 rounded-lg overflow-hidden mt-4 ${theme === 'dark' || theme === 'midnight' || theme === 'ocean' ||
                            theme === 'forest' || theme === 'sunset' ? 'bg-gray-950' : 'bg-white'
                        }`}>
                        <Accordion
                            value={openItems}
                            onValueChange={setOpenItems}
                            variant={effectiveVariant}
                            animationVariant={animation}
                            iconStyle={iconStyle}
                            theme={theme}
                            enableSingleOpen={singleOpen}
                        >
                            <AccordionItem id="1">
                                <AccordionSummary id="1">
                                    <AccordionTitle icon={<Globe className="w-5 h-5" />} category="General">
                                        What is Web3 Africa?
                                    </AccordionTitle>
                                </AccordionSummary>
                                <AccordionDetails id="1">
                                    <Typography variant="body-small" className="leading-relaxed">
                                        Web3 Africa is a community-driven initiative focused on educating and empowering
                                        African developers, entrepreneurs, and creators to build and participate in the
                                        decentralized web.
                                    </Typography>
                                    <AccordionLink href="/learn-more">
                                        Learn more about Web3 Africa
                                    </AccordionLink>
                                </AccordionDetails>
                            </AccordionItem>

                            <AccordionItem id="2">
                                <AccordionSummary id="2">
                                    <AccordionTitle icon={<Users className="w-5 h-5" />} category="Programs">
                                        Who can join the SkillChain Program?
                                    </AccordionTitle>
                                </AccordionSummary>
                                <AccordionDetails id="2">
                                    <Typography variant="body-small" className="leading-relaxed">
                                        The SkillChain Program is open to anyone with a passion for blockchain technology
                                        and Web3 development, from beginners to experienced developers.
                                    </Typography>
                                </AccordionDetails>
                            </AccordionItem>

                            <AccordionItem id="3">
                                <AccordionSummary id="3">
                                    <AccordionTitle icon={<HandshakeIcon className="w-5 h-5" />} category="Partnership">
                                        How can I become a partner?
                                    </AccordionTitle>
                                </AccordionSummary>
                                <AccordionDetails id="3">
                                    <Typography variant="body-small" className="leading-relaxed">
                                        We're always open to collaborating with organizations that share our vision.
                                        Reach out to our partnership team to explore opportunities.
                                    </Typography>
                                    <AccordionLink href="mailto:partners@web3africa.com">
                                        Contact partnership team
                                    </AccordionLink>
                                </AccordionDetails>
                            </AccordionItem>
                        </Accordion>
                    </div>
                </TabItem>
                <TabItem value="code" label="Code">
                    <div className="mt-4">
                        <CodeBlock language="tsx" className="text-sm">
                            {codeString}
                        </CodeBlock>
                    </div>
                </TabItem>
            </Tabs>
        </div>
    );
};

/* ============================================
   DEMO 2: SPLIT ACCORDION
============================================ */

export const AccordionSplitDemo = () => {
    const { colorMode } = useColorMode();
    const [openItems, setOpenItems] = useState<string[]>(['1']);
    const [theme, setTheme] = useState<'light' | 'dark' | 'midnight' | 'ocean' | 'forest' | 'sunset'>(colorMode === 'dark' ? 'dark' : 'light');
    const [iconStyle, setIconStyle] = useState<'chevron' | 'plus-minus' | 'arrow' | 'checkmark'>('chevron');
    const [variant, setVariant] = useState<'default' | 'card' | 'bordered' | 'minimal' | 'glass' | 'gradient'>('default');
    const [animation, setAnimation] = useState<'fade' | 'slide' | 'scale' | 'flip' | 'reveal'>('slide');
    const [contentSide, setContentSide] = useState<'left' | 'right'>('left');
    const [accentColor, setAccentColor] = useState('primary');

    // Build code string
    const codeString = `<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
  <div className={${contentSide === 'left' ? '"order-1"' : '"order-2"'}}>
    <Typography variant="h2" weight="bold" className="text-4xl mb-4">
      Frequently Asked Questions
    </Typography>
    <Typography variant="lead" className="text-lg mb-6">
      Have questions? We're here to help.
    </Typography>
    <div className="bg-${accentColor}/5 p-6 rounded-2xl">
      <Typography variant="h6" weight="semibold" className="mb-2">
        Still have questions?
      </Typography>
      <Typography variant="body-small" className="mb-4">
        Reach out to our support team.
      </Typography>
      <button className="px-4 py-2 bg-${accentColor} text-white rounded-lg">
        Contact Support
      </button>
    </div>
  </div>

  <div className={${contentSide === 'left' ? '"order-2"' : '"order-1"'}}>
    <Accordion
      value={openItems}
      onValueChange={setOpenItems}
      variant="${variant}"
      animationVariant="${animation}"
      iconStyle="${iconStyle}"
      theme="${theme}"
    >
      {/* Accordion items */}
    </Accordion>
  </div>
</div>`;

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap gap-4 justify-start sm:justify-end">
                <VariantSelector
                    variants={themeOptions.map(t => t.value)}
                    selectedVariant={theme}
                    onSelectVariant={(value) => setTheme(value as any)}
                    type="Theme"
                />
                <VariantSelector
                    variants={iconStyleOptions.map(i => i.value)}
                    selectedVariant={iconStyle}
                    onSelectVariant={(value) => setIconStyle(value as any)}
                    type="Icon Style"
                />
                <VariantSelector
                    variants={variantOptions.map(v => v.value)}
                    selectedVariant={variant}
                    onSelectVariant={(value) => setVariant(value as any)}
                    type="Variant"
                />
                <VariantSelector
                    variants={animationOptions.map(a => a.value)}
                    selectedVariant={animation}
                    onSelectVariant={(value) => setAnimation(value as any)}
                    type="Animation"
                />
                <VariantSelector
                    variants={['left', 'right']}
                    selectedVariant={contentSide}
                    onSelectVariant={(value) => setContentSide(value as 'left' | 'right')}
                    type="Content Side"
                />
            </div>

            <div className="flex flex-wrap gap-4 justify-start sm:justify-end">
                <select
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm"
                >
                    <option value="primary">Primary</option>
                    <option value="blue-500">Blue</option>
                    <option value="green-500">Green</option>
                    <option value="purple-500">Purple</option>
                    <option value="orange-500">Orange</option>
                    <option value="pink-500">Pink</option>
                </select>
            </div>

            <Tabs>
                <TabItem value="preview" label="Preview">
                    <div className={`border border-gray-300 p-6 rounded-lg overflow-hidden mt-4 ${theme === 'dark' || theme === 'midnight' || theme === 'ocean' ||
                            theme === 'forest' || theme === 'sunset' ? 'bg-gray-950' : 'bg-white'
                        }`}>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                            {/* Content side */}
                            <div className={contentSide === 'left' ? 'order-1' : 'order-2'}>
                                <Typography
                                    variant="h2"
                                    weight="bold"
                                    className={`text-4xl mb-4 ${theme !== 'light' ? 'text-white' : 'text-gray-900'}`}
                                >
                                    Frequently Asked Questions
                                </Typography>
                                <Typography
                                    variant="lead"
                                    className={`text-lg mb-6 ${theme !== 'light' ? 'text-gray-400' : 'text-gray-500'}`}
                                >
                                    Have questions? We're here to help you understand everything about our platform.
                                </Typography>
                                <div className={`p-6 rounded-2xl ${theme !== 'light' ? `bg-${accentColor}/10` : `bg-${accentColor}/5`}`}>
                                    <Typography
                                        variant="h6"
                                        weight="semibold"
                                        className={`mb-2 ${theme !== 'light' ? 'text-white' : 'text-gray-900'}`}
                                    >
                                        Still have questions?
                                    </Typography>
                                    <Typography
                                        variant="body-small"
                                        className={`mb-4 ${theme !== 'light' ? 'text-gray-400' : 'text-gray-500'}`}
                                    >
                                        Can't find what you're looking for? Reach out to our support team.
                                    </Typography>
                                    <button className={`px-4 py-2 bg-${accentColor} text-white rounded-lg hover:bg-${accentColor}/90 transition-colors`}>
                                        Contact Support
                                    </button>
                                </div>
                            </div>

                            {/* Accordion side */}
                            <div className={contentSide === 'left' ? 'order-2' : 'order-1'}>
                                <Accordion
                                    value={openItems}
                                    onValueChange={setOpenItems}
                                    variant={variant}
                                    animationVariant={animation}
                                    iconStyle={iconStyle}
                                    theme={theme}
                                >
                                    <AccordionItem id="1">
                                        <AccordionSummary id="1">
                                            <AccordionTitle icon={<Rocket className="w-5 h-5" />}>
                                                How do I get started?
                                            </AccordionTitle>
                                        </AccordionSummary>
                                        <AccordionDetails id="1">
                                            <Typography variant="body-small">
                                                Getting started is easy! Sign up for a free account, complete your profile,
                                                and you'll have access to all our basic features.
                                            </Typography>
                                        </AccordionDetails>
                                    </AccordionItem>

                                    <AccordionItem id="2">
                                        <AccordionSummary id="2">
                                            <AccordionTitle icon={<Shield className="w-5 h-5" />}>
                                                Is my data secure?
                                            </AccordionTitle>
                                        </AccordionSummary>
                                        <AccordionDetails id="2">
                                            <Typography variant="body-small">
                                                Yes, we take security seriously. All data is encrypted using AES-256,
                                                we're GDPR compliant, and we perform regular security audits.
                                            </Typography>
                                        </AccordionDetails>
                                    </AccordionItem>

                                    <AccordionItem id="3">
                                        <AccordionSummary id="3">
                                            <AccordionTitle icon={<Users className="w-5 h-5" />}>
                                                Can I invite team members?
                                            </AccordionTitle>
                                        </AccordionSummary>
                                        <AccordionDetails id="3">
                                            <Typography variant="body-small">
                                                Absolutely! Our team plans allow you to invite unlimited team members with
                                                role-based access control.
                                            </Typography>
                                        </AccordionDetails>
                                    </AccordionItem>
                                </Accordion>
                            </div>
                        </div>
                    </div>
                </TabItem>
                <TabItem value="code" label="Code">
                    <div className="mt-4">
                        <CodeBlock language="tsx" className="text-sm">
                            {codeString}
                        </CodeBlock>
                    </div>
                </TabItem>
            </Tabs>
        </div>
    );
};

/* ============================================
   DEMO 3: COMPREHENSIVE COLOR THEMES DEMO
   Vibrant, Pastel, Glass, Gradient, Seasonal
============================================ */

export const AccordionVibrantDemo = () => {
    const [openItems, setOpenItems] = useState<string[]>(['1', '2']);
    const [activeCategory, setActiveCategory] = useState('vibrant');
    const [activeTheme, setActiveTheme] = useState(THEME_CATEGORIES.vibrant[0]);
    const [iconStyle, setIconStyle] = useState<'chevron' | 'plus-minus' | 'arrow' | 'checkmark'>('chevron');
    const [variant, setVariant] = useState<'default' | 'card' | 'bordered' | 'minimal' | 'glass' | 'gradient'>('glass');
    const [animation, setAnimation] = useState<'fade' | 'slide' | 'scale' | 'flip' | 'reveal'>('slide');
    const [showIcons, setShowIcons] = useState(true);
    const [showCategories, setShowCategories] = useState(true);
    const [glassEffect, setGlassEffect] = useState(true);

    const currentTheme = THEME_CATEGORIES[activeCategory as keyof typeof THEME_CATEGORIES].find(t => t.id === activeTheme.id) || activeTheme;

    const getBackgroundClass = () => {
        const theme = currentTheme;

        if (activeCategory === 'glass') {
            return `relative overflow-hidden ${glassEffect ? 'backdrop-blur-xl' : ''}`;
        }

        if (theme.gradient) {
            return `bg-gradient-to-br ${theme.gradient}`;
        }

        return theme.bg;
    };

    const getGlassBackground = () => {
        if (activeCategory !== 'glass') return '';

        const theme = currentTheme;
        const baseBg = glassEffect ? 'bg-black/40' : theme.bg;

        return `${baseBg} backdrop-blur-md border border-white/20 shadow-xl`;
    };

    const getTextColor = () => {
        if (activeCategory === 'pastel') return 'text-gray-900';
        if (activeCategory === 'glass') return 'text-white';
        return 'text-white';
    };

    const getMutedTextColor = () => {
        if (activeCategory === 'pastel') return 'text-gray-600';
        if (activeCategory === 'glass') return 'text-white/80';
        return 'text-white/80';
    };

    // Build code string
    const codeString = `<div className="relative overflow-hidden rounded-2xl p-8 md:p-12 ${getBackgroundClass()}">
  <div className="text-center mb-8">
    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full ${activeCategory === 'pastel'
            ? 'bg-' + currentTheme.accent + '-100 text-' + currentTheme.accent + '-800'
            : 'bg-white/10 backdrop-blur-sm text-white'
        } mb-4">
      <Sparkles className="w-4 h-4" />
      <span className="text-sm font-medium uppercase">${currentTheme.name}</span>
    </div>
    <Typography variant="h2" weight="bold" className="text-4xl mb-2 ${getTextColor()}">
      Frequently Asked Questions
    </Typography>
    <Typography variant="lead" className="${getMutedTextColor()}">
      Everything you need to know about our ${currentTheme.name.toLowerCase()} theme
    </Typography>
  </div>

  <Accordion
    value={openItems}
    onValueChange={setOpenItems}
    variant="${variant}"
    animationVariant="${animation}"
    iconStyle="${iconStyle}"
    theme="dark"
  >
    {/* Accordion items */}
  </Accordion>

  <div className="mt-8 text-center">
    <button className="px-6 py-3 ${activeCategory === 'pastel'
            ? 'bg-' + currentTheme.accent + '-600 text-white'
            : 'bg-white/10 backdrop-blur-sm text-white'
        } rounded-xl hover:bg-opacity-80 transition-all border ${activeCategory !== 'pastel' ? 'border-white/20' : ''
        }">
      Still have questions? Contact us
    </button>
  </div>
</div>`;

    return (
        <div className="space-y-6">
            {/* Theme Category Selector */}
            <div className="flex flex-wrap gap-2">
                {Object.entries(THEME_CATEGORIES).map(([key, themes]) => (
                    <button
                        key={key}
                        onClick={() => {
                            setActiveCategory(key);
                            setActiveTheme(themes[0]);
                        }}
                        className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-all ${activeCategory === key
                                ? 'bg-primary text-white'
                                : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700'
                            }`}
                    >
                        {key} ({themes.length})
                    </button>
                ))}
            </div>

            {/* Theme Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                {THEME_CATEGORIES[activeCategory as keyof typeof THEME_CATEGORIES].map((theme) => (
                    <button
                        key={theme.id}
                        onClick={() => setActiveTheme(theme)}
                        className={`p-3 rounded-lg text-center transition-all ${activeTheme.id === theme.id
                                ? 'ring-2 ring-primary scale-105'
                                : 'hover:scale-105'
                            }`}
                    >
                        <div className={`w-full h-12 rounded-lg mb-2 bg-gradient-to-br ${theme.gradient || theme.bg} flex items-center justify-center`}>
                            <div className={`${activeCategory === 'glass' ? 'text-white' : 'text-white'}`}>
                                {theme.icon}
                            </div>
                        </div>
                        <span className="text-xs truncate block">{theme.name}</span>
                    </button>
                ))}
            </div>

            {/* Controls */}
            <div className="flex flex-wrap gap-4 items-center justify-between p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
                <div className="flex flex-wrap gap-2">
                    <select
                        value={iconStyle}
                        onChange={(e) => setIconStyle(e.target.value as any)}
                        className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm"
                    >
                        <option value="chevron">Chevron Icons</option>
                        <option value="plus-minus">Plus/Minus</option>
                        <option value="arrow">Arrow</option>
                        <option value="checkmark">Checkmark</option>
                    </select>

                    <select
                        value={variant}
                        onChange={(e) => setVariant(e.target.value as any)}
                        className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm"
                    >
                        <option value="default">Default</option>
                        <option value="card">Card</option>
                        <option value="bordered">Bordered</option>
                        <option value="minimal">Minimal</option>
                        <option value="glass">Glass</option>
                        <option value="gradient">Gradient</option>
                    </select>

                    <select
                        value={animation}
                        onChange={(e) => setAnimation(e.target.value as any)}
                        className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm"
                    >
                        <option value="fade">Fade</option>
                        <option value="slide">Slide</option>
                        <option value="scale">Scale</option>
                        <option value="flip">Flip</option>
                        <option value="reveal">Reveal</option>
                    </select>
                </div>

                <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={showIcons}
                            onChange={(e) => setShowIcons(e.target.checked)}
                            className="rounded"
                        />
                        <span className="text-sm">Show Icons</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={showCategories}
                            onChange={(e) => setShowCategories(e.target.checked)}
                            className="rounded"
                        />
                        <span className="text-sm">Show Categories</span>
                    </label>
                    {activeCategory === 'glass' && (
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={glassEffect}
                                onChange={(e) => setGlassEffect(e.target.checked)}
                                className="rounded"
                            />
                            <span className="text-sm">Glass Effect</span>
                        </label>
                    )}
                </div>
            </div>

            <Tabs>
                <TabItem value="preview" label="Preview">
                    <div className={`relative overflow-hidden rounded-2xl p-8 transition-all duration-500 ${activeCategory === 'glass'
                            ? getGlassBackground()
                            : getBackgroundClass()
                        }`}>
                        {/* Decorative elements for glass effect */}
                        {activeCategory === 'glass' && glassEffect && (
                            <>
                                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
                                <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-3xl"></div>
                                <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-white/5 to-transparent rounded-full blur-3xl"></div>
                            </>
                        )}

                        {/* Content */}
                        <div className="relative z-10">
                            {/* Header */}
                            <div className="text-center mb-8">
                                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${activeCategory === 'pastel'
                                        ? `bg-${currentTheme.accent}-100 text-${currentTheme.accent}-800`
                                        : activeCategory === 'glass'
                                            ? 'bg-white/20 backdrop-blur-sm text-white border border-white/30'
                                            : 'bg-white/10 backdrop-blur-sm text-white'
                                    } mb-4`}>
                                    <Sparkles className="w-4 h-4" />
                                    <span className="text-sm font-medium uppercase">{currentTheme.name}</span>
                                </div>
                                <Typography
                                    variant="h2"
                                    weight="bold"
                                    className={`text-3xl md:text-4xl mb-2 ${getTextColor()}`}
                                >
                                    Frequently Asked Questions
                                </Typography>
                                <Typography
                                    variant="lead"
                                    className={getMutedTextColor()}
                                >
                                    Everything you need to know about our {currentTheme.name.toLowerCase()} theme
                                </Typography>
                            </div>

                            {/* Accordion */}
                            <Accordion
                                value={openItems}
                                onValueChange={setOpenItems}
                                variant={variant}
                                animationVariant={animation}
                                iconStyle={iconStyle}
                                theme="dark"
                            >
                                <AccordionItem id="1">
                                    <AccordionSummary id="1">
                                        <AccordionTitle
                                            icon={showIcons ? <Cpu className="w-5 h-5" /> : undefined}
                                            category={showCategories ? "Technology" : undefined}
                                        >
                                            What technology stack do you use?
                                        </AccordionTitle>
                                    </AccordionSummary>
                                    <AccordionDetails id="1">
                                        <Typography variant="body-small" className={getMutedTextColor()}>
                                            We use cutting-edge technologies including React, TypeScript, Node.js, and
                                            Web3 libraries. Our stack is carefully chosen for performance, security,
                                            and developer experience.
                                        </Typography>
                                    </AccordionDetails>
                                </AccordionItem>

                                <AccordionItem id="2">
                                    <AccordionSummary id="2">
                                        <AccordionTitle
                                            icon={showIcons ? <TrendingUp className="w-5 h-5" /> : undefined}
                                            category={showCategories ? "Growth" : undefined}
                                        >
                                            How can your platform help my business grow?
                                        </AccordionTitle>
                                    </AccordionSummary>
                                    <AccordionDetails id="2">
                                        <Typography variant="body-small" className={getMutedTextColor()}>
                                            Our platform provides analytics, automation tools, and insights that help
                                            you make data-driven decisions. Join thousands of businesses that have
                                            grown 3x faster with our solutions.
                                        </Typography>
                                    </AccordionDetails>
                                </AccordionItem>

                                <AccordionItem id="3">
                                    <AccordionSummary id="3">
                                        <AccordionTitle
                                            icon={showIcons ? <Award className="w-5 h-5" /> : undefined}
                                            category={showCategories ? "Premium" : undefined}
                                        >
                                            What's included in the premium plan?
                                        </AccordionTitle>
                                    </AccordionSummary>
                                    <AccordionDetails id="3">
                                        <Typography variant="body-small" className={getMutedTextColor()}>
                                            Premium includes unlimited projects, priority support, advanced analytics,
                                            custom integrations, and dedicated account manager. Perfect for growing
                                            businesses and enterprises.
                                        </Typography>
                                        <AccordionLink
                                            href="/pricing"
                                            className={activeCategory === 'pastel' ? `text-${currentTheme.accent}-600` : 'text-white/90 hover:text-white'}
                                        >
                                            View pricing details
                                        </AccordionLink>
                                    </AccordionDetails>
                                </AccordionItem>

                                <AccordionItem id="4">
                                    <AccordionSummary id="4">
                                        <AccordionTitle
                                            icon={showIcons ? <Mail className="w-5 h-5" /> : undefined}
                                            category={showCategories ? "Support" : undefined}
                                        >
                                            How do I contact support?
                                        </AccordionTitle>
                                    </AccordionSummary>
                                    <AccordionDetails id="4">
                                        <Typography variant="body-small" className={getMutedTextColor()}>
                                            Premium users get 24/7 priority support via live chat and phone.
                                            Free users can reach us via email with 24-hour response time.
                                            We're always here to help!
                                        </Typography>
                                    </AccordionDetails>
                                </AccordionItem>
                            </Accordion>

                            {/* Footer */}
                            <div className="mt-8 text-center">
                                <button className={`px-6 py-3 rounded-xl transition-all duration-300 ${activeCategory === 'pastel'
                                        ? `bg-${currentTheme.accent}-600 text-white hover:bg-${currentTheme.accent}-700`
                                        : activeCategory === 'glass'
                                            ? 'bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 border border-white/20'
                                            : 'bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 border border-white/20'
                                    }`}>
                                    Still have questions? Contact us
                                </button>
                            </div>
                        </div>
                    </div>
                </TabItem>
                <TabItem value="code" label="Code">
                    <div className="mt-4">
                        <CodeBlock language="tsx" className="text-sm">
                            {codeString}
                        </CodeBlock>
                    </div>
                </TabItem>
            </Tabs>

            {/* Theme Info Panel */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                        <Palette className="w-4 h-4" />
                        Active Theme
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Category: <span className="capitalize font-medium">{activeCategory}</span><br />
                        Theme: <span className="font-medium">{currentTheme.name}</span><br />
                        Accent: <span className={`text-${currentTheme.accent}-500 capitalize`}>{currentTheme.accent}</span>
                    </p>
                </div>
                <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                        <Brush className="w-4 h-4" />
                        Current Styles
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Variant: <span className="capitalize">{variant}</span><br />
                        Icons: <span className="capitalize">{iconStyle}</span><br />
                        Animation: <span className="capitalize">{animation}</span>
                    </p>
                </div>
                <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                        <Heart className="w-4 h-4" />
                        Features
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Icons: {showIcons ? '✅' : '❌'}<br />
                        Categories: {showCategories ? '✅' : '❌'}<br />
                        Glass Effect: {glassEffect ? '✅' : '❌'}
                    </p>
                </div>
            </div>
        </div>
    );
};