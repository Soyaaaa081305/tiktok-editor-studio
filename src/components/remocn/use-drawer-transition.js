"use client";;
import { drawerStyle, drawerStyleContext } from "@/components/remocn/drawer";
import { easings, useRemocnTheme, useStateTransition } from "@/lib/remocn-ui";

export const DEFAULT_DURATION = 12;

export function tweenDrawerStyle(a, b, t) {
  return {
    overlayOpacity:
      a.overlayOpacity + (b.overlayOpacity - a.overlayOpacity) * t,
    panelOpacity: a.panelOpacity + (b.panelOpacity - a.panelOpacity) * t,
    panelTranslateY:
      a.panelTranslateY + (b.panelTranslateY - a.panelTranslateY) * t,
  };
}

export function useDrawerTransition(steps, opts = {}) {
  const {
    theme: themeOverride,
    mode,
    speed = 1,
    defaultDuration = DEFAULT_DURATION,
  } = opts;
  const theme = useRemocnTheme(themeOverride, mode);
  const ctx = drawerStyleContext(theme);
  const { from, to, progress } = useStateTransition(
    steps,
    "closed",
    speed,
    defaultDuration,
  );
  const t = easings.out(progress);
  return tweenDrawerStyle(drawerStyle(from, ctx), drawerStyle(to, ctx), t);
}
