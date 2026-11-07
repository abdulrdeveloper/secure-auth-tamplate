import {
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type HTMLInputTypeAttribute,
  type ReactNode,
} from "react";
import {
  AlertCircle,
  Eye,
  EyeOff,
  LoaderCircle,
  LockKeyhole,
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
  type?: HTMLInputTypeAttribute;
  placeholder?: string;
  name?: string;
  value?: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
};

export function Field({ label, type = "text", ...props }: FieldProps) {
  const id = useId();
  const Icon = type === "email" ? Mail : UserRound;
  return (
    <div className="mb-3.5">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Icon size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
        <Input id={id} type={type} required className="pl-9" {...props} />
      </div>
    </div>
  );
}

export function NameField(props: Omit<FieldProps, "label">) {
  return <Field label="Full name" placeholder="Sam Rivera" {...props} />;
}

export function PasswordField({
  label = "Password",
  ...props
}: { label?: string } & Omit<FieldProps, "label" | "type" | "placeholder">) {
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [visible, setVisible] = useState(false);

  return (
    <div className="mb-3.5">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <LockKeyhole size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
        <Input
          ref={inputRef}
          id={id}
          type={visible ? "text" : "password"}
          placeholder="••••••••"
          required
          className="pl-9 pr-10"
          {...props}
        />
        <button
          type="button"
          className="absolute inset-y-0 right-0 grid w-10 cursor-pointer place-items-center text-zinc-500 hover:text-zinc-200"
          aria-label={visible ? "Hide password" : "Show password"}
          onClick={() => {
            setVisible((current) => !current);
            inputRef.current?.focus();
          }}
        >
          {visible ? <EyeOff size={16} /> : <Eye size={16} />}
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
    <div className="mb-5">
      <p className="mb-2 text-sm font-medium text-zinc-200">Verification code</p>
      <InputOTP
        maxLength={6}
        value={value}
        onChange={onValueChange}
        pattern={REGEXP_ONLY_DIGITS}
        disabled={disabled}
      >
        <InputOTPGroup>
          {[0, 1, 2, 3, 4, 5].map((index) => (
            <InputOTPSlot key={index} index={index} />
          ))}
        </InputOTPGroup>
      </InputOTP>
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
    <div className="mb-5 flex items-center justify-between text-sm text-zinc-400">
      <span>Didn&apos;t receive a code?</span>
      <button
        type="button"
        className="cursor-pointer border-0 bg-transparent p-0 font-medium text-blue-400 hover:text-blue-300 disabled:cursor-not-allowed disabled:opacity-50"
        disabled={sending || secondsLeft > 0}
        onClick={handleClick}
      >
        {sending
          ? "Sending..."
          : secondsLeft > 0
            ? `Resend in ${secondsLeft}s`
            : "Resend"}
      </button>
    </div>
  );
}

export function SubmitButton({
  children,
  loading = false,
}: {
  children: ReactNode;
  loading?: boolean;
}) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="mt-2 flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-lg text-sm font-semibold transition-all bg-[linear-gradient(135deg,hsl(38,100%,58%)_0%,hsl(20,95%,55%)_100%)] text-[hsl(228,18%,7%)] hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(38,100%,58%)] focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {loading && <LoaderCircle className="animate-spin" size={16} />}
      {children}
    </button>
  );
}

export function ErrorMessage({ message }: { message: string }) {
  return (
    <div
      role="alert"
      className="mb-4 flex items-start gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2.5 text-sm text-red-300"
    >
      <AlertCircle className="mt-0.5 shrink-0" size={16} />
      <span>{message}</span>
    </div>
  );
}
