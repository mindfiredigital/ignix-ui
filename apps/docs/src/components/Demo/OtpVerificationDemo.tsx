import TabItem from "@theme/TabItem"
import VariantSelector from "./VariantSelector"
import Tabs from "@theme/Tabs"
import CodeBlock from "@theme/CodeBlock"
import { useEffect, useState } from "react"
import { OTPVerificationPage } from "../UI/otp-verification-page"

type OtpCoolDownTimer = typeof coolDownTimers[number];
type OtpVariant = typeof variants[number];
type OtpAnimation = typeof animations[number];
type Otplengths = typeof lengths[number];
type Otptypes = typeof types[number];

const variants = ["default", "dark"] as const
const animations = ["fadeUp", "scaleIn", "slideLeft", "slideRight", "flipIn"] as const
const lengths = ["4", "5", "6", "7", "8", "9", "10"] as const
const types = ["email", "phone"] as const
const coolDownTimers = ["30", "45", "60", "90"] as const


const OtpVerificationDemo = () => {
  const [variant, setVariant] = useState<OtpVariant>("default");
  const [animation, setAnimation] = useState<OtpAnimation>("fadeUp");
  const [otpLength, setOtpLength] = useState<Otplengths>("6");
  const [type, setTypes] = useState<Otptypes>("email");
  const [contactDetail, setContactDetail] = useState<string>("user@example.com");
  const [coolDownTimer, setCoolDownTimer] = useState<OtpCoolDownTimer>("45");

  useEffect(() => {
    if (type === "email") {
      setContactDetail("user@example.com");
    } else {
      setContactDetail("999 999 9999");
    }
  }, [type]);

  const codeString = `
    <OTPVerificationPage
      variant= "${variant}"
      length= {${Number(otpLength)}}
      title= "Enter Verification Code"
      resendCooldown= {${coolDownTimer}}
      contactType= "${type}" 
      contactDetail= "${contactDetail}"
      navigateToLabel= "Back To Login"
      submitButtonLabel= "Verify Code"
      animation= "${animation}" />
    `;

  return (
    <div className="space-y-6 mb-8">
      <div className="flex flex-wrap gap-4 justify-start sm:justify-end">
        <VariantSelector
          variants={[...variants]}
          selectedVariant={variant}
          onSelectVariant={(v) => setVariant(v as "default" | "dark")}
          type="Select Variants"
        />
        <VariantSelector
          variants={[...animations]}
          selectedVariant={animation}
          onSelectVariant={(v) => setAnimation(v as "fadeUp"| "scaleIn"| "slideLeft"| "slideRight"| "flipIn")}
          type="Select Animation"
        />
        {/* OTP Length Input */}
        <VariantSelector
          variants={[...lengths]}
          selectedVariant={otpLength}
          onSelectVariant={(v) => setOtpLength(v as "4" | "5" | "6" | "7" | "8" | "9" | "10")}
          type="Select No of Digit for OTP"
        />
        <VariantSelector
          variants={[...types]}
          selectedVariant={type}
          onSelectVariant={(val) => setTypes(val as "email" | "phone")}
          type="Select Verification Types"
        />
        <VariantSelector
          variants={[...coolDownTimers]}
          selectedVariant={coolDownTimer}
          onSelectVariant={(v) => setCoolDownTimer(v as "30" | "45" | "60" | "90")}
          type="Select CoolDown Timer"
        />
      </div>
      <Tabs>
        <TabItem value="preview" label="Preview">
          <div className="border border-gray-300 rounded-lg overflow-hidden p-4">
            <OTPVerificationPage
            variant= {variant}
            length= {Number(otpLength)}
            title= "Enter Verification Code"
            resendCooldown= {Number(coolDownTimer)}
            contactType= {type} 
            contactDetail= {contactDetail}
            navigateToLabel= "Back To Login"
            submitButtonLabel= "Verify Code"
            animation= {animation}
            />
          </div>
        </TabItem>
        <TabItem value="code" label="Code">
            <CodeBlock language="tsx" className="whitespace-pre-wrap max-h-[500px] overflow-y-scroll">
             {codeString} 
          </CodeBlock> 
        </TabItem>
      </Tabs>
    </div>
  )
}

export default OtpVerificationDemo;