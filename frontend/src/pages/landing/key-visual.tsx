import { useEffect, useRef, useState } from "react";
import { KeyPoster } from "./key-poster";

// Shows the static poster first, then loads the 3D scene in its own chunk and
// crossfades to it. Small screens, reduced motion and browsers without WebGL
// keep the poster.

function canUse3D(): boolean {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  if (!window.matchMedia("(min-width: 768px)").matches) return false;
  try {
    return Boolean(document.createElement("canvas").getContext("webgl2"));
  } catch {
    return false;
  }
}

export function HeroVisual() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas || !canUse3D()) return;

    let cancelled = false;
    let dispose: (() => void) | undefined;

    import("./scene/key-scene")
      .then(({ createKeyScene }) => {
        if (cancelled) return;
        dispose = createKeyScene(canvas, container, () => setReady(true)).dispose;
      })
      .catch(() => undefined);

    return () => {
      cancelled = true;
      dispose?.();
    };
  }, []);

  return (
    <div ref={containerRef} className="relative mx-auto aspect-square w-full max-w-[520px]">
      <KeyPoster
        className={`absolute inset-0 size-full transition-all duration-700 ${
          ready ? "scale-95 opacity-0" : "scale-100 opacity-100"
        }`}
      />
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className={`absolute inset-0 size-full transition-opacity duration-700 ${
          ready ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
}
