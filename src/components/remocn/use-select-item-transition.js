"use client";;
import { selectItemStyle, selectItemStyleContext } from "@/components/remocn/select-item";
import { easings, mixOklch, useRemocnTheme, useStateTransition } from "@/lib/remocn-ui";

export const DEFAULT_DURATION = 8;

export function tweenSelectItemStyle(a, b, t) {
  return {
    background: mixOklch(a.background, b.background, t),
    labelColor: mixOklch(a.labelColor, b.labelColor, t),
    checkOpacity: a.checkOpacity + (b.checkOpacity - a.checkOpacity) * t,
    scale: a.scale + (b.scale - a.scale) * t,
  };
}

export function useSelectItemTransition(steps, opts = {}) {
  const {
    theme: themeOverride,
    mode,
    speed = 1,
    defaultDuration = DEFAULT_DURATION,
  } = opts;
  const theme = useRemocnTheme(themeOverride, mode);
  const ctx = selectItemStyleContext(theme);
  const { from, to, progress } = useStateTransition(
    steps,
    "idle",
    speed,
    defaultDuration,
  );
  const t = easings.out(progress);
  return tweenSelectItemStyle(
    selectItemStyle(from, ctx),
    selectItemStyle(to, ctx),
    t,
  );
}
