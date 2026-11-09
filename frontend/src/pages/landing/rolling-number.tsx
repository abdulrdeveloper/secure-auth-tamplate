import { useEffect, useRef, useState } from "react";

// Counts an integer from 0 to its value when it first scrolls into view. The
// width is reserved to the final digit count so nothing reflows while it ticks.
function RollingNumber({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState(() =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches ? value : 0,
  );

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const duration = 750;
        const start = performance.now();
        const tick = (now: number) => {
          const progress = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - progress, 3);
          setShown(Math.round(value * eased));
          if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [value]);

  return (
    <span
      ref={ref}
      className="inline-block text-right tabular-nums"
      style={{ minWidth: `${String(value).length}ch` }}
    >
      {shown}
    </span>
  );
}

// Renders a string, rolling every run of digits and leaving the rest as text.
export function Rolling({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\d+)/).map((part, index) =>
        /^\d+$/.test(part) ? (
          <RollingNumber key={index} value={Number(part)} />
        ) : (
          <span key={index}>{part}</span>
        ),
      )}
    </>
  );
}
