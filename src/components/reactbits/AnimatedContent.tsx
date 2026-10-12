/**
 * AnimatedContent, from React Bits (DavidHDev/react-bits, src/ts-tailwind/Animations/AnimatedContent).
 * MIT + Commons Clause, see ./LICENSE.md.
 *
 * Changes for this site:
 * - Starts through `onceInView` instead of ScrollTrigger, so content scrolled past before it rendered
 *   (deep link, then scroll up) is shown rather than left hidden.
 * - The hidden state is `opacity: 0`, not `visibility: hidden`: the content stays in the tab order, and
 *   focusing it scrolls it into view, which reveals it.
 * - Quieter defaults (a 28px rise, not 100px), an optional `blur`, and a 55ms-step-friendly `delay` in seconds.
 * - When the tween finishes the inline transform, opacity and filter are cleared. A leftover
 *   `transform` would make this element the containing block for fixed descendants and block
 *   `position: sticky` and later hover transforms.
 * - `prefers-reduced-motion`: the content is simply shown.
 * - The `disappearAfter` options are dropped (nothing here needs content to leave again).
 */
import { useRef, type HTMLAttributes, type ReactNode } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { onceInView } from "@/lib/inView";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface AnimatedContentProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  distance?: number;
  direction?: "vertical" | "horizontal";
  reverse?: boolean;
  /** Seconds. */
  duration?: number;
  ease?: string;
  initialOpacity?: number;
  animateOpacity?: boolean;
  /** Starting scale. Never below ~0.9: nothing real appears from nothing. */
  scale?: number;
  blur?: boolean;
  threshold?: number;
  /** Seconds. */
  delay?: number;
  onComplete?: () => void;
}

export default function AnimatedContent({
  children,
  distance = 28,
  direction = "vertical",
  reverse = false,
  duration = 0.8,
  ease = "power3.out",
  initialOpacity = 0,
  animateOpacity = true,
  scale = 1,
  blur = false,
  threshold = 0.1,
  delay = 0,
  onComplete,
  className = "",
  ...props
}: AnimatedContentProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || reduced) return;

      const axis = direction === "horizontal" ? "x" : "y";
      const offset = reverse ? -distance : distance;

      gsap.set(el, {
        [axis]: offset,
        scale,
        opacity: animateOpacity ? initialOpacity : 1,
        filter: blur ? "blur(8px)" : "none",
      });

      const tween = gsap.to(el, {
        [axis]: 0,
        scale: 1,
        opacity: 1,
        filter: blur ? "blur(0px)" : "none",
        duration,
        delay,
        ease,
        paused: true,
        force3D: true,
        onComplete: () => {
          gsap.set(el, { clearProps: "transform,opacity,filter" });
          onComplete?.();
        },
      });

      return onceInView(el, () => tween.play(), { threshold });
    },
    { dependencies: [reduced, distance, direction, reverse, duration, ease, initialOpacity, animateOpacity, scale, blur, threshold, delay], scope: ref },
  );

  return (
    <div ref={ref} className={className} {...props}>
      {children}
    </div>
  );
}
