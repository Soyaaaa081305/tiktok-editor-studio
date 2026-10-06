"use client";;
import { useRemocnTheme } from "@/lib/remocn-ui";

const DRAWER_HEIGHT = 320;
const MAX_OVERLAY_ALPHA = 0.5;

export function drawerStyleContext(theme) {
  return {
    popoverBg: theme.popover,
    popoverFg: theme.popoverForeground,
    mutedFg: theme.mutedForeground,
    border: theme.border,
    radius: theme.radius,
    actionBg: theme.primary,
    actionFg: theme.primaryForeground,
    cancelFg: theme.foreground,
  };
}

export function drawerStyle(state, _ctx) {
  switch (state) {
    case "opened":
      return {
        overlayOpacity: 1,
        panelOpacity: 1,
        panelTranslateY: 0,
      };
    default:
      return {
        overlayOpacity: 0,
        panelOpacity: 0,
        panelTranslateY: DRAWER_HEIGHT,
      };
  }
}

export function Drawer({
  state = "closed",
  style,
  title = "Edit profile",
  description = "Make changes to your profile here. Click save when you're done.",
  actionLabel = "Save changes",
  cancelLabel = "Cancel",
  theme: themeOverride,
  className
}) {
  const theme = useRemocnTheme(themeOverride, "light");

  const ctx = drawerStyleContext(theme);
  const v = style ?? drawerStyle(state, ctx);

  const buttonBase = {
    height: 40,
    padding: "0 20px",
    fontSize: 15,
    fontWeight: 500,
    letterSpacing: "-0.01em",
    borderRadius: ctx.radius,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  };

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        fontFamily:
          "var(--font-geist-sans), -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      {}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `rgba(0, 0, 0, ${MAX_OVERLAY_ALPHA * v.overlayOpacity})`,
        }}
      />
      {}
      <div
        className={className}
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: DRAWER_HEIGHT,
          transform: `translateY(${v.panelTranslateY}px)`,
          opacity: v.panelOpacity,
          background: ctx.popoverBg,
          color: ctx.popoverFg,
          borderTop: `1px solid ${ctx.border}`,
          borderTopLeftRadius: ctx.radius + 6,
          borderTopRightRadius: ctx.radius + 6,
          padding: 24,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
          boxShadow: "0 -24px 48px -12px rgba(0,0,0,0.25)",
        }}
      >
        {}
        <div
          style={{
            width: 40,
            height: 5,
            borderRadius: 999,
            background: ctx.border,
            marginBottom: 8,
          }}
        />
        {}
        <div
          style={{
            width: "100%",
            maxWidth: 440,
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          <div
            style={{
              fontSize: 18,
              fontWeight: 500,
              letterSpacing: "-0.01em",
            }}
          >
            {title}
          </div>
          <div style={{ fontSize: 14, lineHeight: 1.5, color: ctx.mutedFg }}>
            {description}
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 8,
              marginTop: 16,
            }}
          >
            {}
            <button
              type="button"
              style={{
                ...buttonBase,
                background: "transparent",
                color: ctx.cancelFg,
                border: `1px solid ${ctx.border}`,
              }}
            >
              {cancelLabel}
            </button>
            {}
            <button
              type="button"
              style={{
                ...buttonBase,
                background: ctx.actionBg,
                color: ctx.actionFg,
                border: "1px solid transparent",
              }}
            >
              {actionLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
