"use client";;
import { tabsStyle, tabsStyleContext } from "@/components/remocn/tabs";
import { easings, useRemocnTheme, useStateTransition } from "@/lib/remocn-ui";

const DEFAULT_ITEMS = ["Account", "Password", "Settings"];

export const DEFAULT_DURATION = 14;

export function tweenTabsStyle(a, b, t) {
  return {
    indicatorOffset:
      a.indicatorOffset + (b.indicatorOffset - a.indicatorOffset) * t,
  };
}

export function useTabsTransition(steps, opts = {}) {
  const {
    items = DEFAULT_ITEMS,
    variant = "pill",
    theme: themeOverride,
    mode,
    speed = 1,
    defaultDuration = DEFAULT_DURATION,
  } = opts;
  const theme = useRemocnTheme(themeOverride, mode);
  const ctx = tabsStyleContext(items, variant, theme);
  const { from, to, progress } = useStateTransition(
    steps,
    items[0],
    speed,
    defaultDuration,
  );
  const t = easings.out(progress);
  return tweenTabsStyle(tabsStyle(from, ctx), tabsStyle(to, ctx), t);
}
