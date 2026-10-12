/**
 * BlurText, from React Bits (DavidHDev/react-bits, src/ts-tailwind/TextAnimations/BlurText).
 * MIT + Commons Clause, see ./LICENSE.md.
 *
 * Changes for this site:
 * - Starts through `onceInView`, so text already scrolled past is shown rather than left blurred.
 * - `startDelay` sequences it inside the hero intro.
 * - `prefers-reduced-motion`: plain text, no animation.
 * - Words are `aria-hidden` pieces of a paragraph that carries the full text as its label, so a
 *   screen reader reads one sentence rather than one word at a time.
 */
import { motion, type Easing, type Transition } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { onceInView } from "@/lib/inView";
import { useReducedMotion } from "@/hooks/useReducedMotion";

type Keyframe = Record<string, string | number>;

interface BlurTextProps {
  text?: string;
  /** Milliseconds between one word starting and the next. */
  delay?: number;
  /** Seconds before the first word starts. */
  startDelay?: number;
  className?: string;
  animateBy?: "words" | "letters";
  direction?: "top" | "bottom";
  threshold?: number;
  rootMargin?: string;
  easing?: Easing | Easing[];
  stepDuration?: number;
  onAnimationComplete?: () => void;
}

const buildKeyframes = (from: Keyframe, steps: Keyframe[]): Record<string, Array<string | number>> => {
  const keys = new Set<string>([...Object.keys(from), ...steps.flatMap((step) => Object.keys(step))]);
  const keyframes: Record<string, Array<string | number>> = {};
  keys.forEach((key) => {
    keyframes[key] = [from[key], ...steps.map((step) => step[key])];
  });
  return keyframes;
};

export default function BlurText({
  text = "",
  delay = 60,
  startDelay = 0,
  className = "",
  animateBy = "words",
  direction = "top",
  threshold = 0.1,
  rootMargin = "0px 0px -6% 0px",
  easing = (t: number) => t,
  stepDuration = 0.35,
  onAnimationComplete,
}: BlurTextProps) {
  const reduced = useReducedMotion();
  const elements = animateBy === "words" ? text.split(" ") : text.split("");
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node || reduced) return;
    return onceInView(node, () => setInView(true), { threshold, rootMargin });
  }, [threshold, rootMargin, reduced]);

  const from = useMemo<Keyframe>(
    () => ({ filter: "blur(10px)", opacity: 0, y: direction === "top" ? -32 : 32 }),
    [direction],
  );
  const steps = useMemo<Keyframe[]>(
    () => [
      { filter: "blur(5px)", opacity: 0.5, y: direction === "top" ? 4 : -4 },
      { filter: "blur(0px)", opacity: 1, y: 0 },
    ],
    [direction],
  );

  if (reduced) {
    return <p className={className}>{text}</p>;
  }

  const stepCount = steps.length + 1;
  const totalDuration = stepDuration * (stepCount - 1);
  const times = Array.from({ length: stepCount }, (_, i) => i / (stepCount - 1));
  const keyframes = buildKeyframes(from, steps);

  return (
    <p ref={ref} className={`flex flex-wrap ${className}`} aria-label={text}>
      {elements.map((segment, index) => {
        const transition: Transition = {
          duration: totalDuration,
          times,
          delay: startDelay + (index * delay) / 1000,
          ease: easing,
        };
        return (
          <motion.span
            key={index}
            aria-hidden="true"
            initial={from}
            animate={inView ? keyframes : from}
            transition={transition}
            onAnimationComplete={index === elements.length - 1 ? onAnimationComplete : undefined}
            style={{ display: "inline-block", willChange: inView ? "auto" : "transform, filter, opacity" }}
          >
            {segment === " " ? " " : segment}
            {animateBy === "words" && index < elements.length - 1 && " "}
          </motion.span>
        );
      })}
    </p>
  );
}
