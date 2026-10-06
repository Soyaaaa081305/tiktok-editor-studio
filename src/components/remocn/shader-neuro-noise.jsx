"use client";;
import { NeuroNoise } from "@paper-design/shaders-react";
import { useCallback, useState } from "react";
import {
  continueRender,
  delayRender,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export function ShaderNeuroNoise({
  speed = 1,
  colorFront = "#8a8a95",
  colorMid = "#4a4a68",
  colorBack = "#12121a",
  brightness = 0.05,
  contrast = 0.3,
  className,
  ...rest
}) {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const [handle] = useState(() => delayRender("shader-neuro-noise"));
  const gate = useCallback(
    (element) => {
      if (!element) return;
      requestAnimationFrame(() =>
        requestAnimationFrame(() => continueRender(handle)),
      );
    },
    [handle],
  );

  return (
    <div
      ref={gate}
      className={className}
      style={{ position: "absolute", inset: 0 }}
    >
      <NeuroNoise
        speed={0}
        frame={(frame / fps) * speed * 1000}
        colorFront={colorFront}
        colorMid={colorMid}
        colorBack={colorBack}
        brightness={brightness}
        contrast={contrast}
        fit="cover"
        width={width}
        height={height}
        {...rest}
      />
    </div>
  );
}
