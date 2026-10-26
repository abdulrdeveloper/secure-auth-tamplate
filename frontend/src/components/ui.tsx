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
    className={`w-full border-0 bg-transparent text-zinc-50 outline-none selection:bg-lime-300 selection:text-zinc-950 placeholder:text-zinc-600 ${className}`}
    style={{ colorScheme: "dark" }}
    {...props}
  />
));
Input.displayName = "Input";

export const Label = forwardRef<
  HTMLLabelElement,
  LabelHTMLAttributes<HTMLLabelElement>
>(({ className = "", ...props }, ref) => (
  <label ref={ref} className={`block ${className}`} {...props} />
));
Label.displayName = "Label";

export function Card({
  className = "",
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`rounded-xl border border-zinc-800 bg-zinc-900/70 p-[25px] ${className}`}
      {...props}
    />
  );
}
