"use client";;
import { mixOklch, useRemocnTheme } from "@/lib/remocn-ui";

function justify(align) {
  return align === "start"
    ? "flex-start"
    : align === "end"
      ? "flex-end"
      : "center";
}

const DEFAULT_ITEMS = [
  { value: "Monthly", label: "Monthly" },
  { value: "Yearly", label: "Yearly" },
];

const SIZE_STYLES = {
  sm: { height: 32, segMinWidth: 72, fontSize: 13, pad: 3, gap: 6 },
  default: { height: 36, segMinWidth: 88, fontSize: 14, pad: 4, gap: 8 },
};

export function toggleGroupStyleContext(items, theme) {
  return {
    items,
    trackBg: theme.muted,
    thumbBg: theme.background,
    activeFg: theme.foreground,
    inactiveFg: theme.mutedForeground,
    radius: theme.radius,
  };
}

export function toggleGroupStyle(state, ctx) {
  const i = ctx.items.findIndex((it) => it.value === state);
  return { indicatorOffset: i < 0 ? 0 : i };
}

export function ToggleGroup({
  state = DEFAULT_ITEMS[0].value,
  style,
  items = DEFAULT_ITEMS,
  size = "default",
  theme: themeOverride,
  align = "center",
  className
}) {
  const theme = useRemocnTheme(themeOverride, "light");
  const ctx = toggleGroupStyleContext(items, theme);
  const v = style ?? toggleGroupStyle(state, ctx);

  const sizeStyle = SIZE_STYLES[size];
  const { pad } = sizeStyle;
  const segmentWidth = sizeStyle.segMinWidth;
  const thumbX = pad + v.indicatorOffset * segmentWidth;

  return (
    <div
      className={className}
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: justify(align),
        background: "transparent",
        fontFamily:
          "var(--font-geist-sans), -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      <div
        style={{
          position: "relative",
          display: "flex",
          height: sizeStyle.height,
          padding: pad,
          boxSizing: "border-box",
          background: ctx.trackBg,
          borderRadius: ctx.radius,
        }}
      >
        {}
        <div
          style={{
            position: "absolute",
            top: pad,
            left: thumbX,
            width: segmentWidth,
            height: sizeStyle.height - pad * 2,
            background: ctx.thumbBg,
            borderRadius: Math.max(2, ctx.radius - 3),
            boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
          }}
        />
        {}
        {items.map((item, i) => {
          const proximity = Math.max(0, 1 - Math.abs(i - v.indicatorOffset));
          return (
            <span
              key={item.value}
              style={{
                position: "relative",
                width: segmentWidth,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: sizeStyle.gap,
                fontSize: sizeStyle.fontSize,
                fontWeight: 500,
                letterSpacing: "-0.01em",
                color: mixOklch(ctx.inactiveFg, ctx.activeFg, proximity),
              }}
            >
              {item.icon}
              {item.label}
            </span>
          );
        })}
      </div>
    </div>
  );
}
