"use client";;
import { loadFont } from "@remotion/google-fonts/Caveat";
import { useCurrentFrame } from "remotion";
import {
  DEFAULT_STEP,
  hashRange,
  qstep,
  steppedRamp,
} from "@/lib/remocn/stop-motion";

const { fontFamily: HAND_FAMILY } = loadFont("normal", {
  subsets: ["latin"],
  weights: ["400", "500", "600", "700"],
});

const easeOutCubic = (t) => 1 - (1 - t) ** 3;

const easeInOutCubic = (t) =>
  t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2;

const DEFAULT_DURATION_STEPS = 18;

const EASES = {
  "in-out": easeInOutCubic,
  out: easeOutCubic,
  linear: (t) => t,
};

export function handCountDuration(options) {
  const delay = options?.delay ?? 0;
  const durationSteps = options?.durationSteps ?? DEFAULT_DURATION_STEPS;
  const step = options?.step ?? DEFAULT_STEP;
  const end = delay + durationSteps * step;
  return Math.ceil(end / step) * step;
}

export function handCountValue(args) {
  const from = args.from ?? 0;
  const delay = args.delay ?? 0;
  const durationSteps = args.durationSteps ?? DEFAULT_DURATION_STEPS;
  const step = args.step ?? DEFAULT_STEP;
  const progress = steppedRamp(
    args.frame,
    delay,
    delay + durationSteps * step,
    {
      ease: EASES[args.ease ?? "in-out"],
      step,
    },
  );
  return from + (args.to - from) * progress;
}

export function handCountText(value, options) {
  return `${options?.prefix ?? ""}${value.toFixed(options?.decimals ?? 0)}${options?.suffix ?? ""}`;
}

export function handCountPose(frame, options) {
  const step = options?.step ?? DEFAULT_STEP;
  const settled = handCountDuration(options);
  return Math.min(qstep(Math.max(0, frame), step), qstep(settled, step));
}

export function handCountJitter(args) {
  const seed = args.seed ?? "count";
  const pose = handCountPose(args.frame, args);
  return {
    rot: hashRange(`${seed}:${pose}:${args.index}:r`, -3.2, 3.2),
    dy: hashRange(`${seed}:${pose}:${args.index}:y`, -1.8, 1.8),
  };
}

export function HandCount({
  to,
  from = 0,
  delay = 0,
  durationSteps = DEFAULT_DURATION_STEPS,
  decimals = 0,
  prefix = "",
  suffix = "",
  fontSize = 96,
  color = "#26242c",
  weight = 700,
  ease = "in-out",
  align = "center",
  fontFamily = HAND_FAMILY,
  seed = "count",
  step = DEFAULT_STEP
}) {
  const frame = useCurrentFrame();
  const value = handCountValue({
    frame,
    to,
    from,
    delay,
    durationSteps,
    step,
    ease,
  });
  const chars = Array.from(handCountText(value, { decimals, prefix, suffix }));

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: align === "center" ? "center" : "flex-start",
        background: "transparent",
      }}
    >
      <span
        style={{
          display: "inline-block",
          fontFamily: `${fontFamily}, cursive`,
          fontWeight: weight,
          fontSize,
          lineHeight: 1.15,
          color,
          whiteSpace: "pre",
          textAlign: align,
        }}
      >
        {chars.map((char, i) => {
          const { rot, dy } = handCountJitter({
            frame,
            index: i,
            seed,
            delay,
            durationSteps,
            step,
          });
          return (
            <span
              key={`${i}:${char}`}
              style={{
                display: "inline-block",
                whiteSpace: "pre",
                translate: `0 ${dy}px`,
                rotate: `${rot}deg`,
              }}
            >
              {char}
            </span>
          );
        })}
      </span>
    </div>
  );
}
