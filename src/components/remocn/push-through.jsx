"use client";;
import { AbsoluteFill, Easing, interpolate } from "remotion";

const clampOpts = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
};

const PushThroughPresentation = ({
  children,
  presentationProgress,
  presentationDirection,
  passedProps,
}) => {
  const { zoom = 2.4, blur = 14 } = passedProps;
  const entering = presentationDirection === "entering";
  const p = presentationProgress;

  if (!entering) {
    const exitStyle = {
      opacity: interpolate(p, [0.4, 0.62], [1, 0], {
        ...clampOpts,
        easing: Easing.bezier(0.42, 0, 0.58, 1),
      }),
      scale: `${interpolate(p, [0, 0.65], [1, zoom], {
        ...clampOpts,
        easing: Easing.in(Easing.cubic),
      })}`,
      filter: `blur(${interpolate(p, [0.15, 0.6], [0, blur], clampOpts)}px)`,
    };
    return <AbsoluteFill style={exitStyle}>{children}</AbsoluteFill>;
  }

  const childStyle = {
    opacity: interpolate(p, [0.3, 0.5], [0, 1], clampOpts),
    scale: `${interpolate(p, [0.3, 0.88, 1], [0.68, 1.02, 1], {
      ...clampOpts,
      easing: Easing.out(Easing.cubic),
    })}`,
    filter: `blur(${interpolate(p, [0.3, 0.75], [blur * 0.7, 0], clampOpts)}px)`,
  };

  return <AbsoluteFill style={childStyle}>{children}</AbsoluteFill>;
};

export function pushThrough(props = {}) {
  return {
    component: PushThroughPresentation,
    props,
  };
}
