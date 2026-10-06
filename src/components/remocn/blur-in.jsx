"use client";;
export function blurInStyleContext(blur, direction, distance) {
  const axis =
    direction === "left" || direction === "right" ? "x" : "y";
  const sign = direction === "up" || direction === "left" ? 1 : -1;
  return { blur, distance, axis, sign };
}

export function blurInStyle(state, ctx) {
  if (state === "revealed")
    return { blur: 0, opacity: 1, translateX: 0, translateY: 0 };
  const offset = ctx.distance === 0 ? 0 : ctx.sign * ctx.distance;
  return {
    blur: ctx.blur,
    opacity: 0,
    translateX: ctx.axis === "x" ? offset : 0,
    translateY: ctx.axis === "y" ? offset : 0,
  };
}

export function BlurIn({
  state = "hidden",
  style,
  children,
  blur = 8,
  direction = "up",
  distance = 12,
  display = "inline-block",
  className
}) {
  const v =
    style ?? blurInStyle(state, blurInStyleContext(blur, direction, distance));
  return (
    <div
      className={className}
      style={{
        display,
        opacity: v.opacity,
        filter: v.blur > 0 ? `blur(${v.blur}px)` : "none",
        transform: `translate(${v.translateX}px, ${v.translateY}px)`,
      }}
    >
      {children}
    </div>
  );
}
