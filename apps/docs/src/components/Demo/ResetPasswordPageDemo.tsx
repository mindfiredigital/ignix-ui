import TabItem from "@theme/TabItem"
import VariantSelector from "./VariantSelector"
import Tabs from "@theme/Tabs"
import CodeBlock from "@theme/CodeBlock"
import { useEffect, useState } from "react"
import { ResetPasswordPage } from "../UI/reset-password"

const inputVariants = ["clean", "underline", "floating", "borderGlow", "shimmer", "particles", "slide", "scale", "rotate", "bounce", "elastic", "glow", "shake", "wave", "typewriter", "magnetic", "pulse", "flip", "morph", "spotlight", "liquid", "neon", "origami", "glitch", "hologram", "cosmic", "borderBeam", "gradientBorder", "ripple", "materialFloat", "neonPulse", "typewriterReveal", "morphing", "liquidBorder", "particleField", "glassmorphism", "holographic3D", "quantumParticles", "premiumGlass", "luxuryShimmer", "materialRipple", "cosmicField", "premiumGradient"]

const ResetPasswordPageDemo = () => {
  const [inputVariant, setInputVariant] = useState('clean');
  const [token, setToken] = useState('');

  const codeString = `
    <ResetPasswordPage
    token="${token}"
    inputVariant="${inputVariant}"
    onSubmit={(password, token) => console.log("Password reset:", password, token)}
    onTokenValidate={(token) => token.length >= 6 && token.length <= 32}
    />`;

  useEffect(() => {
    setToken('');
  },[])
  
  return (
    <div className='space-y-6 mb-8'>
      <div className='flex flex-wrap gap-4 justify-start sm:justify-end'>
        <VariantSelector
          variants={inputVariants}
          selectedVariant={inputVariant}
          onSelectVariant={setInputVariant}
          type='Input Variant'
        />
      </div>
      <Tabs>
        <TabItem value='preview' label='Preview'>
          <div className='border rounded-lg overflow-hidden p-4'>
            <ResetPasswordPage
              token={token}
              inputVariant={inputVariant as any}
              onSubmit={(password, token) => console.log("Password reset:", password, token)}
              onTokenValidate={(token) => token.length >= 6 && token.length <= 32}
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

export default ResetPasswordPageDemo;

