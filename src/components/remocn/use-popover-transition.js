"use client";;
import { popoverStyle } from "@/components/remocn/popover";
import { easings, useStateTransition } from "@/lib/remocn-ui";

export const DEFAULT_DURATION = 10;

export function tweenPopoverStyle(a, b, t) {
  return {
    opacity: a.opacity + (b.opacity - a.opacity) * t,
    scale: a.scale + (b.scale - a.scale) * t,
    translate: a.translate + (b.translate - a.translate) * t,
  };
}

export function usePopoverTransition(steps, opts = {}) {
  const { speed = 1, defaultDuration = DEFAULT_DURATION } = opts;
  const { from, to, progress } = useStateTransition(
    steps,
    "closed",
    speed,
    defaultDuration,
  );
  const t = easings.out(progress);
  return tweenPopoverStyle(popoverStyle(from), popoverStyle(to), t);
}
