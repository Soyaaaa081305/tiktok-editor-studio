"use client";;
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";

function cornerPinMatrix(src, dst) {
  const a = [];
  const rhs = [];

  for (let i = 0; i < 4; i++) {
    const [x, y] = src[i];
    const [u, v] = dst[i];
    a.push([x, y, 1, 0, 0, 0, -u * x, -u * y]);
    rhs.push(u);
    a.push([0, 0, 0, x, y, 1, -v * x, -v * y]);
    rhs.push(v);
  }

  const n = 8;
  for (let col = 0; col < n; col++) {
    let pivot = col;
    for (let r = col + 1; r < n; r++) {
      if (Math.abs(a[r][col]) > Math.abs(a[pivot][col])) pivot = r;
    }
    [a[col], a[pivot]] = [a[pivot], a[col]];
    [rhs[col], rhs[pivot]] = [rhs[pivot], rhs[col]];

    const d = a[col][col];
    if (Math.abs(d) < 1e-12) continue;
    for (let c = col; c < n; c++) a[col][c] /= d;
    rhs[col] /= d;

    for (let r = 0; r < n; r++) {
      if (r === col) continue;
      const f = a[r][col];
      if (f === 0) continue;
      for (let c = col; c < n; c++) a[r][c] -= f * a[col][c];
      rhs[r] -= f * rhs[col];
    }
  }

  const [m0, m1, m2, m3, m4, m5, m6, m7] = rhs;
  return `matrix3d(${m0}, ${m3}, 0, ${m6}, ${m1}, ${m4}, 0, ${m7}, 0, 0, 1, 0, ${m2}, ${m5}, 0, 1)`;
}

function lerpCorners(from, to, t) {
  return from.map((p, i) => [
    p[0] + (to[i][0] - p[0]) * t,
    p[1] + (to[i][1] - p[1]) * t,
  ]);
}

export function PerspectiveSqueeze({
  className,
  width = 1920,
  height = 1080,
  blockWidth = 990,
  blockHeight = 546,
  lowerBlockPosition = [960, 860],
  upperBlockPosition = [960, 314],

  cornersRest = [
    [0, 0],
    [990, 0],
    [0, 546],
    [990, 546],
  ],

  cornerKeyframes = [0, 45, 70],

  upperCornersMid = [
    [0, -326],
    [990, 0],
    [0, 546],
    [990, 546],
  ],

  upperCornersEnd = [
    [0, 352],
    [990, -428],
    [460, 546],
    [990, 546],
  ],

  lowerCornersMid = [
    [0, 0],
    [990, 0],
    [0, 225],
    [990, 546],
  ],

  lowerCornersEnd = [
    [0, 0],
    [990, 0],
    [0, 897],
    [990, 116],
  ],

  upperText = "REMOCN",
  lowerText = "BEST",
  upperFontFamily = "sans-serif",
  lowerFontFamily = "sans-serif",
  upperFontSize = 603,
  lowerFontSize = 124,
  capRatio = 0.65,
  lineGap = 50,
  scaleKeyframes = [0, 60, 118, 161, 196, 225],
  lowerScaleY = [100, 384.8, 270, 330, 150, 100],
  upperScaleY = [100, 35.8, 64, 45, 110, 100],
  fill = "#ffffff"
}) {
  const frame = useCurrentFrame();
  const { width: compWidth, height: compHeight } = useVideoConfig();
  const stageScale = Math.min(compWidth / width, compHeight / height);

  const squishEase = Easing.bezier(0.6, 0, 0.4, 1);

  const scaleAt = (track) =>
    interpolate(frame, scaleKeyframes, track, {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: squishEase,
    }) / 100;

  const cornersAt = (mid, end) => {
    const [k0, k1, k2] = cornerKeyframes;
    if (frame <= k0) return cornersRest;
    if (frame >= k2) return end;
    if (frame <= k1) {
      return lerpCorners(
        cornersRest,
        mid,
        squishEase((frame - k0) / Math.max(k1 - k0, 1)),
      );
    }
    return lerpCorners(
      mid,
      end,
      squishEase((frame - k1) / Math.max(k2 - k1, 1)),
    );
  };

  const upperScale = scaleAt(upperScaleY);
  const lowerScale = scaleAt(lowerScaleY);

  const upperBoxHeight = upperFontSize * capRatio * upperScale;
  const lowerBoxHeight = lowerFontSize * capRatio * lowerScale;
  const stackTop =
    (blockHeight - (upperBoxHeight + lineGap + lowerBoxHeight)) / 2;
  const upperBaseline = stackTop + upperBoxHeight;
  const lowerBaseline = upperBaseline + lineGap + lowerBoxHeight;

  const line = (
    text,
    family,
    size,
    baseline,
    scale,
  ) => (
    <text
      x={0}
      y={baseline}
      textLength={blockWidth}
      lengthAdjust="spacingAndGlyphs"
      fontFamily={family}
      fontSize={size}
      fontWeight={800}
      fill={fill}
      transform={`matrix(1, 0, 0, ${scale}, 0, ${baseline * (1 - scale)})`}
    >
      {text}
    </text>
  );

  const block = (corners, position) => (
    <div
      style={{
        position: "absolute",
        left: position[0] - blockWidth / 2,
        top: position[1] - blockHeight / 2,
        width: blockWidth,
        height: blockHeight,
        transformOrigin: "0",
        transform: cornerPinMatrix(cornersRest, corners),
      }}
    >
      <svg
        width={blockWidth}
        height={blockHeight}
        viewBox={`0 0 ${blockWidth} ${blockHeight}`}
        style={{ display: "block", overflow: "hidden" }}
      >
        {line(
          upperText,
          upperFontFamily,
          upperFontSize,
          upperBaseline,
          upperScale,
        )}
        {line(
          lowerText,
          lowerFontFamily,
          lowerFontSize,
          lowerBaseline,
          lowerScale,
        )}
      </svg>
    </div>
  );

  return (
    <div
      className={className}
      style={{ position: "absolute", inset: 0, overflow: "hidden" }}
    >
      <div
        style={{
          position: "absolute",
          left: (compWidth - width * stageScale) / 2,
          top: (compHeight - height * stageScale) / 2,
          width,
          height,
          scale: `${stageScale}`,
          transformOrigin: "0",
        }}
      >
        {block(cornersAt(upperCornersMid, upperCornersEnd), upperBlockPosition)}
        {block(cornersAt(lowerCornersMid, lowerCornersEnd), lowerBlockPosition)}
      </div>
    </div>
  );
}
