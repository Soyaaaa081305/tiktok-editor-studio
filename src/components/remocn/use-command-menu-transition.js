"use client";;
import { commandMenuStyle, commandMenuStyleContext } from "@/components/remocn/command-menu";
import { easings, useRemocnTheme, useStateTransition } from "@/lib/remocn-ui";

export const DEFAULT_DURATION = 12;

export function tweenCommandMenuStyle(a, b, t) {
  return {
    backdropOpacity:
      a.backdropOpacity + (b.backdropOpacity - a.backdropOpacity) * t,
    panelOpacity: a.panelOpacity + (b.panelOpacity - a.panelOpacity) * t,
    panelScale: a.panelScale + (b.panelScale - a.panelScale) * t,
    panelTranslateY:
      a.panelTranslateY + (b.panelTranslateY - a.panelTranslateY) * t,
  };
}

export function useCommandMenuTransition(steps, opts = {}) {
  const {
    theme: themeOverride,
    mode,
    speed = 1,
    defaultDuration = DEFAULT_DURATION,
  } = opts;
  const theme = useRemocnTheme(themeOverride, mode);
  const ctx = commandMenuStyleContext(theme);
  const { from, to, progress } = useStateTransition(
    steps,
    "closed",
    speed,
    defaultDuration,
  );
  const t = easings.out(progress);
  return tweenCommandMenuStyle(
    commandMenuStyle(from, ctx),
    commandMenuStyle(to, ctx),
    t,
  );
}
