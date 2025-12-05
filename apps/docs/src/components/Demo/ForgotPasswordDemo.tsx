import TabItem from "@theme/TabItem"
import VariantSelector from "./VariantSelector"
import Tabs from "@theme/Tabs"
import CodeBlock from "@theme/CodeBlock"
import { useState } from "react"
import { ForgotPasswordPage } from "../UI/forgot-password"

const variants = ["default", "dark", "gradientAurora", "gradientEmeraldWave", "gradientRoyal", "gradientOceanNight"]
const inputVariants = ["clean", "underline", "floating", "borderGlow", "shimmer", "particles", "slide", "scale", "rotate", "bounce", "elastic", "glow", "shake", "wave", "typewriter", "magnetic", "pulse", "borderBeam", "ripple", "particleField", "tilt3D"]
const animations = ["bounce", "bounceSlow", "bounceFast", "bounceSmooth", "bounceJelly", "rotateClockwiseSlow" , "rotateClockwiseFast", "rotateAntiClockwiseSlow", "rotateAntiClockwiseFast", "rotatePingPong", "scaleUp", "scaleDown", "scaleHeartBeat", "flipX", "flipY", "flipY", "flipCard", "fadeBlink", "fadeInOut", "press3D", "press3DSoft", "press3DHard", "press3DPop", "press3DDepth", "spinSlow"]
const headerAnimations = ["fadeUp", "scaleIn", "slideLeft", "slideRight", "flipIn"]
const formTypes = ["split", "center"]
const mobileBreakpoints = ["sm", "md", "lg"]

const ForgotPasswordDemo = () => {
  const [variant, setVariant] = useState('dark');
  const [inputVariant, setInputVariant] = useState('underline');
  const [animation, setAnimation] = useState('bounce');
  const [headerAnimation, setHeaderAnimation] = useState('fadeUp');
  const [formType, setFormType] = useState('split');
  const [mobileBreakpoint, setMobileBreakpoint] = useState('md');

  const codeString = `
    <ForgotPasswordPage
    ${
    formType === "split"
      ? `forgotSplitHeader={{ head: "Account Recovery", para: "Enter your email to receive a secure link and restore access to your account." }}`
      : ""
    }
    forgotPasswordHeader={{ head: "Forgot Password",para: "Enter your email to reset your password."}}
    submitbuttonLabel="Send Reset link"
    navigateToLabel="Back To Login"
    onNavigateTo={() => console.log("navigated")}
    onSubmit={(email) => console.log("Send reset link for:", email)}
    successMessage="Check your email for reset link"
    variant="${variant}"
    inputVariant="${inputVariant}"
    animationVariant="${animation}"
    formType="${formType}"
    headerAnimation="${headerAnimation}"
    >
    </ForgotPasswordPage>`;

  return (
    <div className='space-y-6 mb-8'>
      <div className='flex flex-wrap gap-4 justify-start sm:justify-end'>
        <VariantSelector
          variants={formTypes}
          selectedVariant={formType}
          onSelectVariant={setFormType}
          type='Form Type'
        />
        <VariantSelector
          variants={mobileBreakpoints}
          selectedVariant={mobileBreakpoint}
          onSelectVariant={setMobileBreakpoint}
          type='Mobile Breakpoints'
        />
        <VariantSelector
          variants={variants}
          selectedVariant={variant}
          onSelectVariant={setVariant}
          type='Select Variants'
        />
        {formType === 'split' && <VariantSelector
          variants={headerAnimations}
          selectedVariant={headerAnimation}
          onSelectVariant={setHeaderAnimation}
          type='Form Animation'
        />}
        <VariantSelector
          variants={inputVariants}
          selectedVariant={inputVariant}
          onSelectVariant={setInputVariant}
          type='Input Variant'
        />
        <VariantSelector
          variants={animations}
          selectedVariant={animation}
          onSelectVariant={setAnimation}
          type='Submit Button Animation'
        />
      </div>
      <Tabs>
        <TabItem value='preview' label='Preview'>
          <div className='border rounded-lg overflow-hidden p-4'>
            <ForgotPasswordPage
            forgotPasswordHeader={{ head: "Forgot Password",para: "Enter your email to reset your password."}}
            forgotSplitHeader={{ head: "Account Recovery", para: "Enter your email to receive a secure link and restore access to your account." }}
            submitbuttonLabel="Send Reset link"
            successMessage="Check your email for reset link"
            navigateToLabel="Back To Login"
            onNavigateTo={() => console.log("navigated")}
            onSubmit={(email) => console.log("Send reset link for:", email)}
            variant={variant as any}
            inputVariant={inputVariant as any}
            animationVariant={animation as any}
            formType={formType as any}
            headerAnimation={headerAnimation as any}
            mobileBreakpoint={mobileBreakpoint as any}
            >
            </ForgotPasswordPage>
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