"use client";;
import { buttonStyle, buttonStyleContext } from "@/components/remocn/button";
import { easings, mixOklch, useRemocnTheme, useStateTransition } from "@/lib/remocn-ui";

export const DEFAULT_DURATION = 8;

export function tweenButtonStyle(a, b, t) {
  return {
    translateY: a.translateY + (b.translateY - a.translateY) * t,
    scale: a.scale + (b.scale - a.scale) * t,
    labelOpacity: a.labelOpacity + (b.labelOpacity - a.labelOpacity) * t,
    spinnerOpacity:
      a.spinnerOpacity + (b.spinnerOpacity - a.spinnerOpacity) * t,
    checkOpacity: a.checkOpacity + (b.checkOpacity - a.checkOpacity) * t,
    background: mixOklch(a.background, b.background, t),
  };
}

export function useButtonTransition(steps, opts = {}) {
  const {
    variant = "default",
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
  const ctx = buttonStyleContext(variant, theme);
  const { from, to, progress } = useStateTransition(
    steps,
    "idle",
    speed,
    defaultDuration,
  );
  const t = easings.out(progress);
  return tweenButtonStyle(buttonStyle(from, ctx), buttonStyle(to, ctx), t);
}
