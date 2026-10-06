"use client";;
import { useRemocnTheme } from "@/lib/remocn-ui";

export function messageBubbleStyleContext(variant, theme) {
  const reaction = {
    reactionBackground: theme.muted,
    reactionColor: theme.foreground,
    reactionRing: theme.card,
  };
  if (variant === "outgoing") {
    return {
      background: theme.primary,
      color: theme.primaryForeground,
      align: "flex-end",
      reactionSide: "right",
      ...reaction,
    };
  }
  return {
    background: theme.muted,
    color: theme.foreground,
    align: "flex-start",
    reactionSide: "left",
    ...reaction,
  };
}

export function messageBubbleStyle(state) {
  switch (state) {
    case "visible":
      return { opacity: 1, translateY: 0, scale: 1 };
    default:
      return { opacity: 0, translateY: 12, scale: 0.94 };
  }
}

export function messageBubbleReactionStyle(state) {
  return state === "visible"
    ? { opacity: 1, scale: 1 }
    : { opacity: 0, scale: 0 };
}

export function MessageBubble({
  state = "hidden",
  style,
  variant = "incoming",
  children,
  reaction,
  reactionStyle,
  maxWidth = "80%",
  theme: themeOverride,
  className
}) {
  const theme = useRemocnTheme(themeOverride, "light");
  const ctx = messageBubbleStyleContext(variant, theme);
  const v = style ?? messageBubbleStyle(state);
  const reaction_ = reactionStyle ?? messageBubbleReactionStyle(state);

  return (
    <div
      className={className}
      style={{
        display: "flex",
        justifyContent: ctx.align,
        width: "100%",
        opacity: v.opacity,
        transform: `translateY(${v.translateY}px) scale(${v.scale})`,
        transformOrigin:
          ctx.align === "flex-end" ? "bottom right" : "bottom left",
      }}
    >
      <div style={{ position: "relative", maxWidth, minWidth: 0 }}>
        <div
          style={{
            display: "inline-block",
            maxWidth: "100%",
            padding: "10px 14px",
            background: ctx.background,
            color: ctx.color,
            border: "1px solid transparent",
            borderRadius: 24,
            fontFamily:
              "var(--font-geist-sans), -apple-system, BlinkMacSystemFont, sans-serif",
            fontSize: 14,
            lineHeight: 1.625,
            overflowWrap: "break-word",
            wordBreak: "break-word",
          }}
        >
          {children}
        </div>
        {reaction !== undefined && (
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: ctx.reactionSide === "left" ? 12 : undefined,
              right: ctx.reactionSide === "right" ? 12 : undefined,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 4,
              minWidth: 24,
              padding: "2px 6px",
              background: ctx.reactionBackground,
              color: ctx.reactionColor,
              borderRadius: 999,
              fontSize: 14,
              lineHeight: 1,
              boxShadow: `0 0 0 3px ${ctx.reactionRing}`,
              opacity: reaction_.opacity,
              transform: `translateY(75%) scale(${reaction_.scale})`,
              transformOrigin: "center",
            }}
          >
            {reaction}
          </div>
        )}
      </div>
    </div>
  );
}
