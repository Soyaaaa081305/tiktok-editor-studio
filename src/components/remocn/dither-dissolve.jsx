"use client";;
import { AbsoluteFill, interpolate } from "remotion";
import { ShaderDithering } from "@/components/remocn/shader-dithering";

const clampOpts = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
};

const coverEnvelope = (p) =>
  interpolate(p, [0, 0.3, 0.65, 1], [0, 1, 1, 0], clampOpts);

const coverChildOpacity = (p, entering) =>
  entering
    ? interpolate(p, [0.58, 0.66], [0, 1], clampOpts)
    : interpolate(p, [0.28, 0.36], [1, 0], clampOpts);

const DitherDissolvePresentation = ({
  children,
  presentationProgress,
  presentationDirection,
  passedProps,
}) => {
  const {
    colorBack = "#141318",
    colorFront = "#8f88ae",
    shape = "simplex",
    speed = 1.5,
  } = passedProps;
  const entering = presentationDirection === "entering";
  const p = presentationProgress;
  const size = interpolate(p, [0, 1], [1.6, 2.8], clampOpts);

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ opacity: coverChildOpacity(p, entering) }}>
        {children}
      </AbsoluteFill>
      {entering ? (
        <AbsoluteFill
          style={{ opacity: coverEnvelope(p), pointerEvents: "none" }}
        >
          <ShaderDithering
            speed={speed}
            colorBack={colorBack}
            colorFront={colorFront}
            shape={shape}
            size={size}
          />
        </AbsoluteFill>
      ) : null}
    </AbsoluteFill>
  );
};

export function ditherDissolve(props = {}) {
  return {
    component: DitherDissolvePresentation,
    props,
  };
}
