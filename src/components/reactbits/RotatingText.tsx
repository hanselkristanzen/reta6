/**
 * RotatingText, from React Bits (DavidHDev/react-bits, src/ts-tailwind/TextAnimations/RotatingText).
 * MIT + Commons Clause, see ./LICENSE.md.
 *
 * Changes for this site:
 * - The `layout` props are gone: they animated the text box with a scale transform, which distorts
 *   letters. The rotating word sits at the end of its line, so nothing needs to move around it.
 * - Rotation pauses while the element is off screen or the tab is hidden, and (with `loop={false}`)
 *   stops on the last item, so automatically changing text never runs indefinitely (WCAG 2.2.2).
 * - The complete list is exposed once as plain text; the animated characters are `aria-hidden`.
 * - `prefers-reduced-motion`: no rotation; the first item is shown, and the full list is still in
 *   the accessible text.
 */
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
} from "react";
import {
  AnimatePresence,
  motion,
  type Target,
  type TargetAndTransition,
  type Transition,
  type VariantLabels,
} from "motion/react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const cn = (...classes: (string | undefined | null | boolean)[]) => classes.filter(Boolean).join(" ");

export interface RotatingTextRef {
  next: () => void;
  previous: () => void;
  jumpTo: (index: number) => void;
  reset: () => void;
}

export interface RotatingTextProps
  extends Omit<ComponentPropsWithoutRef<typeof motion.span>, "children" | "transition" | "initial" | "animate" | "exit"> {
  texts: string[];
  transition?: Transition;
  initial?: boolean | Target | VariantLabels;
  animate?: boolean | VariantLabels | TargetAndTransition;
  exit?: Target | VariantLabels;
  animatePresenceMode?: "sync" | "wait";
  animatePresenceInitial?: boolean;
  rotationInterval?: number;
  staggerDuration?: number;
  staggerFrom?: "first" | "last" | "center" | "random" | number;
  loop?: boolean;
  auto?: boolean;
  splitBy?: string;
  onNext?: (index: number) => void;
  mainClassName?: string;
  splitLevelClassName?: string;
  elementLevelClassName?: string;
}

const splitIntoCharacters = (text: string): string[] => {
  if (typeof Intl !== "undefined" && Intl.Segmenter) {
    return Array.from(new Intl.Segmenter("en", { granularity: "grapheme" }).segment(text), (part) => part.segment);
  }
  return Array.from(text);
};

