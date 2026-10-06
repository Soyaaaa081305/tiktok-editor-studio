"use client";;
import { mixOklch, useRemocnTheme } from "@/lib/remocn-ui";

const ROW_WIDTH = 360;

export function commandMenuItemStyleContext(theme) {
  return {
    idleBg: theme.popover,
    hoverBg: theme.accent,
    pressBg: mixOklch(theme.accent, theme.foreground, 0.08),
    selectedBg: theme.accent,
    idleFg: theme.popoverForeground,
    selectedFg: theme.accentForeground,
    idleIcon: theme.mutedForeground,
    selectedIcon: theme.foreground,
    kbdBg: theme.muted,
    kbdFg: theme.mutedForeground,
    kbdBorder: theme.border,
  };
}

export function commandMenuItemStyle(state, ctx) {
  switch (state) {
    case "hover":
      return {
        background: ctx.hoverBg,
        labelColor: ctx.idleFg,
        iconColor: ctx.selectedIcon,
        scale: 1,
      };
    case "press":
      return {
        background: ctx.pressBg,
        labelColor: ctx.idleFg,
        iconColor: ctx.selectedIcon,
        scale: 0.98,
      };
    case "selected":
      return {
        background: ctx.selectedBg,
        labelColor: ctx.selectedFg,
        iconColor: ctx.selectedIcon,
        scale: 1,
      };
    default:
      return {
        background: ctx.idleBg,
        labelColor: ctx.idleFg,
        iconColor: ctx.idleIcon,
        scale: 1,
      };
  }
}

const ICON_PATHS = {
  search: "M11 4a7 7 0 1 14 0-14ZM20 20l-3.5-3.5",
  settings:
    "M12 9a3 3 0 1 6 0-6ZM12 2v3 19v3 M4.2 4.2l2.1 2.1 M17.7 17.7l2.1 M2 12h3 M19 19.8l2.1-2.1 6.3l2.1-2.1",
  user: "M12 12a4 4 0 1 0-8 8ZM5 20a7 7 14",
  file: "M7 3h7l4 4v14H7ZM14 3v4h4",
};

function CommandMenuItemIcon({
  icon,
  color
}) {
  return (
    <svg width={16} height={16} viewBox="0 24" fill="none">
      <path
        d={ICON_PATHS[icon]}
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CommandMenuItemRow({
  style,
  state = "idle",
  ctx,
  label,
  icon,
  shortcut,
  width,
  radius
}) {
  const v = style ?? commandMenuItemStyle(state, ctx);
  return (
    <div
      style={{
        width,
        boxSizing: "border-box",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
        padding: "8px 12px",
        borderRadius: radius,
        transform: `scale(${v.scale})`,
        background: v.background,
        color: v.labelColor,
        fontSize: 14,
        letterSpacing: "-0.01em",
      }}
    >
      <span
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          minWidth: 0,
        }}
      >
        {icon !== undefined && (
          <span style={{ display: "flex", flexShrink: 0 }}>
            <CommandMenuItemIcon icon={icon} color={v.iconColor} />
          </span>
        )}
        <span
          style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {label}
        </span>
      </span>
      {shortcut !== undefined && (
        <kbd
          style={{
            flexShrink: 0,
            display: "inline-flex",
            alignItems: "center",
            gap: 2,
            height: 20,
            padding: "0 6px",
            fontSize: 12,
            fontFamily: "inherit",
            letterSpacing: "0.05em",
            color: ctx.kbdFg,
            background: ctx.kbdBg,
            border: `1px solid ${ctx.kbdBorder}`,
            borderRadius: Math.max(4, radius - 4),
          }}
        >
          {shortcut}
        </kbd>
      )}
    </div>
  );
}

export function CommandMenuItem({
  state = "idle",
  style,
  label = "Settings",
  icon = "settings",
  shortcut,
  width = ROW_WIDTH,
  theme: themeOverride,
  className
}) {
  const theme = useRemocnTheme(themeOverride, "light");
  const ctx = commandMenuItemStyleContext(theme);

  return (
    <div
      className={className}
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "transparent",
        fontFamily:
          "var(--font-geist-sans), -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      <CommandMenuItemRow
        style={style}
        state={state}
        ctx={ctx}
        label={label}
        icon={icon}
        shortcut={shortcut}
        width={width}
        radius={theme.radius}
      />
    </div>
  );
}
