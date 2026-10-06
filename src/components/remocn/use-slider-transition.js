"use client";;
import { useCurrentFrame } from "remotion";
import { sliderThumbStyle } from "@/components/remocn/slider";
import { clamp01, easings } from "@/lib/remocn-ui";

export const DEFAULT_DURATION = 18;

export function tweenSliderStyle(a, b, t) {
  return {
    value: a.value + (b.value - a.value) * t,
    thumbScale: a.thumbScale + (b.thumbScale - a.thumbScale) * t,
    ringOpacity: a.ringOpacity + (b.ringOpacity - a.ringOpacity) * t,
  };
}

export function useSliderTransition(steps, opts = {}) {
  const { speed = 1 } = opts;
  const raw = useCurrentFrame() * speed;
  return sliderStyleAt(steps, raw, opts);
}

function valueAt(steps, raw, defaultDuration) {
  const valueSteps = steps.filter(
    s => s.value !== undefined,
  );
  if (valueSteps.length === 0) return 0;
  const first = valueSteps[0];
  if (raw <= first.at) return first.value;

  let toIndex = valueSteps.length - 1;
  for (let i = 1; i < valueSteps.length; i++) {
    if (valueSteps[i].at > raw) {
      toIndex = i;
      break;
    }
  }
  const pastLast = raw >= valueSteps[valueSteps.length - 1].at;
  const to = pastLast ? valueSteps[valueSteps.length - 1] : valueSteps[toIndex];
  const from = pastLast
    ? valueSteps[valueSteps.length - 1]
    : valueSteps[toIndex - 1];

  const dur = to.duration ?? defaultDuration;
  const ease = easings[to.easing ?? "out"];
  const start = to.at - dur;
  const t = pastLast || dur <= 0 ? 1 : ease(clamp01((raw - start) / dur));
  return from.value + (to.value - from.value) * t;
}

function thumbAt(steps, raw, defaultDuration) {
  const thumbSteps = steps.filter(
    s => s.thumbState !== undefined,
  );
  if (thumbSteps.length === 0) return sliderThumbStyle("idle");
  const first = thumbSteps[0];
  if (raw <= first.at) return sliderThumbStyle(first.thumbState);

  let toIndex = thumbSteps.length - 1;
  for (let i = 1; i < thumbSteps.length; i++) {
    if (thumbSteps[i].at > raw) {
      toIndex = i;
      break;
    }
  }
  const pastLast = raw >= thumbSteps[thumbSteps.length - 1].at;
  const to = pastLast ? thumbSteps[thumbSteps.length - 1] : thumbSteps[toIndex];
  const from = pastLast
    ? thumbSteps[thumbSteps.length - 1]
    : thumbSteps[toIndex - 1];

  const dur = to.duration ?? defaultDuration;
  const ease = easings[to.easing ?? "out"];
  const start = to.at - dur;
  const t = pastLast || dur <= 0 ? 1 : ease(clamp01((raw - start) / dur));

  const a = sliderThumbStyle(from.thumbState);
  const b = sliderThumbStyle(to.thumbState);
  return {
    thumbScale: a.thumbScale + (b.thumbScale - a.thumbScale) * t,
    ringOpacity: a.ringOpacity + (b.ringOpacity - a.ringOpacity) * t,
  };
}

export function sliderStyleAt(steps, raw, opts = {}) {
  const { defaultDuration = DEFAULT_DURATION } = opts;
  const value = valueAt(steps, raw, defaultDuration);
  const thumb = thumbAt(steps, raw, defaultDuration);
  return {
    value,
    thumbScale: thumb.thumbScale,
    ringOpacity: thumb.ringOpacity,
  };
}
