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
    <div className="mb-[19px] block text-[13px] font-semibold text-zinc-300">
      <Label htmlFor={inputId}>{label}</Label>
      <div
        className="mt-2 flex h-[47px] cursor-text items-center gap-2.5 rounded-lg border border-zinc-800 bg-zinc-900 px-3.5 text-zinc-500 transition-colors focus-within:border-lime-300"
        onClick={() => inputRef.current?.focus()}
      >
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
      placeholder="Sam Rivera"
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
    <div className="mb-[19px] block text-[13px] font-semibold text-zinc-300">
      <Label htmlFor={inputId}>{label}</Label>
      <div
        className="mt-2 flex h-[47px] cursor-text items-center gap-2.5 rounded-lg border border-zinc-800 bg-zinc-900 px-3.5 text-zinc-500 transition-colors focus-within:border-lime-300"
        onClick={() => inputRef.current?.focus()}
      >
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
          className="shrink-0 cursor-pointer border-0 bg-transparent p-0 text-zinc-500 hover:text-zinc-200"
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
    <button
      className="mt-[27px] flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-lg border-0 bg-lime-300 font-bold text-zinc-950 transition-[filter,transform] hover:-translate-y-px hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:transform-none"
      type="submit"
      disabled={loading}
    >
      {loading && <LoaderCircle className="animate-spin" size={17} />}
      {children}
      {!loading && icon}
    </button>
  );
}

export function ErrorMessage({ message }: { message: string }) {
  return (
    <div
      className="mt-[-5px] mb-[18px] flex items-start gap-2 rounded-lg border border-red-900/70 bg-red-950/40 px-3 py-2.5 text-xs leading-relaxed text-red-300"
      role="alert"
    >
      <AlertCircle className="mt-0.5 shrink-0" size={16} />
      <span>{message}</span>
    </div>
  );
}