const RotatingText = forwardRef<RotatingTextRef, RotatingTextProps>(
  (
    {
      texts,
      transition = { type: "spring", damping: 28, stiffness: 320 },
      initial = { y: "100%", opacity: 0 },
      animate = { y: 0, opacity: 1 },
      exit = { y: "-110%", opacity: 0 },
      animatePresenceMode = "wait",
      animatePresenceInitial = false,
      rotationInterval = 2000,
      staggerDuration = 0,
      staggerFrom = "first",
      loop = true,
      auto = true,
      splitBy = "characters",
      onNext,
      mainClassName,
      splitLevelClassName,
      elementLevelClassName,
      ...rest
    },
    ref,
  ) => {
    const [currentTextIndex, setCurrentTextIndex] = useState(0);
    const [onScreen, setOnScreen] = useState(true);
    const [tabVisible, setTabVisible] = useState(true);
    const rootRef = useRef<HTMLSpanElement>(null);
    const reduced = useReducedMotion();

    const elements = useMemo(() => {
      const currentText = texts[currentTextIndex];
      if (splitBy === "characters") {
        const words = currentText.split(" ");
        return words.map((word, i) => ({ characters: splitIntoCharacters(word), needsSpace: i !== words.length - 1 }));
      }
      if (splitBy === "words") {
        return currentText.split(" ").map((word, i, all) => ({ characters: [word], needsSpace: i !== all.length - 1 }));
      }
      if (splitBy === "lines") {
        return currentText.split("\n").map((line, i, all) => ({ characters: [line], needsSpace: i !== all.length - 1 }));
      }
      return currentText.split(splitBy).map((part, i, all) => ({ characters: [part], needsSpace: i !== all.length - 1 }));
    }, [texts, currentTextIndex, splitBy]);

    const getStaggerDelay = useCallback(
      (index: number, total: number): number => {
        if (staggerFrom === "first") return index * staggerDuration;
        if (staggerFrom === "last") return (total - 1 - index) * staggerDuration;
        if (staggerFrom === "center") return Math.abs(Math.floor(total / 2) - index) * staggerDuration;
        if (staggerFrom === "random") return Math.abs(Math.floor(Math.random() * total) - index) * staggerDuration;
        return Math.abs(staggerFrom - index) * staggerDuration;
      },
      [staggerFrom, staggerDuration],
    );

    const handleIndexChange = useCallback(
      (newIndex: number) => {
        setCurrentTextIndex(newIndex);
        onNext?.(newIndex);
      },
      [onNext],
    );

    const next = useCallback(() => {
      const nextIndex = currentTextIndex === texts.length - 1 ? (loop ? 0 : currentTextIndex) : currentTextIndex + 1;
      if (nextIndex !== currentTextIndex) handleIndexChange(nextIndex);
    }, [currentTextIndex, texts.length, loop, handleIndexChange]);

    const previous = useCallback(() => {
      const previousIndex = currentTextIndex === 0 ? (loop ? texts.length - 1 : currentTextIndex) : currentTextIndex - 1;
      if (previousIndex !== currentTextIndex) handleIndexChange(previousIndex);
    }, [currentTextIndex, texts.length, loop, handleIndexChange]);

    const jumpTo = useCallback(
      (index: number) => {
        const valid = Math.max(0, Math.min(index, texts.length - 1));
        if (valid !== currentTextIndex) handleIndexChange(valid);
      },
      [texts.length, currentTextIndex, handleIndexChange],
    );

    const reset = useCallback(() => {
      if (currentTextIndex !== 0) handleIndexChange(0);
    }, [currentTextIndex, handleIndexChange]);

    useImperativeHandle(ref, () => ({ next, previous, jumpTo, reset }), [next, previous, jumpTo, reset]);

    useEffect(() => {
      const node = rootRef.current;
      if (!node || typeof IntersectionObserver === "undefined") return;
      const observer = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting));
      observer.observe(node);
      const onVisibility = () => setTabVisible(document.visibilityState === "visible");
      document.addEventListener("visibilitychange", onVisibility);
      return () => {
        observer.disconnect();
        document.removeEventListener("visibilitychange", onVisibility);
      };
    }, []);

    useEffect(() => {
      if (!auto || reduced || !onScreen || !tabVisible) return;
      const intervalId = window.setInterval(next, rotationInterval);
      return () => window.clearInterval(intervalId);
    }, [next, rotationInterval, auto, reduced, onScreen, tabVisible]);

    const total = elements.reduce((sum, word) => sum + word.characters.length, 0);

    return (
      <motion.span
        ref={rootRef}
        className={cn("relative flex flex-wrap whitespace-pre-wrap", mainClassName)}
        {...rest}
        transition={transition}
      >
        {/* The whole list, once, as text: the animation below is decoration. */}
        <span className="sr-only">{texts.join(", ")}</span>
        <AnimatePresence mode={animatePresenceMode} initial={animatePresenceInitial}>
          <motion.span
            key={currentTextIndex}
            className={cn(splitBy === "lines" ? "flex w-full flex-col" : "relative flex flex-wrap whitespace-pre-wrap")}
            aria-hidden="true"
          >
            {elements.map((wordObj, wordIndex, array) => {
              const before = array.slice(0, wordIndex).reduce((sum, word) => sum + word.characters.length, 0);
              return (
                <span key={wordIndex} className={cn("inline-flex", splitLevelClassName)}>
                  {wordObj.characters.map((char, charIndex) => (
                    <motion.span
                      key={charIndex}
                      initial={reduced ? false : initial}
                      animate={animate}
                      exit={exit}
                      transition={{ ...transition, delay: getStaggerDelay(before + charIndex, total) }}
                      className={cn("inline-block", elementLevelClassName)}
                    >
                      {char}
                    </motion.span>
                  ))}
                  {wordObj.needsSpace && <span className="whitespace-pre"> </span>}
                </span>
              );
            })}
          </motion.span>
        </AnimatePresence>
      </motion.span>
    );
  },
);

RotatingText.displayName = "RotatingText";
export default RotatingText;
