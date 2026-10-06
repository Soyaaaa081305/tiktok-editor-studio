"use client";;
import { skeletonStyle } from "@/components/remocn/skeleton";
import { easings, useStateTransition } from "@/lib/remocn-ui";

export const DEFAULT_DURATION = 12;

export function tweenSkeletonStyle(a, b, t) {
  return {
    skeletonOpacity:
      a.skeletonOpacity + (b.skeletonOpacity - a.skeletonOpacity) * t,
    contentOpacity:
      a.contentOpacity + (b.contentOpacity - a.contentOpacity) * t,
  };
}

export function useSkeletonTransition(steps, opts = {}) {
  const { speed = 1, defaultDuration = DEFAULT_DURATION } = opts;
  const { from, to, progress } = useStateTransition(
    steps,
    "loading",
    speed,
    defaultDuration,
  );
  const t = easings.out(progress);
  return tweenSkeletonStyle(skeletonStyle(from), skeletonStyle(to), t);
}
