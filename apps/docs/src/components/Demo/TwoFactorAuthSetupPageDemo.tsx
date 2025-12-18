import TabItem from "@theme/TabItem"
import VariantSelector from "./VariantSelector"
import Tabs from "@theme/Tabs"
import CodeBlock from "@theme/CodeBlock"
import { useEffect, useState } from "react"
import { TwoFactorAuthSetupPage } from "../UI/two-factor-auth"

const variants = ["default", "dark", "gradient"]

const TwoFactorAuthSetupPageDemo = () => {
  const [variant, setVariant] = useState<'default' | 'dark' | 'gradient'>('default');
  const [secretKey, setSecretKey] = useState('JBSWY3DPEHPK3PXP');
  const [accountName, setAccountName] = useState('user@example.com');
  const [issuer, setIssuer] = useState('Your App');

  const codeString = `
    <TwoFactorAuthSetupPage
      secretKey="${secretKey}"
      accountName="${accountName}"
      issuer="${issuer}"
      variant="${variant}"
      onVerify={async (code) => {
        // Validate code with your backend
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return { success: true, message: "2FA setup verified successfully" };
      }}
      onSaveBackupCodes={(codes) => {
        console.log("Backup codes saved:", codes);
      }}
    />`;

  useEffect(() => {
    setSecretKey('JBSWY3DPEHPK3PXP');
    setAccountName('user@example.com');
    setIssuer('Your App');
  },[])
  
  return (
    <div className='space-y-6 mb-8'>
      <div className='flex flex-wrap gap-4 justify-start sm:justify-end'>
        <VariantSelector
          variants={variants}
          selectedVariant={variant}
          onSelectVariant={(v) => setVariant(v as 'default' | 'dark' | 'gradient')}
          type='Variant'
        />
      </div>
      <Tabs>
        <TabItem value='preview' label='Preview'>
          <div className='border rounded-lg overflow-hidden p-4'>
            <TwoFactorAuthSetupPage
              secretKey={secretKey}
              accountName={accountName}
              issuer={issuer}
              variant={variant}
              onVerify={async (code) => {
                // Simulate API call
                await new Promise((resolve) => setTimeout(resolve, 1000));
                return { success: true, message: "2FA setup verified successfully", code: code };
              }}
              onSaveBackupCodes={(codes) => {
                console.log("Backup codes saved:", codes);
              }}
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

export default TwoFactorAuthSetupPageDemo;
