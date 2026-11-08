import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type PointerEvent,
  type ReactNode,
} from "react";
import { AlertCircle, X } from "lucide-react";

const AUTO_DISMISS_MS = 10_000;
const MAX_DRAG = 20;
const EXIT_MS = 250;

type ToastContextValue = { showError: (message: string) => void };

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState<string | null>(null);
  const [key, setKey] = useState(0);

  const showError = useCallback((text: string) => {
    setKey((current) => current + 1);
    setMessage(text);
  }, []);

  const dismiss = useCallback(() => setMessage(null), []);

  return (
    <ToastContext.Provider value={{ showError }}>
      {children}
      {message && <ErrorToast key={key} message={message} onDismiss={dismiss} />}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used inside ToastProvider");
  }
  return context;
}

// Drop-in replacement for an inline error box: shows the message as a toast.
export function FormError({ message }: { message: string }) {
  const { showError } = useToast();
  useEffect(() => {
    showError(message);
  }, [message, showError]);
  return null;
}

function ErrorToast({ message, onDismiss }: { message: string; onDismiss: () => void }) {
  const [offset, setOffset] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [leaving, setLeaving] = useState(false);

  const dragStartX = useRef<number | null>(null);
  const dragMoved = useRef(false);
  const hovering = useRef(false);
  const timer = useRef<number | null>(null);
  const remaining = useRef(AUTO_DISMISS_MS);
  const startedAt = useRef(0);
  const leavingRef = useRef(false);
  const onDismissRef = useRef(onDismiss);

  useEffect(() => {
    onDismissRef.current = onDismiss;
  }, [onDismiss]);

  const dismiss = useCallback(() => {
    if (leavingRef.current) return;
    leavingRef.current = true;
    setLeaving(true);
    window.setTimeout(() => onDismissRef.current(), EXIT_MS);
  }, []);

  const pause = useCallback(() => {
    if (timer.current === null) return;
    window.clearTimeout(timer.current);
    timer.current = null;
    remaining.current -= Date.now() - startedAt.current;
  }, []);

  const resume = useCallback(() => {
    if (timer.current !== null || leavingRef.current) return;
    startedAt.current = Date.now();
    timer.current = window.setTimeout(dismiss, Math.max(remaining.current, 0));
  }, [dismiss]);

  useEffect(() => {
    resume();
    return pause;
  }, [pause, resume]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") dismiss();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [dismiss]);

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    dragStartX.current = event.clientX;
    dragMoved.current = false;
    setDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
    pause();
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (dragStartX.current === null) return;
    const raw = event.clientX - dragStartX.current;
    if (Math.abs(raw) > 4) dragMoved.current = true;
    // The toast moves at most MAX_DRAG px in either direction.
    setOffset(Math.max(-MAX_DRAG, Math.min(MAX_DRAG, raw)));
  }

  function endDrag(event: PointerEvent<HTMLDivElement>, cancelled: boolean) {
    const startX = dragStartX.current;
    dragStartX.current = null;
    setDragging(false);
    if (startX === null) return;

    const dx = Math.max(-MAX_DRAG, Math.min(MAX_DRAG, event.clientX - startX));
    if (!cancelled && (!dragMoved.current || dx >= MAX_DRAG)) {
      dismiss();
      return;
    }

    setOffset(0);
    if (!hovering.current) resume();
  }

  function handleEnter() {
    hovering.current = true;
    pause();
  }

  function handleLeave() {
    hovering.current = false;
    if (dragStartX.current === null) resume();
  }

  return (
    <div className="pointer-events-none fixed right-4 top-4 z-50 w-[min(22rem,calc(100vw-2rem))]">
      <div className={`pointer-events-auto ${leaving ? "toast-out" : "toast-in"}`}>
        <div
          role="alert"
          className="flex touch-pan-y select-none items-start gap-3 rounded-xl border border-zinc-800 bg-[#111113] p-4 text-sm text-zinc-100 shadow-2xl shadow-black/60 cursor-grab active:cursor-grabbing"
          style={{
            transform: `translate3d(${offset}px, 0, 0)`,
            transition: dragging ? "none" : "transform 300ms cubic-bezier(0.2, 0.8, 0.2, 1)",
          }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={(event) => endDrag(event, false)}
          onPointerCancel={(event) => endDrag(event, true)}
          onPointerEnter={handleEnter}
          onPointerLeave={handleLeave}
        >
          <AlertCircle className="mt-0.5 shrink-0 text-zinc-300" size={18} />
          <p className="flex-1 leading-relaxed">{message}</p>
          <button
            type="button"
            aria-label="Dismiss"
            className="-m-1 grid size-7 shrink-0 cursor-pointer place-items-center rounded-md text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-zinc-100"
            onPointerDown={(event) => event.stopPropagation()}
            onClick={dismiss}
          >
            <X size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
