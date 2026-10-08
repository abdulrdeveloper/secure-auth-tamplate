import {
  forwardRef,
  type InputHTMLAttributes,
  type LabelHTMLAttributes,
} from "react";

export const Input = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement>
>(({ className = "", ...props }, ref) => (
  <input ref={ref} className={`input ${className}`} {...props} />
));
Input.displayName = "Input";
export const Label = forwardRef<
  HTMLLabelElement,
  LabelHTMLAttributes<HTMLLabelElement>
>(({ className = "", ...props }, ref) => (
  <label ref={ref} className={`label ${className}`} {...props} />
));
Label.displayName = "Label";
export function Card({
  className = "",
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`card ${className}`} {...props} />;
}
