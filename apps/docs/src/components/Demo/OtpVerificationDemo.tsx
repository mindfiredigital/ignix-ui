import TabItem from "@theme/TabItem"
import VariantSelector from "./VariantSelector"
import Tabs from "@theme/Tabs"
import CodeBlock from "@theme/CodeBlock"
import { useEffect, useState } from "react"
import { OTPVerificationPage } from "../UI/otp-verification-page"

const variants = ["default", "dark", "gradientOceanNight"]
const animations = ["fadeUp", "scaleIn", "slideLeft", "slideRight", "flipIn"]
const lengths = ["4", "5", "6", "7", "8", "9", "10"]
const types = ["email", "phone"]
const coolDownTimers = ["30", "45", "60", "90"]

// ---------------------------------------------
// types.ts – shared type for all OTP responses
// ---------------------------------------------
  type OtpResult = {
    success: boolean;
    message?: string;
  };


  // ---------------------------------------------
  // api.ts – shared API helpers for open-source use
  // ---------------------------------------------
  async function resendOtp(
    contact: string,
    type: "email" | "phone"
  ): Promise<OtpResult> {
    // Demo-only mock response
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: `OTP sent successfully to your ${type}`,
        });
      }, 500); // small delay to simulate API call
    });
  }


  async function verifyOtpAPI(
    endpoint: string,
    code: string
  ): Promise<OtpResult> {
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });

      if (!res.ok) {
        const error = await res.json().catch(() => null);
        return {
          success: false,
          message: error?.message || "Verification failed",
        };
      }

      return { success: true, message: "OTP verified successfully" };
    } catch {
      return { success: false, message: "Network error" };
    }
  }

const OtpVerificationDemo = () => {
  const [variant, setVariant] = useState("dark");
  const [animation, setAnimation] = useState("fadeUp");
  const [otpLength, setOtpLength] = useState("6");
  const [type, setTypes] = useState<"email" | "phone">("email");
  const [contactDetail, setContactDetail] = useState("user@example.com");
  const [coolDownTimer, setCoolDownTimer] = useState("45");

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
      animation= "${animation}"
      onNavigateTo= {() => console.log("navigated")}
      onVerifyOtp= {(code) =>
        verifyOtpAPI("/api/auth/verify-otp", code)
      }
          onResendOtp= {() => resendOtp("${contactDetail}", "${type}")}
      >
    </OTPVerificationPage>
    `;

  return (
    <div className="space-y-6 mb-8">
      <div className="flex flex-wrap gap-4 justify-start sm:justify-end">
        <VariantSelector
          variants={variants}
          selectedVariant={variant}
          onSelectVariant={setVariant}
          type="Select Variants"
        />
        <VariantSelector
          variants={animations}
          selectedVariant={animation}
          onSelectVariant={setAnimation}
          type="Select Animation"
        />
        {/* OTP Length Input */}
        <VariantSelector
          variants={lengths}
          selectedVariant={otpLength}
          onSelectVariant={setOtpLength}
          type="Select No of Digit for OTP"
        />
        <VariantSelector
          variants={types}
          selectedVariant={type}
          onSelectVariant={(val) => setTypes(val as "email" | "phone")}
          type="Select Verification Types"
        />
        <VariantSelector
          variants={coolDownTimers}
          selectedVariant={coolDownTimer}
          onSelectVariant={setCoolDownTimer}
          type="Select CoolDown Timer"
        />
      </div>
      <Tabs>
        <TabItem value="preview" label="Preview">
          <div className="border rounded-lg overflow-hidden p-4">
            <OTPVerificationPage
            variant= {variant as any}
            length= {Number(otpLength)}
            title= "Enter Verification Code"
            resendCooldown= {coolDownTimer as any}
            contactType= {type as any} 
            contactDetail= {contactDetail as any}
            navigateToLabel= "Back To Login"
            submitButtonLabel= "Verify Code"
            animation= {animation as any}
            onNavigateTo= {() => console.log("navigated")}
            onVerifyOtp= {(code) =>
              verifyOtpAPI("/api/auth/verify-otp", code)
            }
            onResendOtp= {() => resendOtp(contactDetail as any, type as any)}
            >
            </OTPVerificationPage>
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