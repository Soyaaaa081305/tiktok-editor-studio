"use client";;
import { accordionStyle, accordionStyleContext } from "@/components/remocn/accordion";
import { easings, mixOklch, useRemocnTheme, useStateTransition } from "@/lib/remocn-ui";

export const DEFAULT_DURATION = 14;

export function tweenAccordionStyle(a, b, t) {
  return {
    panelHeight: a.panelHeight + (b.panelHeight - a.panelHeight) * t,
    panelOpacity: a.panelOpacity + (b.panelOpacity - a.panelOpacity) * t,
    chevronRotation:
      a.chevronRotation + (b.chevronRotation - a.chevronRotation) * t,
    background: mixOklch(a.background, b.background, t),
  };
}

export function useAccordionTransition(steps, opts = {}) {
  const {
    variant = "default",
    theme: themeOverride,
    mode,
    speed = 1,
    defaultDuration = DEFAULT_DURATION,
  } = opts;
  const theme = useRemocnTheme(themeOverride, mode);
  const ctx = accordionStyleContext(variant, theme);
  const { from, to, progress } = useStateTransition(
    steps,
    "closed",
    speed,
    defaultDuration,
  );
  const t = easings.out(progress);
  return tweenAccordionStyle(
    accordionStyle(from, ctx),
    accordionStyle(to, ctx),
    t,
  );
}
