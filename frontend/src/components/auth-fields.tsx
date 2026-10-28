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
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  REGEXP_ONLY_DIGITS,
} from "./ui/input-otp";
import { useCooldown } from "../hooks/use-cooldown";
import { getErrorMessage } from "../lib/api";

type FieldProps = {
  label: string;
  icon: typeof Mail;
  type?: HTMLInputTypeAttribute;
  placeholder: string;
  name?: string;
  value?: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
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

export function OtpField({
  value,
  onValueChange,
  disabled = false,
}: {
  value: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
}) {
  return (
    <div className="mb-[22px] block text-[13px] font-semibold text-zinc-300">
      <div className="mb-3 flex items-center justify-between">
        <Label>Verification code</Label>
        <span className="text-xs font-normal text-zinc-500">6 digits</span>
      </div>
      <div className="flex justify-center">
        <InputOTP
          maxLength={6}
          value={value}
          onChange={onValueChange}
          pattern={REGEXP_ONLY_DIGITS}
          disabled={disabled}
        >
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
      </div>
    </div>
  );
}

export function ResendCode({
  cooldownKey,
  onResend,
  onError,
}: {
  cooldownKey: string;
  onResend: () => Promise<{ resendAfter: number }>;
  onError: (message: string) => void;
}) {
  const { secondsLeft, start } = useCooldown(cooldownKey);
  const [sending, setSending] = useState(false);

  async function handleClick() {
    onError("");
    setSending(true);
    try {
      const { resendAfter } = await onResend();
      start(resendAfter);
    } catch (error) {
      onError(getErrorMessage(error));
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="mt-[-3px] mb-5 flex items-center justify-between text-xs text-zinc-500">
      <span>Didn't receive the code?</span>
      <button
        type="button"
        className="inline-flex cursor-pointer items-center gap-1 border-0 bg-transparent p-0 text-[13px] font-semibold text-lime-300 hover:underline disabled:cursor-not-allowed disabled:opacity-60"
        disabled={sending || secondsLeft > 0}
        onClick={handleClick}
      >
        {sending && <LoaderCircle className="animate-spin" size={13} />}
        {sending
          ? "Sending..."
          : secondsLeft > 0
            ? `Resend in ${secondsLeft}s`
            : "Resend code"}
      </button>
    </div>
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
      className="group relative mt-7 flex h-12 w-full cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-xl border border-lime-200/50 bg-gradient-to-b from-lime-300 via-lime-300 to-lime-400 text-[14px] font-semibold text-zinc-950 tracking-[-0.01em] shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_1px_3px_rgba(0,0,0,0.4),0_0_20px_-3px_rgba(190,242,100,0.3)] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-lime-200/80 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.65),0_8px_20px_-4px_rgba(0,0,0,0.5),0_0_30px_rgba(190,242,100,0.5)] active:translate-y-0 active:scale-[0.985] active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-300/70 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 disabled:pointer-events-none disabled:opacity-60 disabled:hover:transform-none disabled:shadow-none"
      type="submit"
      disabled={loading}
    >
      {/* Light sheen sweep effect on hover (Linear/SaaS signature) */}
      <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/35 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />

      {/* Top subtle highlight line */}
      <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/40" />

      {loading ? (
        <span className="relative z-10 flex items-center gap-2">
          <LoaderCircle className="animate-spin" size={17} />
          <span>{children}</span>
        </span>
      ) : (
        <span className="relative z-10 flex items-center gap-2">
          <span>{children}</span>
          {icon && (
            <span className="inline-flex transition-transform duration-200 ease-out group-hover:translate-x-1.5">
              {icon}
            </span>
          )}
        </span>
      )}
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
