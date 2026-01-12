import TabItem from "@theme/TabItem"
import VariantSelector from "./VariantSelector"
import Tabs from "@theme/Tabs"
import CodeBlock from "@theme/CodeBlock"
import { useState } from "react"
import { ForgotPasswordPage } from "../UI/forgot-password"

const variants = ["light" , "dark"]
const inputVariants = ["clean", "underline", "floating", "borderGlow", "shimmer", "particles", "slide", "scale", "rotate", "bounce", "elastic", "glow", "shake", "wave", "typewriter", "magnetic", "pulse", "borderBeam", "ripple", "particleField", "tilt3D"]
const headerAnimations = ["fadeUp", "scaleIn", "slideLeft", "slideRight", "flipIn"]

const ForgotPasswordDemo = () => {
  const [variant, setVariant] = useState('light');
  const [inputVariant, setInputVariant] = useState('clean');
  const [headerAnimation, setHeaderAnimation] = useState('fadeUp');

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
          variants={variants}
          selectedVariant={variant}
          onSelectVariant={setVariant}
          type='Theme Variant'
        />
        <VariantSelector
          variants={inputVariants}
          selectedVariant={inputVariant}
          onSelectVariant={setInputVariant}
          type='Input Variant'
        />
        <VariantSelector
          variants={headerAnimations}
          selectedVariant={headerAnimation}
          onSelectVariant={setHeaderAnimation}
          type='Header Animation'
        />
      </div>
      <Tabs>
        <TabItem value='preview' label='Preview'>
          <div className='border rounded-lg overflow-hidden p-4'>
            <ForgotPasswordPage
              forgotPasswordHeader={{
                head: "Forgot Password",
                para: "Enter your email to reset your password."
              }}
              submitbuttonLabel="Send Reset Link"
              navigateToLabel="Back To Login"
              variant={variant as any}
              inputVariant={inputVariant as any}
              headerAnimation={headerAnimation as any}
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