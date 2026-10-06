"use client";;
import { messageBubbleStyle } from "@/components/remocn/message-bubble";
import { easings, useStateTransition } from "@/lib/remocn-ui";

export const DEFAULT_DURATION = 14;

export function tweenMessageBubbleStyle(a, b, t) {
  return {
    opacity: a.opacity + (b.opacity - a.opacity) * t,
    translateY: a.translateY + (b.translateY - a.translateY) * t,
    scale: a.scale + (b.scale - a.scale) * t,
  };
}

export function useMessageBubbleTransition(steps, opts = {}) {
  const { speed = 1, defaultDuration = DEFAULT_DURATION } = opts;
  const { from, to, progress } = useStateTransition(
    steps,
    "hidden",
    speed,
    defaultDuration,
  );
  const t = easings.out(progress);
  return tweenMessageBubbleStyle(
    messageBubbleStyle(from),
    messageBubbleStyle(to),
    t,
  );
}
