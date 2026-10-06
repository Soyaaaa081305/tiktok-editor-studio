"use client";;
import { radioStyle, radioStyleContext } from "@/components/remocn/radio";
import { easings, mixOklch, useRemocnTheme, useStateTransition } from "@/lib/remocn-ui";

export const DEFAULT_DURATION = 10;

export function tweenRadioStyle(a, b, t) {
  return {
    ringBorderColor: mixOklch(a.ringBorderColor, b.ringBorderColor, t),
    dotOpacity: a.dotOpacity + (b.dotOpacity - a.dotOpacity) * t,
    dotScale: a.dotScale + (b.dotScale - a.dotScale) * t,
  };
}

export function useRadioTransition(steps, opts = {}) {
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
  const ctx = radioStyleContext(theme);
  const { from, to, progress } = useStateTransition(
    steps,
    "unchecked",
    speed,
    defaultDuration,
  );
  const t = easings.out(progress);
  return tweenRadioStyle(radioStyle(from, ctx), radioStyle(to, ctx), t);
}
