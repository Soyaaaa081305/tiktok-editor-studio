"use client";;
import { toggleGroupStyle, toggleGroupStyleContext } from "@/components/remocn/toggle-group";
import { easings, useRemocnTheme, useStateTransition } from "@/lib/remocn-ui";

const DEFAULT_ITEMS = [
  { value: "Monthly", label: "Monthly" },
  { value: "Yearly", label: "Yearly" },
];

export const DEFAULT_DURATION = 14;

export function tweenToggleGroupStyle(a, b, t) {
  return {
    indicatorOffset:
      a.indicatorOffset + (b.indicatorOffset - a.indicatorOffset) * t,
  };
}

export function useToggleGroupTransition(steps, opts = {}) {
  const {
    items = DEFAULT_ITEMS,
    theme: themeOverride,
    mode,
    speed = 1,
    defaultDuration = DEFAULT_DURATION,
  } = opts;
  const theme = useRemocnTheme(themeOverride, mode);
  const ctx = toggleGroupStyleContext(items, theme);
  const { from, to, progress } = useStateTransition(
    steps,
    items[0].value,
    speed,
    defaultDuration,
  );
  const t = easings.out(progress);
  return tweenToggleGroupStyle(
    toggleGroupStyle(from, ctx),
    toggleGroupStyle(to, ctx),
    t,
  );
}
