import { cn } from "../../../utils/cn";

interface Step {
  label: string;
  description?: string;
}

interface StepperProps {
  steps: Step[];
  activeStep: number; // 0-based index
  className?: string;
}

export const Stepper = ({ steps, activeStep, className }: StepperProps) => {
  return (
    <div className={cn("flex items-center justify-between w-full", className)}>
      {steps.map((step, index) => {
        const isActive = index === activeStep;
        const isCompleted = index < activeStep;

        return (
          <div
            key={index}
            className="flex-1 flex flex-col items-center relative"
          >
            {/* Line connector */}
            {index !== steps.length - 1 && (
              <div className="absolute top-4 left-1/2 w-full h-0.5 bg-zinc-300 dark:bg-zinc-700 z-0 transform translate-x-1/2" />
            )}

            {/* Step circle */}
            <div
              className={cn(
                "z-10 w-8 h-8 flex items-center justify-center rounded-full border-2 text-sm font-medium",
                isCompleted
                  ? "bg-green-500 border-green-500 text-white"
                  : isActive
                  ? "bg-white dark:bg-zinc-900 border-blue-500 text-blue-500"
                  : "bg-white dark:bg-zinc-900 border-zinc-300 text-zinc-400"
              )}
            >
              {isCompleted ? "✓" : index + 1}
            </div>

            {/* Step label */}
            <div className="text-center mt-2">
              <div
                className={cn(
                  "text-xs font-medium",
                  isActive || isCompleted
                    ? "text-zinc-900 dark:text-white"
                    : "text-zinc-400"
                )}
              >
                {step.label}
              </div>
              {step.description && (
                <div className="text-[11px] text-zinc-500 dark:text-zinc-400">
                  {step.description}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
