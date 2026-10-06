"use client";;
import { dropdownMenuItemStyle, dropdownMenuItemStyleContext } from "@/components/remocn/dropdown-menu-item";
import { easings, mixOklch, useRemocnTheme, useStateTransition } from "@/lib/remocn-ui";

export const DEFAULT_DURATION = 8;

export function tweenDropdownMenuItemStyle(a, b, t) {
  return {
    scale: a.scale + (b.scale - a.scale) * t,
    background: mixOklch(a.background, b.background, t),
    labelColor: mixOklch(a.labelColor, b.labelColor, t),
  };
}

export function useDropdownMenuItemTransition(steps, opts = {}) {
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
  const ctx = dropdownMenuItemStyleContext(theme);
  const { from, to, progress } = useStateTransition(
    steps,
    "idle",
    speed,
    defaultDuration,
  );
  const t = easings.out(progress);
  return tweenDropdownMenuItemStyle(
    dropdownMenuItemStyle(from, ctx),
    dropdownMenuItemStyle(to, ctx),
    t,
  );
}
