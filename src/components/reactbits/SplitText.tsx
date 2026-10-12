/**
 * SplitText, from React Bits (DavidHDev/react-bits, src/ts-tailwind/TextAnimations/SplitText).
 * MIT + Commons Clause, see ./LICENSE.md.
 *
 * Changes for this site:
 * - GSAP plugins come from the shared registration in `@/lib/gsap`.
 * - The reveal waits for an IntersectionObserver (`onceInView`) instead of a ScrollTrigger, so a
 *   heading that was scrolled past before it rendered (deep link, then scroll up) still appears.
 * - The text stays hidden until the web font is ready and the split is done, so there is no flash of
 *   unsplit text; a 1.5s timeout keeps a slow font from hiding it for good.
 * - `gradient` gives each character its slice of one continuous gradient (see `@/lib/charGradient`).
 * - `prefers-reduced-motion`: the text is split (so the gradient still works) but never animated.
 * - The wrapper no longer clips (`overflow-hidden` cut descenders at tight line heights).
 */
import { useEffect, useRef, useState, type CSSProperties, type ElementType } from "react";
import { gsap, SplitText as GSAPSplitText, useGSAP } from "@/lib/gsap";
import { watchCharGradient } from "@/lib/charGradient";
import { onceInView } from "@/lib/inView";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export interface SplitTextProps {
  text: string;
  className?: string;
  /** Milliseconds between one piece starting and the next. */
  delay?: number;
  /** Seconds to wait before the first piece starts, for sequencing inside an intro. */
  startDelay?: number;
  duration?: number;
  ease?: string;
  splitType?: "chars" | "words" | "lines" | "words, chars";
  from?: gsap.TweenVars;
  to?: gsap.TweenVars;
  threshold?: number;
  rootMargin?: string;
  tag?: ElementType;
  textAlign?: CSSProperties["textAlign"];
  /** Paint the characters with the theme's name gradient (`--g-name`). */
  gradient?: boolean;
  onLetterAnimationComplete?: () => void;
}

export default function SplitText({
  text,
  className = "",
  delay = 40,
  startDelay = 0,
  duration = 1,
  ease = "power3.out",
  splitType = "chars",
  from = { opacity: 0, y: 36 },
  to = { opacity: 1, y: 0 },
  threshold = 0.1,
  rootMargin = "0px 0px -6% 0px",
  tag: Tag = "p",
  textAlign,
  gradient = false,
  onLetterAnimationComplete,
}: SplitTextProps) {
  const ref = useRef<HTMLElement>(null);
  const onCompleteRef = useRef(onLetterAnimationComplete);
  const reduced = useReducedMotion();
  const [fontsReady, setFontsReady] = useState(false);

  useEffect(() => {
    onCompleteRef.current = onLetterAnimationComplete;
  }, [onLetterAnimationComplete]);

  useEffect(() => {
    let active = true;
    const done = () => {
      if (active) setFontsReady(true);
    };
    if (!document.fonts || document.fonts.status === "loaded") done();
    else void document.fonts.ready.then(done);
    const timeout = window.setTimeout(done, 1500);
    return () => {
      active = false;
      window.clearTimeout(timeout);
    };
  }, []);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || !text || !fontsReady) return;

      let stopObserving = () => {};
      let stopGradient = () => {};

      const split = new GSAPSplitText(el, {
        type: splitType,
        smartWrap: true,
        linesClass: "split-line",
        wordsClass: "split-word",
        charsClass: "split-char",
        reduceWhiteSpace: false,
      });

      const targets =
        (splitType.includes("chars") && split.chars.length && split.chars) ||
        (splitType.includes("words") && split.words.length && split.words) ||
        split.lines;

      if (gradient) {
        split.chars.forEach((char) => char.classList.add("char-gradient"));
        stopGradient = watchCharGradient(el, () => split.chars);
      }

      if (reduced) {
        el.style.visibility = "visible";
      } else {
        const tween = gsap.fromTo(
          targets,
          { ...from },
          {
            ...to,
            duration,
            ease,
            delay: startDelay,
            stagger: delay / 1000,
            paused: true,
            force3D: true,
            onComplete: () => onCompleteRef.current?.(),
          },
        );
        // The characters are now in their "from" state, so the wrapper can be shown without a flash.
        el.style.visibility = "visible";
        stopObserving = onceInView(el, () => tween.play(), { threshold, rootMargin });
      }

      return () => {
        stopObserving();
        stopGradient();
        split.revert();
      };
    },
    {
      dependencies: [text, delay, startDelay, duration, ease, splitType, JSON.stringify(from), JSON.stringify(to), threshold, rootMargin, fontsReady, reduced, gradient],
      scope: ref,
    },
  );

  return (
    <Tag ref={ref} style={{ textAlign, visibility: "hidden" }} className={`relative ${className}`}>
      {text}
    </Tag>
  );
}
