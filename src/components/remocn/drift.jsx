"use client";;
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export function Drift({
  children,
  grow = 0.035
}) {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const scale = interpolate(frame, [0, durationInFrames], [1, 1 + grow]);
  return <AbsoluteFill style={{ scale: `${scale}` }}>{children}</AbsoluteFill>;
}
