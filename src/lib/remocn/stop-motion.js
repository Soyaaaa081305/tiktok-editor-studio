import { spring } from "remotion";

export const DEFAULT_STEP = 3;

export const qf = (frame, step = DEFAULT_STEP) => Math.floor(frame / step) * step;

export const qstep = (frame, step = DEFAULT_STEP) => Math.floor(frame / step);

export const hash01 = seed => {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  h = Math.imul(h ^ (h >>> 13), 2246822519);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
};

export const hashRange = (seed, lo, hi) => lo + hash01(seed) * (hi - lo);

export const paperJitter = (frame, seed, options) => {
  const amp = options?.amp ?? 1.4;
  const rotAmp = options?.rotAmp ?? 0.35;
  const s = qstep(frame, options?.step ?? DEFAULT_STEP);
  return {
    x: hashRange(`${seed}:x:${s}`, -amp, amp),
    y: hashRange(`${seed}:y:${s}`, -amp, amp),
    rot: hashRange(`${seed}:r:${s}`, -rotAmp, rotAmp),
  };
};

export const steppedSpring = args => spring({
  frame: qf(
    Math.max(0, args.frame - (args.delay ?? 0)),
    args.step ?? DEFAULT_STEP,
  ),
  fps: args.fps,
  config: args.config,
});

export const steppedRamp = (frame, from, to, options) => {
  const f = qf(frame, options?.step ?? DEFAULT_STEP);
  if (f <= from) return 0;
  if (f >= to) return 1;
  const ease = options?.ease ?? ((t) => t);
  return ease((f - from) / (to - from));
};
