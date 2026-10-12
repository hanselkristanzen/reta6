/**
 * ScrollReveal, from React Bits (DavidHDev/react-bits, src/ts-tailwind/TextAnimations/ScrollReveal).
 * MIT + Commons Clause, see ./LICENSE.md.
 *
 * Changes for this site:
 * - Scoped to this element with `useGSAP`. The original cleanup called `ScrollTrigger.getAll().kill()`,
 *   which would also kill every other component's triggers.
 * - One scrubbed timeline drives opacity and blur together instead of two tweens.
 * - Renders a `<p>` (the original put a `<p>` inside an `<h2>`), and the rotation is optional (off).
 * - Blur is small (3px) and applies only while the paragraph crosses the viewport.
 * - `prefers-reduced-motion`: the paragraph is shown fully legible, with no scroll effect.
 */
import { useMemo, useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface ScrollRevealProps {
  children: string;
  enableBlur?: boolean;
  baseOpacity?: number;
  blurStrength?: number;
  /** ScrollTrigger positions for the span of the reveal. */
  start?: string;
  end?: string;
  className?: string;
}

export default function ScrollReveal({
  children,
  enableBlur = true,
  baseOpacity = 0.14,
  blurStrength = 3,
  start = "top 88%",
  end = "bottom 62%",
  className = "",
}: ScrollRevealProps) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduced = useReducedMotion();

  const words = useMemo(
    () =>
      children.split(/(\s+)/).map((word, index) =>
        /^\s+$/.test(word) ? (
          word
        ) : (
          <span className="word inline-block" key={index} aria-hidden="true">
            {word}
          </span>
        ),
      ),
    [children],
  );

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || reduced) return;
      const targets = el.querySelectorAll<HTMLElement>(".word");

      gsap.fromTo(
        targets,
        { opacity: baseOpacity, filter: enableBlur ? `blur(${blurStrength}px)` : "none" },
        {
          opacity: 1,
          filter: "blur(0px)",
          ease: "none",
          stagger: 0.05,
          scrollTrigger: { trigger: el, start, end, scrub: 0.4 },
        },
      );
    },
    { dependencies: [reduced, enableBlur, baseOpacity, blurStrength, start, end, children], scope: ref },
  );

  return (
    <p ref={ref} className={className} aria-label={children}>
      {words}
    </p>
  );
}
