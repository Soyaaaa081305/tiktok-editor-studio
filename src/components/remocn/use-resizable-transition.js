"use client";;
import { useCurrentFrame } from "remotion";
import { resizableHandleStyle } from "@/components/remocn/resizable";
import { clamp01, easings } from "@/lib/remocn-ui";

export const DEFAULT_DURATION = 18;

export function tweenResizableStyle(a, b, t) {
  return {
    ratio: a.ratio + (b.ratio - a.ratio) * t,
    handleScale: a.handleScale + (b.handleScale - a.handleScale) * t,
    handleRingOpacity:
      a.handleRingOpacity + (b.handleRingOpacity - a.handleRingOpacity) * t,
  };
}

export function useResizableTransition(steps, opts = {}) {
  const { speed = 1 } = opts;
  const raw = useCurrentFrame() * speed;
  return resizableStyleAt(steps, raw, opts);
}

function ratioAt(steps, raw, defaultDuration) {
  const ratioSteps = steps.filter(
    s => s.ratio !== undefined,
  );
  if (ratioSteps.length === 0) return 0.5;
  const first = ratioSteps[0];
  if (raw <= first.at) return first.ratio;

  let toIndex = ratioSteps.length - 1;
  for (let i = 1; i < ratioSteps.length; i++) {
    if (ratioSteps[i].at > raw) {
      toIndex = i;
      break;
    }
  }
  const pastLast = raw >= ratioSteps[ratioSteps.length - 1].at;
  const to = pastLast ? ratioSteps[ratioSteps.length - 1] : ratioSteps[toIndex];
  const from = pastLast
    ? ratioSteps[ratioSteps.length - 1]
    : ratioSteps[toIndex - 1];

  const dur = to.duration ?? defaultDuration;
  const ease = easings[to.easing ?? "out"];
  const start = to.at - dur;
  const t = pastLast || dur <= 0 ? 1 : ease(clamp01((raw - start) / dur));
  return from.ratio + (to.ratio - from.ratio) * t;
}

function handleAt(steps, raw, defaultDuration) {
  const handleSteps = steps.filter(
    s => s.handleState !== undefined,
  );
  if (handleSteps.length === 0) return resizableHandleStyle("idle");
  const first = handleSteps[0];
  if (raw <= first.at) return resizableHandleStyle(first.handleState);

  let toIndex = handleSteps.length - 1;
  for (let i = 1; i < handleSteps.length; i++) {
    if (handleSteps[i].at > raw) {
      toIndex = i;
      break;
    }
  }
  const pastLast = raw >= handleSteps[handleSteps.length - 1].at;
  const to = pastLast
    ? handleSteps[handleSteps.length - 1]
    : handleSteps[toIndex];
  const from = pastLast
    ? handleSteps[handleSteps.length - 1]
    : handleSteps[toIndex - 1];

  const dur = to.duration ?? defaultDuration;
  const ease = easings[to.easing ?? "out"];
  const start = to.at - dur;
  const t = pastLast || dur <= 0 ? 1 : ease(clamp01((raw - start) / dur));

  const a = resizableHandleStyle(from.handleState);
  const b = resizableHandleStyle(to.handleState);
  return {
    handleScale: a.handleScale + (b.handleScale - a.handleScale) * t,
    handleRingOpacity:
      a.handleRingOpacity + (b.handleRingOpacity - a.handleRingOpacity) * t,
  };
}

export function resizableStyleAt(steps, raw, opts = {}) {
  const { defaultDuration = DEFAULT_DURATION } = opts;
  const ratio = ratioAt(steps, raw, defaultDuration);
  const handle = handleAt(steps, raw, defaultDuration);
  return {
    ratio,
    handleScale: handle.handleScale,
    handleRingOpacity: handle.handleRingOpacity,
  };
}
