import {
  forwardRef,
  type InputHTMLAttributes,
  type LabelHTMLAttributes,
} from "react";

export const Input = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement>
>(({ className = "", ...props }, ref) => (
  <input
    ref={ref}
    className={`h-10 w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 text-sm text-zinc-50 outline-none transition-colors placeholder:text-zinc-500 focus:border-zinc-400 focus:ring-2 focus:ring-zinc-500/30 ${className}`}
    style={{ colorScheme: "dark" }}
    {...props}
  />
));
Input.displayName = "Input";

export const Label = forwardRef<
  HTMLLabelElement,
  LabelHTMLAttributes<HTMLLabelElement>
>(({ className = "", ...props }, ref) => (
  <label
    ref={ref}
    className={`mb-1.5 block text-sm font-medium text-zinc-200 ${className}`}
    {...props}
  />
));
Label.displayName = "Label";
