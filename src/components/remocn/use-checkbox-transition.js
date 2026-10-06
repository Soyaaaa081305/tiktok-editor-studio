"use client";;
import { checkboxStyle, checkboxStyleContext } from "@/components/remocn/checkbox";
import { easings, mixOklch, useRemocnTheme, useStateTransition } from "@/lib/remocn-ui";

export const DEFAULT_DURATION = 10;

export function tweenCheckboxStyle(a, b, t) {
  return {
    boxBackground: mixOklch(a.boxBackground, b.boxBackground, t),
    boxBorderColor: mixOklch(a.boxBorderColor, b.boxBorderColor, t),
    checkOpacity: a.checkOpacity + (b.checkOpacity - a.checkOpacity) * t,
    checkScale: a.checkScale + (b.checkScale - a.checkScale) * t,
    checkDraw: a.checkDraw + (b.checkDraw - a.checkDraw) * t,
  };
}

export function useCheckboxTransition(steps, opts = {}) {
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
  const ctx = checkboxStyleContext(theme);
  const { from, to, progress } = useStateTransition(
    steps,
    "unchecked",
    speed,
    defaultDuration,
  );
  const t = easings.out(progress);
  return tweenCheckboxStyle(
    checkboxStyle(from, ctx),
    checkboxStyle(to, ctx),
    t,
  );
}
