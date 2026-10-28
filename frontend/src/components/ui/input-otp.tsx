import * as React from "react";
import { OTPInput, OTPInputContext, REGEXP_ONLY_DIGITS } from "input-otp";
import { Minus } from "lucide-react";

const InputOTP = React.forwardRef<
  React.ElementRef<typeof OTPInput>,
  React.ComponentPropsWithoutRef<typeof OTPInput>
>(({ className = "", containerClassName = "", ...props }, ref) => (
  <OTPInput
    ref={ref}
    containerClassName={`flex items-center justify-center gap-2 has-disabled:opacity-50 ${containerClassName}`}
    className={`disabled:cursor-not-allowed ${className}`}
    {...props}
  />
));
InputOTP.displayName = "InputOTP";

const InputOTPGroup = React.forwardRef<
  React.ElementRef<"div">,
  React.ComponentPropsWithoutRef<"div">
>(({ className = "", ...props }, ref) => (
  <div
    ref={ref}
    className={`flex items-center gap-2 ${className}`}
    {...props}
  />
));
InputOTPGroup.displayName = "InputOTPGroup";

const InputOTPSlot = React.forwardRef<
  React.ElementRef<"div">,
  React.ComponentPropsWithoutRef<"div"> & { index: number }
>(({ index, className = "", ...props }, ref) => {
  const inputOTPContext = React.useContext(OTPInputContext);
  const { char, hasFakeCaret, isActive } =
    inputOTPContext?.slots[index] ?? {};

  return (
    <div
      ref={ref}
      className={`relative flex h-12 w-11 items-center justify-center rounded-lg border text-base font-semibold transition-all select-none sm:w-12 ${
        isActive
          ? "border-lime-300 ring-2 ring-lime-300/20 text-lime-300 shadow-sm"
          : "border-zinc-800 bg-zinc-900/90 text-zinc-100 hover:border-zinc-700"
      } ${className}`}
      {...props}
    >
      {char}
      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-5 w-0.5 animate-caret-blink bg-lime-300 duration-1000" />
        </div>
      )}
    </div>
  );
});
InputOTPSlot.displayName = "InputOTPSlot";

const InputOTPSeparator = React.forwardRef<
  React.ElementRef<"div">,
  React.ComponentPropsWithoutRef<"div">
>(({ ...props }, ref) => (
  <div ref={ref} role="separator" {...props}>
    <Minus className="size-4 text-zinc-600" />
  </div>
));
InputOTPSeparator.displayName = "InputOTPSeparator";

export {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
  REGEXP_ONLY_DIGITS,
};
