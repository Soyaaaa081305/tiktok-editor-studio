"use client";;
import { AbsoluteFill, Easing, interpolate } from "remotion";

const clampOpts = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
};

const FocusPullPresentation = ({
  children,
  presentationProgress,
  presentationDirection,
  passedProps,
}) => {
  const { blur = 16 } = passedProps;
  const entering = presentationDirection === "entering";
  const p = presentationProgress;

  if (!entering) {
    const exitStyle = {
      opacity: interpolate(p, [0.42, 0.68], [1, 0], {
        ...clampOpts,
        easing: Easing.bezier(0.42, 0, 0.58, 1),
      }),
      scale: `${interpolate(p, [0, 0.6], [1, 1.05], {
        ...clampOpts,
        easing: Easing.bezier(0.42, 0, 0.58, 1),
      })}`,
      filter: `blur(${interpolate(p, [0.05, 0.55], [0, blur], {
        ...clampOpts,
        easing: Easing.in(Easing.quad),
      })}px) brightness(${interpolate(p, [0.1, 0.55], [1, 1.3], clampOpts)})`,
    };
    return <AbsoluteFill style={exitStyle}>{children}</AbsoluteFill>;
  }

  const childStyle = {
    opacity: interpolate(p, [0.32, 0.52], [0, 1], clampOpts),
    scale: `${interpolate(p, [0.35, 1], [0.97, 1], {
      ...clampOpts,
      easing: Easing.out(Easing.cubic),
    })}`,
    filter: `blur(${interpolate(p, [0.35, 0.9], [blur, 0], {
      ...clampOpts,
      easing: Easing.out(Easing.quad),
    })}px) brightness(${interpolate(p, [0.4, 0.85], [1.25, 1], clampOpts)})`,
  };

  return <AbsoluteFill style={childStyle}>{children}</AbsoluteFill>;
};

export function focusPull(props = {}) {
  return {
    component: FocusPullPresentation,
    props,
  };
}
