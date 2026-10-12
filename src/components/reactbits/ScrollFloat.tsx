/**
 * ScrollFloat, from React Bits (DavidHDev/react-bits, src/ts-tailwind/TextAnimations/ScrollFloat).
 * MIT + Commons Clause, see ./LICENSE.md.
 *
 * Changes for this site:
 * - Scoped to this element with `useGSAP` (the original never cleaned its ScrollTrigger up).
 * - Renders any heading tag (`as`) with the full text as its accessible label, and the characters
 *   `aria-hidden`, so a heading is announced once and whole.
 * - `accent`: a trailing part of the title painted with the theme gradient, one continuous gradient
 *   across its characters (see `@/lib/charGradient`).
 * - Words are wrapped, so a long title breaks between words, never inside one.
 * - Gentler defaults for a heading (power3.out, a shorter scroll span), and a bottom pad so the
 *   overflow mask does not clip descenders.
 * - `prefers-reduced-motion`: the heading is static.
 */
import { useMemo, useRef, type ElementType } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { watchCharGradient } from "@/lib/charGradient";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface ScrollFloatProps {
  children: string;
  /** Painted with the gradient; rendered after `children`, separated by a space. */
  accent?: string;
  as?: ElementType;
  className?: string;
  animationDuration?: number;
  ease?: string;
  scrollStart?: string;
  scrollEnd?: string;
  stagger?: number;
}

function Words({ text, accent = false }: { text: string; accent?: boolean }) {
  return text.split(" ").map((word, wordIndex, all) => (
    <span key={wordIndex} className="inline-block whitespace-nowrap" aria-hidden="true">
      {word.split("").map((char, charIndex) => (
        <span key={charIndex} data-char className={`inline-block ${accent ? "char-gradient" : ""}`}>
          {char}
        </span>
      ))}
      {wordIndex < all.length - 1 && <span className="inline-block w-[0.26em]" />}
    </span>
  ));
}

export default function ScrollFloat({
  children,
  accent,
  as: Tag = "h2",
  className = "",
  animationDuration = 1,
  ease = "power3.out",
  scrollStart = "top 92%",
  scrollEnd = "top 58%",
  stagger = 0.03,
}: ScrollFloatProps) {
  const ref = useRef<HTMLElement>(null);
  const accentRef = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();

  const label = accent ? `${children} ${accent}` : children;
  const plain = useMemo(() => <Words text={children} />, [children]);
  const accented = useMemo(() => (accent ? <Words text={accent} accent /> : null), [accent]);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      const accentBox = accentRef.current;
      const stopGradient = accentBox
        ? watchCharGradient(accentBox, () => Array.from(accentBox.querySelectorAll("[data-char]")))
        : () => {};

      if (!reduced) {
        gsap.fromTo(
          el.querySelectorAll("[data-char]"),
          { opacity: 0, yPercent: 110, scaleY: 1.8, scaleX: 0.8, transformOrigin: "50% 0%" },
          {
            opacity: 1,
            yPercent: 0,
            scaleY: 1,
            scaleX: 1,
            duration: animationDuration,
            ease,
            stagger,
            scrollTrigger: { trigger: el, start: scrollStart, end: scrollEnd, scrub: 0.5 },
          },
        );
      }
      return stopGradient;
    },
    { dependencies: [reduced, animationDuration, ease, scrollStart, scrollEnd, stagger, label], scope: ref },
  );

  return (
    <Tag ref={ref} aria-label={label} className={`overflow-hidden pb-[0.16em] -mb-[0.16em] ${className}`}>
      {plain}
      {accented && (
        <>
          {" "}
          <span ref={accentRef} className="relative inline-block">
            {accented}
          </span>
        </>
      )}
    </Tag>
  );
}
