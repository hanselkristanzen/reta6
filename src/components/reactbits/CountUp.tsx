/**
 * CountUp, from React Bits (DavidHDev/react-bits, src/ts-tailwind/TextAnimations/CountUp).
 * MIT + Commons Clause, see ./LICENSE.md.
 *
 * Changes for this site:
 * - `prefix` and `suffix` (for "94%" or "150+") that are part of the same readout.
 * - The animated digits are `aria-hidden`; the final value is exposed once as plain text, so a
 *   screen reader does not announce every intermediate number.
 * - `prefers-reduced-motion`: the final value is shown at once.
 * - A timed ease-out tween (`animate`) instead of upstream's `useSpring`. The spring's damping is high
 *   enough that it creeps toward the target for several seconds, so a figure such as a GPA of 3.51 read
 *   "3.50" long after the count looked finished. The tween lands on the exact value when `duration` ends.
 */
import { animate, useInView, useMotionValue } from "motion/react";
import { useCallback, useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface CountUpProps {
  to: number;
  from?: number;
  direction?: "up" | "down";
  /** Seconds before the count starts once the element is visible. */
  delay?: number;
  duration?: number;
  className?: string;
  startWhen?: boolean;
  /** Thousands separator, e.g. ",". Empty for none. */
  separator?: string;
  prefix?: string;
  suffix?: string;
  onStart?: () => void;
  onEnd?: () => void;
}

const decimalPlaces = (value: number): number => {
  const [, decimals = ""] = value.toString().split(".");
  return parseInt(decimals || "0", 10) !== 0 ? decimals.length : 0;
};

export default function CountUp({
  to,
  from = 0,
  direction = "up",
  delay = 0,
  duration = 2,
  className = "",
  startWhen = true,
  separator = "",
  prefix = "",
  suffix = "",
  onStart,
  onEnd,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();
  const motionValue = useMotionValue(direction === "down" ? to : from);
  const isInView = useInView(ref, { once: true, margin: "0px" });

  const maxDecimals = Math.max(decimalPlaces(from), decimalPlaces(to));

  const formatValue = useCallback(
    (latest: number) => {
      const formatted = Intl.NumberFormat("en-US", {
        useGrouping: !!separator,
        minimumFractionDigits: maxDecimals,
        maximumFractionDigits: maxDecimals,
      }).format(latest);
      return `${prefix}${separator ? formatted.replace(/,/g, separator) : formatted}${suffix}`;
    },
    [maxDecimals, separator, prefix, suffix],
  );

  // Show the starting value (or the final one, when motion is reduced) before anything animates.
  useEffect(() => {
    if (ref.current) ref.current.textContent = formatValue(reduced ? to : direction === "down" ? to : from);
  }, [from, to, direction, formatValue, reduced]);

  useEffect(() => {
    if (reduced || !isInView || !startWhen) return undefined;
    onStart?.();
    const controls = animate(motionValue, direction === "down" ? from : to, {
      duration,
      delay,
      ease: [0.23, 1, 0.32, 1],
      onComplete: () => onEnd?.(),
    });
    return () => controls.stop();
  }, [isInView, startWhen, motionValue, direction, from, to, delay, onStart, onEnd, duration, reduced]);

  useEffect(() => {
    if (reduced) return undefined;
    return motionValue.on("change", (latest: number) => {
      if (ref.current) ref.current.textContent = formatValue(latest);
    });
  }, [motionValue, formatValue, reduced]);

  return (
    <span className={className}>
      <span ref={ref} aria-hidden="true" />
      <span className="sr-only">{formatValue(direction === "down" ? from : to)}</span>
    </span>
  );
}
