/**
 * FadeContent, from React Bits (DavidHDev/react-bits, src/ts-tailwind/Animations/FadeContent).
 * MIT + Commons Clause, see ./LICENSE.md.
 *
 * Changes for this site:
 * - Starts through `onceInView` instead of ScrollTrigger (see AnimatedContent).
 * - Hidden with `opacity: 0` rather than `autoAlpha`, so the content stays focusable.
 * - `duration` and `delay` are in seconds only (the original guessed units from the size of the number).
 * - Inline opacity and filter are cleared after the fade.
 * - `prefers-reduced-motion`: the content is simply shown.
 */
import { useRef, type HTMLAttributes, type ReactNode } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { onceInView } from "@/lib/inView";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface FadeContentProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  blur?: boolean;
  /** Seconds. */
  duration?: number;
  ease?: string;
  /** Seconds. */
  delay?: number;
  threshold?: number;
  initialOpacity?: number;
  onComplete?: () => void;
}

export default function FadeContent({
  children,
  blur = false,
  duration = 0.8,
  ease = "power2.out",
  delay = 0,
  threshold = 0.1,
  initialOpacity = 0,
  onComplete,
  className = "",
  ...props
}: FadeContentProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || reduced) return;

      gsap.set(el, { opacity: initialOpacity, filter: blur ? "blur(8px)" : "none" });
      const tween = gsap.to(el, {
        opacity: 1,
        filter: blur ? "blur(0px)" : "none",
        duration,
        delay,
        ease,
        paused: true,
        onComplete: () => {
          gsap.set(el, { clearProps: "opacity,filter" });
          onComplete?.();
        },
      });

      return onceInView(el, () => tween.play(), { threshold });
    },
    { dependencies: [reduced, blur, duration, ease, delay, threshold, initialOpacity], scope: ref },
  );

  return (
    <div ref={ref} className={className} {...props}>
      {children}
    </div>
  );
}
