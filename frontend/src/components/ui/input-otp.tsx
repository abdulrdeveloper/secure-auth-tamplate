import * as React from "react";
import { OTPInput, OTPInputContext, REGEXP_ONLY_DIGITS } from "input-otp";

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
      className={`relative flex h-11 w-10 items-center justify-center rounded-md border text-base font-semibold transition-colors select-none sm:w-11 ${
        isActive
          ? "border-zinc-400 ring-2 ring-zinc-500/30 text-zinc-50"
          : "border-zinc-700 bg-zinc-950 text-zinc-50"
      } ${className}`}
      {...props}
    >
      {char}
      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-5 w-0.5 animate-caret-blink bg-white duration-1000" />
        </div>
      )}
    </div>
  );
});
InputOTPSlot.displayName = "InputOTPSlot";

export { InputOTP, InputOTPGroup, InputOTPSlot, REGEXP_ONLY_DIGITS };
