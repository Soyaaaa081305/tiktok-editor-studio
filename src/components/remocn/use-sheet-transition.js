"use client";;
import { sheetStyle, sheetStyleContext } from "@/components/remocn/sheet";
import { easings, useRemocnTheme, useStateTransition } from "@/lib/remocn-ui";

export const DEFAULT_DURATION = 12;

export function tweenSheetStyle(a, b, t) {
  return {
    overlayOpacity:
      a.overlayOpacity + (b.overlayOpacity - a.overlayOpacity) * t,
    panelOpacity: a.panelOpacity + (b.panelOpacity - a.panelOpacity) * t,
    panelTranslateX:
      a.panelTranslateX + (b.panelTranslateX - a.panelTranslateX) * t,
  };
}

export function useSheetTransition(steps, opts = {}) {
  const {
    theme: themeOverride,
    mode,
    speed = 1,
    defaultDuration = DEFAULT_DURATION,
  } = opts;
  const theme = useRemocnTheme(themeOverride, mode);
  const ctx = sheetStyleContext(theme);
  const { from, to, progress } = useStateTransition(
    steps,
    "closed",
    speed,
    defaultDuration,
  );
  const t = easings.out(progress);
  return tweenSheetStyle(sheetStyle(from, ctx), sheetStyle(to, ctx), t);
}
