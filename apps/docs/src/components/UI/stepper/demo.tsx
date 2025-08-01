
import { useState } from "react";
import { Stepper } from "./index";

const StepperDemo = () => {
    const [step, setStep] = useState(0);
    return (
      <>
        <Stepper
          steps={[
            { label: 'Cart', description: 'Review items' },
            { label: 'Shipping', description: 'Delivery info' },
            { label: 'Payment', description: 'Card details' },
          ]}
          activeStep={step}
        />
        <div className="flex justify-between mt-4">
          <button
            onClick={() => setStep(Math.max(0, step - 1))}
            disabled={step === 0}
            className="px-4 py-2 bg-primary text-white rounded disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={() => setStep(Math.min(2, step + 1))}
            disabled={step === 2}
            className="px-4 py-2 bg-primary text-white rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </>
    );
}

export default StepperDemo;
