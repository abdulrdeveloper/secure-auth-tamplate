import { type ReactNode } from "react";
import { KeyRound, LockKeyhole, Mail, UserRound } from "lucide-react";
import { Input, Label } from "./ui";

export function Field({
  label,
  icon: Icon,
  type = "text",
  placeholder,
}: {
  label: string;
  icon: typeof Mail;
  type?: string;
  placeholder: string;
}) {
  return (
    <div className="field">
      <Label>{label}</Label>
      <div className="input-wrap">
        <Icon size={17} />
        <Input type={type} placeholder={placeholder} />
      </div>
    </div>
  );
}
export function NameField() {
  return <Field label="Full name" icon={UserRound} placeholder="Alex Morgan" />;
}
export function PasswordField({ label = "Password" }: { label?: string }) {
  return (
    <Field
      label={label}
      icon={LockKeyhole}
      type="password"
      placeholder="••••••••"
    />
  );
}
export function OtpField() {
  return (
    <Field label="Verification code" icon={KeyRound} placeholder="000000" />
  );
}
export function SubmitButton({
  children,
  icon,
}: {
  children: ReactNode;
  icon: ReactNode;
}) {
  return (
    <button className="primary-button" type="submit">
      {children}
      {icon}
    </button>
  );
}
