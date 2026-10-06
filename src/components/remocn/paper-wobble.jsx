"use client";;
import { useCurrentFrame } from "remotion";
import { DEFAULT_STEP, paperJitter } from "@/lib/remocn/stop-motion";

export function PaperWobble({
  children,
  seed = "wobble",
  amp = 1.4,
  rotAmp = 0.35,
  step = DEFAULT_STEP,
  className,
  style
}) {
  const frame = useCurrentFrame();
  const jitter = paperJitter(frame, seed, { amp, rotAmp, step });
  const wobble = `translate(${jitter.x}px, ${jitter.y}px) rotate(${jitter.rot}deg)`;

  return (
    <div
      className={className}
      style={{
        display: "inline-block",
        ...style,
        transform: style?.transform ? `${style.transform} ${wobble}` : wobble,
      }}
    >
      {children}
    </div>
  );
}
