import {
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type HTMLInputTypeAttribute,
  type ReactNode,
} from "react";
import {
  Eye,
  EyeOff,
  AlertCircle,
  KeyRound,
  LockKeyhole,
  LoaderCircle,
  Mail,
  UserRound,
} from "lucide-react";
import { Input, Label } from "./ui";

type FieldProps = {
  label: string;
  icon: typeof Mail;
  type?: HTMLInputTypeAttribute;
  placeholder: string;
  name?: string;
  value?: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  maxLength?: number;
};

export function Field({
  label,
  icon: Icon,
  type = "text",
  placeholder,
  name,
  value,
  onChange,
  inputMode,
  maxLength,
}: FieldProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="field">
      <Label htmlFor={inputId}>{label}</Label>
      <div className="input-wrap" onClick={() => inputRef.current?.focus()}>
        <Icon size={17} />
        <Input
          ref={inputRef}
          id={inputId}
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          inputMode={inputMode}
          maxLength={maxLength}
          required
        />
      </div>
    </div>
  );
}
export function NameField(
  props: Omit<FieldProps, "label" | "icon" | "placeholder">,
) {
  return (
    <Field
      label="Full name"
      icon={UserRound}
      placeholder="Alex Morgan"
      {...props}
    />
  );
}
export function PasswordField({
  label = "Password",
  ...props
}: { label?: string } & Omit<
  FieldProps,
  "label" | "icon" | "type" | "placeholder"
>) {
  const [visible, setVisible] = useState(false);

  return (
    <PasswordInput
      label={label}
      visible={visible}
      onToggle={() => setVisible((current) => !current)}
      {...props}
    />
  );
}

function PasswordInput({
  label,
  visible,
  onToggle,
  ...props
}: {
  label: string;
  visible: boolean;
  onToggle: () => void;
} & Omit<FieldProps, "label" | "icon" | "type" | "placeholder">) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="field">
      <Label htmlFor={inputId}>{label}</Label>
      <div className="input-wrap" onClick={() => inputRef.current?.focus()}>
        <LockKeyhole size={17} />
        <Input
          ref={inputRef}
          id={inputId}
          type={visible ? "text" : "password"}
          placeholder="••••••••"
          {...props}
        />
        <button
          type="button"
          className="password-toggle"
          aria-label={visible ? "Hide password" : "Show password"}
          onClick={(event) => {
            event.stopPropagation();
            onToggle();
            inputRef.current?.focus();
          }}
        >
          {visible ? <EyeOff size={17} /> : <Eye size={17} />}
        </button>
      </div>
    </div>
  );
}
export function OtpField(
  props: Omit<FieldProps, "label" | "icon" | "placeholder">,
) {
  return (
    <Field
      label="Verification code"
      icon={KeyRound}
      placeholder="000000"
      {...props}
    />
  );
}
export function SubmitButton({
  children,
  icon,
  loading = false,
}: {
  children: ReactNode;
  icon: ReactNode;
  loading?: boolean;
}) {
  return (
    <button className="primary-button" type="submit" disabled={loading}>
      {loading && <LoaderCircle className="animate-spin" size={17} />}
      {children}
      {!loading && icon}
    </button>
  );
}

export function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="error-message" role="alert">
      <AlertCircle size={16} />
      <span>{message}</span>
    </div>
  );
}
