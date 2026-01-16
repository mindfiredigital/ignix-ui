import TabItem from "@theme/TabItem"
import VariantSelector from "./VariantSelector"
import Tabs from "@theme/Tabs"
import CodeBlock from "@theme/CodeBlock"
import { useState, useEffect } from "react"
import { ForgotPasswordPage } from "../UI/forgot-password"

type ForgotPasswordVariants = typeof variants[number];
type ForgotPasswordInputVariants = typeof inputVariants[number];
type ForgotPasswordHeaderAnimation = typeof headerAnimations[number];

const variants = ["default" , "dark"] as const
const inputVariants = ["clean", "underline", "floating", "borderGlow", "shimmer", "particles", "slide", "scale", "rotate", "bounce", "elastic", "glow", "shake", "wave", "typewriter", "magnetic", "pulse", "borderBeam", "ripple", "particleField", "tilt3D"] as const 
const headerAnimations = ["fadeUp", "scaleIn", "slideLeft", "slideRight", "flipIn"] as const

// Helper function to get current Docusaurus theme
const getDocusaurusTheme = (): "default" | "dark" => {
  if (typeof window === 'undefined') return 'dark';
  return (document.documentElement.getAttribute('data-theme') || 'dark') as "default" | "dark";
};

// Map Docusaurus theme to component variant
const mapThemeToVariant = (theme: "default" | "dark"): "default" | "dark" => {
  return theme; // Keep as is since variants array uses "default" and "dark"
};

const ForgotPasswordDemo = () => {
  const [variant, setVariant] = useState<ForgotPasswordVariants>(() => mapThemeToVariant(getDocusaurusTheme()));

  // Sync variant with Docusaurus theme changes
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const currentTheme = getDocusaurusTheme();
      setVariant(mapThemeToVariant(currentTheme));
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    return () => observer.disconnect();
  }, []);
  
  const [inputVariant, setInputVariant] = useState<ForgotPasswordInputVariants>('clean');
  const [headerAnimation, setHeaderAnimation] = useState<ForgotPasswordHeaderAnimation>('fadeUp');

  const codeString = `
<ForgotPasswordPage
  forgotPasswordHeader={{
    head: "Forgot Password",
    para: "Enter your email to reset your password."
  }}
  submitbuttonLabel="Send Reset Link"
  navigateToLabel="Back To Login"
  successMessage="Check your email for reset link"
  variant="${variant}"
  inputVariant="${inputVariant}"
  headerAnimation="${headerAnimation}"
/>`;

  return (
    <div className='space-y-6 mb-8'>
      <div className='flex flex-wrap gap-4 justify-start sm:justify-end'>
        <VariantSelector
          variants={[...variants]}
          selectedVariant={variant}
          onSelectVariant={(v) => setVariant(v as 'default' | 'dark')}
          type='Theme Variant'
        />
        <VariantSelector
          variants={[...inputVariants]}
          selectedVariant={inputVariant}
          onSelectVariant={(v) => setInputVariant(v as "clean"| "underline"| "floating"| "borderGlow"| "shimmer"| "particles"| "slide"| "scale"| "rotate"| "bounce"| "elastic"| "glow"| "shake"| "wave"| "typewriter"| "magnetic"| "pulse"| "borderBeam"| "ripple"| "particleField"| "tilt3D")}
          type='Input Variant'
        />
        <VariantSelector
          variants={[...headerAnimations]}
          selectedVariant={headerAnimation}
          onSelectVariant={(v) => setHeaderAnimation(v as "fadeUp"| "scaleIn"| "slideLeft"| "slideRight"| "flipIn")}
          type='Header Animation'
        />
      </div>
      <Tabs>
        <TabItem value='preview' label='Preview'>
          <div className='border border-gray-300 rounded-lg overflow-hidden p-4'>
            <ForgotPasswordPage
              forgotPasswordHeader={{
                head: "Forgot Password",
                para: "Enter your email to reset your password."
              }}
              submitbuttonLabel="Send Reset Link"
              navigateToLabel="Back To Login"
              variant={variant}
              inputVariant={inputVariant}
              headerAnimation={headerAnimation}
            />
          </div>
        </TabItem>
        <TabItem value='code' label='Code'>
          <CodeBlock language='tsx' className='whitespace-pre-wrap max-h-[500px] overflow-y-scroll'>
            {codeString} 
          </CodeBlock> 
        </TabItem>
      </Tabs>
    </div>
  )
}

export default ForgotPasswordDemo;