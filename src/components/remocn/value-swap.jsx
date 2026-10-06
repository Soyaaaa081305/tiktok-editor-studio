"use client";;
import { Easing, interpolate, useCurrentFrame } from "remotion";

const clampOpts = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
};

export function ValueSwap({
  values,
  at,
  duration = 10,
  distance = 12,
  direction = "up",
  className,
  style
}) {
  const frame = useCurrentFrame();
  const ats = Array.isArray(at) ? at : [at];
  const d = direction === "down" ? -distance : distance;
  const count = Math.min(values.length, ats.length + 1);
  const rendered = values.slice(0, count);
  const sizer = rendered.reduce((a, b) => (b.length > a.length ? b : a), "");
  const swapP = (start) =>
    interpolate(frame, [start, start + duration], [0, 1], {
      ...clampOpts,
      easing: Easing.inOut(Easing.cubic),
    });
  return (
    <span
      className={className}
      style={{
        position: "relative",
        display: "inline-block",
        ...style,
      }}
    >
      <span style={{ visibility: "hidden" }}>{sizer}</span>
      {rendered.map((value, i) => {
        const pIn = i > 0 ? swapP(ats[i - 1]) : 1;
        const pOut = i < count - 1 ? swapP(ats[i]) : 0;
        const opacity = pIn * (1 - pOut);
        if (opacity <= 0.001) return null;
        const y = (1 - pIn) * d + pOut * -d;
        return (
          <span
            key={`${i}-${value}`}
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              whiteSpace: "nowrap",
              opacity,
              translate: `0 ${y}px`,
            }}
          >
            {value}
          </span>
        );
      })}
    </span>
  );
}
