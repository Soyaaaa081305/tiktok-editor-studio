"use client";;
import { tooltipStyle } from "@/components/remocn/tooltip";
import { easings, useStateTransition } from "@/lib/remocn-ui";

export const DEFAULT_DURATION = 8;

export function tweenTooltipStyle(a, b, t) {
  return {
    opacity: a.opacity + (b.opacity - a.opacity) * t,
    scale: a.scale + (b.scale - a.scale) * t,
    translate: a.translate + (b.translate - a.translate) * t,
  };
}

export function useTooltipTransition(steps, opts = {}) {
  const { speed = 1, defaultDuration = DEFAULT_DURATION } = opts;
  const { from, to, progress } = useStateTransition(
    steps,
    "hidden",
    speed,
    defaultDuration,
  );
  const t = easings.out(progress);
  return tweenTooltipStyle(tooltipStyle(from), tooltipStyle(to), t);
}
