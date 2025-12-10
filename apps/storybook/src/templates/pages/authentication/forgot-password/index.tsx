import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { motion } from "framer-motion";
import { Lock } from "lucide-react";
import { z } from "zod";
import { Button } from "../../../../components/button";
import AnimatedInput from "../../../../components/input";
import { cn } from "../../../../../utils/cn";

type HeaderAnimationKeys = keyof typeof headerAnimationVariant;

interface SimpleHeader {
  head: string;
  para: string;
}

interface ForgotPasswordHeaderProps extends SimpleHeader {
  animationVariant?: HeaderAnimationKeys;
}

interface LinkButtonProps {
  label?: string;
  textColor?: string;
  onBack?: () => void;
}

export interface ForgotPasswordProps {
  // NEW — simplified header API
  forgotPasswordHeader?: SimpleHeader;
  forgotSplitHeader?: SimpleHeader;

  // Backward compatible (custom header nodes)
  formCardHeader?: React.ReactNode;
  formSplitHeader?: React.ReactNode;

  // optional override nodes
  loginLink?: React.ReactNode;
  button?: React.ReactNode;
  input?: React.ReactNode;

  // Variants & animations
  variant?: VariantProps<typeof ForgotPasswordVariants>["variant"];
  inputVariant?:
    | "clean"
    | "underline"
    | "floating"
    | "borderGlow"
    | "shimmer"
    | "particles"
    | "slide"
    | "scale"
    | "rotate"
    | "bounce"
    | "elastic"
    | "glow"
    | "shake"
    | "wave"
    | "typewriter"
    | "magnetic"
    | "pulse"
    | "borderBeam"
    | "ripple"
    | "particleField"
    | "tilt3D";
  animationVariant?:
    | "bounce"
    | "bounceSlow"
    | "bounceFast"
    | "bounceSmooth"
    | "bounceJelly"
    | "rotateClockwiseSlow"
    | "rotateClockwiseFast"
    | "rotateAntiClockwiseSlow"
    | "rotateAntiClockwiseFast"
    | "rotatePingPong"
    | "scaleUp"
    | "scaleDown"
    | "scaleHeartBeat"
    | "flipX"
    | "flipY"
    | "flipCard"
    | "fadeBlink"
    | "fadeInOut"
    | "press3D"
    | "press3DSoft"
    | "press3DHard"
    | "press3DPop"
    | "press3DDepth"
    | "spinSlow";

  headerAnimation?: HeaderAnimationKeys;

  // Status messages
  status?: "idle" | "success" | "error";
  errorMessage?: string;
  successMessage?: string;
  navigateToLabel?: string;
  submitbuttonLabel?: string;
  // Layout
  formType?: "center" | "split";

  // Callbacks
  onSubmit?: (email: string) => void;
  onNavigateTo?: () => void; // open-source-friendly navigation callback
}

