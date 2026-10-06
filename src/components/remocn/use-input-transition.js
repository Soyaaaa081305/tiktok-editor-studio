"use client";;
import { inputStyle, inputStyleContext } from "@/components/remocn/input";
import { easings, mixOklch, useRemocnTheme, useStateTransition } from "@/lib/remocn-ui";

export const DEFAULT_DURATION = 8;

export function tweenInputStyle(a, b, t) {
  return {
    ringWidth: a.ringWidth + (b.ringWidth - a.ringWidth) * t,
    caretOpacity: a.caretOpacity + (b.caretOpacity - a.caretOpacity) * t,
    valueReveal: a.valueReveal + (b.valueReveal - a.valueReveal) * t,
    placeholderOpacity:
      a.placeholderOpacity + (b.placeholderOpacity - a.placeholderOpacity) * t,
    borderColor: mixOklch(a.borderColor, b.borderColor, t),
    ringColor: mixOklch(a.ringColor, b.ringColor, t),
    background: mixOklch(a.background, b.background, t),
  };
}

export function useInputTransition(steps, opts = {}) {
  const {
    theme: themeOverride,
    mode,
    primary,
    speed = 1,
    defaultDuration = DEFAULT_DURATION,
  } = opts;
  const theme = useRemocnTheme(
    { ...themeOverride, ...(primary ? { primary } : {}) },
    mode,
  );
  const ctx = inputStyleContext(theme);
  const { from, to, progress } = useStateTransition(
    steps,
    "idle",
    speed,
    defaultDuration,
  );
  const t = easings.out(progress);
  return tweenInputStyle(inputStyle(from, ctx), inputStyle(to, ctx), t);
}
