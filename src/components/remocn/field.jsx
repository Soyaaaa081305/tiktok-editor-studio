"use client";;
import { useRemocnTheme } from "@/lib/remocn-ui";

export function FieldGroup({
  children,
  gap = 16,
  style
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap, ...style }}>
      {children}
    </div>
  );
}

export function Field({
  children,
  gap = 6,
  style
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap, ...style }}>
      {children}
    </div>
  );
}

export function FieldLabel({
  children,
  theme,
  style
}) {
  const t = useRemocnTheme(theme, "light");
  return (
    <div
      style={{
        fontSize: 13,
        lineHeight: "18px",
        fontWeight: 500,
        letterSpacing: "-0.01em",
        color: t.foreground,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function FieldDescription({
  children,
  align = "start",
  theme,
  style
}) {
  const t = useRemocnTheme(theme, "light");
  return (
    <div
      style={{
        fontSize: 12,
        lineHeight: "16px",
        color: t.mutedForeground,
        textAlign: align === "center" ? "center" : "left",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function FieldControl({
  children,
  height = 40,
  style
}) {
  return (
    <div style={{ position: "relative", height, ...style }}>{children}</div>
  );
}
