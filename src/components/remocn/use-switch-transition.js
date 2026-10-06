"use client";;
import { switchStyle, switchStyleContext } from "@/components/remocn/switch";
import { easings, mixOklch, useRemocnTheme, useStateTransition } from "@/lib/remocn-ui";

export const DEFAULT_DURATION = 10;

export function tweenSwitchStyle(a, b, t) {
  return {
    trackBackground: mixOklch(a.trackBackground, b.trackBackground, t),
    thumbOffset: a.thumbOffset + (b.thumbOffset - a.thumbOffset) * t,
  };
}

export function useSwitchTransition(steps, opts = {}) {
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
  const ctx = switchStyleContext(theme);
  const { from, to, progress } = useStateTransition(
    steps,
    "unchecked",
    speed,
    defaultDuration,
  );
  const t = easings.out(progress);
  return tweenSwitchStyle(switchStyle(from, ctx), switchStyle(to, ctx), t);
}
