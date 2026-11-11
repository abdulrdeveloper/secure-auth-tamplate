import { useEffect, useRef, type ReactNode } from "react";

type ModalProps = {
  open: boolean;
  title: string;
  children: ReactNode;
  onDismiss?: () => void;
  width?: string;
};

export function Modal({ open, title, children, onDismiss, width = "26rem" }: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby="modal-title"
      onCancel={(event) => {
        event.preventDefault();
        onDismiss?.();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onDismiss?.();
      }}
      style={{ width: `min(${width}, calc(100vw - 2rem))` }}
      className="dialog-pop m-auto rounded-2xl border border-zinc-800 bg-[#111113] p-0 text-zinc-100 shadow-2xl shadow-black backdrop:bg-black/60 backdrop:backdrop-blur-sm"
    >
      {open && (
        <div className="p-6">
          <h2 id="modal-title" className="text-base font-semibold text-zinc-50">
            {title}
          </h2>
          {children}
        </div>
      )}
    </dialog>
  );
}

const BUTTON = "h-9 cursor-pointer rounded-lg px-4 text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-60";

export const buttonStyles = {
  secondary: `${BUTTON} border border-zinc-800 font-medium text-zinc-200 hover:bg-zinc-900`,
  primary: `${BUTTON} bg-white font-semibold text-zinc-950 hover:bg-zinc-200`,
  danger: `${BUTTON} bg-red-500 font-semibold text-white hover:bg-red-400`,
};

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  children: ReactNode;
  confirmLabel: string;
  busyLabel?: string;
  busy?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

// Asks before a destructive action. Focus starts on Cancel, the safe choice.
export function ConfirmDialog({
  open,
  title,
  children,
  confirmLabel,
  busyLabel,
  busy = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <Modal open={open} title={title} onDismiss={busy ? undefined : onCancel}>
      <div className="mt-2 text-sm leading-relaxed text-zinc-400">{children}</div>
      <div className="mt-6 flex justify-end gap-2">
        <button type="button" onClick={onCancel} disabled={busy} className={buttonStyles.secondary}>
          Cancel
        </button>
        <button type="button" onClick={onConfirm} disabled={busy} className={buttonStyles.danger}>
          {busy ? (busyLabel ?? confirmLabel) : confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