const ForgotPasswordVariants = cva("", {
  variants: {
    variant: {
      default: "bg-background text-foreground",
      gradientAurora:
        "bg-gradient-to-br from-violet-900 via-indigo-900 to-blue-950 text-white",
      gradientEmeraldWave:
        "bg-gradient-to-br from-green-900 via-emerald-900 to-teal-950 text-white",
      gradientRoyal:
        "bg-gradient-to-br from-purple-950 via-fuchsia-900 to-pink-950 text-white",
      gradientOceanNight:
        "bg-gradient-to-br from-blue-950 via-slate-900 to-black text-white",
      dark: "bg-gradient-to-br from-black via-neutral-900 to-neutral-800 text-white",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

const ForgotPasswordCardVariants = cva("", {
  variants: {
    variant: {
      default: "bg-background text-foreground",
      gradientAurora:
        "bg-gradient-to-br from-blue-700 via-violet-700 to-indigo-900 text-white",
      gradientEmeraldWave:
        "bg-gradient-to-br from-teal-500 via-green-600 to-emerald-700 text-white",
      gradientRoyal:
        "bg-gradient-to-br from-indigo-600 via-purple-700 to-fuchsia-700 text-white",
      gradientOceanNight:
        "bg-gradient-to-br from-cyan-500 via-blue-600 to-blue-900 text-white",
      dark: "bg-white text-black",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

const headerAnimationVariant = {
  fadeUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
  },
  slideLeft: {
    initial: { opacity: 0, x: -40 },
    animate: { opacity: 1, x: 0 },
  },
  slideRight: {
    initial: { opacity: 0, x: 40 },
    animate: { opacity: 1, x: 0 },
  },
  flipIn: {
    initial: { rotateX: -90, opacity: 0 },
    animate: { rotateX: 0, opacity: 1 },
  },
};

/* ------------------ PANEL HEADER ------------------ */
export const FormHeader = ({
  head,
  para,
  animationVariant = "fadeUp",
}: ForgotPasswordHeaderProps) => {
  const anim =
    headerAnimationVariant[animationVariant] ?? headerAnimationVariant.fadeUp;

  return (
    <motion.div
      initial={anim.initial}
      animate={anim.animate}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="flex flex-col justify-center items-start gap-4 px-4"
    >
      <h1 className="text-4xl font-extrabold leading-tight">{head}</h1>
      <p className="text-lg opacity-90 max-w-sm">{para}</p>
    </motion.div>
  );
};

/** Back To Login Link */
export const LinkButton = ({
  label = "Back to Login",
  onBack,
  textColor,
}: LinkButtonProps) => {
  return (
    <Button
      variant="link"
      className={cn("hover:cursor-pointer", textColor)}
      onClick={onBack}
    >
      {label}
    </Button>
  );
};

/** Zod Validation Schema */
const emailSchema = z.string().email("Please enter a valid email address.");

const ForgotPasswordContent: React.FC<ForgotPasswordProps> = ({
  forgotPasswordHeader,
  forgotSplitHeader,
  formCardHeader,
  formSplitHeader,
  variant = "default",
  inputVariant = "clean",
  animationVariant = "scaleHeartBeat",
  formType = "split",
  headerAnimation = "fadeUp",
  successMessage = "Check your email for a reset link",
  onSubmit,
  onNavigateTo,
  navigateToLabel = "Back To Login",
  submitbuttonLabel = "Send Reset Link",
}) => {
  const [email, setEmail] = React.useState("");
  const [status, setStatus] = React.useState<"idle" | "success" | "error">(
    "idle"
  );
  const [errorMessage, setErrorMessage] = React.useState("");
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const handleSubmit = () => {
    const result = emailSchema.safeParse(email);

    if (!result.success) {
      setStatus("error");
      setErrorMessage(result.error.issues[0].message);
      return;
    }

    // fire consumer handler (apps handle the actual API call)
    try {
      onSubmit?.(email);
      setStatus("success");
      setErrorMessage(successMessage);
    } catch (err: any) {
      // if consumer throws synchronously
      setStatus("error");
      setErrorMessage(err?.message ?? "Failed to submit");
    }
  };

  const handleNavigateTo = () => {
    onNavigateTo?.();
  };

  /* ----------- RESOLVED HEADERS ----------- */

  const resolvedFormCardHeader = forgotPasswordHeader ? (
    <FormHeader
      head={forgotPasswordHeader.head}
      para={forgotPasswordHeader.para}
      animationVariant={headerAnimation}
    />
  ) : (
    formCardHeader
  );

  const resolvedSplitHeader = forgotSplitHeader ? (
    <FormHeader
      head={forgotSplitHeader.head}
      para={forgotSplitHeader.para}
      animationVariant={headerAnimation}
    />
  ) : (
    formSplitHeader
  );

  /* ------------- FORM CARD ------------- */
  const FormCard = (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className={cn(
        "w-full max-w-md p-8 rounded-2xl shadow-xl border border-gray-200",
        (variant === "dark" && formType === "center") || isMobile
          ? ForgotPasswordVariants({ variant })
          : ForgotPasswordCardVariants({ variant })
      )}
    >
      <div className="flex flex-col items-center gap-3 mb-6">
        <Lock size={58} />
        {resolvedFormCardHeader}
      </div>

      <div className="space-y-6">
        <AnimatedInput
          placeholder="Enter your email"
          variant={inputVariant}
          value={email}
          onChange={(val: string) => setEmail(val)}
        />

        <Button
          animationVariant={animationVariant}
          className={cn(
            "w-full h-12 rounded-xl text-base",
            !isMobile && formType !== "center"
              ? ForgotPasswordVariants({ variant })
              : ForgotPasswordCardVariants({ variant })
          )}
          onClick={handleSubmit}
        >
          {submitbuttonLabel}
        </Button>

        {status === "error" && (
          <p className="text-red-500 font-medium text-center">{errorMessage}</p>
        )}

        {/* If consumer passed a `loginLink` node use it; otherwise render default LinkButton */}
        <LinkButton
          label={navigateToLabel}
          onBack={handleNavigateTo}
          textColor={
            variant === "dark" && formType === "center" ? "text-white" : ""
          }
        />

        {status === "success" && (
          <>
            <p className="text-green-500 font-medium text-center">
              {successMessage}
            </p>
          </>
        )}
      </div>
    </motion.div>
  );

  /* -------- CENTER -------- */
  if (formType === "center") {
    return (
      <div
        className={cn(
          "flex min-h-screen items-center justify-center px-4 py-10 bg-gray-50",
          ForgotPasswordVariants({ variant })
        )}
      >
        {FormCard}
      </div>
    );
  }

  /* -------- SPLIT -------- */
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gray-50">
      <div className="flex w-full max-w-6xl rounded-3xl overflow-hidden shadow-2xl">
        <div
          className={cn(
            "hidden md:flex md:w-1/2 flex-col justify-center p-16",
            ForgotPasswordVariants({ variant })
          )}
        >
          {resolvedSplitHeader}
        </div>

        <div
          className={cn(
            "flex w-full md:w-1/2 justify-center items-center p-10 bg-white",
            ForgotPasswordCardVariants({ variant })
          )}
        >
          {FormCard}
        </div>
      </div>
    </div>
  );
};

export const ForgotPasswordPage: React.FC<ForgotPasswordProps> = (props) => {
  return <ForgotPasswordContent {...props} />;
};
