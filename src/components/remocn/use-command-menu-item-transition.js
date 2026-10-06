"use client";;
import { commandMenuItemStyle, commandMenuItemStyleContext } from "@/components/remocn/command-menu-item";
import { easings, mixOklch, useRemocnTheme, useStateTransition } from "@/lib/remocn-ui";

export const DEFAULT_DURATION = 8;

export function tweenCommandMenuItemStyle(a, b, t) {
  return {
    background: mixOklch(a.background, b.background, t),
    labelColor: mixOklch(a.labelColor, b.labelColor, t),
    iconColor: mixOklch(a.iconColor, b.iconColor, t),
    scale: a.scale + (b.scale - a.scale) * t,
  };
}

export function useCommandMenuItemTransition(steps, opts = {}) {
  const {
    theme: themeOverride,
    mode,
    speed = 1,
    defaultDuration = DEFAULT_DURATION,
  } = opts;
  const theme = useRemocnTheme(themeOverride, mode);
  const ctx = commandMenuItemStyleContext(theme);
  const { from, to, progress } = useStateTransition(
    steps,
    "idle",
    speed,
    defaultDuration,
  );
  const t = easings.out(progress);
  return tweenCommandMenuItemStyle(
    commandMenuItemStyle(from, ctx),
    commandMenuItemStyle(to, ctx),
    t,
  );
}
