"use client";;
import { contextMenuStyle, contextMenuStyleContext } from "@/components/remocn/context-menu";
import { easings, useRemocnTheme, useStateTransition } from "@/lib/remocn-ui";

export const DEFAULT_DURATION = 10;

export function tweenContextMenuStyle(a, b, t) {
  return {
    opacity: a.opacity + (b.opacity - a.opacity) * t,
    scale: a.scale + (b.scale - a.scale) * t,
    translateY: a.translateY + (b.translateY - a.translateY) * t,
  };
}

export function useContextMenuTransition(steps, opts = {}) {
  const {
    theme: themeOverride,
    mode,
    speed = 1,
    defaultDuration = DEFAULT_DURATION,
  } = opts;
  const theme = useRemocnTheme(themeOverride, mode);
  const ctx = contextMenuStyleContext(theme);
  const { from, to, progress } = useStateTransition(
    steps,
    "closed",
    speed,
    defaultDuration,
  );
  const t = easings.out(progress);
  return tweenContextMenuStyle(
    contextMenuStyle(from, ctx),
    contextMenuStyle(to, ctx),
    t,
  );
}
